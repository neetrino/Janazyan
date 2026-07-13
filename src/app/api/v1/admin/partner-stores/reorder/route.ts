import { NextRequest, NextResponse } from 'next/server';
import { revalidatePartnerStoresPublicCache } from '@/lib/partner-stores/revalidate-partner-stores-cache';
import { authenticateToken, requireAdmin } from '@/lib/middleware/auth';
import { adminService } from '@/lib/services/admin.service';
import {
  ADMIN_LIST_SERVER_CACHE_KEYS,
  invalidateAdminListServerCache,
} from '@/lib/cache/admin-list-server-cache';

/**
 * PUT /api/v1/admin/partner-stores/reorder
 * Reorder regions, areas (within region), or stores (within region/area).
 */
export async function PUT(req: NextRequest) {
  try {
    const user = await authenticateToken(req);
    if (!user || !requireAdmin(user)) {
      return NextResponse.json(
        {
          type: 'https://api.shop.am/problems/forbidden',
          title: 'Forbidden',
          status: 403,
          detail: 'Admin access required',
          instance: req.url,
        },
        { status: 403 },
      );
    }

    const body = await req.json();
    const scope = body.scope as 'region' | 'area' | 'store';
    const orderedIds = Array.isArray(body.orderedIds)
      ? body.orderedIds.map((id: unknown) => String(id))
      : [];
    const regionId =
      body.regionId === null || body.regionId === undefined || body.regionId === ''
        ? null
        : String(body.regionId);
    const areaId =
      body.areaId === null || body.areaId === undefined || body.areaId === ''
        ? null
        : String(body.areaId);

    const result = await adminService.reorderPartnerStores({
      scope,
      orderedIds,
      regionId,
      areaId,
    });

    await invalidateAdminListServerCache(ADMIN_LIST_SERVER_CACHE_KEYS.partnerStores);
    await revalidatePartnerStoresPublicCache();

    return NextResponse.json(result);
  } catch (error: unknown) {
    const err = error as {
      status?: number;
      type?: string;
      title?: string;
      detail?: string;
      message?: string;
    };
    return NextResponse.json(
      {
        type: err.type ?? 'https://api.shop.am/problems/internal-error',
        title: err.title ?? 'Internal Server Error',
        status: err.status ?? 500,
        detail: err.detail ?? err.message ?? 'An error occurred',
        instance: req.url,
      },
      { status: err.status ?? 500 },
    );
  }
}
