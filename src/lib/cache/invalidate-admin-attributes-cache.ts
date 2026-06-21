import { invalidateAdminListServerCache, ADMIN_LIST_SERVER_CACHE_KEYS } from '@/lib/cache/admin-list-server-cache';

/** Clears cached admin attributes list after mutations. */
export async function invalidateAdminAttributesServerList(): Promise<void> {
  await invalidateAdminListServerCache(ADMIN_LIST_SERVER_CACHE_KEYS.attributes);
}
