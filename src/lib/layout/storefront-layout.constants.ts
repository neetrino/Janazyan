/** Viewport min-width where storefront desktop chrome activates (header pills, hero shell). */
export const STOREFRONT_DESKTOP_MIN_WIDTH_PX = 1300;

/** Tablet + mobile shell — hidden from {@link STOREFRONT_DESKTOP_MIN_WIDTH_PX} upward. */
export const STOREFRONT_TABLET_DOWN_CLASS = 'desktop:hidden';

/** Desktop-only block surfaces (paired with {@link STOREFRONT_TABLET_DOWN_CLASS}). */
export const STOREFRONT_DESKTOP_ONLY_CLASS = 'hidden desktop:block';

/** Desktop-only flex rows (toolbar, nav cluster). */
export const STOREFRONT_DESKTOP_FLEX_CLASS = 'hidden desktop:flex';

/** Figma home artboard width (node 10:517) — design coordinate reference. */
export const STOREFRONT_CONTENT_MAX_WIDTH_PX = 1470;

/** Slightly wider content column on large viewports. */
export const STOREFRONT_CONTENT_MAX_WIDTH_LG_PX = 1660;

/** Content column on extra-large viewports (≥1800px). */
export const STOREFRONT_CONTENT_MAX_WIDTH_XL_PX = 1800;

/** Content column on ultra-wide viewports (≥2200px). */
export const STOREFRONT_CONTENT_MAX_WIDTH_2XL_PX = 1900;

/** Figma pastel-arc section is 5px wider than the artboard. */
export const STOREFRONT_ARC_MAX_WIDTH_PX = 1475;

export const STOREFRONT_ARC_MAX_WIDTH_LG_PX = 1665;

export const STOREFRONT_ARC_MAX_WIDTH_XL_PX = 1805;

export const STOREFRONT_ARC_MAX_WIDTH_2XL_PX = 1905;

/** Figma promo poster width inside the 1470 artboard (~48px side inset). */
export const STOREFRONT_PROMO_MAX_WIDTH_PX = 1375;

export const STOREFRONT_PROMO_MAX_WIDTH_LG_PX = 1565;

export const STOREFRONT_PROMO_MAX_WIDTH_XL_PX = 1705;

export const STOREFRONT_PROMO_MAX_WIDTH_2XL_PX = 1805;

/** Viewport min-width where the widened column activates. */
export const STOREFRONT_LARGE_LAYOUT_MIN_WIDTH_PX = 1548;

/** Viewport min-width where the extra-large column activates. */
export const STOREFRONT_XL_LAYOUT_MIN_WIDTH_PX = 1800;

/** Viewport min-width where the ultra-wide column activates. */
export const STOREFRONT_2XL_LAYOUT_MIN_WIDTH_PX = 2200;

/** @deprecated Side padding no longer drops at large breakpoints — kept for reference only. */
export const STOREFRONT_SIDE_PADDING_END_MIN_WIDTH_PX = 1580;

export const STOREFRONT_CONTENT_MAX_WIDTH_CLASS = `max-w-[1470px] min-[1548px]:max-w-[1660px] min-[1800px]:max-w-[1800px] min-[2200px]:max-w-[1900px]`;

export const STOREFRONT_ARC_MAX_WIDTH_CLASS = `max-w-[1475px] min-[1548px]:max-w-[1665px] min-[1800px]:max-w-[1805px] min-[2200px]:max-w-[1905px]`;

export const STOREFRONT_PROMO_MAX_WIDTH_CLASS =
  'max-w-[1375px] min-[1548px]:max-w-[1565px] min-[1800px]:max-w-[1705px] min-[2200px]:max-w-[1805px]';

/** Minimum side gutter on narrow viewports (home mobile + legacy storefront blocks). */
export const STOREFRONT_SIDE_PADDING_MIN_PX = 24;

/**
 * Side padding — same gutter as hero-shell pages on all viewports (no drop at max-width).
 * Aligns with {@link PRODUCTS_PAGE_SIDE_PADDING_CLASS}.
 */
export const STOREFRONT_SIDE_PADDING_CLASS = 'px-[clamp(24px,3.2vw,36px)]';

/** Negative horizontal margin — cancels {@link STOREFRONT_SIDE_PADDING_CLASS} for full-bleed surfaces. */
export const STOREFRONT_SIDE_PADDING_NEG_CLASS = '-mx-[clamp(24px,3.2vw,36px)]';

/** Responsive horizontal gutter — same as shell side padding. */
export const STOREFRONT_HORIZONTAL_GUTTER_CLASS = STOREFRONT_SIDE_PADDING_CLASS;

/** Centers content with proportional side insets; widens slightly on large screens. */
export const STOREFRONT_CONTENT_SHELL_CLASS = `mx-auto w-full ${STOREFRONT_CONTENT_MAX_WIDTH_CLASS} ${STOREFRONT_SIDE_PADDING_CLASS}`;

/** Pastel arc block — slightly wider than the main column (Figma 10:519). */
export const STOREFRONT_ARC_SHELL_CLASS = `mx-auto w-full ${STOREFRONT_ARC_MAX_WIDTH_CLASS} ${STOREFRONT_SIDE_PADDING_CLASS}`;

/** Card rows inside arc sections — matches hero-shell inner inset. */
export const SECTION_CARD_ROW_INSET_CLASS = 'px-6 sm:px-8';

/** Home category 2×2 grid — inset within the content column (Figma 45:414). */
export const HOME_CATEGORY_GRID_INSET_CLASS = 'px-6 md:px-10 lg:px-12';
