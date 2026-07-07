import { cache } from 'react';
import { unstable_cache } from 'next/cache';
import type { ProductLabel } from '../../components/ProductLabels';
import { sanitizeStoredProductImageUrl } from '../products/resolve-stored-product-image-url';
import { productsFindService } from '../services/products-find.service';
import { fetchProductAverageRatings } from '../products/fetch-product-average-ratings';
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

async function fetchCatalogProducts(
  limit: number,
  filter?: string,
): Promise<CatalogProduct[]> {
  const result = await productsFindService.findAll({
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
  return featured.slice(0, limit);
}

async function loadHomeFeaturedProducts(): Promise<HomeFeaturedProduct[]> {
  try {
    const catalog = await loadFeaturedCatalog(HOME_FEATURED_LIMIT);
    const ratings = await fetchProductAverageRatings(catalog.map((item) => item.id));

    return catalog.map((product) =>
      mapToHomeFeaturedProduct(
        {
          ...product,
          image: sanitizeStoredProductImageUrl(product.image),
        },
        {
          ratingAverage: ratings.get(product.id),
          currency: 'AMD',
        },
      ),
    );
  } catch {
    return [];
  }
}

const getHomeFeaturedProductsCached = unstable_cache(
  loadHomeFeaturedProducts,
  ['home-featured-products-v2'],
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
