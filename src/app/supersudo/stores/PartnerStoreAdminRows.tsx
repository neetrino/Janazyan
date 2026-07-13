'use client';

import type { DragEvent } from 'react';
import { Button } from '@shop/ui';
import { PartnerStoreDragHandle } from './PartnerStoreDragHandle';
import type { PartnerStoreDragState, PartnerStoreDropIndicator } from './partner-store-drag';
import type { AdminPartnerStore } from './types';

type StoreRowsProps = {
  stores: AdminPartnerStore[];
  regionId: string;
  areaId: string | null;
  reordering: boolean;
  reorderEnabled: boolean;
  dragState: PartnerStoreDragState | null;
  dropIndicator: PartnerStoreDropIndicator | null;
  onEdit: (store: AdminPartnerStore) => void;
  onDelete: (store: AdminPartnerStore) => void;
  onDragStart: (state: PartnerStoreDragState) => void;
  onDragEnd: () => void;
  onDragOverItem: (params: {
    event: DragEvent<HTMLElement>;
    targetId: string;
    scope: 'store';
    regionId: string;
    areaId: string | null;
    siblingIds: string[];
  }) => void;
  onDropItem: () => void;
  publishedLabel: string;
  draftLabel: string;
  editLabel: string;
  deleteLabel: string;
  dragLabel: string;
};

export function PartnerStoreAdminRows({
  stores,
  regionId,
  areaId,
  reordering,
  reorderEnabled,
  dragState,
  dropIndicator,
  onEdit,
  onDelete,
  onDragStart,
  onDragEnd,
  onDragOverItem,
  onDropItem,
  publishedLabel,
  draftLabel,
  editLabel,
  deleteLabel,
  dragLabel,
}: StoreRowsProps) {
  const siblingIds = stores.map((store) => store.id);

  return (
    <div className="space-y-2">
      {stores.map((store) => {
        const isDragging = dragState?.id === store.id;
        const showAbove =
          dropIndicator?.scope === 'store' &&
          dropIndicator.regionId === regionId &&
          dropIndicator.areaId === areaId &&
          dropIndicator.beforeId === store.id;
        const showBelow =
          dropIndicator?.scope === 'store' &&
          dropIndicator.regionId === regionId &&
          dropIndicator.areaId === areaId &&
          dropIndicator.beforeId === 'end' &&
          siblingIds[siblingIds.length - 1] === store.id;

        const rowClassName = [
          'flex flex-wrap items-center justify-between gap-3 rounded-lg border border-gray-200 bg-white p-3',
          isDragging ? 'opacity-40 outline outline-2 outline-dashed outline-blue-200' : '',
          showAbove ? 'shadow-[inset_0_3px_0_0_#60a5fa] bg-blue-50/30' : '',
          showBelow ? 'shadow-[inset_0_-3px_0_0_#60a5fa] bg-blue-50/30' : '',
        ]
          .filter(Boolean)
          .join(' ');

        return (
          <div
            key={store.id}
            className={rowClassName}
            onDragOver={(event) => {
              if (!reorderEnabled || !dragState || dragState.scope !== 'store') {
                return;
              }
              onDragOverItem({
                event,
                targetId: store.id,
                scope: 'store',
                regionId,
                areaId,
                siblingIds,
              });
            }}
            onDrop={(event) => {
              event.preventDefault();
              onDropItem();
            }}
          >
            <div className="flex min-w-0 items-start gap-2">
              {reorderEnabled ? (
                <PartnerStoreDragHandle
                  itemId={store.id}
                  disabled={reordering}
                  label={dragLabel}
                  onDragStart={() =>
                    onDragStart({
                      scope: 'store',
                      id: store.id,
                      regionId,
                      areaId,
                      siblingIds,
                    })
                  }
                  onDragEnd={onDragEnd}
                />
              ) : null}
              <div className="min-w-0">
                <p className="font-medium text-gray-900">{store.name}</p>
                <p className="text-sm text-gray-600">{store.address}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span
                className={`rounded-full px-2 py-0.5 text-xs ${
                  store.published ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
                }`}
              >
                {store.published ? publishedLabel : draftLabel}
              </span>
              <Button variant="outline" size="sm" onClick={() => onEdit(store)}>
                {editLabel}
              </Button>
              <Button variant="outline" size="sm" onClick={() => void onDelete(store)}>
                {deleteLabel}
              </Button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
