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
  PRODUCTS_PAGE_SIDE_PADDING_CLASS,
  PRODUCTS_PAGE_TOOLBAR_TOP_OFFSET_CLASS,
} from '../../app/products/products-page-layout.constants';
import { HeroRectangleBackground } from '../home/HeroRectangleBackground';
import { Header } from '../Header';

type ProductsHeroShellProps = {
  toolbar: ReactNode;
  catalog: ReactNode;
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
 * /products shell — home-hero rounded frame; hero band matches HomeHero SVG, catalog grows below.
 */
export function ProductsHeroShell({ toolbar, catalog }: ProductsHeroShellProps) {
  return (
    <>
      <div className="hidden w-full lg:block">
        <div className={PRODUCTS_PAGE_DESKTOP_SHELL_CLASS}>
          <section aria-label="Shop" className="relative w-full pt-3 md:pt-5">
            <ProductsHeroShellInner toolbar={toolbar} catalog={catalog} />
          </section>
        </div>
      </div>

      <div className={`lg:hidden ${PRODUCTS_PAGE_SIDE_PADDING_CLASS}`}>
        <ProductsHeroShellInner toolbar={toolbar} catalog={catalog} />
      </div>
    </>
  );
}
