'use client';

import { useState, type DragEvent } from 'react';
import { Button } from '@shop/ui';
import { PartnerStoreAdminRows } from './PartnerStoreAdminRows';
import { PartnerStoreDragHandle } from './PartnerStoreDragHandle';
import type { PartnerStoreDragState, PartnerStoreDropIndicator } from './partner-store-drag';
import type {
  AdminPartnerStore,
  AdminPartnerStoreArea,
  AdminPartnerStoreRegion,
} from './types';

type PartnerStoresAdminTreeProps = {
  regions: AdminPartnerStoreRegion[];
  areasByRegion: Map<string, AdminPartnerStoreArea[]>;
  storesByRegion: Map<string, AdminPartnerStore[]>;
  expandedRegionIds: Set<string>;
  reordering: boolean;
  reorderEnabled: boolean;
  dragState: PartnerStoreDragState | null;
  dropIndicator: PartnerStoreDropIndicator | null;
  onToggleRegion: (regionId: string) => void;
  onAddArea: (regionId: string) => void;
  onAddStore: (regionId?: string, areaId?: string) => void;
  onEditStore: (store: AdminPartnerStore) => void;
  onDeleteStore: (store: AdminPartnerStore) => void;
  onDragStart: (state: PartnerStoreDragState) => void;
  onDragEnd: () => void;
  onDragOverItem: (params: {
    event: DragEvent<HTMLElement>;
    targetId: string;
    scope: 'region' | 'area' | 'store';
    regionId: string | null;
    areaId: string | null;
    siblingIds: string[];
  }) => void;
  onDropItem: () => void;
  labels: {
    addArea: string;
    addStoreHere: string;
    noStoresInArea: string;
    directStores: string;
    noStores: string;
    published: string;
    draft: string;
    edit: string;
    delete: string;
    dragToReorder: string;
  };
};

export function PartnerStoresAdminTree({
  regions,
  areasByRegion,
  storesByRegion,
  expandedRegionIds,
  reordering,
  reorderEnabled,
  dragState,
  dropIndicator,
  onToggleRegion,
  onAddArea,
  onAddStore,
  onEditStore,
  onDeleteStore,
  onDragStart,
  onDragEnd,
  onDragOverItem,
  onDropItem,
  labels,
}: PartnerStoresAdminTreeProps) {
  const [expandedAreaIds, setExpandedAreaIds] = useState<Set<string>>(new Set());
  const regionIds = regions.map((region) => region.id);

  const toggleArea = (areaId: string) => {
    setExpandedAreaIds((current) => {
      const next = new Set(current);
      if (next.has(areaId)) {
        next.delete(areaId);
      } else {
        next.add(areaId);
      }
      return next;
    });
  };

  return (
    <div className="space-y-3">
      {regions.map((region) => {
        const regionStores = storesByRegion.get(region.id) ?? [];
        const regionAreas = areasByRegion.get(region.id) ?? [];
        const areaIds = regionAreas.map((area) => area.id);
        const expanded = expandedRegionIds.has(region.id);
        const directStores = regionStores.filter((store) => !store.areaId);
        const isDragging = dragState?.id === region.id && dragState.scope === 'region';
        const showAbove =
          dropIndicator?.scope === 'region' && dropIndicator.beforeId === region.id;
        const showBelow =
          dropIndicator?.scope === 'region' &&
          dropIndicator.beforeId === 'end' &&
          regionIds[regionIds.length - 1] === region.id;

        const regionClassName = [
          'rounded-xl border border-gray-200 bg-white',
          isDragging ? 'opacity-40 outline outline-2 outline-dashed outline-blue-200' : '',
          showAbove ? 'shadow-[inset_0_3px_0_0_#60a5fa] bg-blue-50/20' : '',
          showBelow ? 'shadow-[inset_0_-3px_0_0_#60a5fa] bg-blue-50/20' : '',
        ]
          .filter(Boolean)
          .join(' ');

        return (
          <div
            key={region.id}
            className={regionClassName}
            onDragOver={(event) => {
              if (!reorderEnabled || !dragState || dragState.scope !== 'region') {
                return;
              }
              onDragOverItem({
                event,
                targetId: region.id,
                scope: 'region',
                regionId: null,
                areaId: null,
                siblingIds: regionIds,
              });
            }}
            onDrop={(event) => {
              event.preventDefault();
              if (dragState?.scope === 'region') {
                onDropItem();
              }
            }}
          >
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-100 px-4 py-3">
              <div className="flex min-w-0 items-center gap-2">
                {reorderEnabled ? (
                  <PartnerStoreDragHandle
                    itemId={region.id}
                    disabled={reordering}
                    label={labels.dragToReorder}
                    onDragStart={() =>
                      onDragStart({
                        scope: 'region',
                        id: region.id,
                        regionId: null,
                        areaId: null,
                        siblingIds: regionIds,
                      })
                    }
                    onDragEnd={onDragEnd}
                  />
                ) : null}
                <button
                  type="button"
                  className="text-left font-semibold text-gray-900"
                  onClick={() => onToggleRegion(region.id)}
                  aria-expanded={expanded}
                >
                  {expanded ? '▾ ' : '▸ '}
                  {region.name}
                  <span className="ml-2 text-xs font-normal text-gray-500">
                    ({regionStores.length})
                  </span>
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" size="sm" onClick={() => onAddArea(region.id)}>
                  {labels.addArea}
                </Button>
                <Button variant="outline" size="sm" onClick={() => onAddStore(region.id)}>
                  {labels.addStoreHere}
                </Button>
              </div>
            </div>

            {expanded ? (
              <div className="space-y-3 p-4">
                {regionAreas.map((area) => {
                  const areaStores = regionStores.filter((store) => store.areaId === area.id);
                  const areaExpanded = expandedAreaIds.has(area.id);
                  const isAreaDragging =
                    dragState?.id === area.id && dragState.scope === 'area';
                  const showAreaAbove =
                    dropIndicator?.scope === 'area' &&
                    dropIndicator.regionId === region.id &&
                    dropIndicator.beforeId === area.id;
                  const showAreaBelow =
                    dropIndicator?.scope === 'area' &&
                    dropIndicator.regionId === region.id &&
                    dropIndicator.beforeId === 'end' &&
                    areaIds[areaIds.length - 1] === area.id;

                  const areaClassName = [
                    'rounded-lg border border-gray-100 bg-gray-50 p-3',
                    isAreaDragging
                      ? 'opacity-40 outline outline-2 outline-dashed outline-blue-200'
                      : '',
                    showAreaAbove ? 'shadow-[inset_0_3px_0_0_#60a5fa] bg-blue-50/40' : '',
                    showAreaBelow ? 'shadow-[inset_0_-3px_0_0_#60a5fa] bg-blue-50/40' : '',
                  ]
                    .filter(Boolean)
                    .join(' ');

                  return (
                    <div
                      key={area.id}
                      className={areaClassName}
                      onDragOver={(event) => {
                        if (!reorderEnabled || !dragState || dragState.scope !== 'area') {
                          return;
                        }
                        onDragOverItem({
                          event,
                          targetId: area.id,
                          scope: 'area',
                          regionId: region.id,
                          areaId: null,
                          siblingIds: areaIds,
                        });
                      }}
                      onDrop={(event) => {
                        event.preventDefault();
                        if (dragState?.scope === 'area') {
                          onDropItem();
                        }
                      }}
                    >
                      <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                        <div className="flex min-w-0 items-center gap-2">
                          {reorderEnabled ? (
                            <PartnerStoreDragHandle
                              itemId={area.id}
                              disabled={reordering}
                              label={labels.dragToReorder}
                              onDragStart={() =>
                                onDragStart({
                                  scope: 'area',
                                  id: area.id,
                                  regionId: region.id,
                                  areaId: null,
                                  siblingIds: areaIds,
                                })
                              }
                              onDragEnd={onDragEnd}
                            />
                          ) : null}
                          <button
                            type="button"
                            className="text-left font-medium text-gray-800"
                            onClick={() => toggleArea(area.id)}
                            aria-expanded={areaExpanded}
                          >
                            {areaExpanded ? '▾ ' : '▸ '}
                            {area.name}
                            <span className="ml-2 text-xs font-normal text-gray-500">
                              ({areaStores.length})
                            </span>
                          </button>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onAddStore(region.id, area.id)}
                        >
                          {labels.addStoreHere}
                        </Button>
                      </div>
                      {areaExpanded ? (
                        areaStores.length === 0 ? (
                          <p className="text-xs text-gray-500">{labels.noStoresInArea}</p>
                        ) : (
                          <PartnerStoreAdminRows
                            stores={areaStores}
                            regionId={region.id}
                            areaId={area.id}
                            reordering={reordering}
                            reorderEnabled={reorderEnabled}
                            dragState={dragState}
                            dropIndicator={dropIndicator}
                            onEdit={onEditStore}
                            onDelete={onDeleteStore}
                            onDragStart={onDragStart}
                            onDragEnd={onDragEnd}
                            onDragOverItem={onDragOverItem}
                            onDropItem={onDropItem}
                            publishedLabel={labels.published}
                            draftLabel={labels.draft}
                            editLabel={labels.edit}
                            deleteLabel={labels.delete}
                            dragLabel={labels.dragToReorder}
                          />
                        )
                      ) : null}
                    </div>
                  );
                })}

                {directStores.length > 0 ? (
                  <div>
                    <p className="mb-2 text-xs font-medium uppercase tracking-wide text-gray-500">
                      {labels.directStores}
                    </p>
                    <PartnerStoreAdminRows
                      stores={directStores}
                      regionId={region.id}
                      areaId={null}
                      reordering={reordering}
                      reorderEnabled={reorderEnabled}
                      dragState={dragState}
                      dropIndicator={dropIndicator}
                      onEdit={onEditStore}
                      onDelete={onDeleteStore}
                      onDragStart={onDragStart}
                      onDragEnd={onDragEnd}
                      onDragOverItem={onDragOverItem}
                      onDropItem={onDropItem}
                      publishedLabel={labels.published}
                      draftLabel={labels.draft}
                      editLabel={labels.edit}
                      deleteLabel={labels.delete}
                      dragLabel={labels.dragToReorder}
                    />
                  </div>
                ) : null}

                {regionStores.length === 0 ? (
                  <p className="text-sm text-gray-500">{labels.noStores}</p>
                ) : null}
              </div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
