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

/** Layout box matching catalog scale so cards do not overlap in the grid. */
const CATALOG_SLOT_SIZE =
  'h-[201px] w-[164px] sm:h-[250px] sm:w-[204px] md:h-[305px] md:w-[249px] lg:h-[347px] lg:w-[283px]';

type FeaturedProductCardSlotProps = {
  product: HomeFeaturedProduct;
  scale?: FeaturedProductCardScale;
};

/**
 * Centers the Figma featured card and scales it for catalog, carousel, and mobile grids.
 */
export function FeaturedProductCardSlot({
  product,
  scale = 'catalog',
}: FeaturedProductCardSlotProps) {
  if (scale === 'catalog') {
    return (
      <div className={`relative shrink-0 overflow-visible ${CATALOG_SLOT_SIZE}`}>
        <div
          className={`absolute left-1/2 top-0 -translate-x-1/2 origin-top ${SCALE_CLASS.catalog}`}
        >
          <FeaturedProductCard product={product} />
        </div>
      </div>
    );
  }

  return (
    <div className="flex shrink-0 justify-center overflow-visible">
      <div className={`origin-top ${SCALE_CLASS[scale]}`}>
        <FeaturedProductCard product={product} />
      </div>
    </div>
  );
}
