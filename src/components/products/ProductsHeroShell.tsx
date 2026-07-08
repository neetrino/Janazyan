'use client';

import { useId, type CSSProperties, type ReactNode } from 'react';
import {
  PRODUCTS_CATALOG_BACKGROUND_PATH,
  PRODUCTS_CATALOG_BACKGROUND_VIEWBOX_HEIGHT,
  PRODUCTS_CATALOG_BACKGROUND_VIEWBOX_WIDTH,
  PRODUCTS_PAGE_CATALOG_BOTTOM_PADDING_CLASS,
  PRODUCTS_PAGE_CATALOG_TOP_PADDING_CLASS,
  PRODUCTS_PAGE_CONTENT_INSET_CLASS,
  PRODUCTS_PAGE_CONTENT_ONLY_CATALOG_BOTTOM_PADDING_CLASS,
  PRODUCTS_PAGE_CONTENT_ONLY_CATALOG_TOP_PADDING_CLASS,
  PRODUCTS_PAGE_CONTENT_ONLY_HERO_OFFSET_CLASS,
  PRODUCTS_PAGE_DESKTOP_SHELL_CLASS,
  PRODUCTS_PAGE_MAX_WIDTH_CLASS,
  PRODUCTS_PAGE_MOBILE_CATALOG_SURFACE_CLASS,
  PRODUCTS_PAGE_SHELL_CLASS,
  PRODUCTS_PAGE_SHELL_FOOTER_BLEED_CLASS,
  PRODUCTS_PAGE_SIDE_PADDING_CLASS,
  PRODUCTS_PAGE_COMPACT_HERO_TOOLBAR_OFFSET_CLASS,
  PRODUCTS_PAGE_MOBILE_TOOLBAR_SLOT_CLASS,
  PRODUCTS_PAGE_TOOLBAR_TOP_OFFSET_CLASS,
} from '../../app/products/products-page-layout.constants';
import { Header } from '../Header';
import { HEADER_HERO_SHELL_STICKY_OVERLAP_PX } from '../header/header-shell-shape.constants';
import { StorefrontMobileShell } from '../storefront/StorefrontMobileShell';
import { STOREFRONT_DESKTOP_ONLY_CLASS } from '../../lib/layout/storefront-layout.constants';
import { CategoryFilterDropdownProvider } from '../CategoryNavigation/CategoryFilterDropdownContext';

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
  sectionAriaLabel?: string;
  activeCategorySlug?: string;
};

function resolveHeroToolbarOffsetClass(toolbar: ReactNode | undefined, compactHero: boolean): string {
  if (toolbar) {
    return PRODUCTS_PAGE_TOOLBAR_TOP_OFFSET_CLASS;
  }

  if (compactHero) {
    return PRODUCTS_PAGE_COMPACT_HERO_TOOLBAR_OFFSET_CLASS;
  }

  return PRODUCTS_PAGE_CONTENT_ONLY_HERO_OFFSET_CLASS;
}

function resolveCatalogSpacingClasses(toolbar: ReactNode | undefined): {
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
    topPaddingClass: PRODUCTS_PAGE_CONTENT_ONLY_CATALOG_TOP_PADDING_CLASS,
    bottomPaddingClass: PRODUCTS_PAGE_CONTENT_ONLY_CATALOG_BOTTOM_PADDING_CLASS,
  };
}

function ProductsHeroShellInner({
  toolbar,
  catalog,
  compactHero = false,
}: ProductsHeroShellProps) {
  const heroToolbarOffsetClass = resolveHeroToolbarOffsetClass(toolbar, compactHero);
  const { topPaddingClass, bottomPaddingClass } = resolveCatalogSpacingClasses(toolbar);

  return (
    <div className={`${PRODUCTS_PAGE_SHELL_CLASS} ${PRODUCTS_PAGE_SHELL_FOOTER_BLEED_CLASS} flex flex-col`}>
      <ProductsCatalogDesktopBackground />
      <Header embedded />
      <div
        className="relative z-10 shrink-0 overflow-hidden desktop:-mt-[var(--header-sticky-overlap)]"
        style={{ '--header-sticky-overlap': `${HEADER_HERO_SHELL_STICKY_OVERLAP_PX}px` } as CSSProperties}
      >
        <div
          className={`relative z-20 mx-auto w-full pb-2 desktop:pb-4 ${PRODUCTS_PAGE_MAX_WIDTH_CLASS} ${PRODUCTS_PAGE_SIDE_PADDING_CLASS}`}
        >
          <div className={`${PRODUCTS_PAGE_CONTENT_INSET_CLASS} ${heroToolbarOffsetClass}`}>
            {toolbar}
          </div>
        </div>
      </div>

      <div
        className={`relative z-20 overflow-visible bg-transparent ${topPaddingClass} ${bottomPaddingClass}`}
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

function ProductsCatalogDesktopBackground() {
  const gradientId = useId();

  return (
    <>
      <svg
        aria-hidden
        className="products-catalog-desktop-background pointer-events-none absolute inset-x-0 z-0 w-full"
        viewBox={`0 0 ${PRODUCTS_CATALOG_BACKGROUND_VIEWBOX_WIDTH} ${PRODUCTS_CATALOG_BACKGROUND_VIEWBOX_HEIGHT}`}
        preserveAspectRatio="xMidYMin slice"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient
            id={gradientId}
            x1="205.703"
            y1="137.062"
            x2="1601.17"
            y2="988.49"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#93B6E3" />
            <stop offset="1" stopColor="#FCF8EC" />
          </linearGradient>
        </defs>
        <path d={PRODUCTS_CATALOG_BACKGROUND_PATH} fill={`url(#${gradientId})`} />
      </svg>
      <div
        aria-hidden
        className="products-catalog-desktop-footer-bleed pointer-events-none absolute inset-x-0 bottom-0 z-0"
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
  sectionAriaLabel = 'Shop',
  activeCategorySlug,
}: ProductsHeroShellProps) {
  return (
    <CategoryFilterDropdownProvider activeCategorySlug={activeCategorySlug}>
      <StorefrontMobileShell
        toolbar={toolbar}
        toolbarClassName={toolbar ? PRODUCTS_PAGE_MOBILE_TOOLBAR_SLOT_CLASS : undefined}
        contentSurfaceClassName={mobileContentSurfaceClassName}
        contentInsetClassName={mobileContentInsetClassName}
        hideTopBar={hideMobileTopBar}
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
          />
        </section>
      </div>
    </CategoryFilterDropdownProvider>
  );
}
