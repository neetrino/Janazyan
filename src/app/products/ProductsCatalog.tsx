import Link from 'next/link';
import { unstable_cache } from 'next/cache';
import { Button } from '@shop/ui';
import type { LanguageCode } from '../../lib/language';
import { getServerLanguage } from '../../lib/language-server';
import { t } from '../../lib/i18n';
import { ProductsHeader } from '../../components/ProductsHeader';
import { ProductsGrid } from '../../components/ProductsGrid';
import { logger } from '../../lib/utils/logger';
import { productsService } from '../../lib/services/products.service';
import {
  parseCatalogSearchParams,
  parseOptionalPrice,
  resolveSearchParams,
  sortCatalogProducts,
  type SearchParamsInput,
} from '../../lib/products/catalog-search-params';

const PAGE_CONTAINER = 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8';

interface Product {
  id: string;
  slug: string;
  title: string;
  price: number;
  compareAtPrice: number | null;
  image: string | null;
  inStock: boolean;
  brand: {
    id: string;
    name: string;
  } | null;
  defaultVariantId?: string | null;
  colors?: unknown[];
  labels?: Array<{
    id: string;
    type: 'text' | 'percentage';
    value: string;
    position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
    color: string | null;
  }>;
  originalPrice?: number | null;
}

interface ProductsResponse {
  data: Product[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

const PRODUCTS_LIST_REVALIDATE_SECONDS = 60;

const getProductsCached = unstable_cache(
  async (
    page: number,
    limit: number,
    lang: string,
    search?: string,
    category?: string,
    minPrice?: number,
    maxPrice?: number,
    colors?: string,
    sizes?: string,
    brand?: string
  ): Promise<ProductsResponse> =>
    productsService.findAll({
      page,
      limit,
      lang,
      search,
      category,
      minPrice,
      maxPrice,
      colors,
      sizes,
      brand,
      catalog: true,
    }),
  ['products-catalog-db-v1'],
  { revalidate: PRODUCTS_LIST_REVALIDATE_SECONDS }
);

async function getProducts(
  page: number,
  search: string | undefined,
  category: string | undefined,
  minPrice: string | undefined,
  maxPrice: string | undefined,
  colors: string | undefined,
  sizes: string | undefined,
  brand: string | undefined,
  limit: number,
  language: LanguageCode
): Promise<ProductsResponse> {
  try {
    const response = await getProductsCached(
      page,
      limit,
      language,
      search?.trim() || undefined,
      category?.trim() || undefined,
      parseOptionalPrice(minPrice),
      parseOptionalPrice(maxPrice),
      colors?.trim() || undefined,
      sizes?.trim() || undefined,
      brand?.trim() || undefined
    );
    if (!Array.isArray(response.data)) {
      return {
        data: [],
        meta: { total: 0, page: 1, limit: 12, totalPages: 0 },
      };
    }

    return response;
  } catch (e) {
    logger.error('Product catalog fetch failed', e);
    return {
      data: [],
      meta: { total: 0, page: 1, limit: 12, totalPages: 0 },
    };
  }
}

export async function ProductsCatalog({
  searchParams,
  language: languageProp,
}: {
  searchParams: Promise<SearchParamsInput> | SearchParamsInput;
  language?: LanguageCode;
}) {
  const raw = await resolveSearchParams(searchParams);
  const parsed = parseCatalogSearchParams(raw);
  const language = languageProp ?? (await getServerLanguage());

  const productsData = await getProducts(
    parsed.page,
    parsed.search,
    parsed.category,
    parsed.minPrice,
    parsed.maxPrice,
    parsed.colors,
    parsed.sizes,
    parsed.brand,
    parsed.perPage,
    language
  );

  const normalizedProducts = sortCatalogProducts(
    productsData.data.map((p: Product) => ({
      id: p.id,
      slug: p.slug,
      title: p.title,
      price: p.price,
      compareAtPrice: p.compareAtPrice ?? p.originalPrice ?? null,
      image: p.image ?? null,
      inStock: p.inStock ?? true,
      brand: p.brand ?? null,
      defaultVariantId: p.defaultVariantId ?? null,
      colors: Array.isArray(p.colors) ? p.colors : [],
      labels: p.labels ?? [],
    })),
    parsed.sort
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

  const getPaginationPages = (): (number | 'ellipsis')[] => {
    const total = productsData.meta.totalPages;
    const current = parsed.page;
    if (total <= 7) {
      return Array.from({ length: total }, (_, i) => i + 1);
    }
    const set = new Set<number>([1, total, current - 1, current, current + 1]);
    const sorted = Array.from(set).filter((p) => p >= 1 && p <= total).sort((a, b) => a - b);
    const out: (number | 'ellipsis')[] = [];
    for (let i = 0; i < sorted.length; i++) {
      if (i > 0 && sorted[i]! - sorted[i - 1]! > 1) out.push('ellipsis');
      out.push(sorted[i]!);
    }
    return out;
  };

  return (
    <div className="w-full py-4 overflow-x-hidden">
      <div className={`${PAGE_CONTAINER} relative z-10`}>
        <ProductsHeader total={productsData.meta.total} perPage={productsData.meta.limit} />
      </div>

      <div className={`${PAGE_CONTAINER} relative z-10 py-4`}>
        {normalizedProducts.length > 0 ? (
          <>
            <ProductsGrid products={normalizedProducts} sortBy={parsed.sort} />

            {productsData.meta.totalPages > 1 && (
              <nav
                className="mt-10 flex flex-wrap items-center justify-center gap-2"
                aria-label="Pagination"
              >
                {parsed.page > 1 ? (
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
                  {getPaginationPages().map((item, idx) =>
                    item === 'ellipsis' ? (
                      <span key={`ellipsis-${idx}`} className="px-2 text-neutral-400" aria-hidden>
                        …
                      </span>
                    ) : (
                      <span key={item}>
                        {item === parsed.page ? (
                          <span
                            className="flex h-9 min-w-[2.25rem] items-center justify-center rounded-lg bg-neutral-800 px-3 py-1.5 text-sm font-semibold text-white shadow-sm"
                            aria-current="page"
                          >
                            {item}
                          </span>
                        ) : (
                          <Link
                            href={buildPaginationUrl(item)}
                            className="flex h-9 min-w-[2.25rem] items-center justify-center rounded-lg border border-neutral-300 bg-white px-3 py-1.5 text-sm font-medium text-neutral-700 shadow-sm transition hover:border-neutral-400 hover:bg-neutral-50"
                          >
                            {item}
                          </Link>
                        )}
                      </span>
                    )
                  )}
                </div>

                {parsed.page < productsData.meta.totalPages ? (
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
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">{t(language, 'common.messages.noProductsFound')}</p>
          </div>
        )}
      </div>
    </div>
  );
}
