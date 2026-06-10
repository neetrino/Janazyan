import { ProductsHeroShell } from '../../components/products/ProductsHeroShell';
import {
  ProductsCatalogMainSkeleton,
  ProductsShopToolbarSkeleton,
} from './ProductsCatalogSkeleton';
import { PRODUCTS_PAGE_MOBILE_CATALOG_SURFACE_CLASS } from './products-page-layout.constants';

/** Instant shell on client navigation — no async work before paint. */
export default function ProductsLoading() {
  return (
    <ProductsHeroShell
      mobileContentSurfaceClassName={PRODUCTS_PAGE_MOBILE_CATALOG_SURFACE_CLASS}
      toolbar={<ProductsShopToolbarSkeleton />}
      catalog={<ProductsCatalogMainSkeleton />}
    />
  );
}
