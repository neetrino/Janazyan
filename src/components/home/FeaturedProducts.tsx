'use client';

import Link from 'next/link';
import type { HomeFeaturedProduct } from '../../lib/home/featured-products-data';
import { FeaturedProductCard } from './FeaturedProductCard';
import { HeroArrowButtonIcon } from './HeroArrowIcon';
import { MIRAGE_SECTION_HEADING_CLASS } from './mirage-heading-styles';
import { useTranslation } from '../../lib/i18n-client';
import { SECTION_CARD_ROW_INSET_CLASS } from '../../lib/layout/storefront-layout.constants';
import { useFeaturedRowScale } from './useFeaturedRowScale';

const SECTION_HEIGHT_PX = 772;
const CARD_WIDTH_PX = 283;
const CARD_GAP_PX = 30;
const FEATURED_CARDS_TOP_PX = 174;
/** Allow the fixed-width row to grow gently on wide arcs, matching the ~1.22x widening. */
const FEATURED_ROW_MAX_SCALE = 1.18;
/** Product bottle extends above the card body — row needs headroom so it is not clipped. */
const FEATURED_CARD_IMAGE_OVERFLOW_TOP_PX = 64;

type FeaturedProductsProps = {
  products: HomeFeaturedProduct[];
};

function rowWidthForCount(count: number): number {
  if (count <= 0) {
    return 0;
  }
  return CARD_WIDTH_PX * count + CARD_GAP_PX * Math.max(0, count - 1);
}

export function FeaturedProducts({ products }: FeaturedProductsProps) {
  const { t } = useTranslation();
  const rowWidth = rowWidthForCount(products.length);
  const { containerRef, scale } = useFeaturedRowScale(rowWidth, FEATURED_ROW_MAX_SCALE);

  if (products.length === 0) {
    return null;
  }

  return (
    <section
      aria-label={t('home.featured.sectionAria')}
      className="relative w-full overflow-x-hidden font-armenian"
    >
      <div
        className="relative w-full overflow-visible"
        style={{ minHeight: SECTION_HEIGHT_PX }}
      >
        <h2 className={`absolute left-1/2 top-[61px] w-full -translate-x-1/2 text-center ${MIRAGE_SECTION_HEADING_CLASS}`}>
          {t('home.featured.title')}
        </h2>

        <div
          ref={containerRef}
          className={`absolute inset-x-0 flex justify-center overflow-visible ${SECTION_CARD_ROW_INSET_CLASS}`}
          style={{
            top: FEATURED_CARDS_TOP_PX - FEATURED_CARD_IMAGE_OVERFLOW_TOP_PX,
            paddingTop: FEATURED_CARD_IMAGE_OVERFLOW_TOP_PX,
          }}
        >
          <div
            className="flex flex-nowrap items-center origin-top"
            style={{
              gap: CARD_GAP_PX,
              width: rowWidth,
              transform: `scale(${scale})`,
            }}
          >
            {products.map((product) => (
              <FeaturedProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>

        <div className="absolute left-1/2 top-[608px] -translate-x-1/2">
          <Link
            href="/products?filter=featured"
            className="inline-flex h-[56px] items-center gap-1 rounded-[72px] bg-white px-6 text-[18px] font-bold leading-6 text-sky-deep transition-transform duration-700 ease-in-out hover:-translate-y-0.5"
          >
            {t('home.featured.cta')}
            <HeroArrowButtonIcon />
          </Link>
        </div>
      </div>
    </section>
  );
}
