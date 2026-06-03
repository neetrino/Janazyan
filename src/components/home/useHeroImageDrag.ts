'use client';

import { useCallback, useRef, useState } from 'react';
import type { PointerEvent as ReactPointerEvent } from 'react';
import { HERO_IMAGE_MAX_DRAG_RADIUS_PX } from './hero-slides';

export type HeroImageOffset = {
  x: number;
  y: number;
};

type DragSession = {
  slideId: string;
  startX: number;
  startY: number;
  originX: number;
  originY: number;
};

function clampOffsetToRadius(x: number, y: number): HeroImageOffset {
  const distance = Math.hypot(x, y);

  if (distance <= HERO_IMAGE_MAX_DRAG_RADIUS_PX || distance === 0) {
    return { x, y };
  }

  const scale = HERO_IMAGE_MAX_DRAG_RADIUS_PX / distance;
  return { x: x * scale, y: y * scale };
}

function createInitialOffsets(slideIds: readonly string[]): Record<string, HeroImageOffset> {
  return Object.fromEntries(slideIds.map((slideId) => [slideId, { x: 0, y: 0 }]));
}

/**
 * Pointer drag to move hero product images within a circular boundary.
 */
export function useHeroImageDrag(slideIds: readonly string[]) {
  const [offsets, setOffsets] = useState<Record<string, HeroImageOffset>>(() =>
    createInitialOffsets(slideIds),
  );
  const [draggingSlideId, setDraggingSlideId] = useState<string | null>(null);
  const dragSessionRef = useRef<DragSession | null>(null);

  const handlePointerDown = useCallback(
    (slideId: string, event: ReactPointerEvent<HTMLElement>) => {
      if (event.button !== 0) {
        return;
      }

      event.preventDefault();
      const origin = offsets[slideId] ?? { x: 0, y: 0 };
      dragSessionRef.current = {
        slideId,
        startX: event.clientX,
        startY: event.clientY,
        originX: origin.x,
        originY: origin.y,
      };
      setDraggingSlideId(slideId);
      event.currentTarget.setPointerCapture(event.pointerId);
    },
    [offsets],
  );

  const handlePointerMove = useCallback((slideId: string, event: ReactPointerEvent<HTMLElement>) => {
    const session = dragSessionRef.current;
    if (!session || session.slideId !== slideId) {
      return;
    }

    const deltaX = event.clientX - session.startX;
    const deltaY = event.clientY - session.startY;
    const nextOffset = clampOffsetToRadius(session.originX + deltaX, session.originY + deltaY);

    setOffsets((current) => ({
      ...current,
      [slideId]: nextOffset,
    }));
  }, []);

  const endDrag = useCallback((event: ReactPointerEvent<HTMLElement>) => {
    dragSessionRef.current = null;
    setDraggingSlideId(null);

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  }, []);

  const getDragHandlers = useCallback(
    (slideId: string) => ({
      onPointerDown: (event: ReactPointerEvent<HTMLElement>) => handlePointerDown(slideId, event),
      onPointerMove: (event: ReactPointerEvent<HTMLElement>) => handlePointerMove(slideId, event),
      onPointerUp: endDrag,
      onPointerCancel: endDrag,
    }),
    [endDrag, handlePointerDown, handlePointerMove],
  );

  return {
    offsets,
    draggingSlideId,
    getDragHandlers,
  };
}
