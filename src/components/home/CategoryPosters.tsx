'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { CATEGORY_FIGMA_GRID_IDS } from './constants';
import {
  CATEGORY_POSTER_ARROW_HEIGHT_PX,
  CATEGORY_POSTER_ARROW_WIDTH_PX,
  CATEGORY_POSTER_CIRCLE_SIZE_PX,
} from './constants';
import { MIRAGE_CATEGORY_TITLE_CLASS } from './mirage-heading-styles';
import { useHomeCategoryPosters } from './use-home-i18n';
import { useTranslation } from '../../lib/i18n-client';
import { HOME_CATEGORY_GRID_INSET_CLASS } from '../../lib/layout/storefront-layout.constants';

const CATEGORY_IMAGE_CLASS: Record<
  (typeof CATEGORY_FIGMA_GRID_IDS)[number],
  string
> = {
  body: 'left-[29%] top-[-17%] h-[149%] w-[72%]',
  kids: 'left-[12%] top-[-19%] h-[137%] w-[88%]',
  hair: 'left-[28%] top-[-7%] h-[138%] w-[71%]',
  face: 'left-[22%] top-[-40%] h-[172%] w-[83%]',
};

const CATEGORY_BG_CLASS = {
  pink: 'bg-pink',
  sky: 'bg-sky',
  butter: 'bg-butter',
  sage: 'bg-sage',
  lavender: 'bg-lavender',
} as const;

const CARD_HEIGHT_CLASS = 'h-[434px] min-h-[434px]';

const CATEGORY_POSTER_CIRCLE = '/figma/category-poster-circle.svg';

function CategoryPosterArrow({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      aria-label={label}
      className="absolute bottom-[43px] right-[38px] z-10 flex size-[85px] items-center justify-center transition-transform duration-300 hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink-900"
    >
      <span className="relative flex size-[85.071px] items-center justify-center">
        <span className="relative flex size-16 rotate-[154.96deg] items-center justify-center">
          <Image
            src={CATEGORY_POSTER_CIRCLE}
            alt=""
            width={CATEGORY_POSTER_CIRCLE_SIZE_PX}
            height={CATEGORY_POSTER_CIRCLE_SIZE_PX}
            className="absolute inset-0 size-full"
          />
        </span>

        <span className="absolute inset-0 flex items-center justify-center -rotate-[2deg]">
          <ArrowUpRight
            aria-hidden
            width={CATEGORY_POSTER_ARROW_WIDTH_PX}
            height={CATEGORY_POSTER_ARROW_HEIGHT_PX}
            strokeWidth={2.8}
            className="text-[#93B6E3]"
          />
        </span>
      </span>
    </Link>
  );
}

export function CategoryPosters() {
  const { t } = useTranslation();
  const posters = useHomeCategoryPosters().filter((poster) =>
    (CATEGORY_FIGMA_GRID_IDS as readonly string[]).includes(poster.id),
  );

  return (
    <section
      aria-label={t('home.categories.sectionAria')}
      className="relative w-full bg-white pb-10 pt-10 md:pb-[30px] md:pt-[47px]"
    >
      <div
        className={`grid w-full grid-cols-2 gap-4 md:gap-[16px] ${HOME_CATEGORY_GRID_INSET_CLASS}`}
      >
        {posters.map((poster) => (
          <CategoryCard key={poster.id} poster={poster} />
        ))}
      </div>
    </section>
  );
}

function CategoryCard({
  poster,
}: {
  poster: ReturnType<typeof useHomeCategoryPosters>[number];
}) {
  const { t } = useTranslation();
  const imageClass =
    CATEGORY_IMAGE_CLASS[
      poster.id as (typeof CATEGORY_FIGMA_GRID_IDS)[number]
    ] ?? 'left-[20%] top-[-12%] h-[140%] w-[75%]';
  const categoryLabel = `${poster.title[0]} ${poster.title[1]}`.trim();

  return (
    <article
      className={[
        'group relative block overflow-hidden rounded-[24px]',
        CARD_HEIGHT_CLASS,
        CATEGORY_BG_CLASS[poster.color],
      ].join(' ')}
    >
      <div
        className={[
          'pointer-events-none absolute max-w-none',
          imageClass,
        ].join(' ')}
      >
        <Image
          src={poster.bottle}
          alt=""
          fill
          sizes="(max-width: 1280px) 50vw, 673px"
          className="object-cover object-center transition-transform duration-500 group-hover:-translate-y-1.5 group-hover:scale-[1.02]"
          priority={poster.id === 'body' || poster.id === 'kids'}
        />
      </div>

      <span className="absolute right-[2.53%] top-4 inline-flex h-[25px] items-center rounded-full bg-white/75 px-3 text-[10px] font-normal uppercase leading-[15px] tracking-[0.12em] text-ink-900 backdrop-blur-[6px]">
        {poster.tag}
      </span>

      <div className={`absolute left-[43px] top-[41px] ${MIRAGE_CATEGORY_TITLE_CLASS}`}>
        <span className="block">{poster.title[0]}</span>
        <span className="block">{poster.title[1]}</span>
      </div>

      <CategoryPosterArrow
        href={poster.href}
        label={`${categoryLabel} — ${t('common.footer.shop')}`}
      />
    </article>
  );
}
