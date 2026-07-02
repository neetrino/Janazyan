'use client';

import Image from 'next/image';
import Link from 'next/link';
import { FeaturedProductCardActions } from './FeaturedProductCardActions.client';
import { FeaturedProductCardImage } from './FeaturedProductCardImage.client';
import { FeaturedProductCardPrice } from './FeaturedProductCardPrice.client';
import { ProductLabels } from '../ProductLabels';
import type { HomeFeaturedProduct } from '../../lib/home/featured-products-data';
import { primeProductPageSnapshot } from '@/lib/products/product-page-snapshot';

const CARD_WIDTH_PX = 283;
const CARD_HEIGHT_PX = 347;
const CARD_BODY_TOP_PX = 47;
const PRODUCT_IMAGE_WIDTH_PX = 62;
const PRODUCT_IMAGE_HEIGHT_PX = 255;
const PRODUCT_IMAGE_TOP_PX = -42;
const PRODUCT_TITLE_TOP_PX = 234;

const FEATURED_CART_ICON_LEFT_RATIO = 0.7951;
const FEATURED_CART_ICON_RIGHT_RATIO = 0.0691;
const FEATURED_CART_ICON_TOP_PX = 289;
const FEATURED_CART_ICON_SIZE_PX = Math.round(
  CARD_WIDTH_PX * (1 - FEATURED_CART_ICON_LEFT_RATIO - FEATURED_CART_ICON_RIGHT_RATIO),
);

const FEATURED_CARD_BG = '/figma/featured-card-bg.svg';
const FEATURED_CARD_CART_CORNER = '/figma/featured-card-cart-corner.svg';
const FEATURED_STAR_ICON = '/figma/featured-star.svg';

export type FeaturedProductCardProps = {
  product: HomeFeaturedProduct;
  /** Eagerly load the product image; lazy-load when false. */
  priority?: boolean;
};

export function FeaturedProductCard({ product, priority = true }: FeaturedProductCardProps) {
  const productHref = `/products/${product.slug}`;
  const handleProductNavigate = () => {
    primeProductPageSnapshot({
      slug: product.slug,
      title: product.title,
      image: product.image,
      price: product.price,
      originalPrice: product.comparePriceUsd ?? null,
      compareAtPrice: product.comparePriceUsd ?? null,
      discountPercent: null,
    });
  };

  return (
    <article
      className="group relative shrink-0 overflow-visible"
      style={{ width: CARD_WIDTH_PX, height: CARD_HEIGHT_PX }}
    >
      <Link
        href={productHref}
        aria-label={product.title}
        className="absolute inset-0 z-[15] rounded-[26px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink-900"
        onClick={handleProductNavigate}
      />

      <Link
        href={productHref}
        data-product-fly-origin
        className="absolute left-1/2 z-30 block -translate-x-1/2 transition-transform duration-300 ease-out group-hover:-translate-y-4 group-hover:scale-110"
        onClick={handleProductNavigate}
        style={{
          top: PRODUCT_IMAGE_TOP_PX,
          width: PRODUCT_IMAGE_WIDTH_PX,
          height: PRODUCT_IMAGE_HEIGHT_PX,
        }}
      >
        <FeaturedProductCardImage
          src={product.image}
          alt={product.title}
          priority={priority}
        />
      </Link>

      {product.labels.length > 0 ? (
        <ProductLabels labels={product.labels} variant="featured" />
      ) : product.discountLabel ? (
        <span className="absolute left-[13px] top-[63px] z-20 inline-flex h-[33px] min-w-[70px] items-center justify-center rounded-[20px] bg-sale px-3 text-[14px] font-medium tracking-[-0.5px] text-cream">
          {product.discountLabel}
        </span>
      ) : null}

      <FeaturedProductCardActions
        product={{
          id: product.id,
          slug: product.slug,
          title: product.title,
          image: product.image,
          inStock: product.inStock,
          defaultVariantId: product.defaultVariantId,
          price: product.price,
          compareAtPrice: product.comparePriceUsd,
          brand: null,
        }}
      />

      <div
        className="absolute inset-x-0 bottom-0 overflow-hidden rounded-[26px] bg-cream"
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

      <span
        className="pointer-events-none absolute left-[15px] right-[43px] z-20 line-clamp-2 text-[16px] font-medium leading-[21px] text-ink-800"
        style={{ top: PRODUCT_TITLE_TOP_PX }}
      >
        {product.title}
      </span>

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

      <FeaturedProductCardPrice
        price={product.price}
        comparePrice={product.comparePriceUsd}
      />

    </article>
  );
}
