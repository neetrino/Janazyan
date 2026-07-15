'use client';

import Image from 'next/image';
import Link from 'next/link';
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
import {
  STOREFRONT_HORIZONTAL_GUTTER_CLASS,
  STOREFRONT_SIDE_PADDING_NEG_CLASS,
  STOREFRONT_TABLET_DOWN_CLASS,
} from '../../lib/layout/storefront-layout.constants';
import {
  HOME_MOBILE_GRADIENT_BOTTOM_PADDING_CLASS,
  STOREFRONT_MOBILE_TOP_INSET_CLASS,
  STOREFRONT_MOBILE_HEADER_CHROME_Z_INDEX_CLASS,
} from '../../lib/layout/storefront-mobile-layout.constants';
import { CategoryFilterDropdownProvider } from '../CategoryNavigation/CategoryFilterDropdownContext';
import { MobileOurStoresBanner } from './MobileOurStoresBanner';
import type { WhyCardConfig } from './constants';
import type { WhyCardText } from './use-home-i18n';

/** Full-bleed category pills — cancels page gutter so the row is not clipped on the sides. */
const HOME_MOBILE_CATEGORY_FILTERS_SLOT_CLASS =
  `mt-5 ${STOREFRONT_SIDE_PADDING_NEG_CLASS} w-auto max-w-none`;

type HomeMobileFigmaProps = {
  featuredSlot: ReactNode;
  /** Server-rendered `/products`-style category pills (DB tree). */
  categoryFiltersSlot: ReactNode;
};

type WhyCardView = WhyCardConfig & WhyCardText;
const MOBILE_HERO_CTA_ARROW_SIZE_PX = 12;

export function HomeMobileFigma({
  featuredSlot,
  categoryFiltersSlot,
}: HomeMobileFigmaProps) {
  const categoryPosters = useHomeCategoryPosters();
  const whyCards = useHomeWhyCards().slice(0, 3);
  const hairCategory = categoryPosters.find((item) => item.id === 'hair');

  return (
    <section className={`relative ${STOREFRONT_TABLET_DOWN_CLASS}`}>
      <MobileBackdrop />
      <div
        className={`relative ${STOREFRONT_MOBILE_HEADER_CHROME_Z_INDEX_CLASS} ${STOREFRONT_MOBILE_TOP_INSET_CLASS} ${STOREFRONT_HORIZONTAL_GUTTER_CLASS}`}
      >
        <MobileTopBar />
        <MobileHeroCard heroTitle={hairCategory?.title ?? ['', '']} />
        <CategoryFilterDropdownProvider>
          <div className={HOME_MOBILE_CATEGORY_FILTERS_SLOT_CLASS}>
            {categoryFiltersSlot}
          </div>
        </CategoryFilterDropdownProvider>
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
          <MobileOurStoresBanner />
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
          className="relative inline-flex h-9 w-[217px] items-center justify-center rounded-full bg-white px-4 text-[11px] font-semibold uppercase tracking-[0.15em] text-ink-800"
        >
          <span>{t('home.mobile.orderCta')}</span>
          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
            <MobileHeroCtaArrowIcon />
          </span>
        </Link>
      </div>
    </div>
  );
}

function MobileHeroCtaArrowIcon() {
  return (
    <svg
      width={MOBILE_HERO_CTA_ARROW_SIZE_PX}
      height={MOBILE_HERO_CTA_ARROW_SIZE_PX}
      viewBox="0 0 12 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        d="M2.5 6H9.5M6 2.5L9.5 6L6 9.5"
        stroke="#1E2939"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
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
