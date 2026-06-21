const ADMIN_DASHBOARD_CLIENT_CACHE_KEY = 'janazyan:admin-dashboard:v1';
const ADMIN_DASHBOARD_CLIENT_TTL_MS = 30_000;

type AdminDashboardClientCacheEntry = {
  data: unknown;
  storedAt: number;
};

const memoryCache = new Map<string, AdminDashboardClientCacheEntry>();
const inflightRequests = new Map<string, Promise<unknown>>();

function isFresh(entry: AdminDashboardClientCacheEntry): boolean {
  return Date.now() - entry.storedAt < ADMIN_DASHBOARD_CLIENT_TTL_MS;
}

function readSessionEntry(key: string): AdminDashboardClientCacheEntry | null {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    const raw = sessionStorage.getItem(`${ADMIN_DASHBOARD_CLIENT_CACHE_KEY}:${key}`);
    if (!raw) {
      return null;
    }

    const parsed = JSON.parse(raw) as AdminDashboardClientCacheEntry;
    if (!parsed?.data || !isFresh(parsed)) {
      sessionStorage.removeItem(`${ADMIN_DASHBOARD_CLIENT_CACHE_KEY}:${key}`);
      return null;
    }

    return parsed;
  } catch {
    return null;
  }
}

function writeSessionEntry(key: string, entry: AdminDashboardClientCacheEntry): void {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    sessionStorage.setItem(`${ADMIN_DASHBOARD_CLIENT_CACHE_KEY}:${key}`, JSON.stringify(entry));
  } catch {
    // Ignore quota errors; memory cache still works.
  }
}

export function readAdminDashboardClientCache<T>(key: string): T | null {
  const memoryEntry = memoryCache.get(key);
  if (memoryEntry && isFresh(memoryEntry)) {
    return memoryEntry.data as T;
  }

  const sessionEntry = readSessionEntry(key);
  if (!sessionEntry) {
    return null;
  }

  memoryCache.set(key, sessionEntry);
  return sessionEntry.data as T;
}

export function writeAdminDashboardClientCache<T>(key: string, data: T): void {
  const entry: AdminDashboardClientCacheEntry = { data, storedAt: Date.now() };
  memoryCache.set(key, entry);
  writeSessionEntry(key, entry);
}

export function invalidateAdminDashboardClientCache(): void {
  memoryCache.clear();
  inflightRequests.clear();

  if (typeof window === 'undefined') {
    return;
  }

  try {
    const prefix = `${ADMIN_DASHBOARD_CLIENT_CACHE_KEY}:`;
    const keysToRemove: string[] = [];
    for (let index = 0; index < sessionStorage.length; index += 1) {
      const storageKey = sessionStorage.key(index);
      if (storageKey?.startsWith(prefix)) {
        keysToRemove.push(storageKey);
      }
    }
    keysToRemove.forEach((storageKey) => sessionStorage.removeItem(storageKey));
  } catch {
    // Ignore storage errors.
  }
}

export async function fetchAdminDashboardWithClientCache<T>(
  key: string,
  fetcher: () => Promise<T>,
): Promise<T> {
  const cached = readAdminDashboardClientCache<T>(key);
  if (cached) {
    return cached;
  }

  const inflight = inflightRequests.get(key);
  if (inflight) {
    return inflight as Promise<T>;
  }

  const promise = fetcher()
    .then((data) => {
      writeAdminDashboardClientCache(key, data);
      inflightRequests.delete(key);
      return data;
    })
    .catch((error: unknown) => {
      inflightRequests.delete(key);
      throw error;
    });

  inflightRequests.set(key, promise);
  return promise;
}

export const ADMIN_DASHBOARD_CLIENT_QUERY_KEY = 'default';
