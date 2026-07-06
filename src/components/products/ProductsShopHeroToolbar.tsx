import { Suspense } from 'react';
import {
  PRODUCTS_PAGE_CATEGORY_ROW_CLASS,
  PRODUCTS_PAGE_TOOLBAR_CONTROL_HEIGHT_CLASS,
  PRODUCTS_PAGE_TOOLBAR_PILL_RADIUS_CLASS,
} from '../../app/products/products-page-layout.constants';
import { STOREFRONT_DESKTOP_FLEX_CLASS } from '../../lib/layout/storefront-layout.constants';
import type { LanguageCode } from '../../lib/language';
import { CategoryNavigationServer } from '../CategoryNavigation/CategoryNavigationServer';
import { ProductsShopBreadcrumb } from './ProductsShopBreadcrumb';
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
    <div className="pb-1">
      <ProductsShopBreadcrumb language={language} />
      <div className={`${STOREFRONT_DESKTOP_FLEX_CLASS} flex-col gap-3 desktop:flex-row desktop:items-center desktop:justify-between desktop:gap-[11px]`}>
        <Suspense
          fallback={
            <div className={`${PRODUCTS_PAGE_CATEGORY_ROW_CLASS} min-h-14`}>
              {Array.from({ length: 5 }).map((_, index) => (
                <div
                  key={index}
                  className="h-14 w-28 shrink-0 animate-pulse rounded-full bg-white/50"
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
        <Suspense
          fallback={
            <div
              className={`${PRODUCTS_PAGE_TOOLBAR_CONTROL_HEIGHT_CLASS} w-[231px] shrink-0 animate-pulse bg-sky-deep/40 ${PRODUCTS_PAGE_TOOLBAR_PILL_RADIUS_CLASS}`}
            />
          }
        >
          <ProductsToolbarControls />
        </Suspense>
      </div>
    </div>
  );
}
