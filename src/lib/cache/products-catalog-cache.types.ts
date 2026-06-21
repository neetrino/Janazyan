export type ProductsCatalogCacheFilters = {
  page: number;
  limit: number;
  lang: string;
  search?: string;
  category?: string;
};

export type ProductsCatalogCacheResponse = {
  data: Array<{
    id: string;
    slug: string;
    title: string;
    price: number;
    compareAtPrice: number | null;
    originalPrice: number | null;
    image: string | null;
    inStock: boolean;
    brand: { id: string; name: string } | null;
    defaultVariantId: string | null;
    colors: unknown[];
    labels: Array<{
      id: string;
      type: 'text' | 'percentage';
      value: string;
      position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
      color: string | null;
    }>;
  }>;
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage?: boolean;
  };
};

export function buildProductsCatalogCacheKey(
  filters: ProductsCatalogCacheFilters,
): string {
  const search = filters.search?.trim() || '-';
  const category = filters.category?.trim() || '-';
  return `v1:${filters.lang}:${filters.page}:${filters.limit}:${category}:${search}`;
}
