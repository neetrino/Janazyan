'use client';

import { useCallback, useState, type ReactNode } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Header } from '../Header';
import { HeroArrowButtonIcon } from './HeroArrowIcon';
import { HeroNavigationArrows } from './HeroNavigationArrows';
import { HeroRectangleBackground } from './HeroRectangleBackground';
import { HERO_SLIDES } from './hero-slides';
import { useHeroImageDrag } from './useHeroImageDrag';

const HERO_TITLE = 'JANAZYAN';
const HERO_DESCRIPTION =
  'Պրեմիում մանկական խնամքի արտադրանք՝ ստեղծված սիրով, անվտանգությամբ և Ձեր երեխայի հարմարավետության մասին մտածելով.';
const HERO_KIDS_LABEL = 'Մանկական';

type HeroDraggableShellProps = {
  slideId: string;
  isActive: boolean;
  isDragging: boolean;
  offset: { x: number; y: number };
  animationClass: string;
  wrapperClassName: string;
  dragHandlers: ReturnType<ReturnType<typeof useHeroImageDrag>['getDragHandlers']>;
  children: ReactNode;
};

function HeroDraggableShell({
  slideId,
  isActive,
  isDragging,
  offset,
  animationClass,
  wrapperClassName,
  dragHandlers,
  children,
}: HeroDraggableShellProps) {
  return (
    <div
      className={`${wrapperClassName} ${isActive ? 'pointer-events-auto' : 'pointer-events-none'}`}
      aria-hidden={!isActive}
    >
      <div
        className={`relative h-full w-full touch-none select-none ${
          isDragging ? 'cursor-grabbing' : 'cursor-grab'
        }`}
        style={{ transform: `translate(${offset.x}px, ${offset.y}px)` }}
        {...dragHandlers}
        data-slide-id={slideId}
      >
        <div className={`relative h-full w-full ${isDragging ? '' : animationClass}`}>{children}</div>
      </div>
    </div>
  );
}

function HeroProductImages({
  activeSlideIndex,
  offsets,
  draggingSlideId,
  getDragHandlers,
}: {
  activeSlideIndex: number;
  offsets: Record<string, { x: number; y: number }>;
  draggingSlideId: string | null;
  getDragHandlers: ReturnType<typeof useHeroImageDrag>['getDragHandlers'];
}) {
  const bodyWashSlide = HERO_SLIDES[0];
  const jellyfishSlide = HERO_SLIDES[1];

  return (
    <>
      <HeroDraggableShell
        slideId={bodyWashSlide.id}
        isActive={activeSlideIndex === 0}
        isDragging={draggingSlideId === bodyWashSlide.id}
        offset={offsets[bodyWashSlide.id] ?? { x: 0, y: 0 }}
        animationClass={
          activeSlideIndex === 0 && draggingSlideId !== bodyWashSlide.id
            ? 'animate-hero-body-wash-showcase'
            : ''
        }
        wrapperClassName={`absolute right-[4%] top-[205px] hidden aspect-[549/732] h-[min(732px,78vh)] w-[min(549px,40vw)] transition-opacity duration-500 md:block lg:left-[51.3%] lg:right-auto lg:z-20 ${
          activeSlideIndex === 0 ? 'opacity-100' : 'opacity-0'
        }`}
        dragHandlers={getDragHandlers(bodyWashSlide.id)}
      >
        <Image
          src={bodyWashSlide.productImage}
          alt={bodyWashSlide.productAlt}
          fill
          priority
          sizes="50vw"
          draggable={false}
          className="pointer-events-none object-contain object-top"
        />
      </HeroDraggableShell>

      <HeroDraggableShell
        slideId={jellyfishSlide.id}
        isActive={activeSlideIndex === 1}
        isDragging={draggingSlideId === jellyfishSlide.id}
        offset={offsets[jellyfishSlide.id] ?? { x: 0, y: 0 }}
        animationClass={
          activeSlideIndex === 1 && draggingSlideId !== jellyfishSlide.id
            ? 'animate-hero-jellyfish-float'
            : ''
        }
        wrapperClassName={`absolute right-[8%] top-[296px] hidden aspect-[773/753] w-[min(640px,46vw)] transition-opacity duration-500 md:block lg:z-20 ${
          activeSlideIndex === 1 ? 'opacity-100' : 'opacity-0'
        }`}
        dragHandlers={getDragHandlers(jellyfishSlide.id)}
      >
        <div className="absolute -left-[4.53%] -top-[7.3%] h-[107.3%] w-[104.53%]">
          <Image
            src={jellyfishSlide.productImage}
            alt={jellyfishSlide.productAlt}
            fill
            loading="lazy"
            sizes="46vw"
            draggable={false}
            className="pointer-events-none object-contain"
          />
        </div>
      </HeroDraggableShell>
    </>
  );
}

function HeroKidsLabel({ visible }: { visible: boolean }) {
  return (
    <p
      className={`pointer-events-none absolute right-[8%] top-[281px] z-20 hidden text-[35px] font-light leading-[30px] text-cream transition-opacity duration-500 md:block ${
        visible ? 'opacity-100' : 'opacity-0'
      }`}
      aria-hidden={!visible}
    >
      {HERO_KIDS_LABEL}
    </p>
  );
}

function HeroActionButtons({ className = '' }: { className?: string }) {
  return (
    <div className={`flex flex-wrap items-center gap-3.5 ${className}`}>
      <Link
        href="/products"
        className="inline-flex h-[52px] items-center gap-1 rounded-full bg-cream px-6 text-[15px] font-extrabold tracking-[-0.01em] text-sky-deep shadow-soft transition-transform duration-700 ease-in-out hover:-translate-y-0.5 md:h-[56px] md:text-[16px]"
      >
        Գնել Հիմա
        <HeroArrowButtonIcon />
      </Link>
      <Link
        href="/about"
        className="inline-flex h-[52px] items-center gap-1 rounded-full border-[3px] border-cream px-6 text-[15px] font-semibold tracking-[-0.01em] text-cream transition-[transform,background-color] duration-700 ease-in-out hover:-translate-y-0.5 hover:bg-cream/10 md:h-[56px] md:text-[16px]"
      >
        Իմանալ Ավելին
        <HeroArrowButtonIcon />
      </Link>
    </div>
  );
}

export function HomeHero() {
  const [slideIndex, setSlideIndex] = useState(0);
  const activeSlide = HERO_SLIDES[slideIndex];
  const slideIds = HERO_SLIDES.map((slide) => slide.id);
  const { offsets, draggingSlideId, getDragHandlers } = useHeroImageDrag(slideIds);

  const goToNextSlide = useCallback(() => {
    setSlideIndex((current) => (current + 1) % HERO_SLIDES.length);
  }, []);

  const goToPreviousSlide = useCallback(() => {
    setSlideIndex((current) => (current - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
  }, []);

  const activeAnimationClass =
    activeSlide.id === 'kids-care'
      ? 'animate-hero-jellyfish-float'
      : 'animate-hero-body-wash-showcase';

  return (
    <section
      aria-label="Janazyan hero"
      className="relative w-full px-4 pt-3 sm:px-6 md:px-8 md:pt-5 lg:px-0"
    >
      <div className="relative mx-auto w-full max-w-[1472px] overflow-hidden rounded-[28px] bg-white sm:rounded-[44px] lg:h-[940px] lg:rounded-t-[36px] lg:rounded-bl-[44px] lg:rounded-br-[44px]">
        {HERO_SLIDES.map((slide, index) => (
          <HeroRectangleBackground
            key={slide.id}
            variant={slide.background}
            className={index === slideIndex ? 'opacity-100' : 'opacity-0'}
          />
        ))}

        <Header embedded />

        <HeroProductImages
          activeSlideIndex={slideIndex}
          offsets={offsets}
          draggingSlideId={draggingSlideId}
          getDragHandlers={getDragHandlers}
        />
        <HeroKidsLabel visible={activeSlide.showKidsLabel} />
        <HeroNavigationArrows onPrevious={goToPreviousSlide} onNext={goToNextSlide} />

        <div className="relative z-20 lg:hidden">
          <div className="relative z-10 flex flex-col gap-8 px-5 pb-16 pt-8 sm:px-8 md:gap-10 md:px-10 md:pb-20 md:pt-10">
            <div className="relative -mt-2 h-[280px] w-full overflow-visible rounded-2xl md:hidden">
              <HeroDraggableShell
                slideId={activeSlide.id}
                isActive
                isDragging={draggingSlideId === activeSlide.id}
                offset={offsets[activeSlide.id] ?? { x: 0, y: 0 }}
                animationClass={
                  draggingSlideId === activeSlide.id ? '' : activeAnimationClass
                }
                wrapperClassName="relative h-full w-full"
                dragHandlers={getDragHandlers(activeSlide.id)}
              >
                <Image
                  src={activeSlide.productImage}
                  alt={activeSlide.productAlt}
                  fill
                  priority
                  sizes="100vw"
                  draggable={false}
                  className="pointer-events-none object-contain"
                />
              </HeroDraggableShell>
            </div>

            {activeSlide.showKidsLabel ? (
              <p className="text-[28px] font-light leading-none text-cream">{HERO_KIDS_LABEL}</p>
            ) : null}

            <h1 className="font-wide mt-2 max-w-full text-[clamp(56px,13vw,170px)] leading-[0.9] tracking-[0.01em] text-cream md:mt-6">
              {HERO_TITLE}
            </h1>

            <p className="max-w-[486px] text-[15px] leading-[1.55] tracking-[-0.01em] text-white/95 sm:text-base md:text-lg">
              {HERO_DESCRIPTION}
            </p>

            <HeroActionButtons />
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
            <HeroActionButtons className="mt-10 gap-[14px]" />
          </div>
        </div>
      </div>
    </section>
  );
}
