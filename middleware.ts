import { NextRequest, NextResponse } from "next/server";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import * as jose from "jose";
import { logger } from "@/lib/utils/logger";

type AuthRateLimitDependencies = {
  limiter: Ratelimit | null;
  configured: boolean;
};

let authRateLimitDependencies: AuthRateLimitDependencies | null = null;

function getAuthRateLimiter(): AuthRateLimitDependencies {
  if (authRateLimitDependencies) {
    return authRateLimitDependencies;
  }

  const url = process.env.UPSTASH_REDIS_REST_URL?.trim();
  const token = process.env.UPSTASH_REDIS_REST_TOKEN?.trim();
  if (!url || !token) {
    authRateLimitDependencies = { limiter: null, configured: false };
    return authRateLimitDependencies;
  }

  const redis = new Redis({ url, token });
  authRateLimitDependencies = {
    configured: true,
    limiter: new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(10, "60 s"),
      prefix: "ratelimit:auth",
    }),
  };
  return authRateLimitDependencies;
}

/** Protect /api/v1/admin/* — require valid JWT (signature + expiry). DB check (blocked/deleted) remains in route. */
async function requireAdminAuth(request: NextRequest): Promise<NextResponse | null> {
  const authHeader = request.headers.get("authorization");
  const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;

  if (!token) {
    return NextResponse.json(
      {
        type: "https://api.shop.am/problems/unauthorized",
        title: "Unauthorized",
        status: 401,
        detail: "Missing or invalid Authorization header",
      },
      { status: 401 }
    );
  }

  const secret = process.env.JWT_SECRET;
  if (!secret) {
    return NextResponse.json(
      {
        type: "https://api.shop.am/problems/internal-error",
        title: "Internal Server Error",
        status: 500,
        detail: "Server configuration error",
      },
      { status: 500 }
    );
  }

  try {
    const key = new TextEncoder().encode(secret);
    await jose.jwtVerify(token, key);
    return null;
  } catch {
    return NextResponse.json(
      {
        type: "https://api.shop.am/problems/unauthorized",
        title: "Unauthorized",
        status: 401,
        detail: "Invalid or expired token",
      },
      { status: 401 }
    );
  }
}

/** Rate limit for auth endpoints (login/register) by IP */
async function checkAuthRateLimit(request: NextRequest): Promise<NextResponse | null> {
  const rateLimiter = getAuthRateLimiter();
  if (!rateLimiter.configured) {
    return null;
  }
  if (!rateLimiter.limiter) {
    return null;
  }

  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown";

  try {
    const { success, reset } = await rateLimiter.limiter.limit(ip);
    if (!success) {
      const response = NextResponse.json(
        {
          type: "https://api.shop.am/problems/too-many-requests",
          title: "Too Many Requests",
          status: 429,
          detail: "Too many login/register attempts. Try again later.",
        },
        { status: 429 }
      );
      const retryAfterSeconds = Math.max(1, Math.ceil((reset - Date.now()) / 1000));
      response.headers.set("Retry-After", String(retryAfterSeconds));
      return response;
    }
  } catch (error: unknown) {
    logger.warn("[MIDDLEWARE] Auth rate limit unavailable, skipping limiter.", error);
    return null;
  }
  return null;
}

/** CORS: allowed origin from env. For /api/* requests add CORS headers and handle preflight. */
function getAllowedOrigins(): string[] {
  const configuredOrigins = (process.env.CORS_ORIGIN || "")
    .split(",")
    .map((item) => item.trim())
    .filter((item) => item.length > 0);
  const appUrl = process.env.NEXT_PUBLIC_APP_URL?.trim();
  const defaults =
    process.env.NODE_ENV === "development"
      ? ["http://localhost:3000", "http://127.0.0.1:3000"]
      : [];
  return [...new Set([...configuredOrigins, ...(appUrl ? [appUrl] : []), ...defaults])];
}

function getCorsHeaders(origin: string): Record<string, string> {
  return {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Methods": "GET, POST, PUT, PATCH, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Max-Age": "86400",
    Vary: "Origin",
  };
}

function resolveAllowedOrigin(request: NextRequest): string | null {
  const requestOrigin = request.headers.get("origin");
  if (!requestOrigin) {
    return null;
  }
  const allowedOrigins = getAllowedOrigins();
  return allowedOrigins.includes(requestOrigin) ? requestOrigin : null;
}

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  if (pathname.startsWith("/api/")) {
    const allowedOrigin = resolveAllowedOrigin(request);
    if (request.method === "OPTIONS") {
      if (!allowedOrigin) {
        return NextResponse.json(
          {
            type: "https://api.shop.am/problems/forbidden",
            title: "Forbidden",
            status: 403,
            detail: "Origin is not allowed by CORS policy",
          },
          { status: 403 }
        );
      }
      return new NextResponse(null, { status: 204, headers: getCorsHeaders(allowedOrigin) });
    }
    const response = NextResponse.next();
    if (allowedOrigin) {
      const corsHeaders = getCorsHeaders(allowedOrigin);
      Object.entries(corsHeaders).forEach(([key, value]) => response.headers.set(key, value));
    }
    // Run auth/rate-limit for protected paths, then return response with CORS
    if (pathname.startsWith("/api/v1/admin/")) {
      const authRes = await requireAdminAuth(request);
      if (authRes) {
        if (allowedOrigin) {
          const corsHeaders = getCorsHeaders(allowedOrigin);
          Object.entries(corsHeaders).forEach(([k, v]) => authRes.headers.set(k, v));
        }
        return authRes;
      }
    } else if (
      (pathname === "/api/v1/auth/login" || pathname === "/api/v1/auth/register") &&
      request.method === "POST"
    ) {
      const rateLimitResponse = await checkAuthRateLimit(request);
      if (rateLimitResponse) {
        if (allowedOrigin) {
          const corsHeaders = getCorsHeaders(allowedOrigin);
          Object.entries(corsHeaders).forEach(([k, v]) => rateLimitResponse.headers.set(k, v));
        }
        return rateLimitResponse;
      }
    }
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/api/v1/admin/:path*",
    "/api/v1/auth/login",
    "/api/v1/auth/register",
    "/api/v1/:path*",
    "/api/health",
  ],
};
