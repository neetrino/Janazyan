'use client';

import { useRef, type MouseEvent, type PointerEvent, type RefObject } from 'react';

const CATEGORY_ROW_DRAG_THRESHOLD_PX = 5;

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
    if (event.pointerType !== 'mouse' || event.button !== 0) {
      return;
    }
    const row = rowRef.current;
    if (!row) {
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
      row.setPointerCapture(event.pointerId);
    }
    row.scrollLeft = session.scrollLeft - delta;
  };

  const finishDrag = (event: PointerEvent<HTMLDivElement>) => {
    const session = sessionRef.current;
    if (!session || session.pointerId !== event.pointerId) {
      return;
    }
    sessionRef.current = null;
    if (session.moved) {
      suppressClickRef.current = true;
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
