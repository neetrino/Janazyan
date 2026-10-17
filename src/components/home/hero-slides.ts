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
 * Figma node I45:562;362:564 — product window on the 1388×940 hero.
 * x=671 (48.34%), width=714 (51.44%), height=606 (64.47%). Top is a little below the Figma y.
 */
export const HERO_BODY_WASH_DESKTOP_FRAME_CLASS =
  'lg:left-[48.34%] lg:top-[26%] lg:z-30 lg:h-[64.47%] lg:w-[51.44%]';

/** Crop inside that window: image height 157.05%, shifted up 41.87%. */
export const HERO_BODY_WASH_IMAGE_CROP_CLASS =
  'pointer-events-none absolute left-0 top-[-41.87%] h-[157.05%] w-full max-w-none';

/**
 * Figma node 42:236 on the 1388×940 pink hero.
 * The layer is rotated 180°, so these are its visible bounds.
 */
export const HERO_OCTOPUS_FRAME_CLASS =
  'left-[45.53%] top-[31.49%] h-[66.91%] w-[46.47%]';

/** Horizontal mirror of the kids-slide octopus. */
export const HERO_OCTOPUS_MIRROR_CLASS = '-scale-x-100';

export const HERO_BODY_WASH_IMAGE_WIDTH_PX = 1086;
export const HERO_BODY_WASH_IMAGE_HEIGHT_PX = 1448;

export const HERO_ARROW_SIZE_PX = 64;

/** Centers the arrow row on the hero card's bottom edge. */
export const HERO_NAV_BOTTOM_CLASS = 'bottom-0 translate-y-1/2';
/** Auto-advance hero slides every 4 seconds. */
export const HERO_SLIDE_AUTOPLAY_MS = 4000;
