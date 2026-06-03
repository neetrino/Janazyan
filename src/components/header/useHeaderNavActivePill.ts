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
  getPillCenterX,
  getPillLeftFromPointer,
  getPillPositionForLink,
} from './header-nav-pill.utils';

type NavLink = {
  href: string;
};

type UseHeaderNavActivePillParams = {
  links: ReadonlyArray<NavLink>;
  pathname: string;
  searchParams: URLSearchParams;
};

export function useHeaderNavActivePill({
  links,
  pathname,
  searchParams,
}: UseHeaderNavActivePillParams) {
  const router = useRouter();
  const navRef = useRef<HTMLElement>(null);
  const linkRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const [pillPosition, setPillPosition] = useState<HeaderNavPillPosition>({ left: 0, top: 0 });
  const pillTopRef = useRef(0);
  const [isDragging, setIsDragging] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const activeIndex = links.findIndex((link) =>
    isNavLinkActive(pathname, link.href, searchParams),
  );

  const syncPillToIndex = useCallback((index: number) => {
    const nav = navRef.current;
    const link = linkRefs.current[index];
    if (!nav || !link) {
      return;
    }
    const nextPosition = getPillPositionForLink(link, nav);
    pillTopRef.current = nextPosition.top;
    setPillPosition(nextPosition);
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
  }, [isDragging, syncPillToActive]);

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

    const left = clampPillLeft(getPillLeftFromPointer(clientX, nav), linkRefs.current, nav);
    const nextPosition: HeaderNavPillPosition = { left, top: pillTopRef.current };
    setPillPosition(nextPosition);
    setHoveredIndex(findNearestLinkIndex(getPillCenterX(nextPosition), linkRefs.current, nav));
  }, []);

  const handlePillPointerDown = useCallback((event: ReactPointerEvent<HTMLSpanElement>) => {
    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
    setIsDragging(true);
    updateDragPosition(event.clientX);
  }, [updateDragPosition]);

  const handlePillPointerMove = useCallback(
    (event: ReactPointerEvent<HTMLSpanElement>) => {
      if (!isDragging) {
        return;
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

      const left = clampPillLeft(getPillLeftFromPointer(clientX, nav), linkRefs.current, nav);
      const targetIndex = findNearestLinkIndex(
        getPillCenterX({ left, top: pillTopRef.current }),
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
    [links, pathname, router, searchParams, syncPillToIndex],
  );

  const handlePillPointerUp = useCallback(
    (event: ReactPointerEvent<HTMLSpanElement>) => {
      if (event.currentTarget.hasPointerCapture(event.pointerId)) {
        event.currentTarget.releasePointerCapture(event.pointerId);
      }
      if (!isDragging) {
        return;
      }
      finishDrag(event.clientX);
    },
    [finishDrag, isDragging],
  );

  const handlePillPointerCancel = useCallback(
    (event: ReactPointerEvent<HTMLSpanElement>) => {
      if (event.currentTarget.hasPointerCapture(event.pointerId)) {
        event.currentTarget.releasePointerCapture(event.pointerId);
      }
      setIsDragging(false);
      setHoveredIndex(null);
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
