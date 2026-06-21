import 'server-only';

const LOCAL_CACHE_MAX_KEYS = 250;
const LOCAL_CACHE_DEFAULT_TTL_MS = 60_000;

type LocalEntry = {
  raw: string;
  expiresAt: number;
};

const localJsonCache = new Map<string, LocalEntry>();

export function readLocalJsonRaw(key: string): string | null {
  const entry = localJsonCache.get(key);
  if (!entry) {
    return null;
  }
  if (Date.now() > entry.expiresAt) {
    localJsonCache.delete(key);
    return null;
  }
  return entry.raw;
}

export function writeLocalJsonRaw(
  key: string,
  raw: string,
  ttlMs: number = LOCAL_CACHE_DEFAULT_TTL_MS,
): void {
  while (localJsonCache.size >= LOCAL_CACHE_MAX_KEYS) {
    const firstKey = localJsonCache.keys().next().value;
    if (!firstKey) {
      break;
    }
    localJsonCache.delete(firstKey);
  }
  localJsonCache.set(key, { raw, expiresAt: Date.now() + ttlMs });
}

export function deleteLocalJsonKey(key: string): void {
  localJsonCache.delete(key);
}

export function clearLocalJsonByPattern(pattern: string): number {
  const regex = pattern.replace(/\*/g, '.*').replace(/\?/g, '.');
  const matcher = new RegExp(`^${regex}$`);
  let deleted = 0;
  for (const key of localJsonCache.keys()) {
    if (!matcher.test(key)) {
      continue;
    }
    localJsonCache.delete(key);
    deleted += 1;
  }
  return deleted;
}

export function clearAllLocalJson(): void {
  localJsonCache.clear();
}
