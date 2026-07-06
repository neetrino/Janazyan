import { Suspense } from 'react';
import {
  PRODUCTS_PAGE_CATEGORY_ROW_CLASS,
  PRODUCTS_PAGE_CATEGORY_SCROLL_SHELL_CLASS,
  PRODUCTS_PAGE_TOOLBAR_CONTROL_HEIGHT_CLASS,
  PRODUCTS_PAGE_TOOLBAR_PILL_RADIUS_CLASS,
  PRODUCTS_PAGE_TOOLBAR_ROW_CLASS,
  PRODUCTS_PAGE_TOOLBAR_SORT_WIDTH_CLASS,
  PRODUCTS_PAGE_TOOLBAR_WRAPPER_CLASS,
} from '../../app/products/products-page-layout.constants';
import { STOREFRONT_DESKTOP_ONLY_CLASS } from '../../lib/layout/storefront-layout.constants';
import type { LanguageCode } from '../../lib/language';
import { CategoryNavigationServer } from '../CategoryNavigation/CategoryNavigationServer';
import { ProductsToolbarControls } from './ProductsToolbarControls';

type ProductsShopHeroToolbarProps = {
  language: LanguageCode;
  activeCategorySlug?: string;
};

/**
 * Figma shop hero toolbar — category pills + sort control.
 */
export function ProductsShopHeroToolbar({
  language,
  activeCategorySlug,
}: ProductsShopHeroToolbarProps) {
  return (
    <div className={PRODUCTS_PAGE_TOOLBAR_WRAPPER_CLASS}>
      <div className={PRODUCTS_PAGE_TOOLBAR_ROW_CLASS}>
        <div className={PRODUCTS_PAGE_CATEGORY_SCROLL_SHELL_CLASS}>
          <Suspense
            fallback={
              <div className={`${PRODUCTS_PAGE_CATEGORY_ROW_CLASS} ${PRODUCTS_PAGE_TOOLBAR_CONTROL_HEIGHT_CLASS}`}>
                {Array.from({ length: 5 }).map((_, index) => (
                  <div
                    key={index}
                    className={`${PRODUCTS_PAGE_TOOLBAR_CONTROL_HEIGHT_CLASS} w-20 shrink-0 animate-pulse rounded-full bg-white/50`}
                  />
                ))}
              </div>
            }
          >
            <CategoryNavigationServer
              language={language}
              activeCategorySlug={activeCategorySlug}
              variant="pills"
            />
          </Suspense>
        </div>
        <div className={STOREFRONT_DESKTOP_ONLY_CLASS}>
          <Suspense
            fallback={
              <div
                className={`${PRODUCTS_PAGE_TOOLBAR_CONTROL_HEIGHT_CLASS} ${PRODUCTS_PAGE_TOOLBAR_SORT_WIDTH_CLASS} shrink-0 animate-pulse bg-sky-deep/40 ${PRODUCTS_PAGE_TOOLBAR_PILL_RADIUS_CLASS}`}
              />
            }
          >
            <ProductsToolbarControls />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
