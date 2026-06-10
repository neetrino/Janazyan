'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { memo, type MouseEvent } from 'react';
import { useAuth } from '../../lib/auth/AuthContext';
import { useAddToCart } from '../hooks/useAddToCart';
import { useCurrency } from '../hooks/useCurrency';
import { useWishlist } from '../hooks/useWishlist';
import { useTranslation } from '../../lib/i18n-client';
import { formatPrice } from '../../lib/currency';
import { ProductLabels } from '../ProductLabels';
import type { HomeFeaturedProduct } from '../../lib/home/featured-products-data';
import { snapshotFromFeaturedProduct } from '../../lib/wishlist/wishlist-snapshot-builders';

const CARD_WIDTH_PX = 283;
const CARD_HEIGHT_PX = 347;
const CARD_BODY_TOP_PX = 47;
const PRODUCT_IMAGE_WIDTH_PX = 62;
const PRODUCT_IMAGE_HEIGHT_PX = 255;
const PRODUCT_IMAGE_TOP_PX = -64;

const FEATURED_CART_ICON_LEFT_RATIO = 0.7951;
const FEATURED_CART_ICON_RIGHT_RATIO = 0.0691;
const FEATURED_CART_ICON_TOP_PX = 289;
const FEATURED_CART_ICON_SIZE_PX = Math.round(
  CARD_WIDTH_PX * (1 - FEATURED_CART_ICON_LEFT_RATIO - FEATURED_CART_ICON_RIGHT_RATIO),
);

const FEATURED_CARD_BG = '/figma/featured-card-bg.svg';
const FEATURED_CARD_CART_CORNER = '/figma/featured-card-cart-corner.svg';
const FEATURED_STAR_ICON = '/figma/featured-star.svg';
const FEATURED_CART_ICON = '/figma/featured-cart.svg';

const FEATURED_HEART_STROKE_WIDTH = 1.667;
const FEATURED_HEART_PATH =
  'M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7z';

type FeaturedProductCardProps = {
  product: HomeFeaturedProduct;
  /** Eagerly load the product image; lazy-load when false. */
  priority?: boolean;
};

function FeaturedProductCardComponent({ product, priority = true }: FeaturedProductCardProps) {
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
    defaultVariantId: product.defaultVariantId ?? undefined,
    price: product.price,
  });

  const priceLabel = formatPrice(product.price, currency);
  const comparePriceLabel =
    product.comparePriceUsd != null
      ? formatPrice(product.comparePriceUsd, currency)
      : null;

  const handleWishlist = (event: MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    if (!isLoggedIn) {
      router.push('/login?redirect=/');
      return;
    }
    toggleWishlist(snapshotFromFeaturedProduct(product));
  };

  const handleAddToCart = (event: MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    addToCart({ clickTarget: event.currentTarget, imageUrl: product.image });
  };

  return (
    <article
      className="group relative shrink-0 overflow-visible"
      style={{ width: CARD_WIDTH_PX, height: CARD_HEIGHT_PX }}
    >
      <Link
        href={`/products/${product.slug}`}
        data-product-fly-origin
        className="absolute left-1/2 z-30 block -translate-x-1/2 transition-transform duration-300 ease-out group-hover:-translate-y-4 group-hover:scale-110"
        style={{
          top: PRODUCT_IMAGE_TOP_PX,
          width: PRODUCT_IMAGE_WIDTH_PX,
          height: PRODUCT_IMAGE_HEIGHT_PX,
        }}
      >
        <Image
          src={product.image}
          alt={product.title}
          fill
          sizes="112px"
          className="object-contain object-bottom"
          priority={priority}
          loading={priority ? undefined : 'lazy'}
        />
      </Link>

      {product.labels.length > 0 ? (
        <ProductLabels labels={product.labels} variant="featured" />
      ) : product.discountLabel ? (
        <span className="absolute left-[13px] top-[63px] z-20 inline-flex h-[33px] min-w-[70px] items-center justify-center rounded-[20px] bg-[#e05d5d] px-3 text-[14px] font-medium tracking-[-0.5px] text-cream">
          {product.discountLabel}
        </span>
      ) : null}

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

      <div
        className="absolute inset-x-0 bottom-0"
        style={{ top: CARD_BODY_TOP_PX }}
      >
        <div className="absolute inset-0 rotate-180 overflow-visible">
          <img
            src={FEATURED_CARD_BG}
            alt=""
            className="block h-full w-full max-w-none"
          />
        </div>

        <div className="absolute bottom-0 left-[73.58%] right-0 top-[77.44%] z-10">
          <img
            src={FEATURED_CARD_CART_CORNER}
            alt=""
            className="block h-full w-full max-w-none object-fill"
          />
        </div>
      </div>

      <Link
        href={`/products/${product.slug}`}
        className="absolute left-[15px] right-[43px] top-[212px] z-10 line-clamp-2 text-[16px] font-medium leading-[21px] text-ink-800"
      >
        {product.title}
      </Link>

      {product.category ? (
        <p className="absolute left-[15px] top-[259px] z-10 text-[16px] font-medium leading-[21px] text-ink-800/50">
          {product.category}
        </p>
      ) : null}

      {product.rating ? (
        <div className="absolute left-[14px] top-[280px] z-10 flex items-center gap-2">
          <Image src={FEATURED_STAR_ICON} alt="" width={18} height={19} />
          <span className="text-[16px] leading-5 tracking-[-0.15px] text-ink-800">
            {product.rating}
          </span>
        </div>
      ) : null}

      <p className="absolute left-[15px] top-[307px] z-10 text-[23px] font-black leading-7 tracking-[-0.45px] text-ink-800">
        {priceLabel}
      </p>

      {comparePriceLabel ? (
        <p className="absolute left-[120px] top-[309px] z-10 text-[16px] leading-7 text-ink-800/70 line-through">
          {comparePriceLabel}
        </p>
      ) : null}

      <button
        type="button"
        aria-label="Add to cart"
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
    </article>
  );
}

export const FeaturedProductCard = memo(FeaturedProductCardComponent);
