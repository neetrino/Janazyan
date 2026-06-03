'use client';

import Link from 'next/link';
import type { HomeFeaturedProduct } from '../../lib/home/featured-products-data';
import { FeaturedProductCard } from './FeaturedProductCard';
import { HeroArrowButtonIcon } from './HeroArrowIcon';
import { MIRAGE_SECTION_HEADING_CLASS } from './mirage-heading-styles';
import { useTranslation } from '../../lib/i18n-client';

const SECTION_HEIGHT_PX = 772;
const CARD_WIDTH_PX = 283;
const CARD_GAP_PX = 30;
const FEATURED_CARDS_TOP_PX = 188;

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

  if (products.length === 0) {
    return null;
  }

  return (
    <section
      aria-label={t('home.featured.sectionAria')}
      className="relative w-full overflow-visible px-4 font-armenian sm:px-6 md:px-8 lg:px-[58px]"
    >
      <div
        className="relative mx-auto w-full max-w-[1470px] overflow-visible"
        style={{ minHeight: SECTION_HEIGHT_PX }}
      >
        <h2 className={`absolute left-1/2 top-[61px] w-full -translate-x-1/2 text-center ${MIRAGE_SECTION_HEADING_CLASS}`}>
          {t('home.featured.title')}
        </h2>

        <div
          className="absolute left-1/2 flex -translate-x-1/2 flex-nowrap items-center justify-center overflow-visible"
          style={{
            top: FEATURED_CARDS_TOP_PX,
            width: rowWidthForCount(products.length),
            gap: CARD_GAP_PX,
          }}
        >
          {products.map((product) => (
            <FeaturedProductCard key={product.id} product={product} />
          ))}
        </div>

        <div className="absolute left-1/2 top-[622px] -translate-x-1/2">
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
