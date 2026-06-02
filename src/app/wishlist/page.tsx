'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Button } from '@shop/ui';
import { apiClient } from '../../lib/api-client';
import { getStoredLanguage } from '../../lib/language';
import { useTranslation } from '../../lib/i18n-client';
import { ProductCard } from '../../components/ProductCard';

interface Product {
  id: string;
  slug: string;
  title: string;
  price: number;
  originalPrice: number | null;
  compareAtPrice: number | null;
  discountPercent: number | null;
  image: string | null;
  inStock: boolean;
  defaultVariantId?: string | null;
  brand: {
    id: string;
    name: string;
  } | null;
}

const WISHLIST_KEY = 'shop_wishlist';

function getWishlist(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const stored = localStorage.getItem(WISHLIST_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

/**
 * Wishlist page that shows saved products and supports lightweight CRUD actions.
 */
export default function WishlistPage() {
  const { t } = useTranslation();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  /**
   * Fetches wishlist products for provided ids and updates component state.
   */
  const fetchWishlistProducts = useCallback(async (idsToLoad: string[], options?: { silent?: boolean }) => {
    if (idsToLoad.length === 0) {
      setProducts([]);
      setLoading(false);
      return;
    }

    try {
      if (!options?.silent) {
        setLoading(true);
      }
      const languagePreference = getStoredLanguage();
      const response = await apiClient.get<{
        data: Product[];
        meta: {
          total: number;
          page: number;
          limit: number;
          totalPages: number;
        };
      }>('/api/v1/products', {
        params: {
          ids: idsToLoad.join(','),
          limit: String(idsToLoad.length),
          lang: languagePreference,
        },
      });

      const productById = new Map(response.data.map((product) => [product.id, product]));
      const wishlistProducts = idsToLoad
        .map((id) => productById.get(id))
        .filter((product): product is Product => product !== undefined);
      setProducts(wishlistProducts);

      const normalizedIds = wishlistProducts.map((product) => product.id);
      if (normalizedIds.length !== idsToLoad.length) {
        localStorage.setItem(WISHLIST_KEY, JSON.stringify(normalizedIds));
        window.dispatchEvent(new Event('wishlist-updated'));
      }
    } catch (error) {
      console.error('[Wishlist] Error fetching wishlist products:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchWishlistProducts(getWishlist());

    const handleWishlistUpdate = () => {
      fetchWishlistProducts(getWishlist(), { silent: true });
    };

    window.addEventListener('wishlist-updated', handleWishlistUpdate);
    return () => {
      window.removeEventListener('wishlist-updated', handleWishlistUpdate);
    };
  }, [fetchWishlistProducts]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">{t('common.wishlist.title')}</h1>

      {products.length > 0 ? (
        <>
          {/* Total Count Section */}
          <div className="px-6 py-4 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                <span className="text-base font-medium text-gray-700">
                  {t('common.wishlist.totalCount')}: <span className="font-bold text-gray-900">{products.length}</span>
                </span>
              </div>
            </div>
          </div>

          <div className="grid w-full grid-cols-2 justify-items-center gap-x-6 gap-y-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                viewMode="grid-3"
                product={{
                  id: product.id,
                  slug: product.slug,
                  title: product.title,
                  price: product.price,
                  image: product.image,
                  inStock: product.inStock,
                  brand: product.brand,
                  defaultVariantId: product.defaultVariantId ?? null,
                  compareAtPrice: product.compareAtPrice ?? undefined,
                  originalPrice: product.originalPrice ?? undefined,
                  discountPercent: product.discountPercent ?? undefined,
                }}
              />
            ))}
          </div>
        </>
      ) : (
        <div className="text-center py-16">
          <div className="max-w-md mx-auto">
            <svg
              className="mx-auto h-24 w-24 text-gray-400 mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {t('common.wishlist.empty')}
            </h2>
            <p className="text-gray-600 mb-6">
              {t('common.wishlist.emptyDescription')}
            </p>
            <Link href="/products">
              <Button variant="primary" size="lg">
                {t('common.buttons.browseProducts')}
              </Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
