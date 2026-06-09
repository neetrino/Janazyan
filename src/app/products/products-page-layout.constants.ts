/** Same rounded shell as {@link HomeHero} — white backdrop shows through the SVG step. */
export const PRODUCTS_PAGE_SHELL_CLASS =
  'relative mx-auto w-full max-w-[1472px] overflow-hidden rounded-[28px] bg-white sm:rounded-[44px] lg:rounded-t-[36px] lg:rounded-bl-[44px] lg:rounded-br-[44px]';

/** Same viewBox proportions as {@link HeroRectangleBackground} — keeps the hero shape unsmeared. */
export const PRODUCTS_PAGE_HERO_ASPECT_CLASS = 'aspect-[1388/852]';

/** HomeHero lg frame top inset (5.96% × 940px) — gradient starts below embedded header. */
export const PRODUCTS_PAGE_HERO_GRADIENT_TOP_CLASS = 'top-[56px]';

/** Breadcrumb baseline from shell top (node 269:900, y=210). */
export const PRODUCTS_PAGE_TOOLBAR_TOP_OFFSET_CLASS = 'lg:pt-[210px]';

/** Mobile — clear embedded header before breadcrumb / category pills. */
export const PRODUCTS_PAGE_MOBILE_TOOLBAR_TOP_OFFSET_CLASS = 'pt-[120px] sm:pt-[140px]';

/** Embedded header actions — fixed px (7.77% of Figma 940px frame). */
export const PRODUCTS_PAGE_HEADER_ACTIONS_TOP_PX = 73;
export const PRODUCTS_PAGE_HEADER_ACTIONS_RIGHT_PX = 53;

/** Figma asymmetric pill radius (nodes 269:907 / 269:919). */
export const PRODUCTS_PAGE_TOOLBAR_PILL_CLASS =
  'rounded-tl-[30px] rounded-tr-[89px] rounded-bl-[30px] rounded-br-[89px]';

/** Category filter pills row — Figma "categories" frame (node 269:894), gap 11px. */
export const PRODUCTS_PAGE_CATEGORY_ROW_CLASS =
  'flex items-center gap-[11px] overflow-x-auto scrollbar-hide';

/** Shared category pill shape/typography — Figma buttons (node 269:895 …), h=56, Montserrat Medium 13px. */
export const PRODUCTS_PAGE_CATEGORY_PILL_CLASS =
  'inline-flex h-[54px] shrink-0 items-center justify-center gap-2 rounded-full px-5 text-[13px] font-medium tracking-[0.5px] whitespace-nowrap transition-colors';

/** Active category pill — dark ink slate with 3px white ring (node 269:895). */
export const PRODUCTS_PAGE_CATEGORY_PILL_ACTIVE_CLASS =
  'border-[3px] border-white bg-ink-500 text-white';

/** Inactive category pill — white surface, sky-deep label + icon (nodes 269:861 …). */
export const PRODUCTS_PAGE_CATEGORY_PILL_INACTIVE_CLASS =
  'bg-white text-sky-deep hover:bg-sky-mist/50';

/** Gradient continuation for the catalog zone. */
export const PRODUCTS_PAGE_CATALOG_SURFACE_CLASS = 'bg-products-catalog';

/** Space between toolbar and first product row. */
export const PRODUCTS_PAGE_CATALOG_TOP_PADDING_CLASS = 'pt-6 lg:pt-8';

/** Content horizontal inset (Figma x=53). */
export const PRODUCTS_PAGE_CONTENT_INSET_CLASS = 'px-5 sm:px-8 lg:px-[53px]';

/** Bottom padding inside the catalog zone. */
export const PRODUCTS_PAGE_CATALOG_BOTTOM_PADDING_CLASS = 'pb-10 lg:pb-14';

/** @deprecated Mobile hero band is content-driven; kept for layout reference. */
export const PRODUCTS_PAGE_MOBILE_HERO_BAND_HEIGHT_CLASS = 'h-[160px] sm:h-[180px]';
