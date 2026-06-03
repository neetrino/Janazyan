import type { CSSProperties } from 'react';

export const HOME_NAV_LINK_HREFS: ReadonlyArray<{
  labelKey: 'home' | 'shop' | 'categories' | 'about' | 'contact';
  href: string;
}> = [
  { labelKey: 'home', href: '/' },
  { labelKey: 'shop', href: '/products' },
  { labelKey: 'categories', href: '/stores' },
  { labelKey: 'about', href: '/about' },
  { labelKey: 'contact', href: '/contact' },
];

/** @deprecated Use HOME_NAV_LINK_HREFS with i18n in HeaderBrandCluster */
export const HOME_NAV_LINKS = HOME_NAV_LINK_HREFS;

export type CategoryColorKey =
  | 'pink'
  | 'sky'
  | 'butter'
  | 'sage'
  | 'lavender';

export const CATEGORY_BG: Record<CategoryColorKey, string> = {
  pink: '#f5c8ce',
  sky: '#bcd4ec',
  butter: '#f3e2be',
  sage: '#d6dfc2',
  lavender: '#e7cdff',
};

/** Desktop / mobile 2×2 grid order (Figma node 45:414). */
export const CATEGORY_FIGMA_GRID_IDS = [
  'body',
  'kids',
  'hair',
  'face',
] as const;

export type CategoryPosterConfig = {
  id: string;
  color: CategoryColorKey;
  bottle: string;
  href: string;
};

export const CATEGORY_POSTER_CONFIG: ReadonlyArray<CategoryPosterConfig> = [
  {
    id: 'body',
    color: 'butter',
    bottle: '/figma/category-body.webp',
    href: '/products?category=body',
  },
  {
    id: 'kids',
    color: 'pink',
    bottle: '/figma/category-kids.webp',
    href: '/products?category=kids',
  },
  {
    id: 'hair',
    color: 'sky',
    bottle: '/figma/category-hair.webp',
    href: '/products?category=hair',
  },
  {
    id: 'face',
    color: 'lavender',
    bottle: '/figma/category-face.webp',
    href: '/products?category=face',
  },
  {
    id: 'adult',
    color: 'sage',
    bottle: '/figma/category-body.webp',
    href: '/products?category=adult',
  },
];

/** @deprecated Use CATEGORY_POSTER_CONFIG + useHomeCategoryPosters */
export const CATEGORY_POSTERS = CATEGORY_POSTER_CONFIG;

export type WhyCardConfig = {
  cardKey: '01' | '02' | '03' | '04';
  number: string;
  numberColor: string;
};

export const WHY_CARD_CONFIG: ReadonlyArray<WhyCardConfig> = [
  { cardKey: '01', number: '96', numberColor: '#f5c8ce' },
  { cardKey: '02', number: '5+', numberColor: '#bcd4ec' },
  { cardKey: '03', number: '28', numberColor: '#d6dfc2' },
  { cardKey: '04', number: '0', numberColor: '#f3e2be' },
];

/** @deprecated Use WHY_CARD_CONFIG + useHomeWhyCards */
export const WHY_CARDS = WHY_CARD_CONFIG;

export const ABOUT_STAT_KEYS = ['families', 'products', 'rating'] as const;

export const SECTION_BG: CSSProperties = {
  backgroundImage:
    'linear-gradient(39.10608783083339deg, rgb(147, 182, 227) 7.8835%, rgb(252, 248, 236) 101.47%)',
};
