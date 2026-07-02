'use client';

import { useRouter } from 'next/navigation';
import {
  useCallback,
  useLayoutEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from 'react';
import { isNavLinkActive } from '../../lib/nav/is-nav-link-active';
import type { HeaderNavPillPosition } from './header-nav-pill.constants';
import {
  clampPillLeft,
  findNearestLinkIndex,
  findNearestLinkIndexFromPointer,
  getPillCenterX,
  getPillLeftFromPointer,
  getPillPositionForLink,
} from './header-nav-pill.utils';

type NavLink = {
  href: string;
  label?: string;
};

type UseHeaderNavActivePillParams = {
  links: ReadonlyArray<NavLink>;
  pathname: string;
  searchParams: URLSearchParams;
};

function getLinksLayoutKey(links: ReadonlyArray<NavLink>): string {
  return links.map((link) => `${link.href}\0${link.label ?? ''}`).join('\n');
}

function isSamePillPosition(
  current: HeaderNavPillPosition,
  next: HeaderNavPillPosition,
): boolean {
  return (
    current.left === next.left &&
    current.top === next.top &&
    current.width === next.width
  );
}

export function useHeaderNavActivePill({
  links,
  pathname,
  searchParams,
}: UseHeaderNavActivePillParams) {
  const router = useRouter();
  const navRef = useRef<HTMLElement>(null);
  const linkRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const [pillPosition, setPillPosition] = useState<HeaderNavPillPosition>({
    left: 0,
    top: 0,
    width: 0,
  });
  const pillTopRef = useRef(0);
  const pointerDownClientXRef = useRef<number | null>(null);
  const didPointerDragRef = useRef(false);
  const [isDragging, setIsDragging] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const activeIndex = links.findIndex((link) =>
    isNavLinkActive(pathname, link.href, searchParams),
  );
  const linksLayoutKey = getLinksLayoutKey(links);

  const syncPillToIndex = useCallback((index: number) => {
    const nav = navRef.current;
    const link = linkRefs.current[index];
    if (!nav || !link) {
      return;
    }
    const nextPosition = getPillPositionForLink(link, nav);
    pillTopRef.current = nextPosition.top;
    setPillPosition((current) =>
      isSamePillPosition(current, nextPosition) ? current : nextPosition,
    );
  }, []);

  const syncPillToActive = useCallback(() => {
    if (activeIndex >= 0) {
      syncPillToIndex(activeIndex);
    }
  }, [activeIndex, syncPillToIndex]);

  useLayoutEffect(() => {
    if (isDragging) {
      return;
    }
    syncPillToActive();
  }, [isDragging, syncPillToActive, linksLayoutKey]);

  useLayoutEffect(() => {
    const nav = navRef.current;
    if (!nav) {
      return;
    }

    const observer = new ResizeObserver(() => {
      if (!isDragging) {
        syncPillToActive();
      }
    });

    observer.observe(nav);
    return () => observer.disconnect();
  }, [isDragging, syncPillToActive]);

  const setLinkRef = useCallback(
    (index: number) => (element: HTMLAnchorElement | null) => {
      linkRefs.current[index] = element;
    },
    [],
  );

  const updateDragPosition = useCallback((clientX: number) => {
    const nav = navRef.current;
    if (!nav) {
      return;
    }

    const hoveredIdx = findNearestLinkIndexFromPointer(clientX, linkRefs.current, nav);
    const hoveredLink = linkRefs.current[hoveredIdx];
    const pillWidth = hoveredLink
      ? getPillPositionForLink(hoveredLink, nav).width
      : pillPosition.width;

    const left = clampPillLeft(
      getPillLeftFromPointer(clientX, nav, pillWidth),
      linkRefs.current,
      nav,
      pillWidth,
    );
    const nextPosition: HeaderNavPillPosition = { left, top: pillTopRef.current, width: pillWidth };
    setPillPosition((current) =>
      isSamePillPosition(current, nextPosition) ? current : nextPosition,
    );
    setHoveredIndex(hoveredIdx);
  }, [pillPosition.width]);

  const handlePillPointerDown = useCallback((event: ReactPointerEvent<HTMLSpanElement>) => {
    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
    pointerDownClientXRef.current = event.clientX;
    didPointerDragRef.current = false;
    setIsDragging(true);
    updateDragPosition(event.clientX);
  }, [updateDragPosition]);

  const handlePillPointerMove = useCallback(
    (event: ReactPointerEvent<HTMLSpanElement>) => {
      if (!isDragging) {
        return;
      }
      const pointerDownClientX = pointerDownClientXRef.current;
      if (pointerDownClientX !== null && Math.abs(event.clientX - pointerDownClientX) >= 4) {
        didPointerDragRef.current = true;
      }
      updateDragPosition(event.clientX);
    },
    [isDragging, updateDragPosition],
  );

  const finishDrag = useCallback(
    (clientX: number) => {
      const nav = navRef.current;
      if (!nav) {
        setIsDragging(false);
        setHoveredIndex(null);
        return;
      }

      const hoveredIdx = findNearestLinkIndexFromPointer(clientX, linkRefs.current, nav);
      const hoveredLink = linkRefs.current[hoveredIdx];
      const pillWidth = hoveredLink
        ? getPillPositionForLink(hoveredLink, nav).width
        : pillPosition.width;

      const left = clampPillLeft(
        getPillLeftFromPointer(clientX, nav, pillWidth),
        linkRefs.current,
        nav,
        pillWidth,
      );
      const targetIndex = findNearestLinkIndex(
        getPillCenterX({ left, top: pillTopRef.current, width: pillWidth }),
        linkRefs.current,
        nav,
      );

      setIsDragging(false);
      setHoveredIndex(null);
      syncPillToIndex(targetIndex);

      const targetHref = links[targetIndex]?.href;
      if (!targetHref) {
        return;
      }

      if (!isNavLinkActive(pathname, targetHref, searchParams)) {
        router.push(targetHref);
      }
    },
    [links, pathname, pillPosition.width, router, searchParams, syncPillToIndex],
  );

  const handlePillPointerUp = useCallback(
    (event: ReactPointerEvent<HTMLSpanElement>) => {
      if (event.currentTarget.hasPointerCapture(event.pointerId)) {
        event.currentTarget.releasePointerCapture(event.pointerId);
      }
      if (!isDragging) {
        return;
      }
      if (!didPointerDragRef.current) {
        setIsDragging(false);
        setHoveredIndex(null);
        pointerDownClientXRef.current = null;
        syncPillToActive();
        return;
      }
      pointerDownClientXRef.current = null;
      finishDrag(event.clientX);
    },
    [finishDrag, isDragging, syncPillToActive],
  );

  const handlePillPointerCancel = useCallback(
    (event: ReactPointerEvent<HTMLSpanElement>) => {
      if (event.currentTarget.hasPointerCapture(event.pointerId)) {
        event.currentTarget.releasePointerCapture(event.pointerId);
      }
      setIsDragging(false);
      setHoveredIndex(null);
      pointerDownClientXRef.current = null;
      didPointerDragRef.current = false;
      syncPillToActive();
    },
    [syncPillToActive],
  );

  const highlightedIndex = isDragging && hoveredIndex !== null ? hoveredIndex : activeIndex;

  return {
    navRef,
    setLinkRef,
    pillPosition,
    isDragging,
    highlightedIndex,
    activeIndex,
    pillPointerHandlers: {
      onPointerDown: handlePillPointerDown,
      onPointerMove: handlePillPointerMove,
      onPointerUp: handlePillPointerUp,
      onPointerCancel: handlePillPointerCancel,
    },
  };
}
