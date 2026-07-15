'use client';

interface CarouselDotsProps {
  totalItems: number;
  visibleItems: number;
  currentIndex: number;
  onDotClick: (index: number) => void;
}

/**
 * Dots indicator for carousel
 */
export function CarouselDots({ totalItems, visibleItems, currentIndex, onDotClick }: CarouselDotsProps) {
  const maxIndex = Math.max(0, totalItems - visibleItems);
  const rawPageStarts = Array.from(
    { length: Math.ceil(totalItems / visibleItems) },
    (_, index) => Math.min(index * visibleItems, maxIndex),
  );
  const pageStarts = rawPageStarts.filter(
    (startIndex, index) => index === 0 || startIndex !== rawPageStarts[index - 1],
  );

  return (
    <div className="flex justify-center gap-2 mt-6">
      {pageStarts.map((startIndex, index) => {
        const nextStartIndex = pageStarts[index + 1];
        const isActive = nextStartIndex === undefined
          ? currentIndex >= startIndex
          : currentIndex >= startIndex && currentIndex < nextStartIndex;
        
        return (
          <button
            key={`${startIndex}-${index}`}
            onClick={() => onDotClick(startIndex)}
            className={`h-2 rounded-full transition-all duration-300 ${
              isActive
                ? 'w-8 bg-sky-deep'
                : 'w-2 bg-sky-deep/35 hover:bg-sky-deep/55'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        );
      })}
    </div>
  );
}




