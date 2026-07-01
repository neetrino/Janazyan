'use client';

import Image from 'next/image';
import Link from 'next/link';
import { getCategoryProductsHref } from '../../lib/categories/category-products-href';
import { Menu } from 'lucide-react';
import type { ReactNode } from 'react';
import { MobileBackdrop } from '../storefront/MobileBackdrop';
import { MobileTopBar } from './MobileTopBar';
import {
  CATEGORY_BG,
  CATEGORY_FIGMA_GRID_IDS,
} from './constants';
import {
  MIRAGE_CATEGORY_TITLE_MOBILE_CLASS,
  MIRAGE_MOBILE_HERO_TITLE_CLASS,
} from './mirage-heading-styles';
import { useHomeCategoryPosters, useHomeWhyCards } from './use-home-i18n';
import { useTranslation } from '../../lib/i18n-client';
import { STOREFRONT_HORIZONTAL_GUTTER_CLASS } from '../../lib/layout/storefront-layout.constants';
import { HOME_MOBILE_GRADIENT_BOTTOM_PADDING_CLASS } from '../../lib/layout/storefront-mobile-layout.constants';
import type { WhyCardConfig } from './constants';
import type { WhyCardText } from './use-home-i18n';

type MobileFilterKey = 'face' | 'hair' | 'body' | 'kids' | 'sun';

const MOBILE_FILTER_KEYS: ReadonlyArray<{
  key: MobileFilterKey;
  iconSrc?: string;
  iconClassName?: string;
}> = [
  { key: 'face', iconSrc: '/figma/filter-face-icon.svg', iconClassName: 'h-4 w-4' },
  { key: 'hair', iconSrc: '/figma/filter-hair-icon.svg', iconClassName: 'h-4 w-4' },
  { key: 'body', iconSrc: '/figma/filter-body-icon.svg', iconClassName: 'h-4 w-4' },
  { key: 'kids', iconSrc: '/figma/filter-kids-icon.svg', iconClassName: 'h-5 w-5' },
  { key: 'sun' },
];

type HomeMobileFigmaProps = {
  featuredSlot: ReactNode;
};

type WhyCardView = WhyCardConfig & WhyCardText;

export function HomeMobileFigma({ featuredSlot }: HomeMobileFigmaProps) {
  const categoryPosters = useHomeCategoryPosters();
  const whyCards = useHomeWhyCards().slice(0, 3);
  const hairCategory = categoryPosters.find((item) => item.id === 'hair');

  return (
    <section className="relative lg:hidden">
      <MobileBackdrop />
      <div className={`relative z-10 pt-10 ${STOREFRONT_HORIZONTAL_GUTTER_CLASS}`}>
        <MobileTopBar />
        <MobileHeroCard heroTitle={hairCategory?.title ?? ['', '']} />
        <MobileFilterTabs />
        <MobileCategoryGrid
          categoryIds={[...CATEGORY_FIGMA_GRID_IDS]}
          categoryPosters={categoryPosters}
        />
      </div>

      <div
        className={`relative z-10 mt-8 w-full rounded-t-[44px] bg-gradient-to-b from-sky to-pink pt-9 ${HOME_MOBILE_GRADIENT_BOTTOM_PADDING_CLASS}`}
      >
        <div className={STOREFRONT_HORIZONTAL_GUTTER_CLASS}>
          {featuredSlot}
          <MobileWhyChooseUs cards={whyCards} />
        </div>
      </div>
    </section>
  );
}

function MobileHeroCard({ heroTitle }: { heroTitle: [string, string] }) {
  const { t } = useTranslation();

  return (
    <div className="relative mt-6 h-[220px] overflow-hidden rounded-[40px] bg-[linear-gradient(148deg,#f5c8ce_0%,#bcd4ec_60%,#f19397_100%)]">
      <div className="absolute left-[146px] top-[-48px] h-[339px] w-[266px]">
        <Image
          src="/figma/promo-cosmetic.webp"
          alt=""
          fill
          sizes="266px"
          className="object-contain"
          priority
        />
      </div>
      <div className="absolute left-0 top-[29px] flex w-full flex-col gap-3 px-5 pt-5">
        <p className={MIRAGE_MOBILE_HERO_TITLE_CLASS}>
          {heroTitle.map((line) => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
        </p>
        <Link
          href="/products?category=hair"
          className="inline-flex h-9 w-[217px] items-center justify-center gap-1 rounded-full bg-white px-4 text-[11px] font-semibold uppercase tracking-[0.15em] text-ink-800"
        >
          {t('home.mobile.orderCta')}
          <Menu className="h-3.5 w-3.5" />
        </Link>
      </div>
    </div>
  );
}

function MobileFilterTabs() {
  const { t } = useTranslation();

  return (
    <div className="mt-5 flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
      {MOBILE_FILTER_KEYS.map((filter, index) => (
        <Link
          key={filter.key}
          href={getCategoryProductsHref(filter.key)}
          className={[
            'shrink-0 inline-flex items-center gap-1.5 rounded-full px-4 py-3 text-[12px] font-medium leading-none transition-opacity hover:opacity-90',
            index === 0 ? 'bg-ink-500 text-white' : 'bg-sky text-white',
          ].join(' ')}
        >
          {filter.iconSrc ? (
            <span className={`relative block ${filter.iconClassName ?? 'h-4 w-4'}`}>
              <Image
                src={filter.iconSrc}
                alt=""
                fill
                sizes="20px"
                className="object-contain"
              />
            </span>
          ) : null}
          {t(`home.mobile.filters.${filter.key}`)}
        </Link>
      ))}
    </div>
  );
}

function MobileCategoryGrid({
  categoryIds,
  categoryPosters,
}: {
  categoryIds: string[];
  categoryPosters: ReturnType<typeof useHomeCategoryPosters>;
}) {
  return (
    <div className="mt-4 grid grid-cols-2 gap-3">
      {categoryIds.map((id) => {
        const category = categoryPosters.find((item) => item.id === id);
        if (!category) return null;
        return <MobileCategoryCard key={category.id} category={category} />;
      })}
    </div>
  );
}

function MobileCategoryCard({
  category,
}: {
  category: ReturnType<typeof useHomeCategoryPosters>[number];
}) {
  return (
    <Link
      href={category.href}
      className="relative h-[170px] overflow-hidden rounded-3xl px-3 py-2"
      style={{ backgroundColor: CATEGORY_BG[category.color] }}
    >
      <span className="inline-flex rounded-full bg-white/65 px-2 py-1 text-[9px] uppercase text-ink-900">
        {category.tag}
      </span>
      <p className={`mt-3 ${MIRAGE_CATEGORY_TITLE_MOBILE_CLASS}`}>
        <span className="block">{category.title[0]}</span>
        <span className="block">{category.title[1]}</span>
      </p>
      <div className="absolute -bottom-2 right-0 h-[130px] w-[126px]">
        <Image
          src={category.bottle}
          alt=""
          fill
          sizes="126px"
          className="object-contain"
        />
      </div>
    </Link>
  );
}

function MobileWhyChooseUs({ cards }: { cards: WhyCardView[] }) {
  const { t } = useTranslation();
  const [leftCard, topRightCard, bottomRightCard] = cards;
  if (!leftCard || !topRightCard || !bottomRightCard) {
    return null;
  }

  return (
    <div className="mt-8">
      <h2 className="text-[16px] font-bold text-white">
        {t('home.whyChooseUs.titleMobile')}
      </h2>
      <div className="mt-3 grid grid-cols-2 gap-3">
        <WhyCard card={leftCard} className="row-span-2 h-[260px]" />
        <WhyCard card={topRightCard} className="h-[124px]" />
        <WhyCard card={bottomRightCard} className="h-[124px] bg-cream" compact />
      </div>
    </div>
  );
}

function WhyCard({
  card,
  className,
  compact = false,
}: {
  card: WhyCardView;
  className: string;
  compact?: boolean;
}) {
  return (
    <article className={`relative overflow-hidden rounded-3xl bg-white p-3 ${className}`}>
      {!compact && (
        <span
          className="pointer-events-none absolute bottom-[-26px] right-[-18px] text-[112px] font-black leading-none"
          style={{ color: card.numberColor }}
        >
          {card.number}
        </span>
      )}
      <p className="relative z-10 text-[9px] uppercase text-ink-500">{card.index}</p>
      <p className="relative z-10 mt-1 text-[17px] uppercase leading-[1.04] text-ink-900">
        <span className="block">{card.titleA}</span>
        <span className="block">{card.titleB}</span>
      </p>
      {!compact && (
        <p className="relative z-10 mt-2 text-[12px] leading-[1.3] text-ink-600">
          {card.description}
        </p>
      )}
    </article>
  );
}
