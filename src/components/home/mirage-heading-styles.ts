/** Mirage Expanded — Figma display typography (category/promo titles). */
export const MIRAGE_DISPLAY_BASE =
  'font-mirage font-normal text-ink-800 tracking-[-0.4492px]';

export const MIRAGE_LINE_HEIGHT_CLASS = 'leading-[0.652]';

/** Figma node 10:707 / 10:594 — section titles at 66px. */
export const MIRAGE_SECTION_TRACKING_CLASS = 'tracking-[0.3691px]';

/** Centered section titles (Featured, Why Choose Us, etc.) */
export const MIRAGE_SECTION_HEADING_CLASS = `font-mirage font-normal text-ink-800 ${MIRAGE_SECTION_TRACKING_CLASS} ${MIRAGE_LINE_HEIGHT_CLASS} text-[clamp(34px,5vw,66px)]`;

export const MIRAGE_SECTION_HEADING_CREAM_CLASS = `font-mirage font-normal text-cream ${MIRAGE_SECTION_TRACKING_CLASS} ${MIRAGE_LINE_HEIGHT_CLASS} text-[clamp(34px,5vw,66px)]`;

/** About section — Figma node 45:415, Mirage at 100px. */
export const MIRAGE_ABOUT_HEADING_BASE = `font-mirage font-normal text-[100px] ${MIRAGE_SECTION_TRACKING_CLASS}`;

export const MIRAGE_ABOUT_HEADING_SKY_CLASS = `${MIRAGE_ABOUT_HEADING_BASE} leading-[90px] text-sky-soft`;

export const MIRAGE_ABOUT_HEADING_INK_CLASS = `${MIRAGE_ABOUT_HEADING_BASE} leading-[80px] text-ink-800`;

/** Category poster cards — Figma Mirage at 75px / 45px line */
export const MIRAGE_CATEGORY_TITLE_CLASS =
  'font-mirage font-normal text-ink-700 tracking-[-0.4492px] text-[clamp(44px,5.1vw,75px)] leading-[45px]';

export const MIRAGE_CATEGORY_TITLE_MOBILE_CLASS =
  'font-mirage font-normal text-ink-700 tracking-[-0.4492px] text-[30px] leading-[0.8]';

/** Mobile hero promo card — Figma node 49:1695 */
export const MIRAGE_MOBILE_HERO_TITLE_CLASS =
  'font-mirage font-normal text-white tracking-[-0.5px] text-[62px] leading-[35px]';
