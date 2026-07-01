/** Placeholder cart id written by optimistic add-to-cart before API revalidation. */
export const OPTIMISTIC_USER_CART_ID_PREFIX = 'user-cart-';
const SYNTHETIC_CART_ITEM_ID_PREFIX = 'guest-line:';

/** True when cart id is a client-side placeholder, not a persisted Prisma cart id. */
export function isOptimisticUserCartId(cartId: string): boolean {
  return cartId.startsWith(OPTIMISTIC_USER_CART_ID_PREFIX);
}

/**
 * Stable guest cart line id.
 * Uses URL encoding to avoid separator collisions with future id formats.
 */
export function createSyntheticCartItemId(
  productId: string,
  variantId: string,
  index: number,
): string {
  return `${SYNTHETIC_CART_ITEM_ID_PREFIX}${encodeURIComponent(productId)}:${encodeURIComponent(variantId)}:${index}`;
}

function parsePrefixedSyntheticId(
  itemId: string,
): { productId: string; variantId: string } | null {
  if (!itemId.startsWith(SYNTHETIC_CART_ITEM_ID_PREFIX)) {
    return null;
  }

  const payload = itemId.slice(SYNTHETIC_CART_ITEM_ID_PREFIX.length);
  const parts = payload.split(':');
  if (parts.length !== 3) {
    return null;
  }

  const [encodedProductId, encodedVariantId, rowIndex] = parts;
  if (!encodedProductId || !encodedVariantId || Number.isNaN(Number(rowIndex))) {
    return null;
  }

  try {
    return {
      productId: decodeURIComponent(encodedProductId),
      variantId: decodeURIComponent(encodedVariantId),
    };
  } catch {
    return null;
  }
}

/**
 * Backward-compatible parser for legacy ids:
 * `{productId}-{variantId}-{index}` where ids were dash-free cuid strings.
 */
function parseLegacySyntheticId(
  itemId: string,
): { productId: string; variantId: string } | null {
  const parts = itemId.split('-');
  if (parts.length !== 3) {
    return null;
  }

  const [productId, variantId, rowIndex] = parts;
  if (!productId || !variantId || Number.isNaN(Number(rowIndex))) {
    return null;
  }

  return { productId, variantId };
}

/** Parses synthetic line id into product and variant ids. */
export function parseSyntheticCartItemId(
  itemId: string,
): { productId: string; variantId: string } | null {
  return parsePrefixedSyntheticId(itemId) ?? parseLegacySyntheticId(itemId);
}

/** Robust synthetic id detection without false positives for real DB UUID-like ids. */
export function isSyntheticCartItemId(itemId: string): boolean {
  return parseSyntheticCartItemId(itemId) !== null;
}
