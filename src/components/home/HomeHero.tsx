'use client';

import { useCallback, useEffect, useState, type ReactNode } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { HeroBodyWashImage } from './HeroBodyWashImage';
import { HeroCtaArrow } from './HeroArrowIcon';
import { HeroNavigationArrows } from './HeroNavigationArrows';
import { HeroRectangleBackground } from './HeroRectangleBackground';
import {
  HERO_BODY_WASH_DESKTOP_FRAME_CLASS,
  HERO_OCTOPUS_FRAME_CLASS,
  HERO_OCTOPUS_MIRROR_CLASS,
  HERO_SLIDE_AUTOPLAY_MS,
  HERO_SLIDES,
} from './hero-slides';
import {
  HOME_HERO_KIDS_LABEL_RIGHT_CLASS,
  HOME_HERO_KIDS_LABEL_TOP_CLASS,
  HOME_HERO_TITLE_DESKTOP_CLASS,
  HOME_HERO_TITLE_MOBILE_CLASS,
  HOME_HERO_TITLE_TOP_CLASS,
} from './hero-typography.constants';
import { useHeroImageDrag } from './useHeroImageDrag';
import { useTranslation } from '../../lib/i18n-client';
import { STOREFRONT_DESKTOP_ONLY_CLASS, STOREFRONT_TABLET_DOWN_CLASS } from '../../lib/layout/storefront-layout.constants';
import {
  STOREFRONT_HERO_CONTENT_INSET_LEFT_CLASS,
  STOREFRONT_HERO_CONTENT_INSET_RIGHT_CLASS,
} from '../../lib/layout/hero-frame.constants';

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
        wrapperClassName={`absolute hidden transition-opacity duration-500 lg:block ${HERO_BODY_WASH_DESKTOP_FRAME_CLASS} ${
          activeSlideIndex === 0 ? 'opacity-100' : 'opacity-0'
        }`}
        dragHandlers={getDragHandlers(bodyWashSlide.id)}
      >
        <HeroBodyWashImage
          src={bodyWashSlide.productImage}
          alt={bodyWashSlide.productAlt}
          priority
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
        wrapperClassName={`absolute z-20 hidden transition-opacity duration-500 md:block ${HERO_OCTOPUS_FRAME_CLASS} ${
          activeSlideIndex === 1 ? 'opacity-100' : 'opacity-0'
        }`}
        dragHandlers={getDragHandlers(jellyfishSlide.id)}
      >
        <Image
          src={jellyfishSlide.productImage}
          alt={jellyfishSlide.productAlt}
          fill
          loading="lazy"
          sizes="46vw"
          draggable={false}
          className={`pointer-events-none object-cover ${HERO_OCTOPUS_MIRROR_CLASS}`}
        />
      </HeroDraggableShell>
    </>
  );
}

function HeroKidsLabel({ visible, label }: { visible: boolean; label: string }) {
  return (
    <p
      className={`pointer-events-none absolute z-30 hidden whitespace-nowrap text-[35px] font-light leading-[30px] text-cream transition-opacity duration-500 desktop:block ${HOME_HERO_KIDS_LABEL_RIGHT_CLASS} ${HOME_HERO_KIDS_LABEL_TOP_CLASS} ${
        visible ? 'opacity-100' : 'opacity-0'
      }`}
      aria-hidden={!visible}
    >
      {label}
    </p>
  );
}

function HeroActionButtons({
  className = '',
  buyNowLabel,
  learnMoreLabel,
}: {
  className?: string;
  buyNowLabel: string;
  learnMoreLabel: string;
}) {
  return (
    <div className={`flex flex-wrap items-center gap-3.5 ${className}`}>
      <Link
        href="/products"
        className="inline-flex h-[52px] items-center gap-1 rounded-full bg-cream px-6 text-[15px] font-extrabold tracking-[-0.01em] text-sky-deep transition-transform duration-700 ease-in-out hover:-translate-y-0.5 md:h-[56px] md:text-[16px]"
      >
        {buyNowLabel}
        <HeroCtaArrow tone="sky" />
      </Link>
      <Link
        href="/about"
        className="inline-flex h-[52px] items-center gap-1 rounded-full border-[3px] border-cream px-6 text-[15px] font-semibold tracking-[-0.01em] text-cream transition-[transform,background-color] duration-700 ease-in-out hover:-translate-y-0.5 hover:bg-cream/10 md:h-[56px] md:text-[16px]"
      >
        {learnMoreLabel}
        <HeroCtaArrow tone="cream" />
      </Link>
    </div>
  );
}

export function HomeHero() {
  const { t } = useTranslation();
  const [slideIndex, setSlideIndex] = useState(0);
  const activeSlide = HERO_SLIDES[slideIndex];
  const heroTitle = t('home.hero.title');
  const heroDescription = t('home.hero.description');
  const heroKidsLabel = t('home.hero.kidsLabel');
  const buyNowLabel = t('home.hero.buyNow');
  const learnMoreLabel = t('home.hero.learnMore');
  const slideIds = HERO_SLIDES.map((slide) => slide.id);
  const { offsets, draggingSlideId, getDragHandlers } = useHeroImageDrag(slideIds);

  const goToNextSlide = useCallback(() => {
    setSlideIndex((current) => (current + 1) % HERO_SLIDES.length);
  }, []);

  const goToPreviousSlide = useCallback(() => {
    setSlideIndex((current) => (current - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
  }, []);

  useEffect(() => {
    if (draggingSlideId !== null) {
      return;
    }

    const timerId = window.setInterval(goToNextSlide, HERO_SLIDE_AUTOPLAY_MS);
    return () => window.clearInterval(timerId);
  }, [draggingSlideId, goToNextSlide]);

  const activeAnimationClass =
    activeSlide.id === 'kids-care'
      ? 'animate-hero-jellyfish-float'
      : 'animate-hero-body-wash-showcase';

  return (
    <section
      aria-label={t('home.hero.ariaSection')}
      className="relative z-10 w-full"
    >
      <div className="relative w-full overflow-hidden rounded-[28px] bg-white [container-type:inline-size] sm:rounded-[44px] lg:h-[min(940px,calc(100svh-2.5rem))] lg:rounded-bl-[44px] lg:rounded-br-[44px]">
        {HERO_SLIDES.map((slide, index) => (
          <HeroRectangleBackground
            key={slide.id}
            variant={slide.background}
            flushBottom
            className={index === slideIndex ? 'opacity-100' : 'opacity-0'}
          />
        ))}

        <HeroProductImages
          activeSlideIndex={slideIndex}
          offsets={offsets}
          draggingSlideId={draggingSlideId}
          getDragHandlers={getDragHandlers}
        />
        <HeroKidsLabel visible={activeSlide.showKidsLabel} label={heroKidsLabel} />

        <div className={`relative z-20 ${STOREFRONT_TABLET_DOWN_CLASS}`}>
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
                  className={`pointer-events-none object-contain ${
                    activeSlide.id === 'kids-care' ? HERO_OCTOPUS_MIRROR_CLASS : ''
                  }`}
                />
              </HeroDraggableShell>
            </div>

            {activeSlide.showKidsLabel ? (
              <p className="text-[28px] font-light leading-none text-cream">{heroKidsLabel}</p>
            ) : null}

            <h1 className={`mt-2 max-w-full md:mt-6 ${HOME_HERO_TITLE_MOBILE_CLASS}`}>
              {heroTitle}
            </h1>

            <p className="max-w-[486px] text-[15px] leading-[1.55] tracking-[-0.01em] text-white/95 sm:text-base md:text-lg">
              {heroDescription}
            </p>

            <HeroActionButtons
              buyNowLabel={buyNowLabel}
              learnMoreLabel={learnMoreLabel}
            />
          </div>
        </div>

        <div className={`pointer-events-none absolute inset-0 z-10 ${STOREFRONT_DESKTOP_ONLY_CLASS}`}>
          <div
            className={`pointer-events-auto absolute ${HOME_HERO_TITLE_TOP_CLASS} ${STOREFRONT_HERO_CONTENT_INSET_LEFT_CLASS} ${STOREFRONT_HERO_CONTENT_INSET_RIGHT_CLASS}`}
          >
            <h1 className={HOME_HERO_TITLE_DESKTOP_CLASS}>
              {heroTitle}
            </h1>
            <p className="mt-10 w-[486px] text-[18px] leading-[28px] tracking-[-0.44px] text-white">
              {heroDescription}
            </p>
            <HeroActionButtons
              className="mt-10 gap-[14px]"
              buyNowLabel={buyNowLabel}
              learnMoreLabel={learnMoreLabel}
            />
          </div>
        </div>
      </div>
      <HeroNavigationArrows onPrevious={goToPreviousSlide} onNext={goToNextSlide} />
    </section>
  );
}
