'use client';

import { useCallback, useState, type DragEvent } from 'react';
import {
  buildOrderedIdsFromDrop,
  resolveDropBeforeId,
  type PartnerStoreDragState,
  type PartnerStoreDropIndicator,
} from './partner-store-drag';

type PersistReorderPayload = {
  scope: 'region' | 'area' | 'store';
  orderedIds: string[];
  regionId?: string | null;
  areaId?: string | null;
};

type UsePartnerStoreDragReorderParams = {
  persistReorder: (payload: PersistReorderPayload) => void;
};

/**
 * Drag-and-drop state and handlers for partner-store hierarchy reordering.
 */
export function usePartnerStoreDragReorder({
  persistReorder,
}: UsePartnerStoreDragReorderParams) {
  const [dragState, setDragState] = useState<PartnerStoreDragState | null>(null);
  const [dropIndicator, setDropIndicator] = useState<PartnerStoreDropIndicator | null>(
    null,
  );

  const handleDragStart = useCallback((state: PartnerStoreDragState) => {
    setDragState(state);
    setDropIndicator(null);
  }, []);

  const handleDragEnd = useCallback(() => {
    setDragState(null);
    setDropIndicator(null);
  }, []);

  const handleDragOverItem = useCallback(
    (params: {
      event: DragEvent<HTMLElement>;
      targetId: string;
      scope: 'region' | 'area' | 'store';
      regionId: string | null;
      areaId: string | null;
      siblingIds: string[];
    }) => {
      if (!dragState || dragState.scope !== params.scope) {
        return;
      }
      if (dragState.id === params.targetId) {
        return;
      }
      if (dragState.regionId !== params.regionId || dragState.areaId !== params.areaId) {
        return;
      }

      params.event.preventDefault();
      params.event.dataTransfer.dropEffect = 'move';

      const bounds = params.event.currentTarget.getBoundingClientRect();
      const insertBefore = params.event.clientY < bounds.top + bounds.height / 2;
      const beforeId = resolveDropBeforeId(params.targetId, params.siblingIds, insertBefore);

      setDropIndicator({
        scope: params.scope,
        regionId: params.regionId,
        areaId: params.areaId,
        beforeId,
      });
    },
    [dragState],
  );

  const handleDropItem = useCallback(() => {
    if (!dragState || !dropIndicator || dragState.scope !== dropIndicator.scope) {
      handleDragEnd();
      return;
    }
    if (
      dragState.regionId !== dropIndicator.regionId ||
      dragState.areaId !== dropIndicator.areaId
    ) {
      handleDragEnd();
      return;
    }

    const orderedIds = buildOrderedIdsFromDrop(
      dragState.siblingIds,
      dragState.id,
      dropIndicator.beforeId,
    );
    const unchanged =
      !orderedIds ||
      orderedIds.every((id, index) => id === dragState.siblingIds[index]);

    handleDragEnd();

    if (!orderedIds || unchanged) {
      return;
    }

    persistReorder({
      scope: dragState.scope,
      orderedIds,
      regionId: dragState.regionId,
      areaId: dragState.areaId,
    });
  }, [dragState, dropIndicator, handleDragEnd, persistReorder]);

  return {
    dragState,
    dropIndicator,
    handleDragStart,
    handleDragEnd,
    handleDragOverItem,
    handleDropItem,
  };
}
