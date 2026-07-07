/** Figma sky-deep — hero band top tone. */
export const STOREFRONT_HERO_SHELL_SKY_TOP_COLOR = '#93B6E3';

/** Mid sky — seam tone where hero band meets catalog content. */
export const STOREFRONT_HERO_SHELL_SKY_MID_COLOR = '#C6DDF3';

export type StorefrontHeroShellGradientStop = {
  offset: string;
  color: string;
};

/** Desktop — blue at top, white at bottom. */
export const STOREFRONT_HERO_SHELL_DESKTOP_GRADIENT_STOPS: readonly StorefrontHeroShellGradientStop[] = [
  { offset: '0%', color: STOREFRONT_HERO_SHELL_SKY_TOP_COLOR },
  { offset: '14%', color: '#A8C4E8' },
  { offset: '28%', color: STOREFRONT_HERO_SHELL_SKY_MID_COLOR },
  { offset: '42%', color: '#D4E7F8' },
  { offset: '56%', color: '#E2EFF9' },
  { offset: '68%', color: '#EEF5FC' },
  { offset: '80%', color: '#F7FAFD' },
  { offset: '92%', color: '#FFFFFF' },
  { offset: '100%', color: '#FFFFFF' },
];

/** Laptop — same direction, faster fade so product rows sit on white sooner. */
export const STOREFRONT_HERO_SHELL_LAPTOP_GRADIENT_STOPS: readonly StorefrontHeroShellGradientStop[] = [
  { offset: '0%', color: STOREFRONT_HERO_SHELL_SKY_TOP_COLOR },
  { offset: '10%', color: '#A8C4E8' },
  { offset: '22%', color: STOREFRONT_HERO_SHELL_SKY_MID_COLOR },
  { offset: '36%', color: '#D4E7F8' },
  { offset: '50%', color: '#E2EFF9' },
  { offset: '62%', color: '#EEF5FC' },
  { offset: '74%', color: '#F7FAFD' },
  { offset: '86%', color: '#FFFFFF' },
  { offset: '100%', color: '#FFFFFF' },
];

/** Mobile catalog — white under top bar, then sky blue toward the bottom. */
export const STOREFRONT_HERO_SHELL_MOBILE_GRADIENT_STOPS: readonly StorefrontHeroShellGradientStop[] = [
  { offset: '0%', color: '#FFFFFF' },
  { offset: '6%', color: '#FFFFFF' },
  { offset: '18%', color: '#F7FAFD' },
  { offset: '32%', color: '#EEF5FC' },
  { offset: '44%', color: '#E2EFF9' },
  { offset: '58%', color: '#D4E7F8' },
  { offset: '72%', color: STOREFRONT_HERO_SHELL_SKY_MID_COLOR },
  { offset: '100%', color: STOREFRONT_HERO_SHELL_SKY_MID_COLOR },
];

export const STOREFRONT_LAPTOP_VIEWPORT_MAX_WIDTH_PX = 1649;

/** @param stops Gradient stops top → bottom. */
export function buildStorefrontHeroShellGradientCss(
  stops: readonly StorefrontHeroShellGradientStop[],
): string {
  return `linear-gradient(180deg, ${stops.map((stop) => `${stop.color} ${stop.offset}`).join(', ')})`;
}

export const STOREFRONT_HERO_SHELL_GRADIENT_CSS = buildStorefrontHeroShellGradientCss(
  STOREFRONT_HERO_SHELL_DESKTOP_GRADIENT_STOPS,
);

export const STOREFRONT_HERO_SHELL_LAPTOP_GRADIENT_CSS = buildStorefrontHeroShellGradientCss(
  STOREFRONT_HERO_SHELL_LAPTOP_GRADIENT_STOPS,
);

export const STOREFRONT_HERO_SHELL_MOBILE_GRADIENT_CSS = buildStorefrontHeroShellGradientCss(
  STOREFRONT_HERO_SHELL_MOBILE_GRADIENT_STOPS,
);

/** Tailwind utility — blue at top fading to white at the bottom. */
export const STOREFRONT_HERO_SHELL_BACKGROUND_CLASS = 'bg-storefront-hero-shell';

/** Laptop storefront shell — quicker fade to white. */
export const STOREFRONT_HERO_SHELL_LAPTOP_BACKGROUND_CLASS = 'bg-storefront-hero-shell-laptop';

/** Mobile — white tucks under top bar, then fades into the shared sky palette. */
export const STOREFRONT_HERO_SHELL_MOBILE_BACKGROUND_CLASS = 'bg-storefront-hero-shell-mobile';

/** Desktop hero band — laptop gradient below 1650px, full desktop fade at wide viewports. */
export const STOREFRONT_HERO_SHELL_RESPONSIVE_BACKGROUND_CLASS =
  `${STOREFRONT_HERO_SHELL_LAPTOP_BACKGROUND_CLASS} min-[1650px]:bg-storefront-hero-shell`;

/** Hero aspect box — white shows through outside the Figma path cutout. */
export const STOREFRONT_HERO_SHELL_ASPECT_SURFACE_CLASS = 'bg-white';

/** Category row overflow fade — matches {@link STOREFRONT_HERO_SHELL_SKY_MID_COLOR}. */
export const STOREFRONT_HERO_SHELL_CATEGORY_SCROLL_FADE_FROM_CLASS = 'desktop:from-[#C6DDF3]';
