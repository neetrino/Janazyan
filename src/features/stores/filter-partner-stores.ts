import type { PartnerStore } from './types';

/** Filters partner stores by name or address (case-insensitive). */
export function filterPartnerStores(stores: PartnerStore[], query: string): PartnerStore[] {
  const normalizedQuery = query.trim().toLowerCase();

  if (!normalizedQuery) {
    return stores;
  }

  return stores.filter(
    (store) =>
      store.name.toLowerCase().includes(normalizedQuery) ||
      store.address.toLowerCase().includes(normalizedQuery) ||
      store.regionName.toLowerCase().includes(normalizedQuery) ||
      (store.areaName?.toLowerCase().includes(normalizedQuery) ?? false),
  );
}
