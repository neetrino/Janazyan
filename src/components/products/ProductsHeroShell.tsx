'use client';

import type { CSSProperties, ReactNode } from 'react';
import {
  PRODUCTS_PAGE_CATALOG_BOTTOM_PADDING_CLASS,
  PRODUCTS_PAGE_CATALOG_SURFACE_CLASS,
  PRODUCTS_PAGE_CATALOG_TOP_PADDING_CLASS,
  PRODUCTS_PAGE_CONTENT_INSET_CLASS,
  PRODUCTS_PAGE_DESKTOP_SHELL_CLASS,
  PRODUCTS_PAGE_HERO_ASPECT_CLASS,
  PRODUCTS_PAGE_HERO_GRADIENT_TOP_CLASS,
  PRODUCTS_PAGE_SHELL_CLASS,
  PRODUCTS_PAGE_COMPACT_HERO_TOOLBAR_OFFSET_CLASS,
  PRODUCTS_PAGE_TOOLBAR_TOP_OFFSET_CLASS,
} from '../../app/products/products-page-layout.constants';
import { HeroRectangleBackground } from '../home/HeroRectangleBackground';
import { Header } from '../Header';
import { HEADER_SHELL_STICKY_OVERLAP_PX } from '../header/header-shell-shape.constants';
import { StorefrontMobileShell } from '../storefront/StorefrontMobileShell';
import { STOREFRONT_MOBILE_CONTENT_SURFACE_CLASS } from '../../lib/layout/storefront-mobile-layout.constants';

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
}: ProductsHeroShellProps) {
  const heroToolbarOffsetClass = resolveHeroToolbarOffsetClass(toolbar, compactHero);

  return (
    <div className={`${PRODUCTS_PAGE_SHELL_CLASS} flex flex-col`}>
      <Header embedded />
      <div
        className="relative shrink-0 overflow-hidden lg:-mt-[var(--header-sticky-overlap)]"
        style={{ '--header-sticky-overlap': `${HEADER_SHELL_STICKY_OVERLAP_PX}px` } as CSSProperties}
      >
        <div
          className={`absolute inset-x-0 w-full ${PRODUCTS_PAGE_HERO_ASPECT_CLASS} ${PRODUCTS_PAGE_HERO_GRADIENT_TOP_CLASS}`}
        >
          <HeroRectangleBackground variant="blue" fill solidColor="#C9DDF0" />
        </div>
        <div
          className={`relative z-20 pb-2 lg:pb-4 ${PRODUCTS_PAGE_CONTENT_INSET_CLASS} ${heroToolbarOffsetClass}`}
        >
          {toolbar}
        </div>
      </div>

      <div
        className={`relative z-20 overflow-visible ${PRODUCTS_PAGE_CATALOG_SURFACE_CLASS} ${PRODUCTS_PAGE_CONTENT_INSET_CLASS} ${PRODUCTS_PAGE_CATALOG_TOP_PADDING_CLASS} ${PRODUCTS_PAGE_CATALOG_BOTTOM_PADDING_CLASS}`}
      >
        {catalog}
      </div>
    </div>
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
}: ProductsHeroShellProps) {
  return (
    <>
      <StorefrontMobileShell
        toolbar={toolbar}
        contentSurfaceClassName={mobileContentSurfaceClassName}
        contentInsetClassName={mobileContentInsetClassName}
        hideTopBar={hideMobileTopBar}
        sectionAriaLabel={sectionAriaLabel}
      >
        {catalog}
      </StorefrontMobileShell>

      <div className={`hidden lg:block ${PRODUCTS_PAGE_DESKTOP_SHELL_CLASS}`}>
        <section
          aria-label={sectionAriaLabel}
          className="relative w-full lg:pt-3 lg:md:pt-5"
        >
          <ProductsHeroShellInner
            toolbar={toolbar}
            catalog={catalog}
            compactHero={compactHero}
          />
        </section>
      </div>
    </>
  );
}
