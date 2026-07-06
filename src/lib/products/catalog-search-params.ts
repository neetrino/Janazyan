import { DEFAULT_CATALOG_PAGE_SIZE } from './catalog-page.constants';

export type CatalogSort = 'default' | 'price-asc' | 'price-desc' | 'name-asc' | 'name-desc';

const MAX_CATALOG_PAGE_SIZE = 24;

export type SearchParamsInput = Record<string, string | string[] | undefined>;

export type ParsedCatalogParams = {
  page: number;
  perPage: number;
  sort: CatalogSort;
  search?: string;
  category?: string;
  colors?: string;
  sizes?: string;
  brand?: string;
  selectedColors: string[];
  selectedSizes: string[];
  selectedBrands: string[];
};

export async function resolveSearchParams(
  searchParams: Promise<SearchParamsInput> | SearchParamsInput
): Promise<SearchParamsInput> {
  return searchParams instanceof Promise ? await searchParams : searchParams;
}

export function parseCatalogSearchParams(params: SearchParamsInput): ParsedCatalogParams {
  const page = parseInt((params.page as string) || '1', 10);
  const limitParam = typeof params.limit === 'string' ? params.limit.trim() : '';
  const parsedLimit =
    limitParam && !Number.isNaN(parseInt(limitParam, 10))
      ? parseInt(limitParam, 10)
      : null;
  const perPage = parsedLimit
    ? Math.min(parsedLimit, MAX_CATALOG_PAGE_SIZE)
    : DEFAULT_CATALOG_PAGE_SIZE;
  const sort = (typeof params.sort === 'string' ? params.sort : 'default') as CatalogSort;

  const colors = typeof params.colors === 'string' ? params.colors : undefined;
  const sizes = typeof params.sizes === 'string' ? params.sizes : undefined;
  const brands = typeof params.brand === 'string' ? params.brand : undefined;

  return {
    page,
    perPage,
    sort,
    search: typeof params.search === 'string' ? params.search : undefined,
    category:
      typeof params.category === 'string' && params.category.trim()
        ? params.category.trim()
        : undefined,
    colors,
    sizes,
    brand: brands,
    selectedColors: colors ? colors.split(',').map((c) => c.trim().toLowerCase()) : [],
    selectedSizes: sizes ? sizes.split(',').map((s) => s.trim()) : [],
    selectedBrands: brands ? brands.split(',').map((b) => b.trim()) : [],
  };
}

export function sortCatalogProducts<T extends { price: number; title: string }>(
  products: T[],
  sort: CatalogSort
): T[] {
  const sorted = [...products];
  switch (sort) {
    case 'price-asc':
      sorted.sort((a, b) => a.price - b.price);
      break;
    case 'price-desc':
      sorted.sort((a, b) => b.price - a.price);
      break;
    case 'name-asc':
      sorted.sort((a, b) => a.title.localeCompare(b.title));
      break;
    case 'name-desc':
      sorted.sort((a, b) => b.title.localeCompare(a.title));
      break;
    default:
      break;
  }
  return sorted;
}
