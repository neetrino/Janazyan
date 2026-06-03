'use client';

import { useEffect, useMemo, useState } from 'react';
import { CAROUSEL_MOBILE_BREAKPOINT_PX } from './carousel-constants';
import { getCarouselRingLayout, type CarouselRingLayout } from './carousel-layout';

/** Reactive ring layout from store count and viewport width. */
export function useCarouselLayout(storeCount: number): CarouselRingLayout {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const query = `(max-width: ${CAROUSEL_MOBILE_BREAKPOINT_PX - 1}px)`;
    const media = window.matchMedia(query);
    const update = () => setIsMobile(media.matches);
    update();
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);

  return useMemo(
    () => getCarouselRingLayout(storeCount, isMobile),
    [isMobile, storeCount],
  );
}
