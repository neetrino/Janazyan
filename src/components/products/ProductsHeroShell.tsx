'use client';

import type { ReactNode } from 'react';
import {
  PRODUCTS_PAGE_CATALOG_BOTTOM_PADDING_CLASS,
  PRODUCTS_PAGE_CATALOG_SURFACE_CLASS,
  PRODUCTS_PAGE_CATALOG_TOP_PADDING_CLASS,
  PRODUCTS_PAGE_CONTENT_INSET_CLASS,
  PRODUCTS_PAGE_DESKTOP_SHELL_CLASS,
  PRODUCTS_PAGE_HERO_ASPECT_CLASS,
  PRODUCTS_PAGE_HERO_GRADIENT_TOP_CLASS,
  PRODUCTS_PAGE_MOBILE_TOOLBAR_TOP_OFFSET_CLASS,
  PRODUCTS_PAGE_SHELL_CLASS,
  PRODUCTS_PAGE_TOOLBAR_TOP_OFFSET_CLASS,
} from '../../app/products/products-page-layout.constants';
import { HeroRectangleBackground } from '../home/HeroRectangleBackground';
import { Header } from '../Header';

type ProductsHeroShellProps = {
  /** Omitted on content-only pages (e.g. /about) — hero band keeps the same height. */
  toolbar?: ReactNode;
  catalog: ReactNode;
  sectionAriaLabel?: string;
};

function ProductsHeroShellInner({ toolbar, catalog }: ProductsHeroShellProps) {
  return (
    <div className={`${PRODUCTS_PAGE_SHELL_CLASS} flex flex-col`}>
      <div className="relative shrink-0 overflow-hidden">
        <div
          className={`absolute inset-x-0 w-full ${PRODUCTS_PAGE_HERO_ASPECT_CLASS} ${PRODUCTS_PAGE_HERO_GRADIENT_TOP_CLASS}`}
        >
          <HeroRectangleBackground variant="blue" fill solidColor="#C9DDF0" />
        </div>
        <Header embedded />
        <div
          className={`relative z-20 pb-2 lg:pb-4 ${PRODUCTS_PAGE_CONTENT_INSET_CLASS} ${PRODUCTS_PAGE_MOBILE_TOOLBAR_TOP_OFFSET_CLASS} ${PRODUCTS_PAGE_TOOLBAR_TOP_OFFSET_CLASS}`}
        >
          {toolbar}
        </div>
      </div>

      <div
        className={`relative z-20 ${PRODUCTS_PAGE_CATALOG_SURFACE_CLASS} ${PRODUCTS_PAGE_CONTENT_INSET_CLASS} ${PRODUCTS_PAGE_CATALOG_TOP_PADDING_CLASS} ${PRODUCTS_PAGE_CATALOG_BOTTOM_PADDING_CLASS}`}
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
  sectionAriaLabel = 'Shop',
}: ProductsHeroShellProps) {
  return (
    <div className={PRODUCTS_PAGE_DESKTOP_SHELL_CLASS}>
      <section
        aria-label={sectionAriaLabel}
        className="relative w-full lg:pt-3 lg:md:pt-5"
      >
        <ProductsHeroShellInner toolbar={toolbar} catalog={catalog} />
      </section>
    </div>
  );
}
