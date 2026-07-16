import {
  STOREFRONT_MOBILE_CONTENT_ONLY_SURFACE_TOP_MARGIN_CLASS,
  STOREFRONT_MOBILE_CONTENT_ONLY_SURFACE_TOP_PADDING_CLASS,
} from '../../lib/layout/storefront-mobile-layout.constants';
import { STOREFRONT_SIDE_PADDING_NEG_CLASS } from '../../lib/layout/storefront-layout.constants';
import { STOREFRONT_PILL_INTERACTIVE_CLASS } from '../../lib/ui/storefront-interactive-button-classes';
import { FOOTER_DESKTOP_DECORATION_BLEED_PX } from '../../components/footer/footer-desktop.constants';
import { HEADER_HERO_SHELL_BAND_HEIGHT_PX } from '../../components/header/header-shell-shape.constants';

/** Desktop catalog gradient inset from shell top — shared by all hero-shell pages. */
export const PRODUCTS_CATALOG_BACKGROUND_TOP_OFFSET_PX = 24;

/**
 * Catalog shell — overflow must stay visible so the desktop SVG can bleed into
 * the footer overlap. Do not use overflow-x-clip here: Safari forces overflow-y
 * to clip as well, which cuts the background under the footer.
 */
export const PRODUCTS_PAGE_SHELL_CLASS =
  'relative w-full overflow-visible rounded-t-[28px] bg-white sm:rounded-t-[44px] desktop:rounded-t-[36px]';

/**
 * Extra sky gradient below decoration overlap — fills the wedge where the shell
 * bottom arc meets the footer rounded top corners on desktop.
 */
export const PRODUCTS_CATALOG_BACKGROUND_FOOTER_EXTRA_BLEED_PX = 44;

/** Total desktop footer-zone gradient height (decoration overlap + corner clearance). */
export const PRODUCTS_CATALOG_BACKGROUND_FOOTER_BLEED_PX =
  FOOTER_DESKTOP_DECORATION_BLEED_PX + PRODUCTS_CATALOG_BACKGROUND_FOOTER_EXTRA_BLEED_PX;

/** Footer overlap zone — desktop SVG background extends by this amount (see globals.css). */
export const PRODUCTS_PAGE_SHELL_FOOTER_BLEED_CLASS = '';

/** Figma catalog desktop background SVG viewBox — short pages use this for min-height. */
export const PRODUCTS_CATALOG_BACKGROUND_VIEWBOX_WIDTH = 1442;
export const PRODUCTS_CATALOG_BACKGROUND_VIEWBOX_HEIGHT = 1840;

/** Bottom stop of the catalog desktop gradient — fills tall shells below the fixed shape. */
export const PRODUCTS_CATALOG_BACKGROUND_TAIL_COLOR = '#FCF8EC';

/** Default desktop catalog gradient vector — matches the original /products artwork. */
export const PRODUCTS_CATALOG_BACKGROUND_GRADIENT_X1 = 205.703;
export const PRODUCTS_CATALOG_BACKGROUND_GRADIENT_Y1 = 137.062;
export const PRODUCTS_CATALOG_BACKGROUND_GRADIENT_X2 = 1601.17;
export const PRODUCTS_CATALOG_BACKGROUND_GRADIENT_Y2 = 988.49;

/** Same header S-step as {@link HERO_RECTANGLE_PATH} (Figma node 42:237 ledge y≈94). */
export const PRODUCTS_CATALOG_BACKGROUND_PATH =
  'M0 125.383C0 108.262 13.8792 94.3832 31 94.3832H837.525C854.645 94.3832 868.525 80.5041 868.525 63.3832V31C868.525 13.8792 882.404 0 899.525 0H1411C1428.12 0 1442 13.8792 1442 31V1809C1442 1826.12 1428.12 1840 1411 1840H31C13.8792 1840 0 1826.12 0 1809V125.383Z';

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

/** Gap between embedded header band bottom and category toolbar (desktop). */
export const PRODUCTS_PAGE_TOOLBAR_BELOW_HEADER_GAP_PX = 100;

/** Toolbar offset from shell top — header band + gap below pills. */
export const PRODUCTS_PAGE_TOOLBAR_TOP_OFFSET_PX =
  HEADER_HERO_SHELL_BAND_HEIGHT_PX + PRODUCTS_PAGE_TOOLBAR_BELOW_HEADER_GAP_PX;

/** @deprecated Use {@link PRODUCTS_PAGE_TOOLBAR_TOP_OFFSET_PX} via inline padding in {@link ProductsHeroShell}. */
export const PRODUCTS_PAGE_TOOLBAR_TOP_OFFSET_CLASS = `desktop:pt-[${PRODUCTS_PAGE_TOOLBAR_TOP_OFFSET_PX}px]`;

/** Content-only hero pages (checkout) — header clearance without empty toolbar band. */
export const PRODUCTS_PAGE_COMPACT_HERO_TOOLBAR_OFFSET_CLASS =
  'pt-[120px] sm:pt-[140px] desktop:pt-[156px]';

/** Content-only pages without toolbar — shorter white band before the blue hero curve. */
export const PRODUCTS_PAGE_CONTENT_ONLY_HERO_OFFSET_CLASS =
  'pt-[100px] sm:pt-[120px] desktop:pt-[140px]';

/** Legacy content-only hero offset — preserved for /contact. */
export const PRODUCTS_PAGE_CONTENT_ONLY_HERO_OFFSET_LEGACY_CLASS =
  'pt-[120px] sm:pt-[140px] desktop:pt-[200px]';

/** Mobile — clear embedded header before category pills. */
export const PRODUCTS_PAGE_MOBILE_TOOLBAR_TOP_OFFSET_CLASS = 'pt-[120px] sm:pt-[140px]';

/** Embedded header actions — fixed px (7.77% of Figma 940px frame). */
export const PRODUCTS_PAGE_HEADER_ACTIONS_TOP_PX = 73;
export const PRODUCTS_PAGE_HEADER_ACTIONS_RIGHT_PX = 53;

/** Shared toolbar pill + dropdown panel radius — matches Figma subcategory panel (node 486:366). */
export const PRODUCTS_PAGE_TOOLBAR_PILL_RADIUS_CLASS = 'rounded-[20px]';

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

/** Outer shop toolbar wrapper — desktop offset comes from the hero shell, not here. */
export const PRODUCTS_PAGE_TOOLBAR_WRAPPER_CLASS = 'pb-1';

/**
 * Mobile shop — category pills sit inside the white catalog card (no extra gap above the curve).
 */
export const PRODUCTS_PAGE_MOBILE_TOOLBAR_GAP_CLASS = 'mb-4';

export const PRODUCTS_PAGE_MOBILE_TOOLBAR_SLOT_CLASS =
  `${PRODUCTS_PAGE_MOBILE_TOOLBAR_GAP_CLASS} ${STOREFRONT_SIDE_PADDING_NEG_CLASS} w-auto max-w-none`;

/** Gap between search row and the white catalog card on mobile shop. */
export const PRODUCTS_PAGE_MOBILE_CATALOG_TOP_MARGIN_CLASS = 'mt-8';

/** Leading/trailing scroll spacers — keep first/last pills fully visible (not clipped by row padding). */
export const PRODUCTS_PAGE_CATEGORY_ROW_EDGE_SPACER_CLASS =
  'w-[clamp(24px,3.2vw,36px)] shrink-0 desktop:w-0';

/** Category pills occupy remaining toolbar width; full width on mobile (no sort slot). */
export const PRODUCTS_PAGE_CATEGORY_SCROLL_SHELL_CLASS =
  'min-w-0 w-full max-w-none flex-1';

/** Category filter pills row — Figma "categories" frame (node 269:894). */
export const PRODUCTS_PAGE_CATEGORY_ROW_CLASS =
  'flex w-full max-w-none items-center gap-1.5 desktop:gap-2.5 overflow-x-auto overscroll-none touch-pan-x scrollbar-hide';

/** Right-edge fade — desktop hero only; on mobile it covers half-pills while scrolling. */
export const PRODUCTS_PAGE_CATEGORY_SCROLL_FADE_CLASS =
  'pointer-events-none absolute inset-y-0 right-0 z-10 hidden w-10 bg-gradient-to-l from-[#C9DDF0] to-transparent desktop:block';

/** Shop hero breadcrumb — Figma node 269:900. */
export const PRODUCTS_PAGE_SHOP_BREADCRUMB_CLASS =
  'mb-5 text-base leading-[18px] text-white drop-shadow-[0_1px_3px_rgba(30,41,57,0.35)] sm:mb-6 desktop:mb-6';

/** Shared category pill shape/typography — Figma buttons (node 269:895 …). */
export const PRODUCTS_PAGE_CATEGORY_PILL_CLASS =
  `inline-flex ${PRODUCTS_PAGE_TOOLBAR_CONTROL_HEIGHT_CLASS} shrink-0 items-center justify-center ${PRODUCTS_PAGE_TOOLBAR_PILL_RADIUS_CLASS} text-[11px] font-medium leading-[14px] tracking-[0.35px] whitespace-nowrap desktop:text-[13px] desktop:leading-4 desktop:tracking-[0.4px] ${STOREFRONT_PILL_INTERACTIVE_CLASS}`;

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
  `relative z-10 ${PRODUCTS_PAGE_MOBILE_CATALOG_TOP_MARGIN_CLASS} w-auto rounded-t-[44px] bg-products-catalog-mobile pt-5 ${STOREFRONT_SIDE_PADDING_NEG_CLASS} ${PRODUCTS_PAGE_MOBILE_CATALOG_BOTTOM_PADDING_CLASS}`;

/** Content-only mobile catalog — tighter top spacing (stores, about, FAQ, blog). */
export const PRODUCTS_PAGE_MOBILE_CONTENT_ONLY_CATALOG_SURFACE_CLASS =
  `relative z-10 ${STOREFRONT_MOBILE_CONTENT_ONLY_SURFACE_TOP_MARGIN_CLASS} w-auto rounded-t-[44px] bg-products-catalog-mobile ${STOREFRONT_MOBILE_CONTENT_ONLY_SURFACE_TOP_PADDING_CLASS} ${STOREFRONT_SIDE_PADDING_NEG_CLASS} ${PRODUCTS_PAGE_MOBILE_CATALOG_BOTTOM_PADDING_CLASS}`;

/** Legacy mobile reset hook for single-mount catalog slots; intentionally a no-op. */
export const PRODUCTS_PAGE_CATALOG_MOBILE_SURFACE_RESET_CLASS = '';

/** Legacy desktop shell continuation hook for single-mount catalog slots; intentionally a no-op. */
export const PRODUCTS_PAGE_CATALOG_DESKTOP_SHELL_CONTINUATION_CLASS = '';

/** Space between toolbar and first product row (node 570:646, y=388 inside 20px artboard inset). */
export const PRODUCTS_PAGE_CATALOG_TOP_PADDING_CLASS = 'pt-6 desktop:pt-[69px]';

/** Content-only pages — tighter gap between hero curve and page title. */
export const PRODUCTS_PAGE_CONTENT_ONLY_CATALOG_TOP_PADDING_CLASS = 'pt-3 sm:pt-4 desktop:pt-10';

/** Legacy content-only catalog top padding — preserved for /contact. */
export const PRODUCTS_PAGE_CONTENT_ONLY_CATALOG_TOP_PADDING_LEGACY_CLASS =
  'pt-6 desktop:pt-10';

/** Inner content inset — fixed to match narrow-viewport spacing at every breakpoint. */
export const PRODUCTS_PAGE_CONTENT_INSET_CLASS = 'px-6 sm:px-8';

/** Bottom padding inside the catalog zone — clears footer decoration on shop pages. */
export const PRODUCTS_PAGE_CATALOG_BOTTOM_PADDING_CLASS =
  'pb-24 md:pb-32 desktop:pb-[180px]';

/** Content-only hero pages — tighter gap before the overlapping footer decoration. */
export const PRODUCTS_PAGE_CONTENT_ONLY_CATALOG_BOTTOM_PADDING_CLASS =
  'pb-24 md:pb-32 desktop:pb-28';

/** Single product page — keep reviews above the footer with a small visual gap. */
export const PRODUCTS_PAGE_PDP_CATALOG_BOTTOM_PADDING_CLASS =
  'pb-24 md:pb-32 desktop:pb-40';

/** @deprecated Mobile hero band is content-driven; kept for layout reference. */
export const PRODUCTS_PAGE_MOBILE_HERO_BAND_HEIGHT_CLASS = 'h-[160px] sm:h-[180px]';
