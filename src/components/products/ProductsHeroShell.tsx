'use client';

import { useId, type CSSProperties, type ReactNode } from 'react';
import {
  PRODUCT_DETAIL_CATALOG_BACKGROUND_FOOTER_BLEED_PX,
  PRODUCT_DETAIL_CATALOG_BACKGROUND_GRADIENT_X1,
  PRODUCT_DETAIL_CATALOG_BACKGROUND_GRADIENT_X2,
  PRODUCT_DETAIL_CATALOG_BACKGROUND_GRADIENT_Y1,
  PRODUCT_DETAIL_CATALOG_BACKGROUND_GRADIENT_Y2,
  PRODUCT_DETAIL_CATALOG_BACKGROUND_MID_COLOR,
  PRODUCT_DETAIL_CATALOG_BACKGROUND_MID_OFFSET,
  PRODUCT_DETAIL_CATALOG_BACKGROUND_TAIL_COLOR,
  PRODUCTS_CATALOG_BACKGROUND_FOOTER_BLEED_PX,
  PRODUCTS_CATALOG_BACKGROUND_GRADIENT_X1,
  PRODUCTS_CATALOG_BACKGROUND_GRADIENT_X2,
  PRODUCTS_CATALOG_BACKGROUND_GRADIENT_Y1,
  PRODUCTS_CATALOG_BACKGROUND_GRADIENT_Y2,
  PRODUCTS_CATALOG_BACKGROUND_PATH,
  PRODUCTS_CATALOG_BACKGROUND_TAIL_COLOR,
  PRODUCTS_CATALOG_BACKGROUND_TOP_OFFSET_PX,
  PRODUCTS_CATALOG_BACKGROUND_VIEWBOX_HEIGHT,
  PRODUCTS_CATALOG_BACKGROUND_VIEWBOX_WIDTH,
  PRODUCTS_PAGE_CATALOG_BOTTOM_PADDING_CLASS,
  PRODUCTS_PAGE_CATALOG_TOP_PADDING_CLASS,
  PRODUCTS_PAGE_CONTENT_INSET_CLASS,
  PRODUCTS_PAGE_CONTENT_ONLY_CATALOG_BOTTOM_PADDING_CLASS,
  PRODUCTS_PAGE_CONTENT_ONLY_CATALOG_TOP_PADDING_CLASS,
  PRODUCTS_PAGE_CONTENT_ONLY_CATALOG_TOP_PADDING_LEGACY_CLASS,
  PRODUCTS_PAGE_CONTENT_ONLY_HERO_OFFSET_CLASS,
  PRODUCTS_PAGE_CONTENT_ONLY_HERO_OFFSET_LEGACY_CLASS,
  PRODUCTS_PAGE_DESKTOP_SHELL_CLASS,
  PRODUCTS_PAGE_MAX_WIDTH_CLASS,
  PRODUCTS_PAGE_MOBILE_CATALOG_SURFACE_CLASS,
  PRODUCTS_PAGE_MOBILE_CONTENT_ONLY_CATALOG_SURFACE_CLASS,
  PRODUCTS_PAGE_SHELL_CLASS,
  PRODUCTS_PAGE_SHELL_FOOTER_BLEED_CLASS,
  PRODUCTS_PAGE_SIDE_PADDING_CLASS,
  PRODUCTS_PAGE_COMPACT_HERO_TOOLBAR_OFFSET_CLASS,
  PRODUCTS_PAGE_MOBILE_TOOLBAR_SLOT_CLASS,
  PRODUCTS_PAGE_TOOLBAR_TOP_OFFSET_PX,
} from '../../app/products/products-page-layout.constants';
import { Header } from '../Header';
import { HEADER_HERO_SHELL_STICKY_OVERLAP_PX } from '../header/header-shell-shape.constants';
import { StorefrontMobileShell } from '../storefront/StorefrontMobileShell';
import { STOREFRONT_DESKTOP_ONLY_CLASS } from '../../lib/layout/storefront-layout.constants';
import { STOREFRONT_MOBILE_CONTENT_ONLY_SURFACE_CLASS, STOREFRONT_MOBILE_CONTENT_SURFACE_CLASS } from '../../lib/layout/storefront-mobile-layout.constants';
import { CategoryFilterDropdownProvider } from '../CategoryNavigation/CategoryFilterDropdownContext';

type DesktopBackgroundVariant = 'default' | 'productDetail';

type ProductsHeroShellProps = {
  /** Omitted on content-only pages (e.g. /about) — hero band keeps the same height. */
  toolbar?: ReactNode;
  catalog: ReactNode;
  /** Shorter hero band when there is no toolbar row (e.g. /checkout). */
  compactHero?: boolean;
  /** Mobile content card surface — defaults to shop catalog gradient like /products. */
  mobileContentSurfaceClassName?: string;
  /** Mobile content horizontal inset — defaults to products page inset. */
  mobileContentInsetClassName?: string;
  /** Hide mobile search top bar (e.g. /profile). */
  hideMobileTopBar?: boolean;
  /** Tighter mobile top spacing for content-only pages — defaults to true when no toolbar. */
  compactMobileTop?: boolean;
  /** Tighter desktop hero/catalog spacing for content-only pages — defaults to true when no toolbar. */
  compactContentSpacing?: boolean;
  /** Override catalog bottom spacing for route-specific footer handoff. */
  catalogBottomPaddingClassName?: string;
  /** Route-specific desktop catalog background tuning; defaults to original /products art. */
  desktopBackgroundVariant?: DesktopBackgroundVariant;
  sectionAriaLabel?: string;
  activeCategorySlug?: string;
};

function resolveDesktopBackgroundSettings(variant: DesktopBackgroundVariant) {
  if (variant === 'productDetail') {
    return {
      footerBleedPx: PRODUCT_DETAIL_CATALOG_BACKGROUND_FOOTER_BLEED_PX,
      gradientX1: PRODUCT_DETAIL_CATALOG_BACKGROUND_GRADIENT_X1,
      gradientY1: PRODUCT_DETAIL_CATALOG_BACKGROUND_GRADIENT_Y1,
      gradientX2: PRODUCT_DETAIL_CATALOG_BACKGROUND_GRADIENT_X2,
      gradientY2: PRODUCT_DETAIL_CATALOG_BACKGROUND_GRADIENT_Y2,
      midColor: PRODUCT_DETAIL_CATALOG_BACKGROUND_MID_COLOR,
      midOffset: PRODUCT_DETAIL_CATALOG_BACKGROUND_MID_OFFSET,
      tailColor: PRODUCT_DETAIL_CATALOG_BACKGROUND_TAIL_COLOR,
    };
  }

  return {
    footerBleedPx: PRODUCTS_CATALOG_BACKGROUND_FOOTER_BLEED_PX,
    gradientX1: PRODUCTS_CATALOG_BACKGROUND_GRADIENT_X1,
    gradientY1: PRODUCTS_CATALOG_BACKGROUND_GRADIENT_Y1,
    gradientX2: PRODUCTS_CATALOG_BACKGROUND_GRADIENT_X2,
    gradientY2: PRODUCTS_CATALOG_BACKGROUND_GRADIENT_Y2,
    midColor: null,
    midOffset: null,
    tailColor: PRODUCTS_CATALOG_BACKGROUND_TAIL_COLOR,
  };
}

function resolveHeroToolbarOffsetClass(
  toolbar: ReactNode | undefined,
  compactHero: boolean,
  compactContentSpacing: boolean,
): string {
  if (toolbar) {
    return '';
  }

  if (compactHero) {
    return PRODUCTS_PAGE_COMPACT_HERO_TOOLBAR_OFFSET_CLASS;
  }

  if (!compactContentSpacing) {
    return PRODUCTS_PAGE_CONTENT_ONLY_HERO_OFFSET_LEGACY_CLASS;
  }

  return PRODUCTS_PAGE_CONTENT_ONLY_HERO_OFFSET_CLASS;
}

function resolveCatalogSpacingClasses(
  toolbar: ReactNode | undefined,
  compactContentSpacing: boolean,
): {
  topPaddingClass: string;
  bottomPaddingClass: string;
} {
  if (toolbar) {
    return {
      topPaddingClass: PRODUCTS_PAGE_CATALOG_TOP_PADDING_CLASS,
      bottomPaddingClass: PRODUCTS_PAGE_CATALOG_BOTTOM_PADDING_CLASS,
    };
  }

  return {
    topPaddingClass: compactContentSpacing
      ? PRODUCTS_PAGE_CONTENT_ONLY_CATALOG_TOP_PADDING_CLASS
      : PRODUCTS_PAGE_CONTENT_ONLY_CATALOG_TOP_PADDING_LEGACY_CLASS,
    bottomPaddingClass: PRODUCTS_PAGE_CONTENT_ONLY_CATALOG_BOTTOM_PADDING_CLASS,
  };
}

function resolveMobileContentSurfaceClass(
  toolbar: ReactNode | undefined,
  mobileContentSurfaceClassName: string,
  compactMobileTop: boolean,
): string {
  if (toolbar || !compactMobileTop) {
    return mobileContentSurfaceClassName;
  }

  if (mobileContentSurfaceClassName === PRODUCTS_PAGE_MOBILE_CATALOG_SURFACE_CLASS) {
    return PRODUCTS_PAGE_MOBILE_CONTENT_ONLY_CATALOG_SURFACE_CLASS;
  }

  if (mobileContentSurfaceClassName === STOREFRONT_MOBILE_CONTENT_SURFACE_CLASS) {
    return STOREFRONT_MOBILE_CONTENT_ONLY_SURFACE_CLASS;
  }

  return mobileContentSurfaceClassName;
}

function ProductsHeroShellInner({
  toolbar,
  catalog,
  compactHero = false,
  compactContentSpacing = true,
  catalogBottomPaddingClassName,
  desktopBackgroundVariant = 'default',
}: ProductsHeroShellProps) {
  const heroToolbarOffsetClass = resolveHeroToolbarOffsetClass(
    toolbar,
    compactHero,
    compactContentSpacing,
  );
  const { topPaddingClass, bottomPaddingClass } = resolveCatalogSpacingClasses(
    toolbar,
    compactContentSpacing,
  );
  const resolvedBottomPaddingClass = catalogBottomPaddingClassName ?? bottomPaddingClass;
  const background = resolveDesktopBackgroundSettings(desktopBackgroundVariant);

  return (
    <div
      className={`${PRODUCTS_PAGE_SHELL_CLASS} ${PRODUCTS_PAGE_SHELL_FOOTER_BLEED_CLASS} flex flex-col`}
      style={
        {
          '--products-catalog-background-top-offset': `${PRODUCTS_CATALOG_BACKGROUND_TOP_OFFSET_PX}px`,
          '--products-catalog-background-footer-bleed': `${background.footerBleedPx}px`,
          '--products-catalog-background-viewbox-width': `${PRODUCTS_CATALOG_BACKGROUND_VIEWBOX_WIDTH}`,
          '--products-catalog-background-viewbox-height': `${PRODUCTS_CATALOG_BACKGROUND_VIEWBOX_HEIGHT}`,
        } as CSSProperties
      }
    >
      <ProductsCatalogDesktopBackground background={background} />
      <Header embedded />
      <div
        className="relative z-10 shrink-0 overflow-hidden desktop:-mt-[var(--header-sticky-overlap)]"
        style={{ '--header-sticky-overlap': `${HEADER_HERO_SHELL_STICKY_OVERLAP_PX}px` } as CSSProperties}
      >
        <div
          className={`relative z-20 mx-auto w-full pb-2 desktop:pb-4 ${PRODUCTS_PAGE_MAX_WIDTH_CLASS} ${PRODUCTS_PAGE_SIDE_PADDING_CLASS}`}
        >
          <div
            className={`${PRODUCTS_PAGE_CONTENT_INSET_CLASS} ${heroToolbarOffsetClass}`}
            style={
              toolbar
                ? ({ paddingTop: PRODUCTS_PAGE_TOOLBAR_TOP_OFFSET_PX } as CSSProperties)
                : undefined
            }
          >
            {toolbar}
          </div>
        </div>
      </div>

      <div
        className={`relative z-20 overflow-visible bg-transparent ${topPaddingClass} ${resolvedBottomPaddingClass}`}
      >
        <div
          className={`mx-auto w-full ${PRODUCTS_PAGE_MAX_WIDTH_CLASS} ${PRODUCTS_PAGE_SIDE_PADDING_CLASS} ${PRODUCTS_PAGE_CONTENT_INSET_CLASS}`}
        >
          {catalog}
        </div>
      </div>
    </div>
  );
}

type ProductsCatalogDesktopBackgroundProps = {
  background: ReturnType<typeof resolveDesktopBackgroundSettings>;
};

function ProductsCatalogDesktopBackground({ background }: ProductsCatalogDesktopBackgroundProps) {
  const gradientId = useId();

  return (
    <>
      <svg
        aria-hidden
        className="products-catalog-desktop-background pointer-events-none absolute z-0"
        viewBox={`0 0 ${PRODUCTS_CATALOG_BACKGROUND_VIEWBOX_WIDTH} ${PRODUCTS_CATALOG_BACKGROUND_VIEWBOX_HEIGHT}`}
        preserveAspectRatio="xMidYMin slice"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient
            id={gradientId}
            x1={background.gradientX1}
            y1={background.gradientY1}
            x2={background.gradientX2}
            y2={background.gradientY2}
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#93B6E3" />
            {background.midOffset !== null && background.midColor !== null ? (
              <stop offset={background.midOffset} stopColor={background.midColor} />
            ) : null}
            <stop offset="1" stopColor={background.tailColor} />
          </linearGradient>
        </defs>
        <path d={PRODUCTS_CATALOG_BACKGROUND_PATH} fill={`url(#${gradientId})`} />
      </svg>
      <div
        aria-hidden
        className="products-catalog-desktop-background-fill pointer-events-none absolute z-0"
        style={{ backgroundColor: background.tailColor }}
      />
    </>
  );
}

/**
 * Storefront hero shell — Figma catalog gradient (same as /products); content grows below.
 */
export function ProductsHeroShell({
  toolbar,
  catalog,
  compactHero = false,
  mobileContentSurfaceClassName = PRODUCTS_PAGE_MOBILE_CATALOG_SURFACE_CLASS,
  mobileContentInsetClassName = PRODUCTS_PAGE_CONTENT_INSET_CLASS,
  hideMobileTopBar = false,
  compactMobileTop,
  compactContentSpacing,
  catalogBottomPaddingClassName,
  desktopBackgroundVariant = 'default',
  sectionAriaLabel = 'Shop',
  activeCategorySlug,
}: ProductsHeroShellProps) {
  const isContentOnlyPage = !toolbar;
  const resolvedCompactMobileTop = compactMobileTop ?? isContentOnlyPage;
  const resolvedCompactContentSpacing = compactContentSpacing ?? isContentOnlyPage;
  const resolvedMobileContentSurfaceClassName = resolveMobileContentSurfaceClass(
    toolbar,
    mobileContentSurfaceClassName,
    resolvedCompactMobileTop,
  );

  return (
    <CategoryFilterDropdownProvider activeCategorySlug={activeCategorySlug}>
      <StorefrontMobileShell
        toolbar={toolbar}
        toolbarClassName={toolbar ? PRODUCTS_PAGE_MOBILE_TOOLBAR_SLOT_CLASS : undefined}
        contentSurfaceClassName={resolvedMobileContentSurfaceClassName}
        contentInsetClassName={mobileContentInsetClassName}
        hideTopBar={hideMobileTopBar}
        compactMobileTop={resolvedCompactMobileTop}
        sectionAriaLabel={sectionAriaLabel}
      >
        {catalog}
      </StorefrontMobileShell>

      <div className={`${STOREFRONT_DESKTOP_ONLY_CLASS} ${PRODUCTS_PAGE_DESKTOP_SHELL_CLASS}`}>
        <section
          aria-label={sectionAriaLabel}
          className="relative w-full"
        >
          <ProductsHeroShellInner
            toolbar={toolbar}
            catalog={catalog}
            compactHero={compactHero}
            compactContentSpacing={resolvedCompactContentSpacing}
            catalogBottomPaddingClassName={catalogBottomPaddingClassName}
            desktopBackgroundVariant={desktopBackgroundVariant}
          />
        </section>
      </div>
    </CategoryFilterDropdownProvider>
  );
}
