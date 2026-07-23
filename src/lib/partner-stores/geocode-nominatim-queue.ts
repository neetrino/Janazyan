export const GEOCODE_USER_AGENT = 'JanazyanPartnerStores/1.0 (partner-stores map)';
export const GEOCODE_TIMEOUT_MS = 8000;
export const NOMINATIM_MIN_INTERVAL_MS = 1100;

let nominatimQueue: Promise<void> = Promise.resolve();
let lastNominatimAt = 0;

/**
 * Serializes Nominatim calls and enforces the public API minimum interval.
 */
export async function withNominatimRateLimit<T>(operation: () => Promise<T>): Promise<T> {
  const run = nominatimQueue.then(async () => {
    const waitMs = Math.max(0, NOMINATIM_MIN_INTERVAL_MS - (Date.now() - lastNominatimAt));
    if (waitMs > 0) {
      await new Promise((resolve) => setTimeout(resolve, waitMs));
    }
    lastNominatimAt = Date.now();
    return operation();
  });
  nominatimQueue = run.then(
    () => undefined,
    () => undefined,
  );
  return run;
}
