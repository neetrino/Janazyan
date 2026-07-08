import {
  STOREFRONT_MOBILE_CONTENT_SURFACE_TOP_MARGIN_CLASS,
} from '../../lib/layout/storefront-mobile-layout.constants';
import { STOREFRONT_SIDE_PADDING_NEG_CLASS } from '../../lib/layout/storefront-layout.constants';
import { STOREFRONT_PILL_INTERACTIVE_CLASS } from '../../lib/ui/storefront-interactive-button-classes';

/** Same rounded shell as {@link HomeHero}; white backdrop keeps the header pill gap white. */
export const PRODUCTS_PAGE_SHELL_CLASS =
  'relative w-full overflow-x-clip overflow-y-visible rounded-[28px] bg-white sm:rounded-[44px] desktop:rounded-t-[36px] desktop:rounded-bl-[44px] desktop:rounded-br-[44px]';

/** Slightly wider than home column — tighter outer gutters on /products. */
export const PRODUCTS_PAGE_MAX_WIDTH_CLASS =
  'max-w-[1510px] min-[1548px]:max-w-[1710px] min-[1800px]:max-w-[1840px] min-[2200px]:max-w-[1940px]';

/** Minimum outer gutter on narrow viewports (space outside the rounded shell). */
export const PRODUCTS_PAGE_SIDE_PADDING_MIN_PX = 24;
export const PRODUCTS_PAGE_SIDE_PADDING_MAX_PX = 36;

/** Side gutters — same visual inset on all viewports (matches narrow-phone spacing, capped on wide). */
export const PRODUCTS_PAGE_SIDE_PADDING_CLASS = 'px-[clamp(24px,3.2vw,36px)]';

/** Desktop page wrapper — full-width background shell for non-home storefront pages. */
export const PRODUCTS_PAGE_DESKTOP_SHELL_CLASS = 'w-full';

/** Same viewBox proportions as {@link HeroRectangleBackground} — keeps the hero shape unsmeared. */
export const PRODUCTS_PAGE_HERO_ASPECT_CLASS = 'aspect-[1388/852]';

/** Desktop hero gradient flush with shell top — header pills center in the blue band. */
export const PRODUCTS_PAGE_HERO_GRADIENT_TOP_OFFSET_PX = 0;

/** Desktop hero gradient spans the full header band. */
export const PRODUCTS_PAGE_HERO_GRADIENT_TOP_CLASS = 'top-0';

/** Toolbar baseline from shell top (node 269:894, y=251 inside 20px artboard inset). */
export const PRODUCTS_PAGE_TOOLBAR_TOP_OFFSET_CLASS = 'desktop:pt-[271px]';

/** Content-only hero pages (checkout) — header clearance without empty toolbar band. */
export const PRODUCTS_PAGE_COMPACT_HERO_TOOLBAR_OFFSET_CLASS =
  'pt-[120px] sm:pt-[140px] desktop:pt-[156px]';

/** Mobile — clear embedded header before category pills. */
export const PRODUCTS_PAGE_MOBILE_TOOLBAR_TOP_OFFSET_CLASS = 'pt-[120px] sm:pt-[140px]';

/** Embedded header actions — fixed px (7.77% of Figma 940px frame). */
export const PRODUCTS_PAGE_HEADER_ACTIONS_TOP_PX = 73;
export const PRODUCTS_PAGE_HEADER_ACTIONS_RIGHT_PX = 53;

/** Figma toolbar pills — fully rounded capsule on both edges (nodes 269:907 / 269:919). */
export const PRODUCTS_PAGE_TOOLBAR_PILL_RADIUS_CLASS = 'rounded-full';

/** Shared toolbar control pill height — aligned with category pills. */
export const PRODUCTS_PAGE_TOOLBAR_CONTROL_HEIGHT_CLASS = 'h-10 desktop:h-12';

/** Sort control width — icon + chevron only (no label text). */
export const PRODUCTS_PAGE_TOOLBAR_SORT_WIDTH_CLASS =
  'shrink-0 px-2.5 desktop:px-3';

/** Gap between category pills and sort control. */
export const PRODUCTS_PAGE_TOOLBAR_ROW_GAP_CLASS = 'gap-1.5 desktop:gap-2.5';

/** Toolbar row — single line at all breakpoints; categories scroll, sort stays pinned right. */
export const PRODUCTS_PAGE_TOOLBAR_ROW_CLASS =
  `flex flex-row items-center ${PRODUCTS_PAGE_TOOLBAR_ROW_GAP_CLASS}`;

/** Outer shop toolbar wrapper — extra top inset on tablet/laptop mobile shell. */
export const PRODUCTS_PAGE_TOOLBAR_WRAPPER_CLASS = 'pb-1 pt-16 sm:pt-20 desktop:pt-0';

/** Mobile toolbar slot — full-bleed category row below search (cancels shell side padding). */
export const PRODUCTS_PAGE_MOBILE_TOOLBAR_GAP_CLASS = 'mt-9 sm:mt-11';

export const PRODUCTS_PAGE_MOBILE_TOOLBAR_SLOT_CLASS =
  `${PRODUCTS_PAGE_MOBILE_TOOLBAR_GAP_CLASS} ${STOREFRONT_SIDE_PADDING_NEG_CLASS} w-auto max-w-none`;

/** Horizontal inset for first/last pill while the scroll track stays full-bleed on mobile. */
export const PRODUCTS_PAGE_CATEGORY_ROW_EDGE_INSET_CLASS =
  'px-[clamp(24px,3.2vw,36px)] scroll-px-[clamp(24px,3.2vw,36px)] desktop:px-0 desktop:scroll-px-0';

/** Category pills occupy remaining toolbar width; full width on mobile (no sort slot). */
export const PRODUCTS_PAGE_CATEGORY_SCROLL_SHELL_CLASS =
  'min-w-0 w-full max-w-none flex-1 overflow-hidden';

/** Category filter pills row — Figma "categories" frame (node 269:894). */
export const PRODUCTS_PAGE_CATEGORY_ROW_CLASS =
  `flex w-full max-w-none items-center gap-1.5 desktop:gap-2.5 overflow-x-auto scrollbar-hide ${PRODUCTS_PAGE_CATEGORY_ROW_EDGE_INSET_CLASS}`;

/** Right-edge fade when category row overflows — matches hero band on desktop, white on tablet/laptop. */
export const PRODUCTS_PAGE_CATEGORY_SCROLL_FADE_CLASS =
  'pointer-events-none absolute inset-y-0 right-0 z-10 w-8 bg-gradient-to-l from-white/95 to-transparent desktop:w-10 desktop:from-[#C9DDF0]';

/** Shop hero breadcrumb — Figma node 269:900. */
export const PRODUCTS_PAGE_SHOP_BREADCRUMB_CLASS =
  'mb-5 text-base leading-[18px] text-white drop-shadow-[0_1px_3px_rgba(30,41,57,0.35)] sm:mb-6 desktop:mb-6';

/** Shared category pill shape/typography — Figma buttons (node 269:895 …). */
export const PRODUCTS_PAGE_CATEGORY_PILL_CLASS =
  `inline-flex ${PRODUCTS_PAGE_TOOLBAR_CONTROL_HEIGHT_CLASS} shrink-0 items-center justify-center rounded-full text-[11px] font-medium leading-[14px] tracking-[0.35px] whitespace-nowrap desktop:text-[13px] desktop:leading-4 desktop:tracking-[0.4px] ${STOREFRONT_PILL_INTERACTIVE_CLASS}`;

/** Active category pill — dark ink slate with white ring (node 269:895). */
export const PRODUCTS_PAGE_CATEGORY_PILL_ACTIVE_CLASS =
  'border-2 border-white bg-ink-500 text-white';

/** Inactive category pill — sky surface on mobile; white on desktop hero. */
export const PRODUCTS_PAGE_CATEGORY_PILL_INACTIVE_CLASS =
  'border-2 border-transparent bg-sky-mist/70 text-sky-deep hover:border-white hover:bg-ink-500 hover:text-white hover:opacity-100 desktop:bg-white desktop:hover:border-white desktop:hover:bg-ink-500 desktop:hover:text-white';

/** Sort control — sky-deep brand tone (#93B6E3). */
export const PRODUCTS_PAGE_TOOLBAR_SORT_BUTTON_CLASS =
  'bg-sky-deep text-white hover:bg-sky-deep/90';

/** @deprecated Use {@link PRODUCTS_PAGE_TOOLBAR_PILL_RADIUS_CLASS}. */
export const PRODUCTS_PAGE_TOOLBAR_VIEW_PILL_RADIUS_CLASS = PRODUCTS_PAGE_TOOLBAR_PILL_RADIUS_CLASS;

/** @deprecated Use {@link PRODUCTS_PAGE_TOOLBAR_PILL_RADIUS_CLASS}. */
export const PRODUCTS_PAGE_TOOLBAR_SORT_PILL_RADIUS_CLASS = PRODUCTS_PAGE_TOOLBAR_PILL_RADIUS_CLASS;

/** Gradient continuation for the catalog zone — starts at sky-mist to meet the hero band. */
export const PRODUCTS_PAGE_CATALOG_SURFACE_CLASS = 'bg-products-catalog';

/** Mobile catalog — nav clearance + last-row card breathing room (88px nav + 16px). */
export const PRODUCTS_PAGE_MOBILE_CATALOG_BOTTOM_PADDING_CLASS =
  'pb-[calc(104px+env(safe-area-inset-bottom,0px))]';

/** Mobile catalog — full-bleed gradient, white at top fading to shop sky blue. */
export const PRODUCTS_PAGE_MOBILE_CATALOG_SURFACE_CLASS =
  `relative z-10 ${STOREFRONT_MOBILE_CONTENT_SURFACE_TOP_MARGIN_CLASS} w-auto rounded-t-[44px] bg-products-catalog-mobile pt-6 ${STOREFRONT_SIDE_PADDING_NEG_CLASS} ${PRODUCTS_PAGE_MOBILE_CATALOG_BOTTOM_PADDING_CLASS}`;

/** Legacy mobile reset hook for single-mount catalog slots; intentionally a no-op. */
export const PRODUCTS_PAGE_CATALOG_MOBILE_SURFACE_RESET_CLASS = '';

/** Legacy desktop shell continuation hook for single-mount catalog slots; intentionally a no-op. */
export const PRODUCTS_PAGE_CATALOG_DESKTOP_SHELL_CONTINUATION_CLASS = '';

/** Space between toolbar and first product row (node 570:646, y=388 inside 20px artboard inset). */
export const PRODUCTS_PAGE_CATALOG_TOP_PADDING_CLASS = 'pt-6 desktop:pt-[69px]';

/** Inner content inset — fixed to match narrow-viewport spacing at every breakpoint. */
export const PRODUCTS_PAGE_CONTENT_INSET_CLASS = 'px-6 sm:px-8';

/** Bottom padding inside the catalog zone — space before footer + decoration bleed on large screens. */
export const PRODUCTS_PAGE_CATALOG_BOTTOM_PADDING_CLASS =
  'pb-24 md:pb-32 desktop:pb-[297px]';

/** @deprecated Mobile hero band is content-driven; kept for layout reference. */
export const PRODUCTS_PAGE_MOBILE_HERO_BAND_HEIGHT_CLASS = 'h-[160px] sm:h-[180px]';
