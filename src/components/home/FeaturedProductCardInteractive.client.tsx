'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import type { MouseEvent } from 'react';
import { formatPrice } from '../../lib/currency';
import { useAuth } from '../../lib/auth/AuthContext';
import { useTranslation } from '../../lib/i18n-client';
import { useAddToCart } from '../hooks/useAddToCart';
import { useCurrency } from '../hooks/useCurrency';
import { useWishlist } from '../hooks/useWishlist';

const FEATURED_CART_ICON_LEFT_RATIO = 0.7951;
const FEATURED_CART_ICON_RIGHT_RATIO = 0.0691;
const FEATURED_CART_ICON_TOP_PX = 289;
const CARD_WIDTH_PX = 283;
const FEATURED_CART_ICON_SIZE_PX = Math.round(
  CARD_WIDTH_PX * (1 - FEATURED_CART_ICON_LEFT_RATIO - FEATURED_CART_ICON_RIGHT_RATIO),
);
const FEATURED_CART_ICON = '/figma/featured-cart.svg';
const FEATURED_HEART_STROKE_WIDTH = 1.667;
const FEATURED_HEART_PATH =
  'M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7z';

type FeaturedProductCardInteractiveProps = {
  product: {
    id: string;
    slug: string;
    title: string;
    image: string;
    inStock: boolean;
    defaultVariantId: string | null;
    price: number;
    compareAtPrice: number | null;
    brand: { id: string; name: string } | null;
  };
  initialPriceLabel: string;
  initialComparePriceLabel: string | null;
};

export function FeaturedProductCardInteractive({
  product,
  initialPriceLabel,
  initialComparePriceLabel,
}: FeaturedProductCardInteractiveProps) {
  const router = useRouter();
  const { isLoggedIn } = useAuth();
  const { t } = useTranslation();
  const currency = useCurrency();
  const { isInWishlist, toggleWishlist } = useWishlist(product.id);
  const { addToCart } = useAddToCart({
    productId: product.id,
    productSlug: product.slug,
    productTitle: product.title,
    productImage: product.image,
    inStock: product.inStock,
    defaultVariantId: product.defaultVariantId,
    price: product.price,
  });

  const priceLabel = formatPrice(product.price, currency);
  const comparePriceLabel =
    product.compareAtPrice != null ? formatPrice(product.compareAtPrice, currency) : null;

  const handleWishlist = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    if (!isLoggedIn) {
      router.push('/login?redirect=/products');
      return;
    }
    toggleWishlist({
      id: product.id,
      slug: product.slug,
      title: product.title,
      price: product.price,
      originalPrice: product.compareAtPrice,
      compareAtPrice: product.compareAtPrice,
      discountPercent: null,
      image: product.image,
      inStock: product.inStock,
      defaultVariantId: product.defaultVariantId,
      brand: product.brand,
    });
  };

  const handleAddToCart = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    addToCart({ clickTarget: event.currentTarget, imageUrl: product.image });
  };

  return (
    <>
      <button
        type="button"
        aria-label={
          isInWishlist
            ? t('common.ariaLabels.removeFromWishlist')
            : t('common.ariaLabels.addToWishlist')
        }
        aria-pressed={isInWishlist}
        onClick={handleWishlist}
        className={`absolute left-[235px] top-[62px] z-20 grid size-9 place-items-center transition-transform hover:scale-105 ${
          isInWishlist ? 'text-red-600' : 'text-[#4a5565]'
        }`}
      >
        <svg
          width={24}
          height={23}
          viewBox="0 0 24 23"
          fill="none"
          aria-hidden
          className="block"
        >
          <path
            d={FEATURED_HEART_PATH}
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={FEATURED_HEART_STROKE_WIDTH}
            fill={isInWishlist ? 'currentColor' : 'none'}
          />
        </svg>
      </button>

      <button
        type="button"
        aria-label={t('common.ariaLabels.addToCart')}
        disabled={!product.inStock}
        onClick={handleAddToCart}
        className="absolute z-20 grid place-items-center transition-transform hover:scale-105 disabled:opacity-50"
        style={{
          left: `${FEATURED_CART_ICON_LEFT_RATIO * 100}%`,
          top: FEATURED_CART_ICON_TOP_PX,
          width: FEATURED_CART_ICON_SIZE_PX,
          height: FEATURED_CART_ICON_SIZE_PX,
        }}
      >
        <Image
          src={FEATURED_CART_ICON}
          alt=""
          width={FEATURED_CART_ICON_SIZE_PX}
          height={FEATURED_CART_ICON_SIZE_PX}
        />
      </button>

      <p
        className="absolute left-[15px] top-[307px] z-10 text-[23px] font-black leading-7 tracking-[-0.45px] text-ink-800"
        suppressHydrationWarning
      >
        {priceLabel}
      </p>

      {comparePriceLabel ?? initialComparePriceLabel ? (
        <p
          className="absolute left-[120px] top-[309px] z-10 text-[16px] leading-7 text-ink-800/70 line-through"
          suppressHydrationWarning
        >
          {comparePriceLabel ?? initialComparePriceLabel}
        </p>
      ) : null}
    </>
  );
}
