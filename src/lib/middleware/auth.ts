import { NextRequest } from "next/server";
import * as jwt from "jsonwebtoken";
import { db } from "@white-shop/db";
import { readJsonCache, writeJsonCache } from "@/lib/cache/storefront-cache-io";
import { dedupeInFlight } from "@/lib/cache/in-flight-dedup";
import { logger } from "@/lib/utils/logger";

export interface AuthUser {
  id: string;
  email: string | null;
  phone: string | null;
  locale: string;
  roles: string[];
}

const AUTH_USER_CACHE_TTL_SECONDS = 60;

function buildAuthUserCacheKey(userId: string): string {
  return `auth:user:v1:${userId}`;
}

async function loadAuthUserFromDb(userId: string): Promise<AuthUser | null> {
  const user = await db.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      phone: true,
      locale: true,
      roles: true,
      blocked: true,
      deletedAt: true,
    },
  });

  if (!user || user.blocked || user.deletedAt) {
    return null;
  }

  return {
    id: user.id,
    email: user.email,
    phone: user.phone,
    locale: user.locale,
    roles: user.roles,
  };
}

async function resolveAuthUser(userId: string): Promise<AuthUser | null> {
  const cacheKey = buildAuthUserCacheKey(userId);
  const cached = await readJsonCache<AuthUser>(cacheKey);
  if (cached) {
    return cached;
  }

  return dedupeInFlight(`auth-user:${userId}`, async () => {
    const cachedAfterLock = await readJsonCache<AuthUser>(cacheKey);
    if (cachedAfterLock) {
      return cachedAfterLock;
    }

    const user = await loadAuthUserFromDb(userId);
    if (user) {
      await writeJsonCache(cacheKey, AUTH_USER_CACHE_TTL_SECONDS, user);
    }
    return user;
  });
}

/**
 * Authenticate JWT token from request headers
 */
export async function authenticateToken(
  request: NextRequest
): Promise<AuthUser | null> {
  try {
    const authHeader = request.headers.get("authorization");
    const token = authHeader?.split(" ")[1];

    if (!token) {
      return null;
    }

    if (!process.env.JWT_SECRET) {
      logger.error("[AUTH] JWT_SECRET is not set");
      return null;
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET) as {
      userId: string;
    };

    return resolveAuthUser(decoded.userId);
  } catch (error) {
    if (
      error instanceof jwt.JsonWebTokenError ||
      error instanceof jwt.TokenExpiredError
    ) {
      return null;
    }
    throw error;
  }
}

/** Drop cached auth profile after block/delete or sensitive account changes. */
export async function invalidateAuthUserCache(userId: string): Promise<void> {
  const { cacheService } = await import("@/lib/services/cache.service");
  await cacheService.del(buildAuthUserCacheKey(userId));
}

/**
 * Check if user is admin
 */
export function requireAdmin(user: AuthUser | null): boolean {
  if (!user) {
    return false;
  }
  return user.roles.includes("admin");
}
