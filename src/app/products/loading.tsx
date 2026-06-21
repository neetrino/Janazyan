import { Suspense } from 'react';
import { ProductsHeroShell } from '../../components/products/ProductsHeroShell';
import {
  ProductsCatalogMainSkeleton,
  ProductsShopToolbarSkeleton,
} from './ProductsCatalogSkeleton';
import { PRODUCTS_PAGE_MOBILE_CATALOG_SURFACE_CLASS } from './products-page-layout.constants';
import { ProductsCatalogLoadingGate } from './ProductsCatalogLoadingGate';

/** Instant shell + cached catalog during client navigation (no server catalog await). */
export default function ProductsLoading() {
  return (
    <ProductsHeroShell
      mobileContentSurfaceClassName={PRODUCTS_PAGE_MOBILE_CATALOG_SURFACE_CLASS}
      toolbar={<ProductsShopToolbarSkeleton />}
      catalog={
        <Suspense fallback={<ProductsCatalogMainSkeleton />}>
          <ProductsCatalogLoadingGate />
        </Suspense>
      }
    />
  );
}
