import { Suspense } from 'react';
import { ProductsHeroShell } from '../../components/products/ProductsHeroShell';
import {
  ProductsCatalogMainSkeleton,
  ProductsShopToolbarSkeleton,
} from './ProductsCatalogSkeleton';
import { ProductsCatalogLoadingGate } from './ProductsCatalogLoadingGate';

/** Instant shell + cached catalog during client navigation (no server catalog await). */
export default function ProductsLoading() {
  return (
    <ProductsHeroShell
      toolbar={<ProductsShopToolbarSkeleton />}
      catalog={
        <Suspense fallback={<ProductsCatalogMainSkeleton />}>
          <ProductsCatalogLoadingGate />
        </Suspense>
      }
    />
  );
}
