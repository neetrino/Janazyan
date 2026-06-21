'use client';

import Link from 'next/link';
import { Button } from '@shop/ui';
import { ProductsGrid } from '@/components/ProductsGrid';
import { useTranslation } from '@/lib/i18n-client';
import { buildCatalogPaginationUrl } from '@/lib/products/build-catalog-pagination-url';
import type { CatalogGridProduct } from '@/lib/products/normalize-catalog-products';
import type { ParsedCatalogParams, SearchParamsInput } from '@/lib/products/catalog-search-params';
import type { ProductsCatalogCacheResponse } from '@/lib/cache/products-catalog-cache.types';
import { ProductsCatalogMainSkeleton } from './ProductsCatalogSkeleton';

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

  const hasPreviousPage = parsed.page > 1;
  const hasNextPage = meta
    ? (meta.hasNextPage ?? parsed.page < meta.totalPages)
    : false;
  const shouldShowPagination = hasPreviousPage || hasNextPage;

  return (
    <div className="relative z-10 w-full">
      {products.length > 0 ? (
        <>
          <ProductsGrid products={products} />

          {shouldShowPagination && (
            <nav
              className="mt-10 flex flex-wrap items-center justify-center gap-2"
              aria-label="Pagination"
            >
              {hasPreviousPage ? (
                <Link href={buildCatalogPaginationUrl(parsed.page - 1, raw)}>
                  <Button
                    variant="outline"
                    className="min-w-[90px] rounded-lg border-neutral-300 bg-white px-4 py-2 text-sm font-medium text-neutral-700 shadow-sm transition hover:border-neutral-400 hover:bg-neutral-50"
                  >
                    {t('common.pagination.previous')}
                  </Button>
                </Link>
              ) : (
                <span className="min-w-[90px] rounded-lg border border-neutral-200 bg-neutral-50 px-4 py-2 text-center text-sm font-medium text-neutral-400">
                  {t('common.pagination.previous')}
                </span>
              )}

              <div className="flex items-center gap-1">
                <span
                  className="flex h-9 min-w-[2.25rem] items-center justify-center rounded-lg bg-neutral-800 px-3 py-1.5 text-sm font-semibold text-white shadow-sm"
                  aria-current="page"
                >
                  {parsed.page}
                </span>
              </div>

              {hasNextPage ? (
                <Link href={buildCatalogPaginationUrl(parsed.page + 1, raw)}>
                  <Button
                    variant="outline"
                    className="min-w-[90px] rounded-lg border-neutral-300 bg-white px-4 py-2 text-sm font-medium text-neutral-700 shadow-sm transition hover:border-neutral-400 hover:bg-neutral-50"
                  >
                    {t('common.pagination.next')}
                  </Button>
                </Link>
              ) : (
                <span className="min-w-[90px] rounded-lg border border-neutral-200 bg-neutral-50 px-4 py-2 text-center text-sm font-medium text-neutral-400">
                  {t('common.pagination.next')}
                </span>
              )}
            </nav>
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
