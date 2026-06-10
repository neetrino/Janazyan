'use client';

import { ProductCard } from '../../components/ProductCard';
import type { WishlistProductSnapshot } from '../../lib/wishlist/wishlist-types';

type WishlistProductGridProps = {
  products: WishlistProductSnapshot[];
  pendingCount: number;
};

const CATALOG_SLOT_SIZE =
  'h-[201px] w-[164px] sm:h-[250px] sm:w-[204px] md:h-[305px] md:w-[249px] lg:h-[347px] lg:w-[283px]';

/** Number of leading cards eagerly loaded (above-the-fold first row). */
const PRIORITY_CARD_COUNT = 4;

function WishlistProductCardSkeleton() {
  return (
    <div
      className={`animate-pulse rounded-2xl bg-neutral-200 ${CATALOG_SLOT_SIZE}`}
    />
  );
}

/**
 * Renders wishlist products using the same ProductCard as the catalog page.
 */
export function WishlistProductGrid({ products, pendingCount }: WishlistProductGridProps) {
  return (
    <div className="grid w-full grid-cols-2 justify-items-center gap-x-6 gap-y-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {products.map((product, index) => (
        <ProductCard
          key={product.id}
          product={{
            id: product.id,
            slug: product.slug,
            title: product.title,
            price: product.price,
            image: product.image,
            inStock: product.inStock,
            defaultVariantId: product.defaultVariantId,
            compareAtPrice: product.compareAtPrice ?? undefined,
            originalPrice: product.originalPrice ?? undefined,
            discountPercent: product.discountPercent ?? undefined,
            brand: product.brand,
          }}
          viewMode="grid-3"
          priority={index < PRIORITY_CARD_COUNT}
        />
      ))}
      {Array.from({ length: pendingCount }).map((_, index) => (
        <WishlistProductCardSkeleton key={`pending-${index}`} />
      ))}
    </div>
  );
}
