'use client';

interface CarouselNavigationProps {
  onPrevious: () => void;
  onNext: () => void;
}

/**
 * Navigation arrows for carousel
 */
export function CarouselNavigation({ onPrevious, onNext }: CarouselNavigationProps) {
  return (
    <>
      <button
        onClick={onPrevious}
        className="absolute left-4 top-1/2 z-20 -translate-y-1/2 cursor-pointer rounded-full bg-white/90 p-2 text-gray-900 shadow-lg transition-all hover:scale-110 hover:bg-white sm:left-6 lg:left-8"
        aria-label="Previous products"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2.5}
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>

      <button
        onClick={onNext}
        className="absolute right-4 top-1/2 z-20 -translate-y-1/2 cursor-pointer rounded-full bg-white/90 p-2 text-gray-900 shadow-lg transition-all hover:scale-110 hover:bg-white sm:right-6 lg:right-8"
        aria-label="Next products"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2.5}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </button>
    </>
  );
}




