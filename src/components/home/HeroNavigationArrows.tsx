import { HeroArrowIcon } from './HeroArrowIcon';
import { HERO_ARROW_SIZE_PX } from './hero-slides';

type HeroNavigationArrowsProps = {
  onPrevious: () => void;
  onNext: () => void;
};

export function HeroNavigationArrows({ onPrevious, onNext }: HeroNavigationArrowsProps) {
  return (
    <div className="pointer-events-auto absolute bottom-0 left-1/2 z-40 flex -translate-x-1/2 items-center gap-[18px] pb-1">
      <button
        type="button"
        onClick={onPrevious}
        aria-label="Previous hero slide"
        className="shrink-0 transition-transform duration-200 hover:scale-105"
      >
        <HeroArrowIcon direction="left" size={HERO_ARROW_SIZE_PX} />
      </button>
      <button
        type="button"
        onClick={onNext}
        aria-label="Next hero slide"
        className="shrink-0 transition-transform duration-200 hover:scale-105"
      >
        <HeroArrowIcon direction="right" size={HERO_ARROW_SIZE_PX} />
      </button>
    </div>
  );
}
