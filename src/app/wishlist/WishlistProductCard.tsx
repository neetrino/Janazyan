'use client';

import { memo } from 'react';
import Link from 'next/link';
import { HOME_FEATURED_PRODUCT_FALLBACK_IMAGE } from '../../lib/home/map-to-home-featured-product';
import type { WishlistProductSnapshot } from '../../lib/wishlist/wishlist-types';

type WishlistProductCardProps = {
  product: WishlistProductSnapshot;
  priceLabel: string;
  comparePriceLabel: string | null;
  removeLabel: string;
  addToCartLabel: string;
  outOfStockLabel: string;
  isAddingToCart: boolean;
  onRemove: (productId: string) => void;
  onAddToCart: (product: WishlistProductSnapshot) => void;
};

/**
 * Lightweight wishlist card — no per-item hooks, instant paint from snapshot data.
 */
export const WishlistProductCard = memo(function WishlistProductCard({
  product,
  priceLabel,
  comparePriceLabel,
  removeLabel,
  addToCartLabel,
  outOfStockLabel,
  isAddingToCart,
  onRemove,
  onAddToCart,
}: WishlistProductCardProps) {
  const imageSrc = product.image ?? HOME_FEATURED_PRODUCT_FALLBACK_IMAGE;

  return (
    <article className="group relative flex w-full max-w-[283px] flex-col overflow-hidden rounded-2xl border border-black/5 bg-white shadow-sm">
      <button
        type="button"
        aria-label={removeLabel}
        onClick={() => onRemove(product.id)}
        className="absolute right-3 top-3 z-10 grid size-9 place-items-center rounded-full bg-white/90 text-red-600 shadow-sm transition-transform hover:scale-105"
      >
        <svg width={22} height={21} viewBox="0 0 24 23" fill="none" aria-hidden>
          <path
            d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7z"
            stroke="currentColor"
            strokeWidth={1.667}
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="currentColor"
          />
        </svg>
      </button>

      <Link
        href={`/products/${product.slug}`}
        className="flex h-52 items-end justify-center bg-[#f7f4ef] px-6 pt-8"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imageSrc}
          alt={product.title}
          loading="eager"
          decoding="async"
          className="max-h-44 w-auto object-contain object-bottom transition-transform duration-200 group-hover:scale-105"
        />
      </Link>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <Link
          href={`/products/${product.slug}`}
          className="line-clamp-2 min-h-[3rem] text-base font-medium leading-6 text-ink-800"
        >
          {product.title}
        </Link>

        {product.brand?.name ? (
          <p className="text-sm text-ink-800/50">{product.brand.name}</p>
        ) : null}

        <div className="mt-auto flex items-end justify-between gap-3">
          <div>
            <p className="text-xl font-black tracking-[-0.45px] text-ink-800">{priceLabel}</p>
            {comparePriceLabel ? (
              <p className="text-sm text-ink-800/70 line-through">{comparePriceLabel}</p>
            ) : null}
          </div>

          <button
            type="button"
            disabled={!product.inStock || isAddingToCart}
            onClick={() => onAddToCart(product)}
            className="rounded-full border border-black/10 px-3 py-2 text-sm font-medium text-ink-800 transition-colors hover:bg-green-600 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            {product.inStock
              ? isAddingToCart
                ? '...'
                : addToCartLabel
              : outOfStockLabel}
          </button>
        </div>
      </div>
    </article>
  );
});

export function WishlistProductCardSkeleton() {
  return (
    <div className="h-[420px] w-full max-w-[283px] animate-pulse rounded-2xl bg-neutral-200" />
  );
}
