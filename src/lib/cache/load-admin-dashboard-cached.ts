import { readJsonCache, writeJsonCache, deleteJsonCachePattern } from '@/lib/cache/storefront-cache-io';
import { dedupeInFlight } from '@/lib/cache/in-flight-dedup';
import {
  ADMIN_DASHBOARD_CACHE_PREFIX,
  ADMIN_DASHBOARD_CACHE_TTL_SECONDS,
  buildAdminDashboardCacheKey,
} from '@/lib/cache/admin-dashboard-cache.constants';
import { invalidateAdminAnalyticsCache } from '@/lib/cache/load-admin-analytics-cached';
import { getStats } from '@/lib/services/admin/admin-stats/stats-calculator';
import { getActivity } from '@/lib/services/admin/admin-stats/activity';
import { getRecentOrders } from '@/lib/services/admin/admin-stats/recent-orders';
import { getTopProducts } from '@/lib/services/admin/admin-stats/top-products';
import { getUserActivity } from '@/lib/services/admin/admin-stats/user-activity';
import type { ActivityItem } from '@/lib/services/admin/admin-stats/activity';
import { logger } from '@/lib/utils/logger';

export type AdminDashboardPayload = {
  stats: Awaited<ReturnType<typeof getStats>>;
  activity: ActivityItem[];
  recentOrders: Awaited<ReturnType<typeof getRecentOrders>>;
  topProducts: Awaited<ReturnType<typeof getTopProducts>>;
  userActivity: Awaited<ReturnType<typeof getUserActivity>>;
};

type LoadAdminDashboardParams = {
  activityLimit?: number;
  ordersLimit?: number;
  productsLimit?: number;
  usersLimit?: number;
};

export async function loadAdminDashboardCached(
  params: LoadAdminDashboardParams = {},
): Promise<AdminDashboardPayload> {
  const activityLimit = params.activityLimit ?? 10;
  const ordersLimit = params.ordersLimit ?? 5;
  const productsLimit = params.productsLimit ?? 5;
  const usersLimit = params.usersLimit ?? 10;
  const cacheKey = buildAdminDashboardCacheKey(
    activityLimit,
    ordersLimit,
    productsLimit,
    usersLimit,
  );

  const cached = await readJsonCache<AdminDashboardPayload>(cacheKey);
  if (cached) {
    logger.debug('[ADMIN DASHBOARD CACHE] hit', { cacheKey });
    return cached;
  }

  logger.debug('[ADMIN DASHBOARD CACHE] miss', { cacheKey });

  return dedupeInFlight(`admin-dashboard:${cacheKey}`, async () => {
    const cachedAfterLock = await readJsonCache<AdminDashboardPayload>(cacheKey);
    if (cachedAfterLock) {
      return cachedAfterLock;
    }

    const payload = await loadAdminDashboardFresh({
      activityLimit,
      ordersLimit,
      productsLimit,
      usersLimit,
    });

    await writeJsonCache(cacheKey, ADMIN_DASHBOARD_CACHE_TTL_SECONDS, payload);
    return payload;
  });
}

async function loadAdminDashboardFresh(
  params: Required<LoadAdminDashboardParams>,
): Promise<AdminDashboardPayload> {
  const [stats, activity, recentOrders, topProducts, userActivity] = await Promise.all([
    getStats(),
    getActivity(params.activityLimit),
    getRecentOrders(params.ordersLimit),
    getTopProducts(params.productsLimit),
    getUserActivity(params.usersLimit),
  ]);

  return {
    stats,
    activity,
    recentOrders,
    topProducts,
    userActivity,
  };
}

/** Invalidate all dashboard cache variants after order/user/product mutations. */
export async function invalidateAdminDashboardCache(): Promise<void> {
  await Promise.all([
    deleteJsonCachePattern(`${ADMIN_DASHBOARD_CACHE_PREFIX}*`),
    deleteJsonCachePattern('admin:stats:v1*'),
    invalidateAdminAnalyticsCache(),
  ]);
}
