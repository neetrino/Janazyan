/** Figma / home / shop toolbar category slugs. */
export type ShopCategorySlug = 'face' | 'hair' | 'body' | 'kids' | 'sun';

export const SHOP_CATEGORY_SLUGS: readonly ShopCategorySlug[] = [
  'face',
  'hair',
  'body',
  'kids',
  'sun',
] as const;

const SHOP_SLUG_KEYWORDS: Record<ShopCategorySlug, readonly string[]> = {
  face: ['face', 'face care', 'դեմք', 'лицо', 'դիմ'],
  hair: ['hair', 'hair care', 'մազ', 'волос'],
  body: ['body', 'body care', 'մարմին', 'մարմն', 'тело'],
  kids: ['kids', 'kid', 'baby', 'child', 'kids care', 'մանկ', 'дет', 'երեխ'],
  sun: ['sun', 'spf', 'sun care', 'արև', 'солн'],
};

/** Whether a URL `category` param is a known shop filter slug. */
export function isShopCategorySlug(slug: string): slug is ShopCategorySlug {
  return (SHOP_CATEGORY_SLUGS as readonly string[]).includes(slug);
}

/** Match a category translation title to a shop filter slug (when DB slug is empty). */
export function titleMatchesShopCategorySlug(
  title: string,
  shopSlug: ShopCategorySlug,
): boolean {
  const haystack = title.toLowerCase();
  return SHOP_SLUG_KEYWORDS[shopSlug].some((keyword) => haystack.includes(keyword));
}
