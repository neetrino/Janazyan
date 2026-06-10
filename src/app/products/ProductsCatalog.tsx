import Link from 'next/link';
import { Button } from '@shop/ui';
import type { LanguageCode } from '../../lib/language';
import { t } from '../../lib/i18n';
import { ProductsGrid } from '../../components/ProductsGrid';
import type { ProductsCatalogCacheResponse } from '../../lib/cache/products-catalog-redis-cache';
import {
  parseCatalogSearchParams,
  sortCatalogProducts,
  type ParsedCatalogParams,
  type SearchParamsInput,
} from '../../lib/products/catalog-search-params';

type ProductsCatalogProps = {
  catalogPromise: Promise<ProductsCatalogCacheResponse>;
  parsed: ParsedCatalogParams;
  raw: SearchParamsInput;
  language: LanguageCode;
};

export async function ProductsCatalog({
  catalogPromise,
  parsed,
  raw,
  language,
}: ProductsCatalogProps) {
  const productsData = await catalogPromise;

  const normalizedProducts = sortCatalogProducts(
    productsData.data.map((product) => ({
      id: product.id,
      slug: product.slug,
      title: product.title,
      price: product.price,
      compareAtPrice: product.compareAtPrice ?? product.originalPrice ?? null,
      image: product.image ?? null,
      inStock: product.inStock ?? true,
      brand: product.brand ?? null,
      defaultVariantId: product.defaultVariantId ?? null,
      colors: Array.isArray(product.colors) ? product.colors : [],
      labels: product.labels ?? [],
    })),
    parsed.sort,
  );

  const buildPaginationUrl = (num: number) => {
    const q = new URLSearchParams();
    q.set('page', num.toString());
    const currentLimit = raw.limit ? String(raw.limit) : '12';
    q.set('limit', currentLimit);
    Object.entries(raw).forEach(([k, v]) => {
      if (k !== 'page' && k !== 'limit' && v && typeof v === 'string') q.set(k, v);
    });
    return `/products?${q.toString()}`;
  };

  const hasPreviousPage = parsed.page > 1;
  const hasNextPage =
    productsData.meta.hasNextPage ?? parsed.page < productsData.meta.totalPages;
  const shouldShowPagination = hasPreviousPage || hasNextPage;

  return (
    <div className="relative z-10 w-full">
      {normalizedProducts.length > 0 ? (
        <>
          <ProductsGrid products={normalizedProducts} />

          {shouldShowPagination && (
            <nav
              className="mt-10 flex flex-wrap items-center justify-center gap-2"
              aria-label="Pagination"
            >
              {hasPreviousPage ? (
                <Link href={buildPaginationUrl(parsed.page - 1)}>
                  <Button
                    variant="outline"
                    className="min-w-[90px] rounded-lg border-neutral-300 bg-white px-4 py-2 text-sm font-medium text-neutral-700 shadow-sm transition hover:border-neutral-400 hover:bg-neutral-50"
                  >
                    {t(language, 'common.pagination.previous')}
                  </Button>
                </Link>
              ) : (
                <span className="min-w-[90px] rounded-lg border border-neutral-200 bg-neutral-50 px-4 py-2 text-center text-sm font-medium text-neutral-400">
                  {t(language, 'common.pagination.previous')}
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
                <Link href={buildPaginationUrl(parsed.page + 1)}>
                  <Button
                    variant="outline"
                    className="min-w-[90px] rounded-lg border-neutral-300 bg-white px-4 py-2 text-sm font-medium text-neutral-700 shadow-sm transition hover:border-neutral-400 hover:bg-neutral-50"
                  >
                    {t(language, 'common.pagination.next')}
                  </Button>
                </Link>
              ) : (
                <span className="min-w-[90px] rounded-lg border border-neutral-200 bg-neutral-50 px-4 py-2 text-center text-sm font-medium text-neutral-400">
                  {t(language, 'common.pagination.next')}
                </span>
              )}
            </nav>
          )}
        </>
      ) : (
        <div className="py-12 text-center">
          <p className="text-lg text-gray-500">{t(language, 'common.messages.noProductsFound')}</p>
        </div>
      )}
    </div>
  );
}
