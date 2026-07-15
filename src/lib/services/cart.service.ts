import { db } from "@white-shop/db";
import {
  isSyntheticCartItemId,
  parseSyntheticCartItemId,
} from "@/lib/cart/cart-item-id";
import { getCartViewCached } from "@/lib/cart/load-cart-view-cached";
import { invalidateCartViewCache } from "@/lib/cart/invalidate-cart-view-cache";
import type { CartViewResponse } from "@/lib/cart/cart-view-cache.types";
import { getProductDiscountSettings } from "./products-discount-settings.cache";
import { CART_WITH_ITEMS_INCLUDE } from "./cart/cart-query.constants";
import { buildCartViewResponse } from "./cart/format-cart-response";
import { logger } from "../utils/logger";
import { DEFAULT_LANGUAGE } from '../language';

const CART_TTL_MS = 30 * 24 * 60 * 60 * 1000;

class CartService {
  /** Get or create user's cart (Redis view cache + slim DB read on miss). */
  async getCart(userId: string, locale: string = DEFAULT_LANGUAGE): Promise<CartViewResponse> {
    return getCartViewCached(userId, locale, (id, lang) =>
      this.loadCartViewFromDb(id, lang),
    );
  }

  private async loadCartViewFromDb(
    userId: string,
    locale: string,
  ): Promise<CartViewResponse> {
    const [{ globalDiscount, categoryDiscounts, brandDiscounts }, cartRow] =
      await Promise.all([
        getProductDiscountSettings(),
        db.cart.findFirst({
          where: { userId },
          include: CART_WITH_ITEMS_INCLUDE,
        }),
      ]);

    let cart = cartRow;
    if (!cart) {
      cart = await db.cart.create({
        data: {
          userId,
          locale,
          expiresAt: new Date(Date.now() + CART_TTL_MS),
          items: { create: [] },
        },
        include: CART_WITH_ITEMS_INCLUDE,
      });
    }

    return buildCartViewResponse(cart.id, cart.items, locale, {
      globalDiscount,
      categoryDiscounts,
      brandDiscounts,
    });
  }

  /**
   * Add item to cart
   */
  async addItem(
    userId: string,
    data: { variantId: string; productId: string; quantity?: number },
    locale: string = DEFAULT_LANGUAGE
  ) {
    const { variantId, productId, quantity = 1 } = data;

    if (!variantId || !productId) {
      throw {
        status: 400,
        type: "https://api.shop.am/problems/validation-error",
        title: "Validation failed",
        detail: "variantId and productId are required",
      };
    }

    const [cart, variant] = await Promise.all([
      db.cart.findFirst({
        where: { userId },
        include: { items: true },
      }),
      db.productVariant.findUnique({
        where: { id: variantId },
        select: { id: true, published: true, productId: true, stock: true, price: true },
      }),
    ]);

    let resolvedCart = cart;
    if (!resolvedCart) {
      resolvedCart = await db.cart.create({
        data: {
          userId,
          locale,
          expiresAt: new Date(Date.now() + CART_TTL_MS),
          items: { create: [] },
        },
        include: { items: true },
      });
    }

    if (!variant || !variant.published || variant.productId !== productId) {
      throw {
        status: 404,
        type: "https://api.shop.am/problems/not-found",
        title: "Variant not found",
      };
    }

    const existingItem = resolvedCart.items.find((item: { variantId: string }) => item.variantId === variantId);
    const totalQuantity = existingItem ? existingItem.quantity + quantity : quantity;

    if (totalQuantity > variant.stock) {
      logger.warn("Cart: stock limit exceeded", {
        variantId,
        currentInCart: existingItem?.quantity ?? 0,
        requestedQuantity: quantity,
        totalQuantity,
        availableStock: variant.stock,
      });
      throw {
        status: 422,
        type: "https://api.shop.am/problems/validation-error",
        title: "Insufficient stock",
        detail: `No more stock available. Maximum available: ${variant.stock}, already in cart: ${existingItem?.quantity || 0}, requested: ${quantity}`,
      };
    }

    let item;
    if (existingItem) {
      logger.debug("Cart: updating existing item", {
        itemId: existingItem.id,
        oldQuantity: existingItem.quantity,
        newQuantity: totalQuantity,
      });
      item = await db.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: totalQuantity },
      });
      const otherItems = resolvedCart.items.filter((i: { id: string }) => i.id !== existingItem.id);
      const itemsForSum = [
        ...otherItems.map((i: { quantity: number; priceSnapshot: unknown }) => ({ q: i.quantity, p: Number(i.priceSnapshot) })),
        { q: totalQuantity, p: Number(item.priceSnapshot) },
      ];
      const itemsCount = itemsForSum.reduce((sum, i) => sum + i.q, 0);
      const total = itemsForSum.reduce((sum, i) => sum + i.q * i.p, 0);
      await invalidateCartViewCache(userId);
      return {
        item: { id: item.id, variantId, quantity: item.quantity, price: Number(item.priceSnapshot) },
        cartSummary: { itemsCount, total },
      };
    }

    logger.debug("Cart: creating new item", { variantId, quantity });
    item = await db.cartItem.create({
      data: {
        cartId: resolvedCart.id,
        variantId,
        productId,
        quantity,
        priceSnapshot: variant.price,
      },
    });
    const itemsForSum = [
      ...resolvedCart.items.map((i: { quantity: number; priceSnapshot: unknown }) => ({ q: i.quantity, p: Number(i.priceSnapshot) })),
      { q: quantity, p: Number(variant.price) },
    ];
    const itemsCount = itemsForSum.reduce((sum, i) => sum + i.q, 0);
    const total = itemsForSum.reduce((sum, i) => sum + i.q * i.p, 0);
    await invalidateCartViewCache(userId);
    return {
      item: { id: item.id, variantId, quantity: item.quantity, price: Number(item.priceSnapshot) },
      cartSummary: { itemsCount, total },
    };
  }

  /** Maps optimistic `{productId}-{variantId}-{index}` ids to DB cart item ids. */
  private async resolveCartItemId(userId: string, itemId: string): Promise<string> {
    if (!isSyntheticCartItemId(itemId)) {
      return itemId;
    }

    const parsed = parseSyntheticCartItemId(itemId);
    if (!parsed) {
      return itemId;
    }

    const item = await db.cartItem.findFirst({
      where: {
        cart: { userId },
        productId: parsed.productId,
        variantId: parsed.variantId,
      },
      select: { id: true },
    });

    if (!item) {
      throw {
        status: 404,
        type: "https://api.shop.am/problems/not-found",
        title: "Cart item not found",
      };
    }

    return item.id;
  }

  /**
   * Update cart item
   */
  async updateItem(userId: string, itemId: string, quantity: number) {
    if (!quantity || quantity < 1) {
      throw {
        status: 400,
        type: "https://api.shop.am/problems/validation-error",
        title: "Validation failed",
        detail: "quantity must be at least 1",
      };
    }

    const resolvedItemId = await this.resolveCartItemId(userId, itemId);

    const cart = await db.cart.findFirst({
      where: {
        userId,
        items: { some: { id: resolvedItemId } },
      },
      include: {
        items: { where: { id: resolvedItemId } },
      },
    });

    if (!cart || cart.items.length === 0) {
      throw {
        status: 404,
        type: "https://api.shop.am/problems/not-found",
        title: "Cart item not found",
      };
    }

    const item = cart.items[0];
    const variant = await db.productVariant.findUnique({
      where: { id: item.variantId },
    });

    if (!variant || variant.stock < quantity) {
      throw {
        status: 422,
        type: "https://api.shop.am/problems/validation-error",
        title: "Insufficient stock",
        detail: `Requested quantity (${quantity}) exceeds available stock (${variant?.stock || 0})`,
      };
    }

    const updatedItem = await db.cartItem.update({
      where: { id: resolvedItemId },
      data: { quantity },
    });

    await invalidateCartViewCache(userId);
    return {
      item: {
        id: updatedItem.id,
        quantity: updatedItem.quantity,
      },
    };
  }

  /**
   * Remove item from cart
   */
  async removeItem(userId: string, itemId: string) {
    const resolvedItemId = await this.resolveCartItemId(userId, itemId);

    const cart = await db.cart.findFirst({
      where: {
        userId,
        items: { some: { id: resolvedItemId } },
      },
    });

    if (!cart) {
      throw {
        status: 404,
        type: "https://api.shop.am/problems/not-found",
        title: "Cart item not found",
      };
    }

    await db.cartItem.delete({ where: { id: resolvedItemId } });
    await invalidateCartViewCache(userId);
    return null;
  }
}

export const cartService = new CartService();
