import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Header } from '../Header';
import { HeroRectangleBackground } from './HeroRectangleBackground';

const HERO_TITLE = 'JANAZYAN';
const HERO_DESCRIPTION =
  'Պրեմիում մանկական խնամքի արտադրանք՝ ստեղծված սիրով, անվտանգությամբ և Ձեր երեխայի հարմարավետության մասին մտածելով։';

export function HomeHero() {
  return (
    <section
      aria-label="Janazyan hero"
      className="relative w-full px-4 pt-3 sm:px-6 md:px-8 md:pt-5 lg:px-0"
    >
      <div className="relative mx-auto w-full max-w-[1472px] overflow-hidden rounded-[28px] bg-white sm:rounded-[44px] lg:h-[940px] lg:rounded-t-[36px] lg:rounded-bl-[44px] lg:rounded-br-[44px]">
        <HeroRectangleBackground />

        <Header embedded />

        <div className="pointer-events-none absolute right-[4%] top-[205px] hidden aspect-[549/732] h-[min(732px,78vh)] w-[min(549px,40vw)] md:block lg:left-[51.3%] lg:right-auto lg:z-20">
          <Image
            src="/figma/category-body.webp"
            alt=""
            fill
            priority
            sizes="50vw"
            className="object-contain object-top"
          />
        </div>

        <div className="relative z-20 lg:hidden">
          <div className="relative z-10 flex flex-col gap-8 px-5 pb-12 pt-8 sm:px-8 md:gap-10 md:px-10 md:pb-16 md:pt-10">
            <div className="relative -mt-2 h-[280px] w-full overflow-hidden rounded-2xl md:hidden">
              <Image
                src="/figma/category-body.webp"
                alt=""
                fill
                priority
                sizes="100vw"
                className="object-contain"
              />
            </div>

            <h1 className="font-wide mt-2 max-w-full text-[clamp(56px,13vw,170px)] leading-[0.9] tracking-[0.01em] text-cream md:mt-6">
              {HERO_TITLE}
            </h1>

            <p className="max-w-[486px] text-[15px] leading-[1.55] tracking-[-0.01em] text-white/95 sm:text-base md:text-lg">
              {HERO_DESCRIPTION}
            </p>

            <div className="flex flex-wrap items-center gap-3.5">
              <Link
                href="/products"
                className="group inline-flex h-[52px] items-center gap-1 rounded-full bg-cream px-6 text-[15px] font-extrabold tracking-[-0.01em] text-sky-deep shadow-soft transition-transform duration-200 hover:-translate-y-0.5 md:h-[56px] md:text-[16px]"
              >
                Գնել Հիմա
                <ArrowRight className="h-5 w-5 transition-transform duration-200 group-hover:translate-x-0.5" />
              </Link>
              <Link
                href="/about"
                className="group inline-flex h-[52px] items-center gap-1 rounded-full border-[3px] border-cream px-6 text-[15px] font-semibold tracking-[-0.01em] text-cream transition-colors duration-200 hover:bg-cream/10 md:h-[56px] md:text-[16px]"
              >
                Իմանալ Ավելին
                <ArrowRight className="h-5 w-5 transition-transform duration-200 group-hover:translate-x-0.5" />
              </Link>
            </div>
          </div>
        </div>

        <div className="relative hidden lg:block">
          <div className="absolute left-[43px] top-[255px] z-10">
            <h1 className="font-wide text-[198px] leading-[200px] tracking-[2px] text-cream">
              {HERO_TITLE}
            </h1>
            <p className="mt-10 w-[486px] text-[18px] leading-[28px] tracking-[-0.44px] text-white">
              {HERO_DESCRIPTION}
            </p>
            <div className="mt-10 flex items-center gap-[14px]">
              <Link
                href="/products"
                className="group inline-flex h-[56px] items-center gap-1 rounded-full bg-cream px-6 text-[16px] font-extrabold tracking-[-0.31px] text-sky-deep"
              >
                Գնել Հիմա
                <ArrowRight className="h-5 w-5 transition-transform duration-200 group-hover:translate-x-0.5" />
              </Link>
              <Link
                href="/about"
                className="group inline-flex h-[56px] items-center gap-1 rounded-full border-[3px] border-cream px-6 text-[16px] font-semibold tracking-[-0.31px] text-cream"
              >
                Իմանալ Ավելին
                <ArrowRight className="h-5 w-5 transition-transform duration-200 group-hover:translate-x-0.5" />
              </Link>
            </div>
          </div>

          <div className="absolute bottom-0 left-1/2 z-30 flex -translate-x-1/2 items-center gap-4">
            <button
              type="button"
              aria-label="Previous"
              className="grid h-16 w-16 place-items-center rounded-full bg-white/80 text-sky-deep shadow-soft"
            >
              <ArrowRight className="h-6 w-6 rotate-180" />
            </button>
            <button
              type="button"
              aria-label="Next"
              className="grid h-16 w-16 place-items-center rounded-full bg-white/80 text-sky-deep shadow-soft"
            >
              <ArrowRight className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
