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
    productImage: '/figma/hero-body-wash-bouquet.png',
    productAlt: 'Janazyan body wash product',
    showKidsLabel: false,
  },
  {
    id: 'kids-care',
    background: 'pink',
    productImage: '/figma/hero-octopus.png',
    productAlt: 'Janazyan kids care octopus',
    showKidsLabel: true,
  },
];

/**
 * Figma 606:725 — 617×713, flush to the artboard’s right edge, y=138.
 * Top clears the 120px header band so the photo does not cover the action pills.
 * The frame stays inside the hero card, so it cannot spill past the right edge.
 */
export const HERO_BODY_WASH_DESKTOP_FRAME_CLASS =
  'right-0 top-[88px] z-20 h-[calc(100%-108px)] aspect-[617/713] overflow-hidden';

export const HERO_BODY_WASH_IMAGE_CLASS =
  'pointer-events-none object-cover object-right';

/**
 * Figma node 42:236 on the 1388×940 pink hero.
 * The layer is rotated 180°, so these are its visible bounds.
 */
/** Full octopus inside the hero card — no crop at the bottom edge. */
export const HERO_OCTOPUS_FRAME_CLASS =
  'bottom-2 left-[40%] top-[8%] w-[56%] translate-y-8';

/** Horizontal mirror of the kids-slide octopus. */
export const HERO_OCTOPUS_MIRROR_CLASS = '-scale-x-100';

export const HERO_BODY_WASH_IMAGE_WIDTH_PX = 1002;
export const HERO_BODY_WASH_IMAGE_HEIGHT_PX = 1243;

export const HERO_ARROW_SIZE_PX = 64;

/** Centers the arrow row on the hero card's bottom edge. */
export const HERO_NAV_BOTTOM_CLASS = 'bottom-0 translate-y-1/2';
/** Auto-advance hero slides every 4 seconds. */
export const HERO_SLIDE_AUTOPLAY_MS = 4000;
