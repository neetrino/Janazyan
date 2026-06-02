import Image from 'next/image';
import Link from 'next/link';
import { Globe, Menu, Phone, Search } from 'lucide-react';
import type { ReactNode } from 'react';
import {
  CATEGORY_BG,
  CATEGORY_FIGMA_GRID_IDS,
  CATEGORY_POSTERS,
  WHY_CARDS,
} from './constants';
import {
  MIRAGE_CATEGORY_TITLE_MOBILE_CLASS,
  MIRAGE_MOBILE_HERO_TITLE_CLASS,
} from './mirage-heading-styles';

const MOBILE_HERO_TITLE = CATEGORY_POSTERS.find((item) => item.id === 'hair')!.title;

type MobileFilter = {
  label: string;
  iconSrc?: string;
  iconClassName?: string;
};

const MOBILE_FILTERS: ReadonlyArray<MobileFilter> = [
  {
    label: 'Դեմք',
    iconSrc: '/figma/filter-face-icon.svg',
    iconClassName: 'h-4 w-4',
  },
  {
    label: 'Մազ',
    iconSrc: '/figma/filter-hair-icon.svg',
    iconClassName: 'h-4 w-4',
  },
  {
    label: 'Մարմին',
    iconSrc: '/figma/filter-body-icon.svg',
    iconClassName: 'h-4 w-4',
  },
  {
    label: 'Մանկական',
    iconSrc: '/figma/filter-kids-icon.svg',
    iconClassName: 'h-5 w-5',
  },
  { label: 'Արև' },
];

type HomeMobileFigmaProps = {
  featuredSlot: ReactNode;
};

export function HomeMobileFigma({ featuredSlot }: HomeMobileFigmaProps) {
  const mobileCategories = [...CATEGORY_FIGMA_GRID_IDS];
  const whyCards = WHY_CARDS.slice(0, 3);

  return (
    <section className="relative lg:hidden pb-28">
      <MobileBackdrop />
      <div className="relative z-10 px-3 pt-10">
        <MobileTopBar />
        <MobileHeroCard />
        <MobileFilterTabs />
        <MobileCategoryGrid categoryIds={mobileCategories} />
      </div>

      <div className="relative z-10 mt-8 rounded-t-[44px] bg-gradient-to-b from-sky to-pink px-3 pb-10 pt-9">
        {featuredSlot}
        <MobileWhyChooseUs cards={whyCards} />
      </div>
    </section>
  );
}

function MobileBackdrop() {
  return (
    <div className="absolute inset-0 -z-10 bg-[linear-gradient(139deg,#ecf5ff_2%,#e6cbd5_31%)]">
      <div className="absolute left-0 top-24 h-[84%] w-full rounded-t-[44px] bg-white" />
    </div>
  );
}

function MobileTopBar() {
  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        aria-label="Search"
        className="flex h-12 flex-1 items-center rounded-full bg-white px-4 text-ink-500 shadow-[0_4px_18px_rgba(30,41,57,0.08)]"
      >
        <Search className="h-5 w-5" />
      </button>
      <CircleButton label="Call">
        <Phone className="h-5 w-5" />
      </CircleButton>
      <CircleButton label="Language">
        <Globe className="h-5 w-5" />
      </CircleButton>
    </div>
  );
}

function CircleButton({
  children,
  label,
}: {
  children: React.ReactNode;
  label: string;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      className="grid h-12 w-12 place-items-center rounded-full bg-sky text-ink-500"
    >
      {children}
    </button>
  );
}

function MobileHeroCard() {
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
          {MOBILE_HERO_TITLE.map((line) => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
        </p>
        <Link
          href="/products?category=hair"
          className="inline-flex h-9 w-[217px] items-center justify-center gap-1 rounded-full bg-white px-4 text-[11px] font-semibold uppercase tracking-[0.15em] text-ink-800"
        >
          Պատվիրել — 32 400 ֏
          <Menu className="h-3.5 w-3.5" />
        </Link>
      </div>
    </div>
  );
}

function MobileFilterTabs() {
  return (
    <div className="mt-5 flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
      {MOBILE_FILTERS.map((filter, index) => (
        <button
          key={filter.label}
          type="button"
          className={[
            'shrink-0 inline-flex items-center gap-1.5 rounded-full px-4 py-3 text-[12px] font-medium leading-none',
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
          {filter.label}
        </button>
      ))}
    </div>
  );
}

function MobileCategoryGrid({ categoryIds }: { categoryIds: string[] }) {
  return (
    <div className="mt-4 grid grid-cols-2 gap-3">
      {categoryIds.map((id) => {
        const category = CATEGORY_POSTERS.find((item) => item.id === id);
        if (!category) return null;
        return <MobileCategoryCard key={category.id} categoryId={category.id} />;
      })}
    </div>
  );
}

function MobileCategoryCard({ categoryId }: { categoryId: string }) {
  const category = CATEGORY_POSTERS.find((item) => item.id === categoryId);
  if (!category) return null;

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

function MobileWhyChooseUs({ cards }: { cards: typeof WHY_CARDS }) {
  const [leftCard, topRightCard, bottomRightCard] = cards;
  if (!leftCard || !topRightCard || !bottomRightCard) {
    return null;
  }

  return (
    <div className="mt-8">
      <h2 className="text-[16px] font-bold text-white">Ինչու ընտրել մեզ</h2>
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
  card: (typeof WHY_CARDS)[number];
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
