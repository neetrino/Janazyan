'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
} from 'react';
import {
  CAROUSEL_AUTO_ROTATE_MS,
  CAROUSEL_GLOBE_TILT_DEG,
  CAROUSEL_PERSPECTIVE_PX,
  CAROUSEL_ROTATION_MS,
  CAROUSEL_SCENE_SHIFT_UP_PX,
  CAROUSEL_FRONT_FACE_Z_OFFSET_PX,
} from '../carousel-constants';
import {
  getCarouselItemGlobePresentation,
  getCarouselSlotAngleDeg,
} from '../carousel-layout';
import { useCarouselLayout } from '../use-carousel-layout';
import type { PartnerStore } from '../types';
import { PartnerStoreCard } from './PartnerStoreCard';

type PartnerStoresCarouselProps = {
  stores: PartnerStore[];
  selectedStoreId: string | null;
  getDirectionsLabel: string;
  viewOnMapLabel: string;
  onSelect: (storeId: string) => void;
  ariaLabel: string;
};

function getStoreIndex(stores: PartnerStore[], storeId: string | null): number {
  if (!storeId) {
    return 0;
  }
  const index = stores.findIndex((store) => store.id === storeId);
  return index >= 0 ? index : 0;
}

function normalizeIndex(index: number, count: number): number {
  if (count <= 0) {
    return 0;
  }
  return ((index % count) + count) % count;
}

type CarouselItemStyle = CSSProperties & {
  '--slot-angle': string;
  '--item-lift': string;
  '--item-scale': string;
  '--item-opacity': string;
};

type CarouselRootStyle = CSSProperties & {
  '--carousel-radius': string;
  '--carousel-card-width': string;
  '--carousel-ring-width': string;
  '--carousel-perspective': string;
  '--globe-tilt': string;
  '--carousel-scene-offset-y': string;
  '--carousel-front-z-offset': string;
};

/**
 * 3D ring carousel — globe-like Y rotation; uniform card sizes.
 */
export function PartnerStoresCarousel({
  stores,
  selectedStoreId,
  getDirectionsLabel,
  viewOnMapLabel,
  onSelect,
  ariaLabel,
}: PartnerStoresCarouselProps) {
  const count = stores.length;
  const activeIndex = getStoreIndex(stores, selectedStoreId);
  const layout = useCarouselLayout(count);
  const [isPaused, setIsPaused] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const autoRotateRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const sceneRef = useRef<HTMLDivElement>(null);
  const wheelLockedRef = useRef(false);
  const touchStartXRef = useRef(0);

  const carouselStyle: CarouselRootStyle = {
    '--carousel-radius': `${layout.radiusPx}px`,
    '--carousel-card-width': `${layout.cardWidthPx}px`,
    '--carousel-ring-width': `${layout.ringWidthPx}px`,
    '--carousel-perspective': `${CAROUSEL_PERSPECTIVE_PX}px`,
    '--globe-tilt': `${CAROUSEL_GLOBE_TILT_DEG}deg`,
    '--carousel-scene-offset-y': `-${CAROUSEL_SCENE_SHIFT_UP_PX}px`,
    '--carousel-front-z-offset': `${CAROUSEL_FRONT_FACE_Z_OFFSET_PX}px`,
  };

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setPrefersReducedMotion(media.matches);
    update();
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);

  const goToIndex = useCallback(
    (index: number) => {
      const store = stores[normalizeIndex(index, count)];
      if (store) {
        onSelect(store.id);
      }
    },
    [count, onSelect, stores],
  );

  const goToPrevious = useCallback(() => {
    goToIndex(activeIndex - 1);
  }, [activeIndex, goToIndex]);

  const goToNext = useCallback(() => {
    goToIndex(activeIndex + 1);
  }, [activeIndex, goToIndex]);

  const lockWheel = useCallback(() => {
    wheelLockedRef.current = true;
    window.setTimeout(() => {
      wheelLockedRef.current = false;
    }, CAROUSEL_ROTATION_MS);
  }, []);

  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene || count < 2 || prefersReducedMotion) {
      return undefined;
    }

    const handleWheel = (event: WheelEvent) => {
      if (wheelLockedRef.current || Math.abs(event.deltaY) < 8) {
        return;
      }
      event.preventDefault();
      lockWheel();
      if (event.deltaY > 0) {
        goToIndex(activeIndex + 1);
      } else {
        goToIndex(activeIndex - 1);
      }
    };

    const handleTouchStart = (event: TouchEvent) => {
      touchStartXRef.current = event.touches[0]?.clientX ?? 0;
    };

    const handleTouchEnd = (event: TouchEvent) => {
      const endX = event.changedTouches[0]?.clientX ?? 0;
      const deltaX = endX - touchStartXRef.current;
      if (wheelLockedRef.current || Math.abs(deltaX) < 40) {
        return;
      }
      lockWheel();
      if (deltaX < 0) {
        goToIndex(activeIndex + 1);
      } else {
        goToIndex(activeIndex - 1);
      }
    };

    scene.addEventListener('wheel', handleWheel, { passive: false });
    scene.addEventListener('touchstart', handleTouchStart, { passive: true });
    scene.addEventListener('touchend', handleTouchEnd, { passive: true });
    return () => {
      scene.removeEventListener('wheel', handleWheel);
      scene.removeEventListener('touchstart', handleTouchStart);
      scene.removeEventListener('touchend', handleTouchEnd);
    };
  }, [activeIndex, count, goToIndex, lockWheel, prefersReducedMotion]);

  useEffect(() => {
    if (autoRotateRef.current) {
      clearInterval(autoRotateRef.current);
      autoRotateRef.current = null;
    }

    if (count < 2 || isPaused || prefersReducedMotion) {
      return undefined;
    }

    autoRotateRef.current = setInterval(() => {
      goToIndex(activeIndex + 1);
    }, CAROUSEL_AUTO_ROTATE_MS);

    return () => {
      if (autoRotateRef.current) {
        clearInterval(autoRotateRef.current);
      }
    };
  }, [activeIndex, count, goToIndex, isPaused, prefersReducedMotion]);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLDivElement>) => {
      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        goToPrevious();
      }
      if (event.key === 'ArrowRight') {
        event.preventDefault();
        goToNext();
      }
    },
    [goToNext, goToPrevious],
  );

  if (count === 0) {
    return null;
  }

  return (
    <div
      className="partner-stores-carousel"
      style={carouselStyle}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocusCapture={() => setIsPaused(true)}
      onBlurCapture={() => setIsPaused(false)}
    >
      <div
        ref={sceneRef}
        className="partner-stores-carousel-scene"
        style={{ minHeight: layout.sceneMinHeightPx }}
        role="region"
        aria-label={ariaLabel}
        aria-roledescription="carousel"
        tabIndex={0}
        onKeyDown={handleKeyDown}
      >
        <div className="partner-stores-carousel-stage">
          <div className="partner-stores-carousel-globe-tilt">
            <div
              className="partner-stores-carousel-ring"
              style={
                {
                  '--rotation-duration': `${CAROUSEL_ROTATION_MS}ms`,
                  width: layout.ringWidthPx,
                } as CSSProperties
              }
            >
              {stores.map((store, index) => {
                const isFrontCard = index === activeIndex;
                const globePresentation = getCarouselItemGlobePresentation(
                  index,
                  activeIndex,
                  count,
                  layout.angleStepDeg,
                );
                const itemStyle: CarouselItemStyle = {
                  '--slot-angle': `${getCarouselSlotAngleDeg(index, activeIndex, layout)}deg`,
                  '--item-lift': `${globePresentation.liftPx}px`,
                  '--item-scale': String(globePresentation.scale),
                  '--item-opacity': String(globePresentation.opacity),
                };

                const card = (
                  <PartnerStoreCard
                    store={store}
                    isSelected={selectedStoreId === store.id}
                    getDirectionsLabel={getDirectionsLabel}
                    viewOnMapLabel={viewOnMapLabel}
                    onSelect={onSelect}
                    compact
                    previewOnly={!isFrontCard}
                  />
                );

                return (
                  <div
                    key={store.id}
                    className={`partner-stores-carousel-item ${
                      isFrontCard ? 'partner-stores-carousel-item--front' : ''
                    }`}
                    style={itemStyle}
                    aria-hidden={!isFrontCard}
                  >
                    <div className="partner-stores-carousel-item-face">
                      {isFrontCard ? (
                        card
                      ) : (
                        <div
                          role="button"
                          className="partner-stores-carousel-card-hit partner-stores-carousel-card-hit--side"
                          onClick={() => goToIndex(index)}
                          onKeyDown={(event) => {
                            if (event.key === 'Enter' || event.key === ' ') {
                              event.preventDefault();
                              goToIndex(index);
                            }
                          }}
                          tabIndex={-1}
                          aria-label={store.name}
                        >
                          {card}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {count > 1 ? (
        <div className="partner-stores-carousel-controls">
          <button
            type="button"
            className="partner-stores-carousel-nav"
            onClick={goToPrevious}
            aria-label="Previous store"
          >
            <ChevronLeft className="h-5 w-5" aria-hidden />
          </button>
          <div className="partner-stores-carousel-dots" role="tablist" aria-label={ariaLabel}>
            {stores.map((store, index) => (
              <button
                key={store.id}
                type="button"
                role="tab"
                aria-selected={index === activeIndex}
                aria-label={store.name}
                className={`partner-stores-carousel-dot ${
                  index === activeIndex ? 'partner-stores-carousel-dot--active' : ''
                }`}
                onClick={() => goToIndex(index)}
              />
            ))}
          </div>
          <button
            type="button"
            className="partner-stores-carousel-nav"
            onClick={goToNext}
            aria-label="Next store"
          >
            <ChevronRight className="h-5 w-5" aria-hidden />
          </button>
        </div>
      ) : null}
    </div>
  );
}
