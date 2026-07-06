/** Figma shop filter slugs (node 269:894). */
export type ShopCategoryFilterSlug = 'all' | 'face' | 'hair' | 'body' | 'kids';

/** Per-pill width, gap, and padding — Figma nodes 269:895 … 493:372. */
const CATEGORY_PILL_LAYOUT_BY_SLUG: Record<ShopCategoryFilterSlug, string> = {
  all: 'w-[115px] gap-[5px] px-2 py-3',
  face: 'w-[115px] gap-[5px] px-2 py-3',
  hair: 'w-[128px] gap-2.5 px-[13px] py-3.5',
  body: 'w-[152px] gap-2.5 px-[9px] py-3.5',
  kids: 'w-[201px] gap-2.5 px-2 py-3.5',
};

/** Tailwind layout classes for a category filter pill. */
export function getCategoryPillLayoutClass(slug: string, hasChildren = false): string {
  if (slug in CATEGORY_PILL_LAYOUT_BY_SLUG) {
    return CATEGORY_PILL_LAYOUT_BY_SLUG[slug as ShopCategoryFilterSlug];
  }

  if (hasChildren) {
    return 'gap-2.5 px-3 py-3.5';
  }

  return 'gap-2.5 px-3 py-3.5';
}
