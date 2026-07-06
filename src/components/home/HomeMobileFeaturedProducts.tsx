'use client';

import Link from 'next/link';
import type { HomeFeaturedProduct } from '../../lib/home/featured-products-data';
import { FeaturedProductCardSlot } from './FeaturedProductCardSlot';
import {
  HOME_FEATURED_MOBILE_GRID_COUNT,
  HOME_FEATURED_TABLET_ROW_COUNT,
} from './home-featured-layout.constants';
import { useTranslation } from '../../lib/i18n-client';

type HomeMobileFeaturedProductsProps = {
  products: HomeFeaturedProduct[];
};

export function HomeMobileFeaturedProducts({
  products,
}: HomeMobileFeaturedProductsProps) {
  const { t } = useTranslation();

  if (products.length === 0) {
    return null;
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between text-white">
        <h2 className="text-[16px] font-bold tracking-[-0.01em]">
          {t('home.featured.mobile.title')}
        </h2>
        <Link
          href="/products?filter=featured"
          className="text-[13px] font-semibold uppercase"
        >
          {t('home.featured.mobile.viewAll')}
        </Link>
      </div>
      <div className="grid grid-cols-2 gap-x-1 gap-y-0 justify-items-center md:hidden">
        {products.slice(0, HOME_FEATURED_MOBILE_GRID_COUNT).map((product) => (
          <FeaturedProductCardSlot
            key={product.id}
            product={product}
            scale="mobile-grid"
          />
        ))}
      </div>
      <div className="hidden md:flex flex-nowrap items-start justify-center gap-2 lg:gap-3">
        {products.slice(0, HOME_FEATURED_TABLET_ROW_COUNT).map((product) => (
          <FeaturedProductCardSlot
            key={product.id}
            product={product}
            scale="catalog"
          />
        ))}
      </div>
    </div>
  );
}

export function HomeMobileFeaturedSkeleton() {
  return (
    <div aria-hidden className="animate-pulse">
      <div className="mb-4 flex items-center justify-between">
        <div className="h-4 w-32 rounded bg-white/30" />
        <div className="h-4 w-16 rounded bg-white/30" />
      </div>
      <div className="grid grid-cols-2 gap-x-1 gap-y-0 justify-items-center md:hidden">
        {Array.from({ length: HOME_FEATURED_MOBILE_GRID_COUNT }).map((_, index) => (
          <div
            key={index}
            className="relative h-[213px] w-[144px] overflow-hidden rounded-3xl bg-white/25"
          >
            <div className="absolute inset-x-3 top-3 h-24 rounded-2xl bg-white/30" />
            <div className="absolute inset-x-3 bottom-4 space-y-2">
              <div className="h-3 w-3/4 rounded bg-white/30" />
              <div className="h-3 w-1/2 rounded bg-white/30" />
            </div>
          </div>
        ))}
      </div>
      <div className="hidden md:flex flex-nowrap items-start justify-center gap-2 lg:gap-3">
        {Array.from({ length: HOME_FEATURED_TABLET_ROW_COUNT }).map((_, index) => (
          <div
            key={index}
            className="relative h-[361px] w-[249px] overflow-hidden rounded-3xl bg-white/25"
          >
            <div className="absolute inset-x-4 top-4 h-32 rounded-2xl bg-white/30" />
            <div className="absolute inset-x-4 bottom-6 space-y-2">
              <div className="h-3 w-3/4 rounded bg-white/30" />
              <div className="h-3 w-1/2 rounded bg-white/30" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
