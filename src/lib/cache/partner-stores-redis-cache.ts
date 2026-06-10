import { isDatabaseConnectionUrlConfigured } from '@white-shop/db/env';
import type { PartnerStore } from '@/features/stores/types';
import { getPublishedPartnerStores } from '@/lib/services/partner-stores.service';
import {
  readJsonCache,
  STOREFRONT_CACHE_KEYS,
  STOREFRONT_CACHE_TTL,
  writeJsonCache,
} from './storefront-cache';

export async function getPartnerStoresFromRedisOrDb(
  locale: string,
): Promise<PartnerStore[]> {
  const key = STOREFRONT_CACHE_KEYS.partnerStores(locale);
  const cached = await readJsonCache<PartnerStore[]>(key);
  if (cached) {
    return cached;
  }

  if (!isDatabaseConnectionUrlConfigured()) {
    return [];
  }

  const data = await getPublishedPartnerStores(locale);
  await writeJsonCache(key, STOREFRONT_CACHE_TTL.partnerStores, data);
  return data;
}
