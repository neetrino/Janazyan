'use client';

import { useMemo } from 'react';
import { getCarouselRingLayout, type CarouselRingLayout } from './carousel-layout';
import { useStoresMobileViewport } from './use-stores-mobile-viewport';

export type CarouselLayoutState = {
  layout: CarouselRingLayout;
  isMobile: boolean;
};

/** Reactive ring layout from store count and viewport width. */
export function useCarouselLayout(storeCount: number): CarouselLayoutState {
  const isMobile = useStoresMobileViewport();

  const layout = useMemo(
    () => getCarouselRingLayout(storeCount, isMobile),
    [isMobile, storeCount],
  );

  return { layout, isMobile };
}
