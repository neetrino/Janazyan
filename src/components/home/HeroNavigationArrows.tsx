'use client';

import { HeroArrowIcon } from './HeroArrowIcon';
import { HERO_ARROW_SIZE_PX, HERO_NAV_BOTTOM_CLASS } from './hero-slides';
import { useTranslation } from '../../lib/i18n-client';

type HeroNavigationArrowsProps = {
  onPrevious: () => void;
  onNext: () => void;
};

export function HeroNavigationArrows({ onPrevious, onNext }: HeroNavigationArrowsProps) {
  const { t } = useTranslation();

  return (
    <div className={`pointer-events-auto absolute left-1/2 z-40 flex -translate-x-1/2 items-center gap-[18px] ${HERO_NAV_BOTTOM_CLASS}`}>
      <button
        type="button"
        onClick={onPrevious}
        aria-label={t('home.hero.nav.previous')}
        className="shrink-0 transition-transform duration-200 hover:scale-105"
      >
        <HeroArrowIcon direction="left" size={HERO_ARROW_SIZE_PX} />
      </button>
      <button
        type="button"
        onClick={onNext}
        aria-label={t('home.hero.nav.next')}
        className="shrink-0 transition-transform duration-200 hover:scale-105"
      >
        <HeroArrowIcon direction="right" size={HERO_ARROW_SIZE_PX} />
      </button>
    </div>
  );
}
