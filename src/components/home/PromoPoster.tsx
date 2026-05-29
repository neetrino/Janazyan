import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

const PROMO_IMAGE = '/figma/promo-cosmetic.png';

export function PromoPoster() {
  return (
    <section
      aria-label="Promotional offer"
      className="relative w-full px-4 pb-16 sm:px-6 md:px-8 lg:px-[58px] md:pb-20"
    >
      <div className="mx-auto w-full">
        <div className="relative overflow-hidden rounded-[28px] md:rounded-[36px] bg-promo-pink min-h-[420px] md:min-h-[520px] lg:h-[720px]">
          <div className="pointer-events-none absolute left-[34%] top-0 hidden h-[990px] w-[790px] overflow-hidden lg:block">
            <div className="absolute left-0 top-[-24.77%] h-[141.92%] w-full">
              <Image
                src={PROMO_IMAGE}
                alt=""
                fill
                sizes="790px"
                className="object-cover"
              />
            </div>
          </div>

          <div className="relative z-10 flex h-full flex-col justify-between gap-10 p-6 sm:p-8 md:p-10 lg:px-[70px] lg:py-[58px]">
            <div className="max-w-[420px]">
              <p className="text-[11px] uppercase tracking-[0.18em] text-white/95">
                — Սահմանափակ առաջարկ
              </p>
              <h2 className="mt-6 flex flex-col gap-2 [font-family:Mirage,var(--font-armenian),system-ui,sans-serif] text-[clamp(56px,9vw,115px)] font-black leading-[0.65] tracking-[-0.004em] text-white lg:mt-[22px] lg:gap-3">
                <span className="block">ՄԱԶԵՐԻ</span>
                <span className="block">ԽՆԱՄՔ</span>
              </h2>
            </div>

            <div className="relative -mx-6 h-[260px] sm:h-[300px] lg:hidden">
              <Image
                src={PROMO_IMAGE}
                alt=""
                fill
                sizes="100vw"
                className="object-contain"
              />
            </div>

            <div className="flex flex-col items-start gap-6 md:flex-row md:items-end md:justify-between md:gap-8 lg:absolute lg:bottom-[58px] lg:left-[70px] lg:right-[42px]">
              <p className="max-w-[400px] text-[14px] leading-[21px] text-white/95 lg:max-w-[404px]">
                Հինգ ապրանք՝ մայրիկի, հայրիկի, դեռահասի և երկու երեխայի համար։ Խնայում եք 12 600 ֏։
              </p>

              <Link
                href="/products?category=hair"
                className="group inline-flex h-[50px] items-center gap-3 rounded-full bg-white px-6 text-[12px] uppercase tracking-[0.16em] text-ink-900 transition-transform duration-200 hover:-translate-y-0.5 lg:min-w-[256px] lg:justify-center"
              >
                Պատվիրել — 32 400 ֏
                <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
