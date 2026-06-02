export type HeroSlideBackground = 'blue' | 'pink';

export type HeroSlide = {
  id: string;
  background: HeroSlideBackground;
  productImage: string;
  productAlt: string;
  showKidsLabel: boolean;
};

export const HERO_SLIDES: HeroSlide[] = [
  {
    id: 'body-wash',
    background: 'blue',
    productImage: '/figma/hero-body-wash.webp',
    productAlt: 'Janazyan body wash product',
    showKidsLabel: false,
  },
  {
    id: 'kids-care',
    background: 'pink',
    productImage: '/figma/hero-jellyfish.webp',
    productAlt: 'Janazyan kids care products',
    showKidsLabel: true,
  },
];

export const HERO_ARROW_SIZE_PX = 64;
export const HERO_AUTOPLAY_INTERVAL_MS = 5000;
