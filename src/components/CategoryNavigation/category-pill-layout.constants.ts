/** Figma shop filter slugs (node 269:894). */
export type ShopCategoryFilterSlug = 'all' | 'face' | 'hair' | 'body' | 'kids';

/** Per-pill width, gap, and padding — Figma nodes 269:895 … 493:372. */
const CATEGORY_PILL_LAYOUT_BY_SLUG: Record<ShopCategoryFilterSlug, string> = {
  all: 'w-[88px] gap-1 px-1.5 py-1.5',
  face: 'w-[88px] gap-1 px-1.5 py-1.5',
  hair: 'w-[98px] gap-1.5 px-2 py-1.5',
  body: 'w-[116px] gap-1.5 px-2 py-1.5',
  kids: 'w-[156px] gap-1.5 px-2 py-1.5',
};

/** Tailwind layout classes for a category filter pill. */
export function getCategoryPillLayoutClass(slug: string, hasChildren = false): string {
  if (slug in CATEGORY_PILL_LAYOUT_BY_SLUG) {
    return CATEGORY_PILL_LAYOUT_BY_SLUG[slug as ShopCategoryFilterSlug];
  }

  if (hasChildren) {
    return 'gap-1.5 px-2 py-1.5';
  }

  return 'gap-1.5 px-2 py-1.5';
}
