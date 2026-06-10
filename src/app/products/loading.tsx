import { ProductsHeroShell } from '../../components/products/ProductsHeroShell';
import {
  ProductsCatalogMainSkeleton,
  ProductsShopToolbarSkeleton,
} from './ProductsCatalogSkeleton';

/** Instant shell on client navigation — no async work before paint. */
export default function ProductsLoading() {
  return (
    <ProductsHeroShell
      toolbar={<ProductsShopToolbarSkeleton />}
      catalog={<ProductsCatalogMainSkeleton />}
    />
  );
}
