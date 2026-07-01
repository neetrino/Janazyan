'use client';

import Link from 'next/link';
import { useTranslation } from '../../lib/i18n-client';
import { STOREFRONT_GLASS_PILL_BUTTON_CLASS } from '../products/[slug]/product-action-bar.constants';
import { WishlistProductGrid } from './WishlistProductGrid';
import { useWishlistProducts } from './useWishlistProducts';

/**
 * Wishlist page that shows saved products and supports lightweight CRUD actions.
 */
export default function WishlistPage() {
  const { t } = useTranslation();
  const { ids, products, pendingCount, isEmpty, isRefreshing } = useWishlistProducts();

  return (
    <div className="mx-auto max-w-7xl py-4 lg:px-8 lg:py-12">
      <div className="mb-8 flex items-center gap-3">
        <h1 className="text-3xl font-bold text-gray-900">{t('common.wishlist.title')}</h1>
        {isRefreshing ? (
          <span className="text-sm text-gray-500">{t('common.messages.loading')}</span>
        ) : null}
      </div>

      {!isEmpty ? (
        <>
          <div className="px-6 py-4 mb-6">
            <div className="flex items-center gap-3">
              <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              <span className="text-base font-medium text-gray-700">
                {t('common.wishlist.totalCount')}:{' '}
                <span className="font-bold text-gray-900">{ids.length}</span>
              </span>
            </div>
          </div>

          <WishlistProductGrid products={products} pendingCount={pendingCount} />
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
            <Link href="/products" className={STOREFRONT_GLASS_PILL_BUTTON_CLASS}>
              {t('common.buttons.browseProducts')}
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
