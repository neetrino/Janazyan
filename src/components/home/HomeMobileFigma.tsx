import Image from 'next/image';
import Link from 'next/link';
import { Globe, Menu, Phone, Search, ShoppingCart, Star } from 'lucide-react';
import { CATEGORY_BG, CATEGORY_POSTERS, FEATURED_PRODUCTS, WHY_CARDS } from './constants';

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

export function HomeMobileFigma() {
  const mobileCategories = CATEGORY_POSTERS.slice(0, 4);
  const whyCards = WHY_CARDS.slice(0, 3);

  return (
    <section className="relative lg:hidden pb-28">
      <MobileBackdrop />
      <div className="relative z-10 px-3 pt-10">
        <MobileTopBar />
        <MobileHeroCard />
        <MobileFilterTabs />
        <MobileCategoryGrid categoryIds={mobileCategories.map((category) => category.id)} />
      </div>

      <div className="relative z-10 mt-8 rounded-t-[44px] bg-gradient-to-b from-sky to-pink px-3 pb-10 pt-9">
        <MobileFeaturedProducts />
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
    <div className="relative mt-6 h-[218px] overflow-hidden rounded-[32px] bg-[linear-gradient(149deg,#f5c8ce_0%,#bcd4ec_60%,#f19397_100%)]">
      <div className="absolute -right-8 -top-8 h-[290px] w-[248px]">
        <Image
          src="/figma/promo-cosmetic.png"
          alt=""
          fill
          sizes="248px"
          className="object-contain"
        />
      </div>
      <div className="relative z-10 px-4 pb-5 pt-6">
        <p className="font-display text-[44px] leading-[0.78] tracking-[-0.02em] text-white">
          <span className="block">Մազերի</span>
          <span className="block">խնամք</span>
        </p>
        <Link
          href="/products?category=hair"
          className="mt-6 inline-flex h-9 items-center gap-1 rounded-full bg-white px-4 text-[11px] font-semibold uppercase tracking-[0.12em] text-ink-800"
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
      <p className="mt-3 font-display text-[30px] leading-[0.8] text-ink-700">
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

function MobileFeaturedProducts() {
  return (
    <div>
      <div className="mb-4 flex items-center justify-between text-white">
        <h2 className="text-[16px] font-bold tracking-[-0.01em]">Հայտնի Ապրանքներ</h2>
        <Link href="/products" className="text-[13px] font-semibold uppercase">
          Բոլորը
        </Link>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {FEATURED_PRODUCTS.slice(0, 4).map((product) => (
          <article key={product.id} className="relative rounded-3xl bg-white p-3">
            <div className="relative mx-auto h-[128px] w-[106px]">
              <Image
                src={product.image}
                alt={product.title}
                fill
                sizes="106px"
                className="object-contain"
              />
            </div>
            <p className="mt-2 line-clamp-2 text-[13px] font-semibold leading-[1.25] text-ink-800">
              {product.title}
            </p>
            <div className="mt-1 flex items-center gap-1 text-[13px] text-ink-800">
              <Star className="h-4 w-4 fill-[#ffb339] text-[#ffb339]" />
              <span>{product.rating}</span>
            </div>
            <p className="mt-1 text-[22px] font-black leading-none text-ink-800">
              {product.price}
            </p>
            <button
              type="button"
              aria-label="Add to cart"
              className="absolute bottom-3 right-3 grid h-9 w-9 place-items-center rounded-full bg-cream text-ink-800"
            >
              <ShoppingCart className="h-4 w-4" />
            </button>
          </article>
        ))}
      </div>
    </div>
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
