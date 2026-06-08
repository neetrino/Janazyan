export type CategoryPillIconKey = 'face' | 'hair' | 'body' | 'kids' | 'default';

type CategoryPillIcon = {
  src: string;
  className: string;
};

const CATEGORY_PILL_ICONS: Record<Exclude<CategoryPillIconKey, 'default'>, CategoryPillIcon> = {
  face: { src: '/figma/filter-face-icon.svg', className: 'h-5 w-5' },
  hair: { src: '/figma/filter-hair-icon.svg', className: 'h-5 w-5' },
  body: { src: '/figma/filter-body-icon.svg', className: 'h-5 w-5' },
  kids: { src: '/figma/filter-kids-icon.svg', className: 'h-6 w-6' },
};

const FACE_KEYWORDS = ['face', 'դեմք', 'лицо'];
const HAIR_KEYWORDS = ['hair', 'մազ', 'волос'];
const BODY_KEYWORDS = ['body', 'մարմին', 'тело', 'adult'];
const KIDS_KEYWORDS = ['kids', 'kid', 'baby', 'child', 'մանկ', 'дет'];

/**
 * Map a category slug/title to a Figma filter icon key.
 */
export function resolveCategoryPillIconKey(slug: string, title: string): CategoryPillIconKey {
  const haystack = `${slug} ${title}`.toLowerCase();

  if (FACE_KEYWORDS.some((keyword) => haystack.includes(keyword))) {
    return 'face';
  }
  if (HAIR_KEYWORDS.some((keyword) => haystack.includes(keyword))) {
    return 'hair';
  }
  if (BODY_KEYWORDS.some((keyword) => haystack.includes(keyword))) {
    return 'body';
  }
  if (KIDS_KEYWORDS.some((keyword) => haystack.includes(keyword))) {
    return 'kids';
  }

  return 'default';
}

export function getCategoryPillIcon(key: CategoryPillIconKey): CategoryPillIcon | null {
  if (key === 'default') {
    return null;
  }
  return CATEGORY_PILL_ICONS[key];
}
