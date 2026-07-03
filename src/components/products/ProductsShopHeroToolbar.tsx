import { Suspense } from 'react';
import {
  PRODUCTS_PAGE_CATEGORY_ROW_CLASS,
  PRODUCTS_PAGE_TOOLBAR_CONTROL_HEIGHT_CLASS,
  PRODUCTS_PAGE_TOOLBAR_PILL_RADIUS_CLASS,
} from '../../app/products/products-page-layout.constants';
import type { LanguageCode } from '../../lib/language';
import { CategoryNavigationServer } from '../CategoryNavigation/CategoryNavigationServer';
import { ProductsToolbarControls } from './ProductsToolbarControls';

type ProductsShopHeroToolbarProps = {
  language: LanguageCode;
  activeCategorySlug?: string;
};

/**
 * Figma shop hero toolbar — category pills, view + sort controls.
 */
export function ProductsShopHeroToolbar({
  language,
  activeCategorySlug,
}: ProductsShopHeroToolbarProps) {
  return (
    <div className="pb-1">
      <div className="hidden flex-col gap-3 lg:flex lg:flex-row lg:items-center lg:justify-between lg:gap-[11px]">
        <Suspense
          fallback={
            <div className={`${PRODUCTS_PAGE_CATEGORY_ROW_CLASS} min-h-16`}>
              {Array.from({ length: 5 }).map((_, index) => (
                <div
                  key={index}
                  className="h-16 w-[128px] shrink-0 animate-pulse rounded-full bg-white/50"
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
            <div className="flex shrink-0 items-center gap-3">
              <div
                className={`${PRODUCTS_PAGE_TOOLBAR_CONTROL_HEIGHT_CLASS} w-[182px] animate-pulse bg-white/40 ${PRODUCTS_PAGE_TOOLBAR_PILL_RADIUS_CLASS}`}
              />
              <div
                className={`${PRODUCTS_PAGE_TOOLBAR_CONTROL_HEIGHT_CLASS} w-[231px] animate-pulse bg-sky-deep/40 ${PRODUCTS_PAGE_TOOLBAR_PILL_RADIUS_CLASS}`}
              />
            </div>
          }
        >
          <ProductsToolbarControls />
        </Suspense>
      </div>
    </div>
  );
}
