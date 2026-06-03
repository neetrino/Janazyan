import {
  HEADER_ACTIVE_PILL_OFFSET_X_PX,
  HEADER_ACTIVE_PILL_OFFSET_Y_PX,
  type HeaderNavPillPosition,
} from './header-nav-pill.constants';

const HEADER_ACTIVE_PILL_HORIZONTAL_PADDING_PX = Math.abs(HEADER_ACTIVE_PILL_OFFSET_X_PX) * 2;

export function getPillPositionForLink(
  link: HTMLAnchorElement,
  nav: HTMLElement,
): HeaderNavPillPosition {
  const navRect = nav.getBoundingClientRect();
  const linkRect = link.getBoundingClientRect();
  return {
    left: linkRect.left - navRect.left + HEADER_ACTIVE_PILL_OFFSET_X_PX,
    top: linkRect.top - navRect.top + HEADER_ACTIVE_PILL_OFFSET_Y_PX,
    width: linkRect.width + HEADER_ACTIVE_PILL_HORIZONTAL_PADDING_PX,
  };
}

export function getLinkCenterX(link: HTMLAnchorElement, nav: HTMLElement): number {
  const navRect = nav.getBoundingClientRect();
  const linkRect = link.getBoundingClientRect();
  return linkRect.left + linkRect.width / 2 - navRect.left;
}

export function getPillCenterX(position: HeaderNavPillPosition): number {
  return position.left + position.width / 2;
}

export function getPillLeftFromPointer(
  clientX: number,
  nav: HTMLElement,
  pillWidth: number,
): number {
  const navRect = nav.getBoundingClientRect();
  return clientX - navRect.left - pillWidth / 2;
}

export function findNearestLinkIndex(
  pillCenterX: number,
  links: ReadonlyArray<HTMLAnchorElement | null>,
  nav: HTMLElement,
): number {
  let bestIndex = 0;
  let bestDistance = Number.POSITIVE_INFINITY;

  links.forEach((link, index) => {
    if (!link) {
      return;
    }
    const distance = Math.abs(getLinkCenterX(link, nav) - pillCenterX);
    if (distance < bestDistance) {
      bestDistance = distance;
      bestIndex = index;
    }
  });

  return bestIndex;
}

export function findNearestLinkIndexFromPointer(
  clientX: number,
  links: ReadonlyArray<HTMLAnchorElement | null>,
  nav: HTMLElement,
): number {
  const navRect = nav.getBoundingClientRect();
  const pointerX = clientX - navRect.left;
  return findNearestLinkIndex(pointerX, links, nav);
}

export function clampPillLeft(
  left: number,
  links: ReadonlyArray<HTMLAnchorElement | null>,
  nav: HTMLElement,
  pillWidth: number,
): number {
  const anchors = links.filter((link): link is HTMLAnchorElement => link !== null);
  if (anchors.length === 0) {
    return left;
  }

  const first = anchors[0];
  const last = anchors[anchors.length - 1];
  const minLeft = getPillPositionForLink(first, nav).left;
  const maxLeft = getPillPositionForLink(last, nav).left + last.getBoundingClientRect().width
    - pillWidth
    + HEADER_ACTIVE_PILL_HORIZONTAL_PADDING_PX;

  return Math.min(Math.max(left, minLeft), maxLeft);
}
