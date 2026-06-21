import { readJsonCache, writeJsonCache, deleteJsonCachePattern } from '@/lib/cache/storefront-cache-io';
import { dedupeInFlight } from '@/lib/cache/in-flight-dedup';
import { ADMIN_DASHBOARD_CACHE_TTL_SECONDS } from '@/lib/cache/admin-dashboard-cache.constants';
import { getAnalytics } from '@/lib/services/admin/admin-stats/analytics';
import { logger } from '@/lib/utils/logger';

const ADMIN_ANALYTICS_CACHE_PREFIX = 'admin:analytics:v2';

export type AdminAnalyticsPayload = Awaited<ReturnType<typeof getAnalytics>>;

type LoadAdminAnalyticsParams = {
  period: string;
  startDate?: string;
  endDate?: string;
};

export function buildAdminAnalyticsCacheKey(
  period: string,
  startDate?: string,
  endDate?: string,
): string {
  return `${ADMIN_ANALYTICS_CACHE_PREFIX}:${period}:${startDate ?? ''}:${endDate ?? ''}`;
}

export async function loadAdminAnalyticsCached(
  params: LoadAdminAnalyticsParams,
): Promise<AdminAnalyticsPayload> {
  const cacheKey = buildAdminAnalyticsCacheKey(
    params.period,
    params.startDate,
    params.endDate,
  );

  const cached = await readJsonCache<AdminAnalyticsPayload>(cacheKey);
  if (cached) {
    logger.debug('[ADMIN ANALYTICS CACHE] hit', { cacheKey });
    return cached;
  }

  logger.debug('[ADMIN ANALYTICS CACHE] miss', { cacheKey });

  return dedupeInFlight(`admin-analytics:${cacheKey}`, async () => {
    const cachedAfterLock = await readJsonCache<AdminAnalyticsPayload>(cacheKey);
    if (cachedAfterLock) {
      return cachedAfterLock;
    }

    const payload = await getAnalytics(params.period, params.startDate, params.endDate);
    await writeJsonCache(cacheKey, ADMIN_DASHBOARD_CACHE_TTL_SECONDS, payload);
    return payload;
  });
}

export async function invalidateAdminAnalyticsCache(): Promise<void> {
  await deleteJsonCachePattern(`${ADMIN_ANALYTICS_CACHE_PREFIX}*`);
}
