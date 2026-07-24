'use client';

import { useEffect, useState } from 'react';
import { getAdminMobileMediaQuery } from '../admin-mobile.constants';

/**
 * `true` below Tailwind `lg` (admin mobile shell).
 * `null` until the first media-query read (avoids SSR/desktop mismatch).
 */
export function useAdminMobileViewport(): boolean | null {
  const [isMobile, setIsMobile] = useState<boolean | null>(null);

  useEffect(() => {
    const media = window.matchMedia(getAdminMobileMediaQuery());
    const update = () => {
      setIsMobile(media.matches);
    };

    update();
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);

  return isMobile;
}
