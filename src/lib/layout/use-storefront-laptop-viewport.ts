'use client';

import { useEffect, useState } from 'react';
import { STOREFRONT_LAPTOP_VIEWPORT_MAX_WIDTH_PX } from './storefront-hero-shell-background.constants';

const STOREFRONT_LAPTOP_MEDIA_QUERY = `(min-width: 1300px) and (max-width: ${STOREFRONT_LAPTOP_VIEWPORT_MAX_WIDTH_PX}px)`;

/** True on compact desktop / laptop widths (1300–1649px). */
export function useStorefrontLaptopViewport(): boolean {
  const [isLaptop, setIsLaptop] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(STOREFRONT_LAPTOP_MEDIA_QUERY);
    const update = () => setIsLaptop(media.matches);

    update();
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);

  return isLaptop;
}
