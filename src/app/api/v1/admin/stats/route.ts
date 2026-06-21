import { NextRequest, NextResponse } from "next/server";
import { authenticateToken, requireAdmin } from "@/lib/middleware/auth";
import { adminService } from "@/lib/services/admin.service";
import { logger } from "@/lib/utils/logger";
import { readJsonCache, writeJsonCache } from "@/lib/cache/storefront-cache-io";
import { dedupeInFlight } from "@/lib/cache/in-flight-dedup";
import { ADMIN_DASHBOARD_CACHE_TTL_SECONDS } from "@/lib/cache/admin-dashboard-cache.constants";

const ADMIN_STATS_CACHE_KEY = "admin:stats:v1";

/**
 * Force dynamic rendering for this route
 * Prevents Next.js from statically generating this route
 */
export const dynamic = "force-dynamic";

/**
 * GET /api/v1/admin/stats
 * Get admin statistics (users count, etc.)
 */
export async function GET(req: NextRequest) {
  try {
    logger.debug("📊 [ADMIN STATS] Request received:", { url: req.url });
    const user = await authenticateToken(req);
    
    if (!user || !requireAdmin(user)) {
      logger.debug("❌ [ADMIN STATS] Unauthorized or not admin");
      return NextResponse.json(
        {
          type: "https://api.shop.am/problems/forbidden",
          title: "Forbidden",
          status: 403,
          detail: "Admin access required",
          instance: req.url,
        },
        { status: 403 }
      );
    }

    logger.debug(`✅ [ADMIN STATS] User authenticated: ${user.id}`);

    const cached = await readJsonCache<Awaited<ReturnType<typeof adminService.getStats>>>(
      ADMIN_STATS_CACHE_KEY,
    );
    if (cached) {
      return NextResponse.json(cached);
    }

    const result = await dedupeInFlight(ADMIN_STATS_CACHE_KEY, async () => {
      const cachedAfterLock = await readJsonCache<Awaited<ReturnType<typeof adminService.getStats>>>(
        ADMIN_STATS_CACHE_KEY,
      );
      if (cachedAfterLock) {
        return cachedAfterLock;
      }

      const fresh = await adminService.getStats();
      await writeJsonCache(ADMIN_STATS_CACHE_KEY, ADMIN_DASHBOARD_CACHE_TTL_SECONDS, fresh);
      return fresh;
    });
    logger.debug("✅ [ADMIN STATS] Stats data retrieved successfully");
    
    return NextResponse.json(result);
  } catch (error: any) {
    console.error("❌ [ADMIN STATS] Error:", {
      message: error.message,
      stack: error.stack,
      type: error.type,
      status: error.status,
      detail: error.detail,
      url: req.url,
    });
    return NextResponse.json(
      {
        type: error.type || "https://api.shop.am/problems/internal-error",
        title: error.title || "Internal Server Error",
        status: error.status || 500,
        detail: error.detail || error.message || "An error occurred",
        instance: req.url,
      },
      { status: error.status || 500 }
    );
  }
}

