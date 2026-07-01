'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
  type MouseEvent,
} from 'react';
import {
  CAROUSEL_AUTO_ROTATE_MS,
  CAROUSEL_FRONT_ACTIONS_MARGIN_TOP_MOBILE_REM,
  CAROUSEL_FRONT_ACTIONS_MARGIN_TOP_REM,
  CAROUSEL_FRONT_CARD_WIDTH_MOBILE_PX,
  CAROUSEL_FRONT_DROP_DESKTOP_PX,
  CAROUSEL_FRONT_DROP_MOBILE_PX,
  CAROUSEL_GLOBE_CENTER_SHIFT_UP_MOBILE_PX,
  CAROUSEL_ROTATION_MS,
} from '../carousel-constants';
import {
  getCarouselItemGlobePresentation,
  getCarouselSlotAngleDeg,
  getRotationIndexForTarget,
} from '../carousel-layout';
import { useCarouselLayout } from '../use-carousel-layout';
import type { PartnerStore, StoreSelectHandler } from '../types';
import { Globe } from '@/components/ui/globe';
import {
  GLOBE_CAROUSEL_SIZE_DESKTOP_PX,
  GLOBE_CAROUSEL_SIZE_MOBILE_PX,
  GLOBE_ROTATE_DURATION_S,
} from '@/components/ui/globe.constants';
import { PartnerStoreCard, PartnerStoreCardActions } from './PartnerStoreCard';

type PartnerStoresCarouselProps = {
  stores: PartnerStore[];
  selectedStoreId: string | null;
  viewOnMapLabel: string;
  onSelect: StoreSelectHandler;
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
  '--carousel-front-card-width': string;
  '--carousel-globe-center-shift-y': string;
  '--carousel-ring-width': string;
  '--carousel-perspective': string;
  '--globe-tilt': string;
  '--carousel-scene-offset-y': string;
  '--carousel-front-z-offset': string;
  '--carousel-front-drop-y': string;
  '--carousel-front-actions-margin-top': string;
  '--stores-globe-rotate-duration': string;
};

/**
 * 3D ring carousel — globe-like Y rotation; uniform card sizes.
 */
export function PartnerStoresCarousel({
  stores,
  selectedStoreId,
  viewOnMapLabel,
  onSelect,
  ariaLabel,
}: PartnerStoresCarouselProps) {
  const count = stores.length;
  const [rotationIndex, setRotationIndex] = useState(() =>
    getStoreIndex(stores, selectedStoreId),
  );
  const activeIndex = normalizeIndex(rotationIndex, count);
  const { layout, isMobile } = useCarouselLayout(count);
  const [isPaused, setIsPaused] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const autoRotateRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<HTMLDivElement>(null);
  const wheelLockedRef = useRef(false);
  const touchStartXRef = useRef(0);

  const carouselStyle: CarouselRootStyle = {
    '--carousel-radius': `${layout.radiusPx}px`,
    '--carousel-card-width': `${layout.cardWidthPx}px`,
    '--carousel-front-card-width': isMobile
      ? `${CAROUSEL_FRONT_CARD_WIDTH_MOBILE_PX}px`
      : `${layout.cardWidthPx}px`,
    '--carousel-globe-center-shift-y': isMobile
      ? `-${CAROUSEL_GLOBE_CENTER_SHIFT_UP_MOBILE_PX}px`
      : '0px',
    '--carousel-ring-width': `${layout.ringWidthPx}px`,
    '--carousel-perspective': `${layout.perspectivePx}px`,
    '--globe-tilt': `${layout.globeTiltDeg}deg`,
    '--carousel-scene-offset-y': `-${layout.sceneShiftUpPx}px`,
    '--carousel-front-z-offset': `${layout.frontFaceZOffsetPx}px`,
    '--carousel-front-drop-y': `${
      isMobile ? CAROUSEL_FRONT_DROP_MOBILE_PX : CAROUSEL_FRONT_DROP_DESKTOP_PX
    }px`,
    '--carousel-front-actions-margin-top': `${
      isMobile ? CAROUSEL_FRONT_ACTIONS_MARGIN_TOP_MOBILE_REM : CAROUSEL_FRONT_ACTIONS_MARGIN_TOP_REM
    }rem`,
    '--stores-globe-rotate-duration': `${GLOBE_ROTATE_DURATION_S}s`,
  };

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setPrefersReducedMotion(media.matches);
    update();
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    const targetIndex = getStoreIndex(stores, selectedStoreId);
    setRotationIndex((prev) => getRotationIndexForTarget(prev, targetIndex, count));
  }, [count, selectedStoreId, stores]);

  const goToIndex = useCallback(
    (index: number, options?: { scrollToMap?: boolean }) => {
      const normalizedIndex = normalizeIndex(index, count);
      setRotationIndex((prev) => getRotationIndexForTarget(prev, normalizedIndex, count));
      const store = stores[normalizedIndex];
      if (store && store.id !== selectedStoreId) {
        onSelect(store.id, options);
      }
    },
    [count, onSelect, selectedStoreId, stores],
  );

  const advanceRotation = useCallback(
    (delta: number, options?: { scrollToMap?: boolean }) => {
      setRotationIndex((prev) => prev + delta);
      const store = stores[normalizeIndex(activeIndex + delta, count)];
      if (store && store.id !== selectedStoreId) {
        onSelect(store.id, options);
      }
    },
    [activeIndex, count, onSelect, selectedStoreId, stores],
  );

  const focusStoreAtIndex = useCallback(
    (index: number) => {
      goToIndex(index, { scrollToMap: true });
    },
    [goToIndex],
  );

  const selectFromCarouselCard = useCallback<StoreSelectHandler>(
    (storeId, options) => {
      onSelect(storeId, options);
    },
    [onSelect],
  );

  const handleCardHitClick = useCallback(
    (index: number, event: MouseEvent<HTMLDivElement>) => {
      const target = event.target as HTMLElement;
      if (target.closest('a, button')) {
        return;
      }
      focusStoreAtIndex(index);
    },
    [focusStoreAtIndex],
  );

  const goToPrevious = useCallback(() => {
    advanceRotation(-1);
  }, [advanceRotation]);

  const goToNext = useCallback(() => {
    advanceRotation(1);
  }, [advanceRotation]);

  const lockWheel = useCallback(() => {
    wheelLockedRef.current = true;
    window.setTimeout(() => {
      wheelLockedRef.current = false;
    }, CAROUSEL_ROTATION_MS);
  }, []);

  useEffect(() => {
    const carousel = carouselRef.current;
    if (!carousel || count < 2 || prefersReducedMotion) {
      return undefined;
    }

    const handleWheel = (event: WheelEvent) => {
      event.preventDefault();
      if (wheelLockedRef.current || Math.abs(event.deltaY) < 8) {
        return;
      }
      lockWheel();
      if (event.deltaY > 0) {
        advanceRotation(1);
      } else {
        advanceRotation(-1);
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
        advanceRotation(1);
      } else {
        advanceRotation(-1);
      }
    };

    const scene = sceneRef.current;
    carousel.addEventListener('wheel', handleWheel, { passive: false });
    scene?.addEventListener('touchstart', handleTouchStart, { passive: true });
    scene?.addEventListener('touchend', handleTouchEnd, { passive: true });
    return () => {
      carousel.removeEventListener('wheel', handleWheel);
      scene?.removeEventListener('touchstart', handleTouchStart);
      scene?.removeEventListener('touchend', handleTouchEnd);
    };
  }, [advanceRotation, count, lockWheel, prefersReducedMotion]);

  useEffect(() => {
    if (autoRotateRef.current) {
      clearInterval(autoRotateRef.current);
      autoRotateRef.current = null;
    }

    if (count < 2 || isPaused || prefersReducedMotion) {
      return undefined;
    }

    autoRotateRef.current = setInterval(() => {
      advanceRotation(1);
    }, CAROUSEL_AUTO_ROTATE_MS);

    return () => {
      if (autoRotateRef.current) {
        clearInterval(autoRotateRef.current);
      }
    };
  }, [advanceRotation, count, isPaused, prefersReducedMotion]);

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

  const activeStore = stores[activeIndex];
  const globeSizePx = isMobile
    ? GLOBE_CAROUSEL_SIZE_MOBILE_PX
    : GLOBE_CAROUSEL_SIZE_DESKTOP_PX;

  return (
    <div
      ref={carouselRef}
      className={`partner-stores-carousel${isMobile ? ' partner-stores-carousel--mobile' : ''}`}
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
              <div className="partner-stores-carousel-globe-center">
                <Globe sizePx={globeSizePx} />
              </div>
              {stores.map((store, index) => {
                const isFrontCard = index === activeIndex;
                const globePresentation = getCarouselItemGlobePresentation(
                  index,
                  rotationIndex,
                  layout.angleStepDeg,
                  layout,
                );
                const itemStyle: CarouselItemStyle = {
                  '--slot-angle': `${getCarouselSlotAngleDeg(index, rotationIndex, layout)}deg`,
                  '--item-lift': `${globePresentation.liftPx}px`,
                  '--item-scale': String(globePresentation.scale),
                  '--item-opacity': String(globePresentation.opacity),
                };

                const card = (
                  <PartnerStoreCard
                    store={store}
                    isSelected={selectedStoreId === store.id}
                    viewOnMapLabel={viewOnMapLabel}
                    onSelect={selectFromCarouselCard}
                    compact
                    previewOnly={!isFrontCard}
                    hideActions
                  />
                );

                const hitClassName = isFrontCard
                  ? 'partner-stores-carousel-card-hit partner-stores-carousel-card-hit--front'
                  : 'partner-stores-carousel-card-hit partner-stores-carousel-card-hit--side';

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
                      <div
                        role="button"
                        className={hitClassName}
                        tabIndex={isFrontCard ? 0 : -1}
                        aria-label={store.name}
                        onClick={(event) => handleCardHitClick(index, event)}
                        onKeyDown={(event) => {
                          if (event.key === 'Enter' || event.key === ' ') {
                            event.preventDefault();
                            focusStoreAtIndex(index);
                          }
                        }}
                      >
                        {card}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <div className="partner-stores-carousel-front-actions">
        <PartnerStoreCardActions
          store={activeStore}
          compact
          isSelected={selectedStoreId === activeStore.id}
          viewOnMapLabel={viewOnMapLabel}
          onSelect={selectFromCarouselCard}
          previewOnly={false}
        />
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
