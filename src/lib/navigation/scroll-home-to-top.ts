import type { MouseEvent } from 'react';

const HOME_PATH = '/';

/**
 * On the home page, a logo click scrolls to the top.
 * From any other page the link still navigates home.
 */
export function handleHomeLogoClick(event: MouseEvent<HTMLAnchorElement>): void {
  if (window.location.pathname !== HOME_PATH) {
    return;
  }

  event.preventDefault();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}
