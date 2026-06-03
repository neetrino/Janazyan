'use client';

import { useEffect, useState } from 'react';
import { CAROUSEL_MOBILE_BREAKPOINT_PX } from './carousel-constants';

/** True when viewport matches stores/carousel mobile layout (< md). */
export function useStoresMobileViewport(): boolean {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const query = `(max-width: ${CAROUSEL_MOBILE_BREAKPOINT_PX - 1}px)`;
    const media = window.matchMedia(query);
    const update = () => setIsMobile(media.matches);
    update();
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);

  return isMobile;
}
