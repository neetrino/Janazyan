/** Mirage Expanded — Figma display typography */
export const MIRAGE_DISPLAY_BASE =
  'font-mirage font-normal text-ink-800 tracking-[-0.4492px]';

export const MIRAGE_LINE_HEIGHT_CLASS = 'leading-[0.652]';

/** Centered section titles (Featured, Why Choose Us, etc.) */
export const MIRAGE_SECTION_HEADING_CLASS = `${MIRAGE_DISPLAY_BASE} ${MIRAGE_LINE_HEIGHT_CLASS} text-[clamp(34px,5vw,66px)]`;

/** Storefront inner-page main titles (about, stores header/footer). */
export const MIRAGE_PAGE_HEADING_CLASS = `${MIRAGE_DISPLAY_BASE} ${MIRAGE_LINE_HEIGHT_CLASS} text-[clamp(32px,3.6vw,50px)]`;

/** Storefront inner-page section titles (contact blocks, stores list/map). */
export const MIRAGE_PAGE_SUBHEADING_CLASS = `${MIRAGE_DISPLAY_BASE} ${MIRAGE_LINE_HEIGHT_CLASS} text-[clamp(24px,2.8vw,34px)]`;

/** Contact page hero title — Figma node 496:458 (Mirage 85px). */
export const MIRAGE_CONTACT_HEADING_CLASS = `${MIRAGE_DISPLAY_BASE} leading-[0.9] text-[clamp(42px,5.9vw,85px)]`;

/** About page title — Figma node 598:631 (Mirage 85px / 90px line). */
export const MIRAGE_ABOUT_PAGE_HEADING_CLASS =
  `${MIRAGE_DISPLAY_BASE} leading-[0.75] text-[clamp(42px,5.9vw,85px)] desktop:leading-[90px]`;

export const MIRAGE_SECTION_HEADING_CREAM_CLASS =
  'font-mirage font-normal text-cream tracking-[-0.4492px] leading-[0.652] text-[clamp(34px,5vw,66px)]';

/** About section — Figma Mirage at 100px (node 45:415) */
export const MIRAGE_ABOUT_HEADING_BASE =
  'font-mirage font-normal text-[100px] tracking-[0.3691px]';

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

/** Mobile home stores banner — Figma node 486:334 */
export const MIRAGE_MOBILE_STORES_TITLE_CLASS =
  'font-mirage font-normal text-ink-500 tracking-[-0.5px] text-[38px] leading-[21px]';
