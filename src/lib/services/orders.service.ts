import { db } from "@white-shop/db";
import { Prisma } from "@white-shop/db";
import type { CheckoutData } from "../types/checkout";
import {
  FIRST_PUBLIC_ORDER_NUMBER,
  ORDER_NUMBER_ALLOCATION_LOCK_KEY,
} from "../constants/order-number";
import { logger } from "../utils/logger";
import { adminDeliveryService } from "./admin/admin-delivery.service";
import { extractMediaUrl } from "../utils/extractMediaUrl";
import { invalidateAdminDashboardCache } from "@/lib/cache/load-admin-dashboard-cached";
import { resolveCheckoutPromo } from "@/lib/promo-codes/resolve-checkout-promo";
import { arcaClient, toArcaAmountMinorUnits } from "@/lib/payments/arca/client";
import { buildArcaReturnUrl, getArcaConfig } from "@/lib/payments/arca/config";
import { convertPrice } from "@/lib/currency";
import { getPublishedPartnerStoreById } from "./partner-stores.service";
import type { PickupStoreAddress } from "@/lib/types/pickup-store";
import { DEFAULT_LANGUAGE } from '../language';

const ORDER_SEQUENCE_FLOOR = FIRST_PUBLIC_ORDER_NUMBER - 1;

async function allocateNextOrderNumber(
  tx: Prisma.TransactionClient
): Promise<string> {
  await tx.$executeRaw(
    Prisma.sql`SELECT pg_advisory_xact_lock(${ORDER_NUMBER_ALLOCATION_LOCK_KEY}::bigint)`
  );
  const rows = await tx.$queryRaw<Array<{ next: string }>>(
    Prisma.sql`
      SELECT (GREATEST(COALESCE(MAX(CAST("number" AS INTEGER)), ${ORDER_SEQUENCE_FLOOR}), ${ORDER_SEQUENCE_FLOOR}) + 1)::text AS next
      FROM "orders"
      WHERE "number" ~ '^[0-9]+$'
    `
  );
  const raw = rows[0]?.next;
  if (raw === undefined || raw === null) {
    throw {
      status: 500,
      type: "https://api.shop.am/problems/internal-error",
      title: "Internal Server Error",
      detail: "Could not allocate order number",
    };
  }
  const nextNum = Number.parseInt(String(raw), 10);
  if (!Number.isFinite(nextNum) || nextNum < FIRST_PUBLIC_ORDER_NUMBER) {
    throw {
      status: 500,
      type: "https://api.shop.am/problems/internal-error",
      title: "Internal Server Error",
      detail: "Invalid order number sequence",
    };
  }
  return String(nextNum);
}
type CartItemWithRelations = Prisma.CartItemGetPayload<{
  include: {
    product: {
      include: {
        translations: true;
      };
    };
    variant: {
      include: {
        options: true;
      };
    };
  };
}>;

type ProductVariantWithProduct = Prisma.ProductVariantGetPayload<{
  include: {
    product: {
      include: {
        translations: true;
      };
    };
    options: true;
  };
}>;

type OrderItemWithVariant = Prisma.OrderItemGetPayload<{
  include: {
    variant: {
      include: {
        options: {
          include: {
            attributeValue: {
              include: {
                translations: true;
                attribute: true;
              };
            };
          };
        };
      };
    };
  };
}>;

type CheckoutCartItem = {
  variantId: string;
  productId: string;
  quantity: number;
  price: number;
  productTitle: string;
  variantTitle?: string;
  sku: string;
  imageUrl?: string;
};

class OrdersService {
  private async createOrderAndPayment(params: {
    userId?: string;
    resolvedUserCartId: string | null;
    paymentMethod: string;
    shippingMethod: string;
    shippingAddress: CheckoutData['shippingAddress'] | PickupStoreAddress | null | undefined;
    email: string;
    phone: string;
    subtotal: number;
    discountAmount: number;
    shippingAmount: number;
    taxAmount: number;
    total: number;
    cartItems: CheckoutCartItem[];
    resolvedPromo: Awaited<ReturnType<typeof resolveCheckoutPromo>> | null;
  }) {
    const {
      userId,
      resolvedUserCartId,
      paymentMethod,
      shippingMethod,
      shippingAddress,
      email,
      phone,
      subtotal,
      discountAmount,
      shippingAmount,
      taxAmount,
      total,
      cartItems,
      resolvedPromo,
    } = params;

    return db.$transaction(
      async (tx: Prisma.TransactionClient) => {
        if (resolvedPromo?.ok) {
          const updateResult = await tx.promoCode.updateMany({
            where: {
              id: resolvedPromo.promo.id,
              deletedAt: null,
              active: true,
              ...(resolvedPromo.promo.usageLimit !== null
                ? { usedCount: { lt: resolvedPromo.promo.usageLimit } }
                : {}),
            },
            data: {
              usedCount: {
                increment: 1,
              },
            },
          });

          if (updateResult.count === 0) {
            throw {
              status: 400,
              type: "https://api.shop.am/problems/validation-error",
              title: "Validation Error",
              detail: "Promo code usage limit reached",
            };
          }
        }

        const orderNumber = await allocateNextOrderNumber(tx);
        const newOrder = await tx.order.create({
          data: {
            number: orderNumber,
            userId: userId || null,
            status: 'pending',
            paymentStatus: 'pending',
            fulfillmentStatus: 'unfulfilled',
            subtotal,
            discountAmount,
            shippingAmount,
            taxAmount,
            total,
            currency: 'AMD',
            customerEmail: email,
            customerPhone: phone,
            customerLocale: 'en',
            shippingMethod,
            shippingAddress: shippingAddress ? JSON.parse(JSON.stringify(shippingAddress)) : null,
            billingAddress: shippingAddress ? JSON.parse(JSON.stringify(shippingAddress)) : null,
            items: {
              create: cartItems.map((item) => ({
                variantId: item.variantId,
                productTitle: item.productTitle,
                variantTitle: item.variantTitle,
                sku: item.sku,
                quantity: item.quantity,
                price: item.price,
                total: item.price * item.quantity,
                imageUrl: item.imageUrl,
              })),
            },
            events: {
              create: {
                type: 'order_created',
                data: {
                  source: userId ? 'user' : 'guest',
                  paymentMethod,
                  shippingMethod,
                  ...(resolvedPromo?.ok ? { promoCode: resolvedPromo.promo.code } : {}),
                },
              },
            },
          },
          include: {
            items: true,
          },
        });

        logger.debug('Updating stock for variants', { count: cartItems.length });
        try {
          for (const item of cartItems) {
            if (!item.variantId) {
              logger.error('Missing variantId for item', { item });
              throw {
                status: 400,
                type: "https://api.shop.am/problems/validation-error",
                title: "Validation Error",
                detail: `Missing variantId for item with SKU: ${item.sku}`,
              };
            }

            const quantity = Number(item.quantity);
            const variantId = item.variantId;
            const updated = await tx.$executeRaw(
              Prisma.sql`UPDATE product_variants SET stock = stock - ${quantity} WHERE id = ${variantId} AND stock >= ${quantity}`
            );
            if (updated === 0) {
              const variant = await tx.productVariant.findUnique({
                where: { id: variantId },
                select: { sku: true, stock: true },
              });
              logger.error('Insufficient stock on atomic decrement', {
                variantId,
                sku: variant?.sku,
                currentStock: variant?.stock,
                requested: quantity,
              });
              throw {
                status: 422,
                type: "https://api.shop.am/problems/validation-error",
                title: "Insufficient stock",
                detail: `Insufficient stock for SKU ${variant?.sku ?? variantId}. Available: ${variant?.stock ?? 0}, requested: ${quantity}`,
              };
            }
            logger.debug('Stock decremented', { variantId, quantity });
          }
          logger.info('All variant stocks updated successfully');
        } catch (stockError: unknown) {
          const err = stockError as { status?: number; type?: string };
          if (err.status && err.type) throw stockError;
          logger.error('Error updating stock', { error: stockError });
          throw stockError;
        }

        const payment = await tx.payment.create({
          data: {
            orderId: newOrder.id,
            provider: paymentMethod,
            method: paymentMethod,
            amount: total,
            currency: 'AMD',
            status: 'pending',
          },
        });

        if (userId && resolvedUserCartId && paymentMethod === 'cash_on_delivery') {
          await tx.cart.delete({
            where: { id: resolvedUserCartId },
          });
        }

        return { order: newOrder, payment };
      },
      { timeout: 10000, maxWait: 5000 }
    );
  }

  private async registerArcaPayment(orderAndPayment: {
    order: { id: string; number: string; total: number; customerLocale: string | null };
    payment: { id: string };
  }): Promise<string> {
    try {
      const arcaConfig = getArcaConfig();
      const amountInArcaCurrency = arcaConfig.currency === '051'
        ? convertPrice(orderAndPayment.order.total, 'USD', 'AMD')
        : orderAndPayment.order.total;
      const returnUrl = buildArcaReturnUrl(orderAndPayment.order.number);
      const registration = await arcaClient.registerOrder({
        orderNumber: orderAndPayment.order.number,
        amountMinorUnits: toArcaAmountMinorUnits(amountInArcaCurrency, arcaConfig.currency),
        returnUrl,
        description: `Order #${orderAndPayment.order.number}`,
        language: orderAndPayment.order.customerLocale || DEFAULT_LANGUAGE,
      });

      await db.payment.update({
        where: { id: orderAndPayment.payment.id },
        data: {
          providerTransactionId: registration.orderId,
          providerResponse: registration.rawResponse as Prisma.InputJsonValue,
        },
      });

      return registration.formUrl;
    } catch (error: unknown) {
      logger.error('ArCa register failed during checkout', {
        orderId: orderAndPayment.order.id,
        paymentId: orderAndPayment.payment.id,
        error,
      });

      const paymentErrorMessage = error instanceof Error
        ? error.message
        : 'Failed to initialize ArCa payment';

      await db.$transaction([
        db.payment.update({
          where: { id: orderAndPayment.payment.id },
          data: {
            status: 'failed',
            errorMessage: paymentErrorMessage,
            failedAt: new Date(),
          },
        }),
        db.order.update({
          where: { id: orderAndPayment.order.id },
          data: {
            paymentStatus: 'failed',
          },
        }),
        db.orderEvent.create({
          data: {
            orderId: orderAndPayment.order.id,
            type: 'payment_init_failed',
            data: {
              provider: 'arca',
              message: paymentErrorMessage,
            },
          },
        }),
      ]);

      throw {
        status: 502,
        type: "https://api.shop.am/problems/payment-provider-error",
        title: "ArCa unavailable",
        detail: "Failed to initialize ArCa payment. Please try again.",
      };
    }
  }

  /**
   * Create order (checkout)
   */
  async checkout(data: CheckoutData, userId?: string) {
    try {
      const {
        cartId,
        items: guestItems,
        email,
        phone,
        shippingMethod = 'pickup',
        pickupStoreId,
        shippingAddress,
        paymentMethod = 'idram',
        promoCode,
      } = data;
      // shippingAmount is ignored — computed server-side from shippingMethod and address

      // Validate required fields
      if (!email || !phone) {
        throw {
          status: 400,
          type: "https://api.shop.am/problems/validation-error",
          title: "Validation Error",
          detail: "Email and phone are required",
        };
      }

      // Get cart items - either from user cart or guest items
      let cartItems: CheckoutCartItem[] = [];

      let resolvedUserCartId: string | null = null;

      if (userId && cartId && cartId !== 'guest-cart') {
        // Resolve by userId — client may send optimistic `user-cart-{userId}` before revalidation.
        const cart = await db.cart.findFirst({
          where: { userId },
          include: {
            items: {
              include: {
                variant: {
                  include: {
                    product: {
                      include: {
                        translations: true,
                      },
                    },
                    options: true,
                  },
                },
                product: {
                  include: {
                    translations: true,
                  },
                },
              },
            },
          },
        });

        if (!cart || cart.items.length === 0) {
          throw {
            status: 400,
            type: "https://api.shop.am/problems/validation-error",
            title: "Cart is empty",
            detail: "Cannot checkout with an empty cart",
          };
        }

        resolvedUserCartId = cart.id;

        // Format cart items
        logger.debug('Processing cart items', { count: cart.items.length });
        
        cartItems = await Promise.all(
          cart.items.map(async (item: CartItemWithRelations) => {
            const product = item.product;
            const variant = item.variant;
            
            if (!variant) {
              logger.error('Cart item missing variant', {
                itemId: item.id,
                variantId: item.variantId,
                productId: item.productId,
              });
              throw {
                status: 404,
                type: "https://api.shop.am/problems/not-found",
                title: "Variant not found",
                detail: `Variant ${item.variantId} not found for cart item`,
              };
            }
            
            logger.debug('Processing cart item', {
              itemId: item.id,
              variantId: variant.id,
              productId: product.id,
              quantity: item.quantity,
              variantStock: variant.stock,
              variantSku: variant.sku,
            });
            
            const translation = product.translations?.[0] || product.translations?.[0];

            // Get variant title from options
            const variantTitle = variant.options
              ?.map((opt) => `${opt.attributeKey || ''}: ${opt.value || ''}`)
              .join(', ') || undefined;

            // Get image URL
            const imageUrl = extractMediaUrl(product.media) ?? undefined;

            // Check stock availability
            if (variant.stock < item.quantity) {
              throw {
                status: 422,
                type: "https://api.shop.am/problems/validation-error",
                title: "Insufficient stock",
                detail: `Product "${translation?.title || 'Unknown'}" - insufficient stock. Available: ${variant.stock}, Requested: ${item.quantity}`,
              };
            }

            // Use current variant price from DB (ignore priceSnapshot to prevent outdated/abused prices)
            const currentPrice = Number(variant.price);
            const cartItem = {
              variantId: variant.id,
              productId: product.id,
              quantity: item.quantity,
              price: currentPrice,
              productTitle: translation?.title || 'Unknown Product',
              variantTitle,
              sku: variant.sku || '',
              imageUrl,
            };
            
            logger.debug('Cart item formatted', {
              variantId: cartItem.variantId,
              productId: cartItem.productId,
              quantity: cartItem.quantity,
              sku: cartItem.sku,
            });
            
            return cartItem;
          })
        );
        
        logger.info('All cart items processed', { count: cartItems.length });
      } else if (guestItems && Array.isArray(guestItems) && guestItems.length > 0) {
        // Validate and collect variant IDs
        const variantIds: string[] = [];
        for (const item of guestItems) {
          if (!item.productId || !item.variantId || !item.quantity) {
            throw {
              status: 400,
              type: "https://api.shop.am/problems/validation-error",
              title: "Validation Error",
              detail: "Each item must have productId, variantId, and quantity",
            };
          }
          variantIds.push(item.variantId);
        }
        const uniqueVariantIds = [...new Set(variantIds)];

        // Batch fetch all variants (one query instead of N)
        const variants = await db.productVariant.findMany({
          where: { id: { in: uniqueVariantIds } },
          include: {
            product: { include: { translations: true } },
            options: true,
          },
        });
        const variantMap = new Map(variants.map((v) => [v.id, v]));

        cartItems = guestItems.map((item: { productId: string; variantId: string; quantity: number }) => {
          const variant = variantMap.get(item.variantId);
          if (!variant || variant.productId !== item.productId) {
            throw {
              status: 404,
              type: "https://api.shop.am/problems/not-found",
              title: "Product variant not found",
              detail: `Variant ${item.variantId} not found for product ${item.productId}`,
            };
          }
          if (variant.stock < item.quantity) {
            throw {
              status: 422,
              type: "https://api.shop.am/problems/validation-error",
              title: "Insufficient stock",
              detail: `Insufficient stock. Available: ${variant.stock}, Requested: ${item.quantity}`,
            };
          }
          const translation = variant.product.translations?.[0] || variant.product.translations?.[0];
          const variantTitle = variant.options
            ?.map((opt: { attributeKey?: string | null; value?: string | null }) => `${opt.attributeKey ?? ""}: ${opt.value ?? ""}`)
            .join(", ") ?? undefined;
          const imageUrl = extractMediaUrl(variant.product.media) ?? undefined;
          return {
            variantId: variant.id,
            productId: variant.product.id,
            quantity: item.quantity,
            price: Number(variant.price),
            productTitle: translation?.title ?? "Unknown Product",
            variantTitle,
            sku: variant.sku ?? "",
            imageUrl,
          };
        });
      } else {
        throw {
          status: 400,
          type: "https://api.shop.am/problems/validation-error",
          title: "Cart is empty",
          detail: "Cannot checkout with an empty cart",
        };
      }

      if (cartItems.length === 0) {
        throw {
          status: 400,
          type: "https://api.shop.am/problems/validation-error",
          title: "Cart is empty",
          detail: "Cannot checkout with an empty cart",
        };
      }

      // Calculate totals
      const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      const subtotalAmd = convertPrice(subtotal, 'USD', 'AMD');
      const resolvedPromo = promoCode
        ? await resolveCheckoutPromo({
            code: promoCode,
            subtotal: subtotalAmd,
            userId: userId ?? null,
          })
        : null;

      if (resolvedPromo && !resolvedPromo.ok) {
        throw {
          status: 400,
          type: "https://api.shop.am/problems/validation-error",
          title: "Validation Error",
          detail: resolvedPromo.detail,
        };
      }

      const discountAmountAmd = resolvedPromo?.ok ? resolvedPromo.promo.discountAmount : 0;
      const discountAmount = convertPrice(discountAmountAmd, 'AMD', 'USD');
      // Shipping: computed server-side only (never trust client-provided amount)
      let shippingAmount = 0;
      let resolvedShippingAddress: CheckoutData['shippingAddress'] | PickupStoreAddress | undefined =
        shippingAddress;

      if (shippingMethod === 'pickup') {
        const normalizedPickupStoreId = pickupStoreId?.trim();
        if (!normalizedPickupStoreId) {
          throw {
            status: 400,
            type: "https://api.shop.am/problems/validation-error",
            title: "Validation Error",
            detail: "Pickup store is required for store pickup orders",
          };
        }

        const pickupStore = await getPublishedPartnerStoreById(normalizedPickupStoreId, 'en');
        if (!pickupStore) {
          throw {
            status: 400,
            type: "https://api.shop.am/problems/validation-error",
            title: "Validation Error",
            detail: "Selected pickup store is unavailable",
          };
        }

        resolvedShippingAddress = {
          pickupStoreId: pickupStore.id,
          storeName: pickupStore.name,
          address: pickupStore.address,
        };
      } else if (shippingMethod === 'delivery' && shippingAddress?.city?.trim()) {
        const country = (shippingAddress.countryCode ?? 'Armenia').toString();
        shippingAmount = await adminDeliveryService.getDeliveryPrice(
          shippingAddress.city.trim(),
          country,
          subtotalAmd,
        );
        if (shippingAmount < 0) shippingAmount = 0;
      }
      const taxAmount = 0; // TODO: Calculate tax if needed
      const taxAmountAmd = convertPrice(taxAmount, 'USD', 'AMD');
      const total = subtotalAmd - discountAmountAmd + shippingAmount + taxAmountAmd;

      const order = await this.createOrderAndPayment({
        userId,
        resolvedUserCartId,
        paymentMethod,
        shippingMethod,
        shippingAddress: resolvedShippingAddress,
        email,
        phone,
        subtotal,
        discountAmount,
        shippingAmount,
        taxAmount,
        total,
        cartItems,
        resolvedPromo,
      });

      let paymentUrl: string | null = null;

      if (paymentMethod === 'arca') {
        paymentUrl = await this.registerArcaPayment(order);
      }

      void invalidateAdminDashboardCache().catch((error: unknown) => {
        logger.warn('Failed to invalidate admin dashboard cache after order create', { error });
      });

      // Return order and payment info
      return {
        order: {
          id: order.order.id,
          number: order.order.number,
          status: order.order.status,
          paymentStatus: order.order.paymentStatus,
          total: order.order.total,
          currency: order.order.currency,
        },
        payment: {
          provider: order.payment.provider,
          paymentUrl,
          expiresAt: null, // TODO: Set expiration if needed
        },
        nextAction: paymentMethod === 'idram' || paymentMethod === 'arca'
          ? 'redirect_to_payment' 
          : 'view_order',
      };
    } catch (error: unknown) {
      // Type guard for custom error
      const customError = error as { status?: number; type?: string; message?: string; code?: string; name?: string; meta?: unknown; stack?: string };
      
      // If it's already our custom error, re-throw it
      if (customError.status && customError.type) {
        throw error;
      }

      // Log unexpected errors
      logger.error("Checkout error", {
        error: {
          name: customError?.name,
          message: customError?.message,
          code: customError?.code,
          meta: customError?.meta,
          stack: customError?.stack?.substring(0, 500),
        },
      });

      // Handle Prisma errors
      if (customError?.code === 'P2002') {
        throw {
          status: 409,
          type: "https://api.shop.am/problems/conflict",
          title: "Conflict",
          detail: "Order number already exists, please try again",
        };
      }

      // Generic error
      throw {
        status: 500,
        type: "https://api.shop.am/problems/internal-error",
        title: "Internal Server Error",
        detail: customError?.message || "An error occurred during checkout",
      };
    }
  }

  /**
   * Get user orders list (paginated)
   */
  async list(userId: string, options?: { page?: number; limit?: number }) {
    const page = Math.max(1, options?.page ?? 1);
    const limit = Math.min(100, Math.max(1, options?.limit ?? 20));
    const skip = (page - 1) * limit;

    const [orders, total] = await Promise.all([
      db.order.findMany({
        where: { userId },
        include: {
          items: { select: { id: true } },
          payments: { select: { id: true } },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      db.order.count({ where: { userId } }),
    ]);

    return {
      data: orders.map((order: {
        id: string;
        number: string;
        status: string;
        paymentStatus: string;
        fulfillmentStatus: string;
        total: number;
        subtotal: number;
        discountAmount: number;
        shippingAmount: number;
        taxAmount: number;
        currency: string;
        createdAt: Date;
        items: Array<{ id: string }>;
      }) => ({
        id: order.id,
        number: order.number,
        status: order.status,
        paymentStatus: order.paymentStatus,
        fulfillmentStatus: order.fulfillmentStatus,
        total: order.total,
        subtotal: order.subtotal,
        discountAmount: order.discountAmount,
        shippingAmount: order.shippingAmount,
        taxAmount: order.taxAmount,
        currency: order.currency,
        createdAt: order.createdAt,
        itemsCount: order.items.length,
      })),
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Get order by number for authenticated users or verified guest checkout.
   */
  async findByNumber(
    orderNumber: string,
    access: string | { email: string; phone: string },
  ) {
    const isGuestAccess = typeof access === 'object';
    const order = await db.order.findFirst({
      where: isGuestAccess
        ? {
            number: orderNumber,
            userId: null,
            customerEmail: {
              equals: access.email.trim(),
              mode: 'insensitive',
            },
          }
        : {
            number: orderNumber,
            userId: access,
          },
      include: {
        items: {
          include: {
            variant: {
              include: {
                options: {
                  include: {
                    attributeValue: {
                      include: {
                        attribute: true,
                        translations: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
        payments: true,
        events: true,
      },
    });

    if (!order) {
      throw {
        status: 404,
        type: "https://api.shop.am/problems/not-found",
        title: "Order not found",
        detail: `Order with number '${orderNumber}' not found`,
      };
    }

    if (isGuestAccess) {
      const requestPhone = access.phone.replace(/\D/g, '');
      const storedPhone = (order.customerPhone ?? '').replace(/\D/g, '');
      if (!requestPhone || requestPhone !== storedPhone) {
        throw {
          status: 404,
          type: "https://api.shop.am/problems/not-found",
          title: "Order not found",
          detail: `Order with number '${orderNumber}' not found`,
        };
      }
    }

    // Parse shipping address if it's a JSON string
    let shippingAddress = order.shippingAddress;
    if (typeof shippingAddress === 'string') {
      try {
        shippingAddress = JSON.parse(shippingAddress);
      } catch {
        shippingAddress = null;
      }
    }

    // Debug logging
    logger.info('Order found', {
      orderNumber: order.number,
      itemsCount: order.items.length,
      items: order.items.map((item: OrderItemWithVariant) => ({
        variantId: item.variantId,
        productTitle: item.productTitle,
        variant: item.variant ? {
          id: item.variant.id,
          optionsCount: item.variant.options?.length || 0,
          options: item.variant.options,
        } : null,
      })),
    });

    return {
      id: order.id,
      number: order.number,
      status: order.status,
      paymentStatus: order.paymentStatus,
      fulfillmentStatus: order.fulfillmentStatus,
      items: order.items.map((item: OrderItemWithVariant) => {
        const variantOptions = item.variant?.options?.map((opt) => {
          // Debug logging for each option
          logger.debug('Processing option', {
            attributeKey: opt.attributeKey,
            value: opt.value,
            valueId: opt.valueId,
            hasAttributeValue: !!opt.attributeValue,
            attributeValueData: opt.attributeValue ? {
              value: opt.attributeValue.value,
              attributeKey: opt.attributeValue.attribute.key,
              imageUrl: opt.attributeValue.imageUrl,
              hasTranslations: opt.attributeValue.translations?.length > 0,
            } : null,
          });

          // New format: Use AttributeValue if available
          if (opt.attributeValue) {
            // Get label from translations (prefer current locale, fallback to first available)
            const translations = opt.attributeValue.translations || [];
            const label = translations.length > 0 ? translations[0].label : opt.attributeValue.value;
            
            return {
              attributeKey: opt.attributeValue.attribute.key || undefined,
              value: opt.attributeValue.value || undefined,
              label: label || undefined,
              imageUrl: opt.attributeValue.imageUrl || undefined,
              colors: opt.attributeValue.colors || undefined,
            };
          }
          // Old format: Use attributeKey and value directly
          return {
            attributeKey: opt.attributeKey || undefined,
            value: opt.value || undefined,
          };
        }) || [];

        logger.debug('Item mapping', {
          productTitle: item.productTitle,
          variantId: item.variantId,
          hasVariant: !!item.variant,
          optionsCount: item.variant?.options?.length || 0,
          variantOptions,
        });

        return {
          variantId: item.variantId || '',
          productTitle: item.productTitle,
          variantTitle: item.variantTitle || '',
          sku: item.sku,
          quantity: item.quantity,
          price: Number(item.price),
          total: Number(item.total),
          imageUrl: item.imageUrl || undefined,
          variantOptions,
        };
      }),
      totals: {
        subtotal: Number(order.subtotal),
        discount: Number(order.discountAmount),
        shipping: Number(order.shippingAmount),
        tax: Number(order.taxAmount),
        total: Number(order.total),
        currency: order.currency,
      },
      customer: {
        email: order.customerEmail || undefined,
        phone: order.customerPhone || undefined,
      },
      shippingAddress: shippingAddress,
      shippingMethod: order.shippingMethod || 'pickup',
      trackingNumber: order.trackingNumber || undefined,
      createdAt: order.createdAt.toISOString(),
      updatedAt: order.updatedAt.toISOString(),
    };
  }
}

export const ordersService = new OrdersService();

