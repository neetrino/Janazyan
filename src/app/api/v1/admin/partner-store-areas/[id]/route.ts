import { NextRequest, NextResponse } from 'next/server';
import { revalidatePartnerStoresPublicCache } from '@/lib/partner-stores/revalidate-partner-stores-cache';
import { authenticateToken, requireAdmin } from '@/lib/middleware/auth';
import { adminService } from '@/lib/services/admin.service';
import {
  ADMIN_LIST_SERVER_CACHE_KEYS,
  invalidateAdminListServerCache,
} from '@/lib/cache/admin-list-server-cache';

async function requireAdminUser(req: NextRequest) {
  const user = await authenticateToken(req);
  if (!user || !requireAdmin(user)) {
    return null;
  }
  return user;
}

function forbidden(req: NextRequest) {
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

function toErrorResponse(req: NextRequest, error: unknown) {
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

async function afterMutation() {
  await invalidateAdminListServerCache(ADMIN_LIST_SERVER_CACHE_KEYS.partnerStores);
  await revalidatePartnerStoresPublicCache();
}

/**
 * PUT /api/v1/admin/partner-store-areas/[id]
 */
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    if (!(await requireAdminUser(req))) {
      return forbidden(req);
    }
    const { id } = await params;
    const body = await req.json();
    const result = await adminService.updatePartnerStoreArea(id, body);
    await afterMutation();
    return NextResponse.json(result);
  } catch (error: unknown) {
    return toErrorResponse(req, error);
  }
}

/**
 * DELETE /api/v1/admin/partner-store-areas/[id]
 */
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    if (!(await requireAdminUser(req))) {
      return forbidden(req);
    }
    const { id } = await params;
    await adminService.deletePartnerStoreArea(id);
    await afterMutation();
    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    return toErrorResponse(req, error);
  }
}
