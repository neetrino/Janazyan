import { logger } from "@/lib/utils/logger";
import type { Redis as UpstashRedis } from "@upstash/redis";
import type { Redis as IORedis } from "ioredis";

type RedisProvider = "upstash_rest" | "redis_tcp" | "memory";
type RedisFailureReason = "ok" | "not_configured" | "connection_failed";

const ERROR_COOLDOWN_MS = 30000;
const REINIT_COOLDOWN_MS = 30000;
const MEMORY_CACHE_MAX_KEYS = 300;
const MEMORY_DEFAULT_TTL_SECONDS = 300;
const PROBE_TTL_SECONDS = 10;
const REDIS_PROBE_KEY = "__cache:health:probe__";

const memoryCache = new Map<string, { value: string; expiresAt: number }>();

let redisClient: IORedis | null = null;
let upstashClient: UpstashRedis | null = null;
let redisAvailable = false;
let connectionAttempted = false;
let lastErrorTime = 0;
let lastInitAttempt = 0;
let provider: RedisProvider = "memory";
let initPromise: Promise<void> | null = null;

export type RedisHealth = {
  available: boolean;
  provider: RedisProvider;
  reason: RedisFailureReason;
};

function getEnv(name: string): string {
  return process.env[name]?.trim() ?? "";
}

function hasUpstashConfig(): boolean {
  return Boolean(getEnv("UPSTASH_REDIS_REST_URL") && getEnv("UPSTASH_REDIS_REST_TOKEN"));
}

function hasTcpRedisConfig(): boolean {
  const redisUrl = getEnv("REDIS_URL");
  return Boolean(redisUrl && redisUrl !== "redis://localhost:6379");
}

function hasRedisConfig(): boolean {
  return hasUpstashConfig() || hasTcpRedisConfig();
}

function logRedisWarn(message: string, details?: unknown): void {
  const now = Date.now();
  if (now - lastErrorTime < ERROR_COOLDOWN_MS) return;
  lastErrorTime = now;
  logger.warn(message, details);
}

function memoryGet(key: string): string | null {
  const entry = memoryCache.get(key);
  if (!entry) return null;
  if (Date.now() <= entry.expiresAt) return entry.value;
  memoryCache.delete(key);
  return null;
}

function memorySetex(key: string, seconds: number, value: string): void {
  while (memoryCache.size >= MEMORY_CACHE_MAX_KEYS) {
    const firstKey = memoryCache.keys().next().value;
    if (!firstKey) break;
    memoryCache.delete(firstKey);
  }
  memoryCache.set(key, { value, expiresAt: Date.now() + seconds * 1000 });
}

function clearMemoryByPattern(pattern: string): number {
  const regex = pattern.replace(/\*/g, ".*").replace(/\?/g, ".");
  const matcher = new RegExp(`^${regex}$`);
  let deleted = 0;
  for (const key of memoryCache.keys()) {
    if (!matcher.test(key)) continue;
    memoryCache.delete(key);
    deleted++;
  }
  return deleted;
}

async function verifyUpstashClient(client: UpstashRedis): Promise<void> {
  await client.set(REDIS_PROBE_KEY, "ok", { ex: PROBE_TTL_SECONDS });
  await client.get(REDIS_PROBE_KEY);
  await client.del(REDIS_PROBE_KEY);
}

async function verifyTcpRedisClient(client: IORedis): Promise<void> {
  await client.ping();
}

async function initRedis(force = false): Promise<void> {
  if (initPromise) return initPromise;
  const now = Date.now();
  if (!force && connectionAttempted && !redisAvailable && now - lastInitAttempt < REINIT_COOLDOWN_MS) {
    return;
  }

  initPromise = (async () => {
    connectionAttempted = true;
    lastInitAttempt = now;
    redisAvailable = false;

    const restUrl = getEnv("UPSTASH_REDIS_REST_URL");
    const restToken = getEnv("UPSTASH_REDIS_REST_TOKEN");
    const redisUrl = getEnv("REDIS_URL");

    if ((restUrl && !restToken) || (!restUrl && restToken)) {
      provider = "memory";
      logRedisWarn("[CACHE] Upstash Redis is partially configured.");
      return;
    }

    if (restUrl && restToken) {
      try {
        const { Redis } = await import("@upstash/redis");
        const client = new Redis({ url: restUrl, token: restToken });
        await verifyUpstashClient(client);
        upstashClient = client;
        redisClient = null;
        provider = "upstash_rest";
        redisAvailable = true;
        return;
      } catch (error: unknown) {
        provider = "memory";
        logRedisWarn("[CACHE] Failed to initialize Upstash Redis; memory fallback enabled.", error);
        return;
      }
    }

    if (!redisUrl || redisUrl === "redis://localhost:6379") {
      provider = "memory";
      return;
    }

    try {
      const Redis = (await import("ioredis")).default;
      const client = new Redis(redisUrl, {
        retryStrategy: (times: number) => (times > 3 ? null : Math.min(times * 50, 2000)),
        maxRetriesPerRequest: 3,
        enableReadyCheck: true,
        lazyConnect: true,
        showFriendlyErrorStack: true,
        enableOfflineQueue: false,
        reconnectOnError: () => false,
      });
      client.on("error", (error: Error) => {
        provider = "memory";
        redisAvailable = false;
        logRedisWarn("[CACHE] Redis TCP error; memory fallback enabled.", error.message);
      });
      await client.connect();
      await verifyTcpRedisClient(client);
      redisClient = client;
      upstashClient = null;
      provider = "redis_tcp";
      redisAvailable = true;
    } catch (error: unknown) {
      provider = "memory";
      logRedisWarn("[CACHE] Failed to initialize Redis TCP; memory fallback enabled.", error);
    }
  })();

  try {
    await initPromise;
  } finally {
    initPromise = null;
  }
}

async function ensureRedisReady(): Promise<void> {
  if (redisAvailable && (upstashClient || redisClient)) return;
  await initRedis();
}

export async function get(key: string): Promise<string | null> {
  await ensureRedisReady();
  if (!redisAvailable || (!redisClient && !upstashClient)) return memoryGet(key);
  try {
    return upstashClient ? (await upstashClient.get(key)) ?? null : await redisClient.get(key);
  } catch {
    return memoryGet(key);
  }
}

export async function set(key: string, value: string): Promise<boolean> {
  await ensureRedisReady();
  if (!redisAvailable || (!redisClient && !upstashClient)) {
    memorySetex(key, MEMORY_DEFAULT_TTL_SECONDS, value);
    return true;
  }
  try {
    if (upstashClient) await upstashClient.set(key, value);
    else await redisClient.set(key, value);
    return true;
  } catch {
    return false;
  }
}

export async function setex(key: string, seconds: number, value: string): Promise<boolean> {
  await ensureRedisReady();
  if (!redisAvailable || (!redisClient && !upstashClient)) {
    memorySetex(key, seconds, value);
    return true;
  }
  try {
    if (upstashClient) await upstashClient.set(key, value, { ex: seconds });
    else await redisClient.setex(key, seconds, value);
    return true;
  } catch {
    memorySetex(key, seconds, value);
    return true;
  }
}

export async function del(key: string): Promise<boolean> {
  await ensureRedisReady();
  memoryCache.delete(key);
  if (!redisAvailable || (!redisClient && !upstashClient)) return true;
  try {
    if (upstashClient) await upstashClient.del(key);
    else await redisClient.del(key);
    return true;
  } catch {
    return false;
  }
}

export async function keys(pattern: string): Promise<string[]> {
  await ensureRedisReady();
  if (!redisAvailable || (!redisClient && !upstashClient)) return [];
  try {
    return upstashClient ? await upstashClient.keys(pattern) : await redisClient.keys(pattern);
  } catch {
    return [];
  }
}

export async function deletePattern(pattern: string): Promise<number> {
  await ensureRedisReady();
  const memoryDeleted = clearMemoryByPattern(pattern);
  if (!redisAvailable || (!redisClient && !upstashClient)) return memoryDeleted;
  try {
    const matchingKeys = upstashClient
      ? await upstashClient.keys(pattern)
      : await redisClient.keys(pattern);
    if (matchingKeys.length === 0) return memoryDeleted;
    if (upstashClient) await upstashClient.del(...matchingKeys);
    else await redisClient.del(...matchingKeys);
    return matchingKeys.length + memoryDeleted;
  } catch {
    return memoryDeleted;
  }
}

export function isAvailable(): boolean {
  return redisAvailable;
}

export async function getRedisHealth(): Promise<RedisHealth> {
  await ensureRedisReady();
  if (redisAvailable) return { available: true, provider, reason: "ok" };
  if (!hasRedisConfig()) return { available: false, provider: "memory", reason: "not_configured" };
  return { available: false, provider: "memory", reason: "connection_failed" };
}

export const cacheService = {
  get,
  set,
  setex,
  del,
  keys,
  deletePattern,
  isAvailable,
  getRedisHealth,
};

