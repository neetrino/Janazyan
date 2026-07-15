import {
  AUTH_PAGE_MOBILE_CONTENT_INSET_CLASS,
  AUTH_PAGE_MOBILE_CONTENT_SURFACE_CLASS,
} from '../../components/auth/auth-layout.constants';

/** About page — Figma node 598:549 */

/** Match /contact hero spacing so product art can sit high beside the header. */
export const ABOUT_PAGE_HERO_SHELL_PROPS = {
  compactMobileTop: false,
  compactContentSpacing: false,
  mobileContentSurfaceClassName: AUTH_PAGE_MOBILE_CONTENT_SURFACE_CLASS,
  mobileContentInsetClassName: AUTH_PAGE_MOBILE_CONTENT_INSET_CLASS,
} as const;

/** Figma frame width for desktop absolute layout. */
export const ABOUT_ARTBOARD_WIDTH_PX = 1440;

/**
 * Content height from shampoo top (y=138) to footer start (y=1284).
 * Artboard y=0 maps to Figma y=138.
 */
export const ABOUT_ARTBOARD_ORIGIN_Y_PX = 138;
export const ABOUT_ARTBOARD_HEIGHT_PX = 1146;

export const ABOUT_SHAMPOO_IMAGE_SRC = '/figma/about-page-shampoo.webp';
export const ABOUT_CREAM_IMAGE_SRC = '/figma/about-page-cream.webp';

/** Figma node 606:725 — Group 9291 1 */
export const ABOUT_SHAMPOO_WIDTH_PX = 617;
export const ABOUT_SHAMPOO_HEIGHT_PX = 713;
export const ABOUT_SHAMPOO_LEFT_PX = 823;
export const ABOUT_SHAMPOO_TOP_PX = 0;

/** Figma node 606:726 — cream composition, bleeds to shell left edge */
export const ABOUT_CREAM_WIDTH_PX = 651;
export const ABOUT_CREAM_HEIGHT_PX = 649;
export const ABOUT_CREAM_LEFT_PX = 0;
export const ABOUT_CREAM_TOP_PX = 596 - ABOUT_ARTBOARD_ORIGIN_Y_PX;

/** Figma node 598:630 — heading stack */
export const ABOUT_HEADING_LEFT_PX = 88;
export const ABOUT_HEADING_TOP_PX = 227 - ABOUT_ARTBOARD_ORIGIN_Y_PX;
export const ABOUT_HEADING_WIDTH_PX = 779;

/** Figma node 603:719 — left body copy */
export const ABOUT_BODY_LEFT_LEFT_PX = 93;
export const ABOUT_BODY_LEFT_TOP_PX = 404 - ABOUT_ARTBOARD_ORIGIN_Y_PX;
export const ABOUT_BODY_LEFT_WIDTH_PX = 660;

/** Figma node 603:720 — right-aligned body copy */
export const ABOUT_BODY_RIGHT_LEFT_PX = 626;
export const ABOUT_BODY_RIGHT_TOP_PX = 879 - ABOUT_ARTBOARD_ORIGIN_Y_PX;
export const ABOUT_BODY_RIGHT_WIDTH_PX = 764;

/** Pull section into hero band — same idea as contact. */
export const ABOUT_SECTION_DESKTOP_BLEED_CLASS =
  'desktop:relative desktop:-mt-[100px] min-[1548px]:-mt-[70px] min-[1800px]:-mt-[50px] desktop:-mb-8 desktop:pt-0 desktop:pb-0 desktop:overflow-visible';

export const ABOUT_COPY_CLASS =
  'text-base font-normal leading-6 tracking-[-0.3125px] text-black/47';

export const ABOUT_MOBILE_SECTION_CLASS =
  'flex flex-col gap-8 py-4 desktop:hidden';

export const ABOUT_MOBILE_IMAGE_CLASS =
  'relative mx-auto w-full max-w-[420px] overflow-hidden';

export const ABOUT_PAGE_CATALOG_BOTTOM_PADDING_CLASS =
  'pb-24 md:pb-32 desktop:pb-16';
