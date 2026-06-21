/**
 * Guest / optimistic cart line id: `{productId}-{variantId}-{index}`.
 * Authenticated cart API uses Prisma `CartItem.id` (cuid, no dashes).
 */
export function isSyntheticCartItemId(itemId: string): boolean {
  return itemId.includes('-');
}

/** Parses synthetic line id into product and variant ids. */
export function parseSyntheticCartItemId(
  itemId: string,
): { productId: string; variantId: string } | null {
  const parts = itemId.split('-');
  if (parts.length < 3) {
    return null;
  }

  const productId = parts[0];
  const variantId = parts.slice(1, -1).join('-');
  if (!productId || !variantId) {
    return null;
  }

  return { productId, variantId };
}
