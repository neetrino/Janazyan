import { resolveCartProductImageUrl } from '@/lib/products/resolve-stored-product-image-url';
import type { ProductDiscountSettings } from '@/lib/services/products-discount-settings.cache';
import type { CartViewResponse } from '@/lib/cart/cart-view-cache.types';

type CartItemRow = {
  id: string;
  productId: string;
  variantId: string;
  quantity: number;
  product: {
    id: string;
    media: unknown;
    discountPercent: number;
    primaryCategoryId: string | null;
    brandId: string | null;
    translations: Array<{ locale: string; title?: string; slug?: string }>;
  };
  variant: {
    id: string;
    sku: string | null;
    stock: number;
    price: number;
    compareAtPrice: number | null;
    imageUrl?: string | null;
  };
};

function resolveAppliedDiscount(
  product: CartItemRow['product'],
  settings: ProductDiscountSettings,
): number {
  const productDiscount = product.discountPercent ?? 0;
  if (productDiscount > 0) {
    return productDiscount;
  }

  const primaryCategoryId = product.primaryCategoryId;
  if (primaryCategoryId && settings.categoryDiscounts[primaryCategoryId]) {
    return settings.categoryDiscounts[primaryCategoryId];
  }

  const brandId = product.brandId;
  if (brandId && settings.brandDiscounts[brandId]) {
    return settings.brandDiscounts[brandId];
  }

  return settings.globalDiscount > 0 ? settings.globalDiscount : 0;
}

function formatCartItem(
  item: CartItemRow,
  locale: string,
  settings: ProductDiscountSettings,
): CartViewResponse['cart']['items'][number] {
  const product = item.product;
  const variant = item.variant;
  const translation =
    product.translations.find((row) => row.locale === locale) ?? product.translations[0];
  const appliedDiscount = resolveAppliedDiscount(product, settings);
  const variantOriginalPrice = variant.price ?? 0;
  let finalPrice = variantOriginalPrice;
  let originalPrice: number | null = null;

  if (appliedDiscount > 0 && variantOriginalPrice > 0) {
    finalPrice = variantOriginalPrice * (1 - appliedDiscount / 100);
    originalPrice = variantOriginalPrice;
  } else if (variant.compareAtPrice != null && variant.compareAtPrice > variantOriginalPrice) {
    originalPrice = Number(variant.compareAtPrice);
  }

  return {
    id: item.id,
    variant: {
      id: variant.id ?? item.variantId,
      sku: variant.sku ?? '',
      stock: variant.stock ?? 0,
      product: {
        id: product.id,
        title: translation?.title ?? '',
        slug: translation?.slug ?? '',
        image: resolveCartProductImageUrl(product.media, variant.imageUrl),
      },
    },
    quantity: item.quantity,
    price: finalPrice,
    originalPrice,
    total: finalPrice * item.quantity,
  };
}

export function buildCartViewResponse(
  cartId: string,
  items: CartItemRow[],
  locale: string,
  settings: ProductDiscountSettings,
): CartViewResponse {
  const itemsWithDetails = items.map((item) => formatCartItem(item, locale, settings));
  const subtotal = itemsWithDetails.reduce((sum, item) => sum + item.total, 0);

  return {
    cart: {
      id: cartId,
      items: itemsWithDetails,
      totals: {
        subtotal,
        discount: 0,
        shipping: 0,
        tax: 0,
        total: subtotal,
        currency: 'USD',
      },
      itemsCount: itemsWithDetails.reduce((sum, item) => sum + item.quantity, 0),
    },
  };
}
