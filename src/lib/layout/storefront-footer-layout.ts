import { isStorefrontPage } from '../nav/is-storefront-page';

/** Bottom clearance so catalog/content clears the overlapping footer shell on desktop. */
export const STOREFRONT_FOOTER_CLEARANCE_BOTTOM_CLASS = 'min-[1650px]:pb-[220px]';

/** Default desktop footer shell overlap (see Footer.tsx). */
export const FOOTER_DESKTOP_SHELL_UP_PULL_PX = 400;

/** Catalog hero shell — footer sits below content; no upward shell overlap. */
export const CATALOG_HERO_SHELL_FOOTER_SHELL_UP_PULL_PX = 0;

/** Catalog hero shell — pulls footer decoration into the gradient (matches decoration top offset). */
export const CATALOG_HERO_SHELL_FOOTER_EXTRA_UP_PULL_PX = 147;

const HIDDEN_FOOTER_PREFIXES = ['/supersudo', '/admin', '/login', '/register'] as const;

/** Whether the global storefront footer renders for the current route. */
export function shouldShowStorefrontFooter(pathname: string): boolean {
  return !HIDDEN_FOOTER_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}

/** Catalog hero shell — footer sits flush below content; no white gutter before the shell. */
export const CATALOG_HERO_SHELL_FOOTER_COMPACT_TOP_MARGIN_CLASS = 'md:max-[1649px]:mt-0';

/** @deprecated Use {@link CATALOG_HERO_SHELL_FOOTER_SHELL_UP_PULL_PX}. */
export const PRODUCTS_PAGE_FOOTER_SHELL_UP_PULL_PX = CATALOG_HERO_SHELL_FOOTER_SHELL_UP_PULL_PX;

/** @deprecated Use {@link CATALOG_HERO_SHELL_FOOTER_EXTRA_UP_PULL_PX}. */
export const PRODUCTS_PAGE_FOOTER_EXTRA_UP_PULL_PX = CATALOG_HERO_SHELL_FOOTER_EXTRA_UP_PULL_PX;

/** @deprecated Use {@link CATALOG_HERO_SHELL_FOOTER_COMPACT_TOP_MARGIN_CLASS}. */
export const PRODUCTS_PAGE_FOOTER_COMPACT_TOP_MARGIN_CLASS =
  CATALOG_HERO_SHELL_FOOTER_COMPACT_TOP_MARGIN_CLASS;

/** All storefront pages except home — catalog shell + compact footer overlap (not 400px home overlap). */
export function usesCatalogHeroShellFooterLayout(pathname: string): boolean {
  return isStorefrontPage(pathname);
}

/** Desktop footer shell overlap — 0 on catalog hero shell routes so content is not covered. */
export function resolvePageFooterShellUpPullPx(pathname: string): number {
  if (usesCatalogHeroShellFooterLayout(pathname)) {
    return CATALOG_HERO_SHELL_FOOTER_SHELL_UP_PULL_PX;
  }

  return FOOTER_DESKTOP_SHELL_UP_PULL_PX;
}

/** Additional negative margin for footer shell — catalog routes pull decoration into gradient. */
export function resolvePageFooterExtraUpPull(pathname: string): number {
  if (usesCatalogHeroShellFooterLayout(pathname)) {
    return CATALOG_HERO_SHELL_FOOTER_EXTRA_UP_PULL_PX;
  }

  return 0;
}

/** Compact footer top gap — catalog hero shell keeps the gradient flush to the footer. */
export function resolvePageFooterCompactTopMarginClass(pathname: string): string {
  if (usesCatalogHeroShellFooterLayout(pathname)) {
    return CATALOG_HERO_SHELL_FOOTER_COMPACT_TOP_MARGIN_CLASS;
  }

  return '';
}

/** @deprecated Use {@link resolvePageFooterExtraUpPull}. */
export function resolveContactPageFooterExtraUpPull(pathname: string): number {
  return resolvePageFooterExtraUpPull(pathname);
}

/** Footer overlap padding — only when the footer overlaps content. */
export function resolveStorefrontMainBottomPaddingClass(pathname: string): string {
  if (!shouldShowStorefrontFooter(pathname)) {
    return '';
  }

  if (usesCatalogHeroShellFooterLayout(pathname)) {
    return '';
  }

  return STOREFRONT_FOOTER_CLEARANCE_BOTTOM_CLASS;
}
