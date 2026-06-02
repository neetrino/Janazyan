import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import {
  CATEGORY_FIGMA_GRID_IDS,
  CATEGORY_POSTERS,
  type CategoryPoster as Poster,
} from './constants';

const CATEGORY_IMAGE_CLASS: Record<
  (typeof CATEGORY_FIGMA_GRID_IDS)[number],
  string
> = {
  body: 'left-[29%] top-[-25%] h-[149%] w-[72%]',
  kids: 'left-[12%] top-[-27%] h-[137%] w-[88%]',
  hair: 'left-[28%] top-[-15%] h-[138%] w-[71%]',
  face: 'left-[22%] top-[-48%] h-[172%] w-[83%]',
};

const CATEGORY_BG_CLASS: Record<Poster['color'], string> = {
  pink: 'bg-pink',
  sky: 'bg-sky',
  butter: 'bg-butter',
  sage: 'bg-sage',
  lavender: 'bg-lavender',
};

const CARD_HEIGHT_CLASS = 'h-[434px] min-h-[434px]';

export function CategoryPosters() {
  const posters = CATEGORY_FIGMA_GRID_IDS.map((id) =>
    CATEGORY_POSTERS.find((poster) => poster.id === id),
  ).filter((poster): poster is Poster => poster !== undefined);

  return (
    <section
      aria-label="Categories"
      className="relative w-full bg-white px-4 pb-10 pt-10 sm:px-6 md:px-8 lg:px-0 md:pb-[30px] md:pt-[47px]"
    >
      <div className="mx-auto grid w-full max-w-[1472px] grid-cols-2 gap-4 md:gap-[16px]">
        {posters.map((poster) => (
          <CategoryCard key={poster.id} poster={poster} />
        ))}
      </div>
    </section>
  );
}

function CategoryCard({ poster }: { poster: Poster }) {
  const imageClass =
    CATEGORY_IMAGE_CLASS[
      poster.id as (typeof CATEGORY_FIGMA_GRID_IDS)[number]
    ] ?? 'left-[20%] top-[-20%] h-[140%] w-[75%]';

  return (
    <Link
      href={poster.href}
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

      <div className="absolute left-[43px] top-[41px] font-display text-[clamp(44px,5.1vw,75px)] leading-[45px] tracking-[-0.45px] text-ink-700">
        <span className="block">{poster.title[0]}</span>
        <span className="block">{poster.title[1]}</span>
      </div>

      <span
        aria-hidden
        className="absolute bottom-[43px] right-[38px] grid h-16 w-16 place-items-center rounded-full bg-white text-ink-800 shadow-soft transition-transform duration-300 group-hover:rotate-[15deg] group-hover:scale-105"
      >
        <ArrowUpRight className="h-5 w-5" strokeWidth={2.4} />
      </span>
    </Link>
  );
}
