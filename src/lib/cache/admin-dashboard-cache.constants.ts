export const ADMIN_DASHBOARD_CACHE_PREFIX = 'admin:dashboard:v1';
export const ADMIN_DASHBOARD_CACHE_TTL_SECONDS = 30;

export function buildAdminDashboardCacheKey(
  activityLimit: number,
  ordersLimit: number,
  productsLimit: number,
  usersLimit: number,
): string {
  return `${ADMIN_DASHBOARD_CACHE_PREFIX}:${activityLimit}:${ordersLimit}:${productsLimit}:${usersLimit}`;
}
