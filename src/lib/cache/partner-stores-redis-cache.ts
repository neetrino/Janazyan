import { MAP_DEFAULT_CENTER } from '@/features/stores/constants';
import type { PartnerStore } from '@/features/stores/types';
import { getPublishedPartnerStores } from '@/lib/services/partner-stores.service';
import {
  readJsonCache,
  STOREFRONT_CACHE_KEYS,
  STOREFRONT_CACHE_TTL,
  writeJsonCache,
} from './storefront-cache';
import { isDatabaseConnectionUrlConfigured } from '@white-shop/db/env';

const DEFAULT_CENTER_EPSILON = 0.00001;
const DEFAULT_CENTER_CACHE_RATIO_THRESHOLD = 0.35;
const DEFAULT_CENTER_MIN_STORES = 4;
const DUPLICATE_COORDINATE_PRECISION = 5;
const DUPLICATE_COORDINATE_CLUSTER_THRESHOLD = 3;

function isDefaultCenterStore(store: PartnerStore): boolean {
  return (
    Math.abs(store.lat - MAP_DEFAULT_CENTER.lat) <= DEFAULT_CENTER_EPSILON &&
    Math.abs(store.lng - MAP_DEFAULT_CENTER.lng) <= DEFAULT_CENTER_EPSILON
  );
}

/** Rejects cached payloads that still look like district-centroid clusters. */
function shouldUseCachedPartnerStores(stores: PartnerStore[]): boolean {
  if (stores.length < DEFAULT_CENTER_MIN_STORES) {
    return true;
  }

  const centeredStores = stores.filter(isDefaultCenterStore).length;
  if (centeredStores / stores.length >= DEFAULT_CENTER_CACHE_RATIO_THRESHOLD) {
    return false;
  }

  const coordinateCounts = new Map<string, number>();
  for (const store of stores) {
    const key = `${store.lat.toFixed(DUPLICATE_COORDINATE_PRECISION)},${store.lng.toFixed(DUPLICATE_COORDINATE_PRECISION)}`;
    coordinateCounts.set(key, (coordinateCounts.get(key) ?? 0) + 1);
  }

  let maxClusterSize = 0;
  for (const count of coordinateCounts.values()) {
    if (count > maxClusterSize) {
      maxClusterSize = count;
    }
  }

  return maxClusterSize < DUPLICATE_COORDINATE_CLUSTER_THRESHOLD;
}

export async function getPartnerStoresFromRedisOrDb(
  locale: string,
): Promise<PartnerStore[]> {
  const key = STOREFRONT_CACHE_KEYS.partnerStores(locale);
  const cached = await readJsonCache<PartnerStore[]>(key);
  if (cached && shouldUseCachedPartnerStores(cached)) {
    return cached;
  }

  if (!isDatabaseConnectionUrlConfigured()) {
    return [];
  }

  const data = await getPublishedPartnerStores(locale);
  if (shouldUseCachedPartnerStores(data)) {
    await writeJsonCache(key, STOREFRONT_CACHE_TTL.partnerStores, data);
  }
  return data;
}
