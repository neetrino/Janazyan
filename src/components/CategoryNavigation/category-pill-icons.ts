export type CategoryPillIconKey =
  | 'all'
  | 'face'
  | 'hair'
  | 'body'
  | 'kids'
  | 'women'
  | 'men'
  | 'accessories'
  | 'default';

type CategoryPillIcon = {
  src: string;
  className: string;
  width: number;
  height: number;
  activeSrc?: string;
};

const CATEGORY_PILL_ICONS: Record<
  Exclude<CategoryPillIconKey, 'default'>,
  CategoryPillIcon
> = {
  all: {
    src: '/figma/filter-all-grid-icon.svg',
    activeSrc: '/figma/filter-active-grid-icon.svg',
    className: 'h-6 w-6',
    width: 24,
    height: 24,
  },
  face: { src: '/figma/filter-face-icon.svg', className: 'h-5 w-5', width: 20, height: 20 },
  hair: { src: '/figma/filter-hair-icon.svg', className: 'h-[19px] w-[18px]', width: 18, height: 19 },
  body: { src: '/figma/filter-body-icon.svg', className: 'h-5 w-[15px]', width: 15, height: 20 },
  kids: { src: '/figma/filter-kids-icon.svg', className: 'h-6 w-6', width: 24, height: 24 },
  women: { src: '/figma/filter-women-icon.svg', className: 'h-5 w-5', width: 20, height: 20 },
  men: { src: '/figma/filter-men-icon.svg', className: 'h-5 w-5', width: 20, height: 20 },
  accessories: {
    src: '/figma/filter-accessories-icon.svg',
    className: 'h-5 w-5',
    width: 20,
    height: 20,
  },
};

const FACE_KEYWORDS = ['face', 'դեմք', 'лицо', 'դիմ'];
const HAIR_KEYWORDS = ['hair', 'մազ', 'волос'];
const BODY_KEYWORDS = ['body', 'body care', 'մարմին', 'մարմն', 'тело', 'adult'];
const KIDS_KEYWORDS = ['kids', 'kid', 'baby', 'child', 'մանկ', 'дет', 'երեխ'];
const WOMEN_KEYWORDS = ['women', 'woman', 'female', 'կանայ', 'жен'];
const MEN_KEYWORDS = ['men', 'man', 'male', 'տղամարդ', 'муж'];
const ACCESSORIES_KEYWORDS = ['accessor', 'աքսեսուար', 'аксессуар', 'bag'];

/**
 * Map a category slug/title to a Figma filter icon key.
 */
export function resolveCategoryPillIconKey(slug: string, title: string): CategoryPillIconKey {
  if (slug === 'all' || slug === 'assortment') {
    return 'all';
  }

  const haystack = `${slug} ${title}`.toLowerCase();

  if (WOMEN_KEYWORDS.some((keyword) => haystack.includes(keyword))) {
    return 'women';
  }
  if (MEN_KEYWORDS.some((keyword) => haystack.includes(keyword))) {
    return 'men';
  }
  if (ACCESSORIES_KEYWORDS.some((keyword) => haystack.includes(keyword))) {
    return 'accessories';
  }
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

export function getCategoryPillIcon(
  key: CategoryPillIconKey,
  isActive = false,
): CategoryPillIcon | null {
  if (key === 'default') {
    return null;
  }

  const icon = CATEGORY_PILL_ICONS[key];
  if (!isActive || !icon.activeSrc) {
    return icon;
  }

  return { ...icon, src: icon.activeSrc };
}
