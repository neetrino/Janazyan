'use client';

import { useId, type CSSProperties, type ReactNode } from 'react';
import {
  PRODUCTS_PAGE_CATALOG_BOTTOM_PADDING_CLASS,
  PRODUCTS_PAGE_CATALOG_SURFACE_CLASS,
  PRODUCTS_PAGE_CATALOG_TOP_PADDING_CLASS,
  PRODUCTS_PAGE_CONTENT_INSET_CLASS,
  PRODUCTS_PAGE_DESKTOP_SHELL_CLASS,
  PRODUCTS_PAGE_HERO_ASPECT_CLASS,
  PRODUCTS_PAGE_HERO_GRADIENT_TOP_CLASS,
  PRODUCTS_PAGE_MAX_WIDTH_CLASS,
  PRODUCTS_PAGE_SHELL_CLASS,
  PRODUCTS_PAGE_SIDE_PADDING_CLASS,
  PRODUCTS_PAGE_COMPACT_HERO_TOOLBAR_OFFSET_CLASS,
  PRODUCTS_PAGE_MOBILE_TOOLBAR_SLOT_CLASS,
  PRODUCTS_PAGE_TOOLBAR_TOP_OFFSET_CLASS,
} from '../../app/products/products-page-layout.constants';
import { HeroRectangleBackground } from '../home/HeroRectangleBackground';
import { Header } from '../Header';
import { HEADER_HERO_SHELL_STICKY_OVERLAP_PX } from '../header/header-shell-shape.constants';
import { StorefrontMobileShell } from '../storefront/StorefrontMobileShell';
import { STOREFRONT_DESKTOP_ONLY_CLASS } from '../../lib/layout/storefront-layout.constants';
import { STOREFRONT_MOBILE_CONTENT_SURFACE_CLASS } from '../../lib/layout/storefront-mobile-layout.constants';
import { CategoryFilterDropdownProvider } from '../CategoryNavigation/CategoryFilterDropdownContext';

const PRODUCTS_FIGMA_BACKGROUND_WIDTH = 1442;
const PRODUCTS_FIGMA_BACKGROUND_HEIGHT = 1840;
const PRODUCTS_FIGMA_BACKGROUND_PATH =
  'M0 148.739C0 131.618 13.8792 117.739 31 117.739H837.525C854.645 117.739 868.525 103.86 868.525 86.7391V31C868.525 13.8792 882.404 0 899.525 0H1411C1428.12 0 1442 13.8792 1442 31V1809C1442 1826.12 1428.12 1840 1411 1840H31C13.8792 1840 0 1826.12 0 1809V148.739Z';

type ProductsHeroDesktopBackground = 'default' | 'catalog';

type ProductsHeroShellProps = {
  /** Omitted on content-only pages (e.g. /about) — hero band keeps the same height. */
  toolbar?: ReactNode;
  catalog: ReactNode;
  /** Shorter hero band when there is no toolbar row (e.g. /checkout). */
  compactHero?: boolean;
  /** Mobile content card surface — defaults to shared white shell. */
  mobileContentSurfaceClassName?: string;
  /** Mobile content horizontal inset — defaults to products page inset. */
  mobileContentInsetClassName?: string;
  /** Hide mobile search top bar (e.g. /profile). */
  hideMobileTopBar?: boolean;
  sectionAriaLabel?: string;
  activeCategorySlug?: string;
  desktopBackground?: ProductsHeroDesktopBackground;
};

function resolveHeroToolbarOffsetClass(toolbar: ReactNode | undefined, compactHero: boolean): string {
  if (toolbar) {
    return PRODUCTS_PAGE_TOOLBAR_TOP_OFFSET_CLASS;
  }

  if (compactHero) {
    return PRODUCTS_PAGE_COMPACT_HERO_TOOLBAR_OFFSET_CLASS;
  }

  return PRODUCTS_PAGE_TOOLBAR_TOP_OFFSET_CLASS;
}

function ProductsHeroShellInner({
  toolbar,
  catalog,
  compactHero = false,
  desktopBackground = 'default',
}: ProductsHeroShellProps) {
  const heroToolbarOffsetClass = resolveHeroToolbarOffsetClass(toolbar, compactHero);
  const useCatalogBackground = desktopBackground === 'catalog';
  const catalogSurfaceClassName = useCatalogBackground
    ? 'bg-transparent'
    : PRODUCTS_PAGE_CATALOG_SURFACE_CLASS;

  return (
    <div className={`${PRODUCTS_PAGE_SHELL_CLASS} flex flex-col`}>
      {useCatalogBackground ? <ProductsCatalogDesktopBackground /> : null}
      <Header embedded />
      <div
        className="relative z-10 shrink-0 overflow-hidden desktop:-mt-[var(--header-sticky-overlap)]"
        style={{ '--header-sticky-overlap': `${HEADER_HERO_SHELL_STICKY_OVERLAP_PX}px` } as CSSProperties}
      >
        {useCatalogBackground ? null : (
          <div
            className={`absolute inset-x-0 w-full ${PRODUCTS_PAGE_HERO_ASPECT_CLASS} ${PRODUCTS_PAGE_HERO_GRADIENT_TOP_CLASS}`}
          >
            <HeroRectangleBackground variant="blue" />
          </div>
        )}
        <div
          className={`relative z-20 mx-auto w-full pb-2 desktop:pb-4 ${PRODUCTS_PAGE_MAX_WIDTH_CLASS} ${PRODUCTS_PAGE_SIDE_PADDING_CLASS}`}
        >
          <div className={`${PRODUCTS_PAGE_CONTENT_INSET_CLASS} ${heroToolbarOffsetClass}`}>
            {toolbar}
          </div>
        </div>
      </div>

      <div
        className={`relative z-20 overflow-visible ${catalogSurfaceClassName} ${PRODUCTS_PAGE_CATALOG_TOP_PADDING_CLASS} ${PRODUCTS_PAGE_CATALOG_BOTTOM_PADDING_CLASS}`}
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
    <svg
      aria-hidden
      className="products-catalog-desktop-background pointer-events-none absolute inset-x-0 z-0 w-full"
      viewBox={`0 0 ${PRODUCTS_FIGMA_BACKGROUND_WIDTH} ${PRODUCTS_FIGMA_BACKGROUND_HEIGHT}`}
      preserveAspectRatio="none"
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
      <path d={PRODUCTS_FIGMA_BACKGROUND_PATH} fill={`url(#${gradientId})`} />
    </svg>
  );
}

/**
 * Storefront hero shell — rounded frame with HomeHero SVG band; catalog/content grows below.
 * Used by /products (with toolbar) and /about (content-only).
 */
export function ProductsHeroShell({
  toolbar,
  catalog,
  compactHero = false,
  mobileContentSurfaceClassName = STOREFRONT_MOBILE_CONTENT_SURFACE_CLASS,
  mobileContentInsetClassName = PRODUCTS_PAGE_CONTENT_INSET_CLASS,
  hideMobileTopBar = false,
  sectionAriaLabel = 'Shop',
  activeCategorySlug,
  desktopBackground = 'default',
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
            desktopBackground={desktopBackground}
          />
        </section>
      </div>
    </CategoryFilterDropdownProvider>
  );
}
