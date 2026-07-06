import {
  PRODUCTS_PAGE_CATEGORY_ROW_CLASS,
  PRODUCTS_PAGE_SHOP_BREADCRUMB_CLASS,
  PRODUCTS_PAGE_TOOLBAR_CONTROL_HEIGHT_CLASS,
  PRODUCTS_PAGE_TOOLBAR_PILL_RADIUS_CLASS,
} from './products-page-layout.constants';
import { STOREFRONT_DESKTOP_FLEX_CLASS } from '../../lib/layout/storefront-layout.constants';

const GRID =
  'grid grid-cols-2 gap-4 sm:grid-cols-3 desktop:grid-cols-4';

/**
 * Toolbar placeholder — synchronous, no DB / i18n on navigation.
 */
export function ProductsShopToolbarSkeleton() {
  return (
    <div className="pb-1" aria-busy="true" aria-label="Loading shop toolbar">
      <div className={`${PRODUCTS_PAGE_SHOP_BREADCRUMB_CLASS} h-[18px] w-40 animate-pulse rounded bg-white/50`} />
      <div className={`${STOREFRONT_DESKTOP_FLEX_CLASS} flex-col gap-3 desktop:flex-row desktop:items-center desktop:justify-between desktop:gap-[11px]`}>
        <div className={`${PRODUCTS_PAGE_CATEGORY_ROW_CLASS} min-h-14`}>
          {Array.from({ length: 5 }).map((_, index) => (
            <div
              key={index}
              className="h-14 w-28 shrink-0 animate-pulse rounded-full bg-white/50"
            />
          ))}
        </div>
        <div
          className={`${PRODUCTS_PAGE_TOOLBAR_CONTROL_HEIGHT_CLASS} w-[231px] shrink-0 animate-pulse bg-sky-deep/40 ${PRODUCTS_PAGE_TOOLBAR_PILL_RADIUS_CLASS}`}
        />
      </div>
    </div>
  );
}

/**
 * Main column placeholder while product list streams in.
 */
export function ProductsCatalogMainSkeleton() {
  return (
    <div
      className="w-full animate-pulse"
      aria-busy="true"
      aria-label="Loading products"
    >
      <div className={GRID}>
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className="overflow-hidden rounded-lg border border-neutral-200 bg-white">
            <div className="aspect-square bg-neutral-200" />
            <div className="space-y-2 p-4">
              <div className="h-4 w-4/5 rounded bg-neutral-200" />
              <div className="h-3 w-1/2 rounded bg-neutral-200" />
              <div className="h-5 w-1/3 rounded bg-neutral-200" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/** @deprecated Use ProductsCatalogMainSkeleton */
export const ProductsCatalogSkeleton = ProductsCatalogMainSkeleton;
