'use client';

import type { HomeFeaturedProduct } from '../../lib/home/featured-products-data';
import { FeaturedProductCard } from './FeaturedProductCard';

export type FeaturedProductCardScale = 'full' | 'catalog' | 'mobile-grid' | 'carousel';

const SCALE_CLASS: Record<FeaturedProductCardScale, string> = {
  full: 'scale-100',
  catalog: 'scale-[0.58] sm:scale-[0.72] md:scale-[0.88] lg:scale-100',
  'mobile-grid': 'scale-[0.58]',
  carousel: 'scale-[0.72] sm:scale-[0.85] lg:scale-100',
};

/** Product bottle extends above the card — slot height includes that overflow at each breakpoint. */
const CATALOG_SLOT_SIZE =
  'h-[238px] w-[164px] sm:h-[296px] sm:w-[204px] md:h-[361px] md:w-[249px] lg:h-[411px] lg:w-[283px]';

const CATALOG_SLOT_CARD_TOP_CLASS =
  'top-[37px] sm:top-[46px] md:top-[56px] lg:top-[64px]';

/** scale 0.58 — image overflow (37px) + scaled card height (201px). */
const MOBILE_GRID_SLOT_SIZE = 'h-[238px] w-[164px]';
const MOBILE_GRID_SLOT_CARD_TOP_CLASS = 'top-[37px]';

type FeaturedProductCardSlotProps = {
  product: HomeFeaturedProduct;
  scale?: FeaturedProductCardScale;
  /** Eagerly load the product image (above-the-fold cards only). */
  priority?: boolean;
};

/**
 * Centers the Figma featured card and scales it for catalog, carousel, and mobile grids.
 */
export function FeaturedProductCardSlot({
  product,
  scale = 'catalog',
  priority = true,
}: FeaturedProductCardSlotProps) {
  if (scale === 'catalog') {
    return (
      <div className={`relative shrink-0 overflow-visible ${CATALOG_SLOT_SIZE}`}>
        <div
          className={`absolute left-1/2 -translate-x-1/2 origin-top ${CATALOG_SLOT_CARD_TOP_CLASS} ${SCALE_CLASS.catalog}`}
        >
          <FeaturedProductCard product={product} priority={priority} />
        </div>
      </div>
    );
  }

  if (scale === 'mobile-grid') {
    return (
      <div className={`relative shrink-0 overflow-visible ${MOBILE_GRID_SLOT_SIZE}`}>
        <div
          className={`absolute left-1/2 -translate-x-1/2 origin-top ${MOBILE_GRID_SLOT_CARD_TOP_CLASS} ${SCALE_CLASS['mobile-grid']}`}
        >
          <FeaturedProductCard product={product} priority={priority} />
        </div>
      </div>
    );
  }

  return (
    <div className="flex shrink-0 justify-center overflow-visible">
      <div className={`origin-top ${SCALE_CLASS[scale]}`}>
        <FeaturedProductCard product={product} priority={priority} />
      </div>
    </div>
  );
}
