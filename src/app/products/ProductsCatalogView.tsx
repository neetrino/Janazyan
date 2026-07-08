'use client';

import { ProductsGrid } from '@/components/ProductsGrid';
import { useTranslation } from '@/lib/i18n-client';
import type { CatalogGridProduct } from '@/lib/products/normalize-catalog-products';
import type { ParsedCatalogParams, SearchParamsInput } from '@/lib/products/catalog-search-params';
import type { ProductsCatalogCacheResponse } from '@/lib/cache/products-catalog-cache.types';
import { ProductsCatalogMainSkeleton } from './ProductsCatalogSkeleton';
import { ProductsCatalogPagination } from './ProductsCatalogPagination';

type ProductsCatalogViewProps = {
  parsed: ParsedCatalogParams;
  raw: SearchParamsInput;
  products: CatalogGridProduct[];
  meta: ProductsCatalogCacheResponse['meta'] | null;
  isLoading: boolean;
  error: Error | null;
};

export function ProductsCatalogView({
  parsed,
  raw,
  products,
  meta,
  isLoading,
  error,
}: ProductsCatalogViewProps) {
  const { t } = useTranslation();

  if (isLoading && products.length === 0) {
    return <ProductsCatalogMainSkeleton />;
  }

  if (error && products.length === 0) {
    return (
      <div className="py-12 text-center">
        <p className="text-lg text-gray-500">{t('common.messages.noProductsFound')}</p>
      </div>
    );
  }

  const totalPages = meta?.totalPages ?? 1;
  const shouldShowPagination = totalPages > 1;

  return (
    <div className="relative z-10 w-full">
      {products.length > 0 ? (
        <>
          <ProductsGrid products={products} />

          {shouldShowPagination && (
            <ProductsCatalogPagination
              currentPage={parsed.page}
              totalPages={totalPages}
              raw={raw}
            />
          )}
        </>
      ) : (
        <div className="py-12 text-center">
          <p className="text-lg text-gray-500">{t('common.messages.noProductsFound')}</p>
        </div>
      )}
    </div>
  );
}
