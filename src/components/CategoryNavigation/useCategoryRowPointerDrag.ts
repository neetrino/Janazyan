'use client';

import { useRef, type MouseEvent, type PointerEvent, type RefObject } from 'react';

/** Ignore click jitter. Capture and suppress navigation only after a real drag. */
const CATEGORY_ROW_DRAG_THRESHOLD_PX = 10;

type DragSession = {
  pointerId: number;
  startX: number;
  scrollLeft: number;
  moved: boolean;
};

/**
 * Lets a mouse drag the category pill row horizontally.
 * A short move still counts as a click so pills stay links.
 */
export function useCategoryRowPointerDrag(rowRef: RefObject<HTMLDivElement | null>) {
  const sessionRef = useRef<DragSession | null>(null);
  const suppressClickRef = useRef(false);

  const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType === 'touch' || event.button !== 0) {
      return;
    }
    const row = rowRef.current;
    if (!row || row.scrollWidth <= row.clientWidth) {
      return;
    }
    sessionRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      scrollLeft: row.scrollLeft,
      moved: false,
    };
  };

  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const session = sessionRef.current;
    const row = rowRef.current;
    if (!session || !row || session.pointerId !== event.pointerId) {
      return;
    }
    const delta = event.clientX - session.startX;
    if (!session.moved && Math.abs(delta) < CATEGORY_ROW_DRAG_THRESHOLD_PX) {
      return;
    }
    if (!session.moved) {
      session.moved = true;
      // Capture only after a drag starts. Capturing on pointerdown retargets
      // the click away from the category link, so a tap never navigates.
      row.setPointerCapture(event.pointerId);
    }
    row.scrollLeft = session.scrollLeft - delta;
    event.preventDefault();
  };

  const finishDrag = (event: PointerEvent<HTMLDivElement>) => {
    const session = sessionRef.current;
    if (!session || session.pointerId !== event.pointerId) {
      return;
    }
    sessionRef.current = null;
    if (session.moved) {
      const row = rowRef.current;
      const scrolled = row ? row.scrollLeft !== session.scrollLeft : false;
      if (scrolled) {
        suppressClickRef.current = true;
        // Click is dispatched after pointerup. If the browser drops it, clear
        // the flag so the next category tap is not swallowed.
        window.setTimeout(() => {
          suppressClickRef.current = false;
        }, 0);
      }
    }
    const row = rowRef.current;
    if (row?.hasPointerCapture(event.pointerId)) {
      row.releasePointerCapture(event.pointerId);
    }
  };

  const onClickCapture = (event: MouseEvent<HTMLDivElement>) => {
    if (!suppressClickRef.current) {
      return;
    }
    suppressClickRef.current = false;
    event.preventDefault();
    event.stopPropagation();
  };

  return { onPointerDown, onPointerMove, onPointerUp: finishDrag, onPointerCancel: finishDrag, onClickCapture };
}
