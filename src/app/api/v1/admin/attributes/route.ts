import { NextRequest, NextResponse } from "next/server";
import { authenticateToken, requireAdmin } from "@/lib/middleware/auth";
import { adminService } from "@/lib/services/admin.service";
import {
  ADMIN_LIST_SERVER_CACHE_KEYS,
  invalidateAdminListServerCache,
  loadAdminListServerCached,
} from "@/lib/cache/admin-list-server-cache";
import { invalidateAdminAttributesServerList } from "@/lib/cache/invalidate-admin-attributes-cache";

/**
 * GET /api/v1/admin/attributes
 * Get list of attributes
 */
export async function GET(req: NextRequest) {
  try {
    const user = await authenticateToken(req);
    if (!user || !requireAdmin(user)) {
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

    const result = await loadAdminListServerCached(
      ADMIN_LIST_SERVER_CACHE_KEYS.attributes,
      () => adminService.getAttributes(),
    );
    return NextResponse.json(result);
  } catch (error: any) {
    console.error("❌ [ADMIN ATTRIBUTES] GET Error:", error);
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

/**
 * POST /api/v1/admin/attributes
 * Create a new attribute
 */
export async function POST(req: NextRequest) {
  try {
    const user = await authenticateToken(req);
    if (!user || !requireAdmin(user)) {
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

    const body = await req.json();
    const result = await adminService.createAttribute(body);
    await invalidateAdminAttributesServerList();
    return NextResponse.json({ data: result }, { status: 201 });
  } catch (error: any) {
    console.error("❌ [ADMIN ATTRIBUTES] POST Error:", error);
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

