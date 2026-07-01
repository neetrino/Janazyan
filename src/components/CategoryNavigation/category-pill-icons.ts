export type CategoryPillIconKey =
  | 'all'
  | 'face'
  | 'hair'
  | 'body'
  | 'kids'
  | 'sun'
  | 'women'
  | 'men'
  | 'accessories'
  | 'default';

type CategoryPillIcon = {
  src: string;
  className: string;
};

const CATEGORY_PILL_ICONS: Record<
  Exclude<CategoryPillIconKey, 'default' | 'sun'>,
  CategoryPillIcon
> = {
  all: { src: '/figma/filter-active-grid-icon.svg', className: 'h-7 w-7' },
  face: { src: '/figma/filter-face-icon.svg', className: 'h-6 w-6' },
  hair: { src: '/figma/filter-hair-icon.svg', className: 'h-6 w-[22px]' },
  body: { src: '/figma/filter-body-icon.svg', className: 'h-6 w-[18px]' },
  kids: { src: '/figma/filter-kids-icon.svg', className: 'h-7 w-7' },
  women: { src: '/figma/filter-women-icon.svg', className: 'h-6 w-6' },
  men: { src: '/figma/filter-men-icon.svg', className: 'h-6 w-6' },
  accessories: { src: '/figma/filter-accessories-icon.svg', className: 'h-6 w-6' },
};

const ACTIVE_GRID_ICON: CategoryPillIcon = CATEGORY_PILL_ICONS.all;

const FACE_KEYWORDS = ['face', 'դեմք', 'лицо', 'դիմ'];
const HAIR_KEYWORDS = ['hair', 'մազ', 'волос'];
const BODY_KEYWORDS = ['body', 'body care', 'մարմին', 'մարմն', 'тело', 'adult'];
const KIDS_KEYWORDS = ['kids', 'kid', 'baby', 'child', 'մանկ', 'дет', 'երեխ'];
const SUN_KEYWORDS = ['sun', 'spf', 'արև', 'солн'];
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

  if (slug === 'sun' || SUN_KEYWORDS.some((keyword) => haystack.includes(keyword))) {
    return 'sun';
  }
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
  isActive: boolean
): CategoryPillIcon | null {
  if (isActive) {
    return ACTIVE_GRID_ICON;
  }

  if (key === 'default' || key === 'sun') {
    return null;
  }

  return CATEGORY_PILL_ICONS[key];
}
