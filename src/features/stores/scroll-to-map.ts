import { STORES_MAP_SCROLL_BREAKPOINT_PX } from './constants';

/**
 * Smooth-scrolls the map block into view on stacked (mobile/tablet) layouts.
 */
export function scrollPartnerMapIntoView(mapSection: HTMLElement | null): void {
  if (!mapSection) {
    return;
  }

  const isStackedLayout = window.matchMedia(
    `(max-width: ${STORES_MAP_SCROLL_BREAKPOINT_PX}px)`,
  ).matches;

  if (!isStackedLayout) {
    return;
  }

  const prefersReducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)',
  ).matches;

  const behavior = prefersReducedMotion ? 'auto' : 'smooth';

  window.requestAnimationFrame(() => {
    mapSection.scrollIntoView({ behavior, block: 'start' });
  });
}
