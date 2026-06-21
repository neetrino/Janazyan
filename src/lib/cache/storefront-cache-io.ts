import { cacheService } from '@/lib/services/cache.service';
import {
  clearLocalJsonByPattern,
  deleteLocalJsonKey,
  readLocalJsonRaw,
  writeLocalJsonRaw,
} from './storefront-cache-local';

const LOCAL_TTL_MS = 60_000;

export async function readJsonCache<T>(key: string): Promise<T | null> {
  const localRaw = readLocalJsonRaw(key);
  if (localRaw !== null) {
    try {
      return JSON.parse(localRaw) as T;
    } catch {
      deleteLocalJsonKey(key);
    }
  }

  const raw = await cacheService.get(key);
  if (raw === null || raw === undefined) {
    return null;
  }

  writeLocalJsonRaw(key, raw, LOCAL_TTL_MS);

  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

export async function writeJsonCache(
  key: string,
  ttlSeconds: number,
  body: unknown,
): Promise<void> {
  const raw = JSON.stringify(body);
  writeLocalJsonRaw(key, raw, Math.min(LOCAL_TTL_MS, ttlSeconds * 1000));
  await cacheService.setex(key, ttlSeconds, raw);
}

export async function deleteJsonCacheKey(key: string): Promise<void> {
  deleteLocalJsonKey(key);
  await cacheService.del(key);
}

export async function deleteJsonCachePattern(pattern: string): Promise<number> {
  const localDeleted = clearLocalJsonByPattern(pattern);
  const remoteDeleted = await cacheService.deletePattern(pattern);
  return localDeleted + remoteDeleted;
}
