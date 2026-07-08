import type { ProductLabel } from '@/components/ProductLabels';
import type { ProductsCatalogCacheResponse } from '@/lib/cache/products-catalog-cache.types';
import { sortCatalogProducts, type CatalogSort } from './catalog-search-params';

export type CatalogGridProduct = {
  id: string;
  slug: string;
  title: string;
  price: number;
  compareAtPrice: number | null;
  image: string | null;
  inStock: boolean;
  brand: { id: string; name: string } | null;
  defaultVariantId: string | null;
  colors: unknown[];
  labels: ProductLabel[];
  categories: Array<{ title: string }>;
  ratingAverage: number | null;
};

export function normalizeCatalogProducts(
  productsData: ProductsCatalogCacheResponse,
  sort: CatalogSort,
): CatalogGridProduct[] {
  return sortCatalogProducts(
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
      categories: product.categories ?? [],
      ratingAverage: product.ratingAverage ?? null,
    })),
    sort,
  );
}
