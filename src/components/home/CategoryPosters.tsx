import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import {
  CATEGORY_POSTERS,
  type CategoryPoster as Poster,
} from './constants';

const TOP_ROW_IDS = new Set(['kids', 'hair', 'body']);

const CATEGORY_IMAGE_CLASS: Record<Poster['id'], string> = {
  kids: 'left-[-3.38%] top-[13.68%] h-[86.31%] w-[106.76%]',
  hair: 'left-[-3.38%] top-[15.84%] h-[86.31%] w-[106.76%]',
  body: 'left-[-3.38%] top-[13.68%] h-[86.31%] w-[106.76%]',
  face: 'left-[25.11%] top-0 h-[110.37%] w-[70.43%]',
  adult: 'left-[27.04%] top-[9.43%] h-[110.37%] w-[70.43%]',
};

const CATEGORY_TITLE_CLASS: Record<Poster['id'], string> = {
  kids: 'left-[28px] top-[41px]',
  hair: 'left-[25px] top-[50px]',
  body: 'left-[25px] top-[50px]',
  face: 'left-[43px] top-[41px]',
  adult: 'left-[36px] top-[41px]',
};

const CATEGORY_BG_CLASS: Record<Poster['color'], string> = {
  pink: 'bg-pink',
  sky: 'bg-sky',
  butter: 'bg-butter',
  sage: 'bg-sage',
  lavender: 'bg-lavender',
};

const CATEGORY_CTA_CLASS: Record<Variant, string> = {
  square: 'bottom-[27px] right-8',
  wide: 'bottom-[43px] right-[38px]',
};

export function CategoryPosters() {
  const top = CATEGORY_POSTERS.filter((p) => TOP_ROW_IDS.has(p.id));
  const bottom = CATEGORY_POSTERS.filter((p) => !TOP_ROW_IDS.has(p.id));

  return (
    <section
      aria-label="Categories"
      className="relative w-full bg-white px-4 pb-10 pt-10 sm:px-6 md:px-8 lg:px-[58px] md:pb-[30px] md:pt-[47px]"
    >
      <div className="mx-auto w-full space-y-6 md:space-y-[16px]">
        <div className="grid gap-6 md:gap-[16px] sm:grid-cols-2 lg:grid-cols-3">
          {top.map((poster) => (
            <CategoryCard key={poster.id} poster={poster} variant="square" />
          ))}
        </div>
        <div className="grid gap-6 md:gap-[16px] sm:grid-cols-1 lg:grid-cols-2">
          {bottom.map((poster) => (
            <CategoryCard key={poster.id} poster={poster} variant="wide" />
          ))}
        </div>
      </div>
    </section>
  );
}

type Variant = 'square' | 'wide';

function CategoryCard({
  poster,
  variant,
}: {
  poster: Poster;
  variant: Variant;
}) {
  const aspectClass =
    variant === 'wide' ? 'aspect-[673/434]' : 'aspect-[444/555]';

  return (
    <Link
      href={poster.href}
      className={[
        'group relative block overflow-hidden rounded-[24px]',
        aspectClass,
        CATEGORY_BG_CLASS[poster.color],
      ].join(' ')}
    >
      <div
        className={[
          'pointer-events-none absolute max-w-none',
          CATEGORY_IMAGE_CLASS[poster.id],
        ].join(' ')}
      >
        <Image
          src={poster.bottle}
          alt=""
          fill
          sizes="(max-width: 1024px) 50vw, 33vw"
          className="!left-0 !top-[-48.39%] !h-[148.39%] !w-full max-w-none object-cover mix-blend-multiply opacity-95 transition-transform duration-500 group-hover:-translate-y-1.5 group-hover:scale-[1.02]"
        />
      </div>

      {/* Tag */}
      <span className="absolute right-[3%] top-4 inline-flex h-[25px] items-center rounded-full bg-white/75 px-3 text-[10px] font-medium uppercase leading-[15px] tracking-[0.12em] text-ink-900 backdrop-blur-md">
        {poster.tag}
      </span>

      {/* Title */}
      <div
        className={[
          'absolute font-display text-[clamp(44px,5.1vw,75px)] leading-[0.6] tracking-[-0.45px] text-ink-700',
          CATEGORY_TITLE_CLASS[poster.id],
        ].join(' ')}
      >
        <span className="block">{poster.title[0]}</span>
        <span className="block">{poster.title[1]}</span>
      </div>

      {/* CTA bubble */}
      <span
        aria-hidden
        className={[
          'absolute grid h-16 w-16 place-items-center rounded-full bg-white/90 text-ink-800 shadow-soft transition-transform duration-300 group-hover:rotate-[15deg] group-hover:scale-105',
          CATEGORY_CTA_CLASS[variant],
        ].join(' ')}
      >
        <ArrowUpRight className="h-5 w-5" strokeWidth={2.4} />
      </span>
    </Link>
  );
}
