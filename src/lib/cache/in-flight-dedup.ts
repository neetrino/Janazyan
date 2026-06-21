/**
 * Coalesce parallel in-flight async work by key so concurrent callers share one promise.
 * Used for catalog Redis/DB loads and client catalog API fetches.
 */
export function dedupeInFlight<T>(key: string, fn: () => Promise<T>): Promise<T> {
  const inflight = getInflightMap<T>();
  const existing = inflight.get(key);
  if (existing) {
    return existing;
  }

  const promise = fn().finally(() => {
    inflight.delete(key);
  });
  inflight.set(key, promise);
  return promise;
}

const inflightStores = new Map<string, Map<string, Promise<unknown>>>();

function getInflightMap<T>(): Map<string, Promise<T>> {
  const storeKey = 'default';
  let store = inflightStores.get(storeKey) as Map<string, Promise<T>> | undefined;
  if (!store) {
    store = new Map<string, Promise<T>>();
    inflightStores.set(storeKey, store as Map<string, Promise<unknown>>);
  }
  return store;
}
