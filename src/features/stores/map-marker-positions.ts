import type { PartnerStore } from './types';
import { normalizePartnerStoreCoordinates } from './coordinates';
import { PARTNER_STORE_COORDINATES } from './partner-store-coordinates';

/** Degrees of separation between overlapping store markers (~11–15m). */
const OVERLAP_OFFSET_STEP_DEG = 0.00012;

type LatLng = { lat: number; lng: number };

function resolveStoreCoordinates(store: PartnerStore): LatLng | null {
  const normalizedCoordinates = normalizePartnerStoreCoordinates(store.lat, store.lng);
  if (normalizedCoordinates) {
    return normalizedCoordinates;
  }

  return PARTNER_STORE_COORDINATES[store.id] ?? null;
}

/**
 * Assigns distinct map positions when multiple stores share identical coordinates.
 * Uses a compact spiral so markers stay near the shared point but remain selectable.
 */
export function resolvePartnerStoreMapPositions(
  stores: PartnerStore[],
): Map<string, LatLng> {
  const positions = new Map<string, LatLng>();
  const groups = new Map<string, PartnerStore[]>();

  for (const store of stores) {
    const coordinates = resolveStoreCoordinates(store);
    if (!coordinates) {
      continue;
    }

    const key = `${coordinates.lat.toFixed(5)},${coordinates.lng.toFixed(5)}`;
    const group = groups.get(key) ?? [];
    group.push(store);
    groups.set(key, group);
  }

  for (const group of groups.values()) {
    const base = resolveStoreCoordinates(group[0]);
    if (!base) {
      continue;
    }

    if (group.length === 1) {
      positions.set(group[0].id, base);
      continue;
    }

    group.forEach((store, index) => {
      if (index === 0) {
        positions.set(store.id, base);
        return;
      }

      const angle = (index * 2.4) % (Math.PI * 2);
      const radius = OVERLAP_OFFSET_STEP_DEG * Math.ceil(index / 6);
      positions.set(store.id, {
        lat: base.lat + Math.cos(angle) * radius,
        lng: base.lng + Math.sin(angle) * radius,
      });
    });
  }

  return positions;
}
