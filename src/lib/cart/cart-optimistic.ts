import { CART_KEY } from '../../app/cart/constants';
import type { Cart, CartItem } from '../../app/cart/types';
import type { CartCacheScope } from './cart-snapshot-cache';
import { readCartSnapshot, writeCartSnapshot } from './cart-snapshot-cache';
import { createSyntheticCartItemId } from './cart-item-id';

export interface OptimisticCartLineInput {
  productId: string;
  productSlug: string;
  variantId: string;
  quantityToAdd: number;
  price: number;
  productTitle?: string;
  productImage?: string | null;
}

interface GuestStoredLine {
  productId: string;
  productSlug?: string;
  variantId?: string;
  quantity?: number;
  price?: number;
}

function buildTotals(items: CartItem[]): Cart['totals'] {
  const subtotal = items.reduce((sum, item) => sum + item.total, 0);
  return {
    subtotal,
    discount: 0,
    shipping: 0,
    tax: 0,
    total: subtotal,
    currency: 'USD',
  };
}

function lineKey(productId: string, variantId: string): string {
  return `${productId}:${variantId}`;
}

/**
 * Instantly updates the scope snapshot when adding from a product card (no API wait).
 */
export function applyOptimisticAddToSnapshot(
  scope: CartCacheScope,
  input: OptimisticCartLineInput,
  cartId: string,
): Cart {
  const existing = readCartSnapshot(scope);
  const items = existing?.items ? [...existing.items] : [];
  const matchIndex = items.findIndex(
    (item) =>
      lineKey(item.variant.product.id, item.variant.id) ===
      lineKey(input.productId, input.variantId),
  );

  const title =
    input.productTitle?.trim() || input.productSlug || 'Product';

  if (matchIndex >= 0) {
    const line = items[matchIndex];
    const quantity = line.quantity + input.quantityToAdd;
    items[matchIndex] = {
      ...line,
      quantity,
      price: input.price > 0 ? input.price : line.price,
      total: (input.price > 0 ? input.price : line.price) * quantity,
    };
  } else {
    const index = items.length;
    const unitPrice = input.price > 0 ? input.price : 0;
    items.push({
      id: createSyntheticCartItemId(input.productId, input.variantId, index),
      variant: {
        id: input.variantId,
        sku: '',
        product: {
          id: input.productId,
          title,
          slug: input.productSlug,
          image: input.productImage ?? null,
        },
      },
      quantity: input.quantityToAdd,
      price: unitPrice,
      originalPrice: null,
      total: unitPrice * input.quantityToAdd,
    });
  }

  const itemsCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const cart: Cart = {
    id: existing?.id ?? cartId,
    items,
    totals: buildTotals(items),
    itemsCount,
  };

  writeCartSnapshot(scope, cart);
  return cart;
}

/**
 * Builds a minimal guest cart from raw localStorage lines (no network).
 */
export function buildGuestCartFromStorage(): Cart | null {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    const stored = localStorage.getItem(CART_KEY);
    const lines: GuestStoredLine[] = stored ? JSON.parse(stored) : [];
    if (!Array.isArray(lines) || lines.length === 0) {
      return null;
    }

    const items: CartItem[] = lines
      .filter((line) => line.productId && line.variantId && line.quantity)
      .map((line, index) => {
        const quantity = Number(line.quantity) || 1;
        const unitPrice = Number(line.price) || 0;
        const slug = line.productSlug ?? '';
        return {
          id: createSyntheticCartItemId(
            line.productId,
            line.variantId as string,
            index,
          ),
          variant: {
            id: line.variantId as string,
            sku: '',
            product: {
              id: line.productId,
              title: slug || 'Product',
              slug,
              image: null,
            },
          },
          quantity,
          price: unitPrice,
          originalPrice: null,
          total: unitPrice * quantity,
        };
      });

    if (items.length === 0) {
      return null;
    }

    const itemsCount = items.reduce((sum, item) => sum + item.quantity, 0);
    return {
      id: 'guest-cart',
      items,
      totals: buildTotals(items),
      itemsCount,
    };
  } catch {
    return null;
  }
}
