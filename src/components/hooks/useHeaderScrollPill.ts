'use client';

import { useEffect, useState } from 'react';

/** Scroll distance before the home header switches to the pill. */
const HEADER_SCROLL_PILL_THRESHOLD_PX = 8;

/** True after the page leaves the top, so the home header can become a pill. */
export function useHeaderScrollPill(): boolean {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const sync = () => {
      setScrolled(window.scrollY > HEADER_SCROLL_PILL_THRESHOLD_PX);
    };

    sync();
    window.addEventListener('scroll', sync, { passive: true });
    return () => window.removeEventListener('scroll', sync);
  }, []);

  return scrolled;
}
