import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

const PROMO_PHOTO = '/figma/promo-poster-photo.webp';
const PROMO_CTA_HREF = '/products?category=hair';

const PROMO_BODY_COLOR = '#3a4452';
const PROMO_HEADING_CLASS =
  '[font-family:Mirage,var(--font-wide-display),var(--font-armenian),system-ui,sans-serif] font-normal';

const PROMO_LABEL = '— Սահմանափակ առաջարկ';
const PROMO_TITLE_LINES = ['Մազերի', 'խնամք'] as const;
const PROMO_DISCOUNT = 'Զեղչ';
const PROMO_DESCRIPTION =
  'Հինգ ապրանք՝ մայրիկի, հայրիկի, դեռահասի և երկու երեխայի համար։ Խնայում եք 12 600 ֏։';
const PROMO_CTA_LABEL = 'Պատվիրել — 32 400 ֏';

const DESKTOP_MIN_HEIGHT_PX = 610;

export function PromoPoster() {
  return (
    <section
      aria-label="Promotional offer"
      className="relative w-full px-4 pb-16 font-armenian sm:px-6 md:px-8 lg:px-[58px] md:pb-20"
    >
      <div className="mx-auto w-full max-w-[1375px]">
        <MobilePromo />
        <DesktopPromo />
      </div>
    </section>
  );
}

function MobilePromo() {
  return (
    <div className="overflow-hidden rounded-[28px] bg-white md:rounded-[36px] lg:hidden">
      <div className="relative h-[240px] w-full sm:h-[280px]">
        <Image
          src={PROMO_PHOTO}
          alt=""
          fill
          sizes="100vw"
          className="object-cover object-left"
        />
      </div>

      <div className="space-y-6 px-5 py-6 sm:px-8 sm:py-8">
        <p
          className="text-[14px] leading-[21px]"
          style={{ color: PROMO_BODY_COLOR }}
        >
          {PROMO_DESCRIPTION}
        </p>

        <div>
          <p className="text-[11px] uppercase tracking-[0.18em] text-ink-800">
            {PROMO_LABEL}
          </p>
          <h2
            className={`${PROMO_HEADING_CLASS} mt-3 text-[clamp(52px,14vw,80px)] leading-[0.72] tracking-[-0.004em] text-ink-800`}
          >
            {PROMO_TITLE_LINES.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </h2>
          <p className="mt-2 text-[clamp(40px,10vw,56px)] font-black leading-[0.88] text-ink-800">
            {PROMO_DISCOUNT}
          </p>
        </div>

        <PromoCta className="w-full justify-center" />
      </div>
    </div>
  );
}

function DesktopPromo() {
  return (
    <div
      className="relative hidden w-full overflow-hidden rounded-[36px] bg-white lg:block"
      style={{ minHeight: DESKTOP_MIN_HEIGHT_PX }}
    >
      <div className="pointer-events-none absolute inset-y-0 left-0 w-[min(72%,932px)] overflow-hidden">
        <div className="absolute -left-[18px] -top-[76px] h-[695px] w-[932px] max-w-none">
          <Image
            src={PROMO_PHOTO}
            alt=""
            fill
            sizes="(min-width: 1024px) 60vw, 100vw"
            className="object-cover"
          />
        </div>
      </div>

      <p
        className="absolute left-[3%] top-[83px] z-10 max-w-[min(396px,32%)] text-[14px] leading-[21px]"
        style={{ color: PROMO_BODY_COLOR }}
      >
        {PROMO_DESCRIPTION}
      </p>

      <div className="relative z-10 ml-auto flex min-h-[610px] w-[min(100%,42%)] min-w-[320px] max-w-[520px] flex-col items-end px-6 pb-11 pt-[92px] xl:min-w-[380px] xl:px-10 xl:max-w-[560px]">
        <div className="w-full min-w-0 text-right">
          <p className="text-[11px] uppercase tracking-[0.18em] text-ink-800">
            {PROMO_LABEL}
          </p>
          <h2
            className={`${PROMO_HEADING_CLASS} mt-[22px] text-[clamp(64px,6.5vw,115px)] leading-[0.65] tracking-[-0.004em] text-ink-800`}
          >
            {PROMO_TITLE_LINES.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </h2>
        </div>

        <div aria-hidden className="min-h-[48px] flex-1" />

        <p className="w-full text-right text-[clamp(48px,5vw,68px)] font-black leading-[0.88] text-ink-800">
          {PROMO_DISCOUNT}
        </p>

        <PromoCta className="mt-6 shrink-0 self-end" />
      </div>
    </div>
  );
}

function PromoCta({ className }: { className?: string }) {
  return (
    <Link
      href={PROMO_CTA_HREF}
      className={[
        'group inline-flex h-[50px] items-center gap-3 rounded-full bg-ink-800 px-6 text-[12px] uppercase tracking-[0.16em] text-white transition-transform duration-200 hover:-translate-y-0.5',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <span className="whitespace-nowrap">{PROMO_CTA_LABEL}</span>
      <ArrowRight
        aria-hidden
        className="h-3.5 w-3.5 shrink-0 transition-transform duration-200 group-hover:translate-x-0.5"
      />
    </Link>
  );
}
