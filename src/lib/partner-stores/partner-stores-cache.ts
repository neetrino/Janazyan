import { unstable_cache } from 'next/cache';
import type { PartnerStore } from '@/features/stores/types';
import { getPartnerStoresFromRedisOrDb } from '@/lib/cache/partner-stores-redis-cache';

export const PARTNER_STORES_REVALIDATE_SECONDS = 300;

export function fetchPartnerStores(locale: string): Promise<PartnerStore[]> {
  return getCachedPartnerStores(locale);
}

const getCachedPartnerStores = unstable_cache(
  async (locale: string): Promise<PartnerStore[]> =>
    getPartnerStoresFromRedisOrDb(locale),
  ['partner-stores-storefront-v2'],
  { revalidate: PARTNER_STORES_REVALIDATE_SECONDS, tags: ['partner-stores'] },
);
