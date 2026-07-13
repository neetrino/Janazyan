import type {
  PartnerStore,
  PartnerStoreAreaGroup,
  PartnerStoreRegionGroup,
} from './types';

/**
 * Groups flat partner stores into Region → optional Area → Store hierarchy.
 * Ordering follows admin position fields at every level.
 */
export function groupPartnerStoresByHierarchy(
  stores: PartnerStore[],
): PartnerStoreRegionGroup[] {
  const regions = new Map<string, PartnerStoreRegionGroup>();

  for (const store of stores) {
    let region = regions.get(store.regionId);
    if (!region) {
      region = {
        id: store.regionId,
        name: store.regionName,
        position: store.regionPosition,
        stores: [],
        areas: [],
      };
      regions.set(store.regionId, region);
    }

    if (!store.areaId) {
      region.stores.push(store);
      continue;
    }

    let area = region.areas.find((item) => item.id === store.areaId);
    if (!area) {
      area = {
        id: store.areaId,
        name: store.areaName ?? '',
        position: store.areaPosition ?? 0,
        stores: [],
      };
      region.areas.push(area);
    }
    area.stores.push(store);
  }

  return Array.from(regions.values())
    .map((region) => ({
      ...region,
      stores: [...region.stores].sort((a, b) => a.position - b.position),
      areas: region.areas
        .map(
          (area): PartnerStoreAreaGroup => ({
            ...area,
            stores: [...area.stores].sort((a, b) => a.position - b.position),
          }),
        )
        .sort((a, b) => a.position - b.position),
    }))
    .sort((a, b) => a.position - b.position);
}
