import type { CSSProperties } from 'react';

export const HOME_NAV_LINKS: ReadonlyArray<{
  label: string;
  href: string;
  active?: boolean;
}> = [
  { label: 'Գլխավոր', href: '/', active: true },
  { label: 'Խանութ', href: '/products' },
  { label: 'Կատեգորիաներ', href: '/products?view=categories' },
  { label: 'Մեր Մասին', href: '/about' },
  { label: 'Մեր Մասին', href: '/about' },
  { label: 'Կապ', href: '/contact' },
];

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
  lavender: '#d6ccea',
};

export type CategoryPoster = {
  id: string;
  title: [string, string];
  tag: string;
  caption: string;
  color: CategoryColorKey;
  bottle: string;
  href: string;
};

export const CATEGORY_POSTERS: ReadonlyArray<CategoryPoster> = [
  {
    id: 'kids',
    title: ['Մանկական', 'Խնամք'],
    tag: '42 ապրանք',
    caption: 'Serum · Cream · Mask',
    color: 'pink',
    bottle: '/figma/bottle.png',
    href: '/products?category=kids',
  },
  {
    id: 'hair',
    title: ['Մազերի', 'խնամք'],
    tag: '28 ապրանք',
    caption: 'Body · Lotion · Oil',
    color: 'sky',
    bottle: '/figma/bottle.png',
    href: '/products?category=hair',
  },
  {
    id: 'body',
    title: ['Մարմնի', 'խնամք'],
    tag: '18 ապրանք',
    caption: 'Kids · 3M+',
    color: 'butter',
    bottle: '/figma/bottle.png',
    href: '/products?category=body',
  },
  {
    id: 'face',
    title: ['Դեմքի', 'խնամք'],
    tag: '21 ապրանք · NEW',
    caption: 'Հիպոալերգիկ · Մաշկաբանորեն փորձարկված',
    color: 'lavender',
    bottle: '/figma/bottle.png',
    href: '/products?category=face',
  },
  {
    id: 'adult',
    title: ['ՄԵԾԱՀԱՍԱԿՆԵՐԻ', 'ԽՆԱՄՔ'],
    tag: '12 ապրանք',
    caption: 'SPF 30 → 50+',
    color: 'sage',
    bottle: '/figma/bottle.png',
    href: '/products?category=adult',
  },
];

export type FeaturedProduct = {
  id: string;
  title: string;
  price: string;
  rating: string;
  image: string;
};

export const FEATURED_PRODUCTS: ReadonlyArray<FeaturedProduct> = [
  {
    id: 'p1',
    title: 'Օրգանիկ Բամբակյա Մեկտեղանի',
    price: '12000 Դ',
    rating: '5.0',
    image: '/figma/product.png',
  },
  {
    id: 'p2',
    title: 'Օրգանիկ Բամբակյա Մեկտեղանի',
    price: '12000 Դ',
    rating: '5.0',
    image: '/figma/product.png',
  },
  {
    id: 'p3',
    title: 'Օրգանիկ Բամբակյա Մեկտեղանի',
    price: '12000 Դ',
    rating: '5.0',
    image: '/figma/product.png',
  },
];

export type WhyCard = {
  number: string;
  index: string;
  titleA: string;
  titleB: string;
  description: string;
  numberColor: string;
};

export const WHY_CARDS: ReadonlyArray<WhyCard> = [
  {
    number: '96',
    index: '№ 01',
    titleA: 'Բնական',
    titleB: 'բաղադրիչներ',
    description:
      '96% բուսական ծագման բաղադրիչներ՝ սերտիֆիկացված մատակարարներից։',
    numberColor: '#f5c8ce',
  },
  {
    number: '5+',
    index: '№ 02',
    titleA: 'Ընտանիքի',
    titleB: 'համար',
    description:
      'Բանաձևեր՝ 3 ամսականից մինչև 80 տարեկան մաշկի համար։',
    numberColor: '#bcd4ec',
  },
  {
    number: '28',
    index: '№ 03',
    titleA: 'Մաշկաբանորեն',
    titleB: 'փորձարկված',
    description:
      'Անկախ լաբորատորիաներ, կլինիկական արդյունքներ 28 օրում։',
    numberColor: '#d6dfc2',
  },
  {
    number: '0',
    index: '№ 04',
    titleA: 'Cruelty',
    titleB: 'Free',
    description:
      'Երբևէ չենք փորձարկում կենդանիների վրա — Leaping Bunny սերտիֆիկատ։',
    numberColor: '#f3e2be',
  },
];

export type StatItem = { value: string; label: string };

export const ABOUT_STATS: ReadonlyArray<StatItem> = [
  { value: '10հզ+', label: 'Երջանիկ Ընտանիք' },
  { value: '500+', label: 'Արտադրանք' },
  { value: '4.9★', label: 'Գնահատական' },
];

export const FOOTER_QUICK_LINKS: ReadonlyArray<{
  label: string;
  href: string;
}> = [
  { label: 'Մեր Մասին', href: '/about' },
  { label: 'Խանութ', href: '/products' },
  { label: 'Բլոգ', href: '/blog' },
  { label: 'Կապ', href: '/contact' },
];

export const FOOTER_POLICIES: ReadonlyArray<{
  label: string;
  href: string;
}> = [
  { label: 'Գաղտնիության քաղաքականություն', href: '/privacy' },
  { label: 'Առաքման քաղաքականություն', href: '/delivery' },
  { label: 'Վերադարձի քաղաքականություն', href: '/returns' },
  { label: 'Պայմաններ և դրույթներ', href: '/terms' },
];

export const FOOTER_CONTACTS: ReadonlyArray<{
  icon: 'pin' | 'phone' | 'mail';
  text: string;
  href?: string;
}> = [
  { icon: 'pin', text: 'Երևան, Հայաստան 0001' },
  { icon: 'phone', text: '+374 (10) 123-456', href: 'tel:+37410123456' },
  {
    icon: 'mail',
    text: 'barev@poqrikcaghik.am',
    href: 'mailto:barev@poqrikcaghik.am',
  },
];

export const SECTION_BG: CSSProperties = {
  backgroundImage:
    'linear-gradient(39.10608783083339deg, rgb(147, 182, 227) 7.8835%, rgb(252, 248, 236) 101.47%)',
};
