import { cache } from 'react';
import { unstable_cache } from 'next/cache';
import { db } from '@white-shop/db';
import type { ProductLabel } from '../../components/ProductLabels';
import { productsService } from '../services/products.service';
import { mapToHomeFeaturedProduct } from './map-to-home-featured-product';

const HOME_FEATURED_LIMIT = 4;
const HOME_LANG = 'hy';
const HOME_FEATURED_REVALIDATE_SECONDS = 60;

type CatalogProduct = {
  id: string;
  slug: string;
  title: string;
  price: number;
  originalPrice?: number | null;
  compareAtPrice?: number | null;
  discountPercent?: number | null;
  image: string | null;
  inStock: boolean;
  defaultVariantId?: string | null;
  brand: { name: string } | null;
  categories: Array<{ title: string }>;
  labels?: ProductLabel[];
};

export type HomeFeaturedProduct = {
  id: string;
  slug: string;
  title: string;
  category: string;
  price: number;
  comparePriceUsd: number | null;
  priceLabel: string;
  comparePriceLabel: string | null;
  discountLabel: string | null;
  rating: string | null;
  image: string;
  inStock: boolean;
  defaultVariantId: string | null;
  labels: ProductLabel[];
};

async function fetchAverageRatings(
  productIds: string[],
): Promise<Map<string, number>> {
  if (productIds.length === 0) {
    return new Map();
  }

  try {
    const rows = await db.productReview.groupBy({
      by: ['productId'],
      where: {
        productId: { in: productIds },
        published: true,
      },
      _avg: { rating: true },
    });

    return new Map(
      rows.map((row) => [
        row.productId,
        row._avg.rating ?? 0,
      ]),
    );
  } catch {
    return new Map();
  }
}

async function fetchCatalogProducts(
  limit: number,
  filter?: string,
): Promise<CatalogProduct[]> {
  const result = await productsService.findAll({
    filter,
    limit,
    page: 1,
    lang: HOME_LANG,
    catalog: true,
  });
  return result.data as CatalogProduct[];
}

async function loadFeaturedCatalog(limit: number): Promise<CatalogProduct[]> {
  const featured = await fetchCatalogProducts(limit, 'featured');
  if (featured.length >= limit) {
    return featured.slice(0, limit);
  }

  const seen = new Set(featured.map((item) => item.id));
  const merged = [...featured];

  if (merged.length < limit) {
    const latest = await fetchCatalogProducts(limit * 2);
    for (const product of latest) {
      if (seen.has(product.id)) {
        continue;
      }
      merged.push(product);
      seen.add(product.id);
      if (merged.length >= limit) {
        break;
      }
    }
  }

  return merged.slice(0, limit);
}

async function loadHomeFeaturedProducts(): Promise<HomeFeaturedProduct[]> {
  try {
    const catalog = await loadFeaturedCatalog(HOME_FEATURED_LIMIT);
    const ratings = await fetchAverageRatings(catalog.map((item) => item.id));

    return catalog.map((product) =>
      mapToHomeFeaturedProduct(product, {
        ratingAverage: ratings.get(product.id),
        currency: 'AMD',
      }),
    );
  } catch {
    return [];
  }
}

const getHomeFeaturedProductsCached = unstable_cache(
  loadHomeFeaturedProducts,
  ['home-featured-products-v1'],
  {
    revalidate: HOME_FEATURED_REVALIDATE_SECONDS,
    tags: ['products', 'home-featured'],
  },
);

/**
 * Featured products for the home page (admin "featured" flag, with catalog fallback).
 * Cached for 60s; deduped within a single request.
 */
export const getHomeFeaturedProducts = cache(getHomeFeaturedProductsCached);
