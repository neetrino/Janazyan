'use client';

import type { ReactNode } from 'react';
import {
  PRODUCTS_PAGE_CONTENT_INSET_CLASS,
  PRODUCTS_PAGE_HERO_BAND_MIN_HEIGHT_CLASS,
  PRODUCTS_PAGE_MOBILE_HERO_BAND_HEIGHT_CLASS,
  PRODUCTS_PAGE_SHELL_CLASS,
  PRODUCTS_PAGE_TOOLBAR_TOP_OFFSET_CLASS,
} from '../../app/products/products-page-layout.constants';
import { HeroRectangleBackground } from '../home/HeroRectangleBackground';
import { Header } from '../Header';

type ProductsHeroShellProps = {
  toolbar: ReactNode;
  catalog: ReactNode;
};

/**
 * /products shell — fixed hero band (Figma node 269:726), catalog grows below.
 */
export function ProductsHeroShell({ toolbar, catalog }: ProductsHeroShellProps) {
  return (
    <>
      <div className="hidden w-full lg:block">
        <div className={`${PRODUCTS_PAGE_SHELL_CLASS} flex flex-col`}>
          <div className={`relative shrink-0 ${PRODUCTS_PAGE_HERO_BAND_MIN_HEIGHT_CLASS}`}>
            <HeroRectangleBackground variant="blue" fill />
            <Header embedded embeddedScope="products" />

            <div
              className={`absolute inset-x-0 top-0 z-20 ${PRODUCTS_PAGE_TOOLBAR_TOP_OFFSET_CLASS} ${PRODUCTS_PAGE_CONTENT_INSET_CLASS}`}
            >
              {toolbar}
            </div>
          </div>

          <div className="relative z-20 flex flex-col">{catalog}</div>
        </div>
      </div>

      <div className="lg:hidden">
        <div className="relative flex flex-col overflow-hidden rounded-[28px] bg-white">
          <div
            className={`relative shrink-0 overflow-hidden ${PRODUCTS_PAGE_MOBILE_HERO_BAND_HEIGHT_CLASS}`}
          >
            <HeroRectangleBackground variant="blue" fill />
            <Header embedded embeddedScope="products" />
          </div>

          <div className={`relative z-20 flex flex-col bg-products-catalog ${PRODUCTS_PAGE_CONTENT_INSET_CLASS}`}>
            <div className="pb-2 pt-4">{toolbar}</div>
            {catalog}
          </div>
        </div>
      </div>
    </>
  );
}
