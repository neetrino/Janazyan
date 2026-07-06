import { NextRequest, NextResponse } from 'next/server';
import { invalidateStorefrontCategoryCaches } from '@/lib/cache/storefront-cache';
import { authenticateToken, requireAdmin } from '@/lib/middleware/auth';
import { adminService } from '@/lib/services/admin.service';
import { logger } from '@/lib/utils/logger';

/**
 * PUT /api/v1/admin/categories/reorder
 * Reorder sibling categories (same parentId) for storefront /products strip.
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
    logger.debug('↕️ [ADMIN CATEGORIES] Reorder request:', body);

    const parentId =
      body.parentId === null || body.parentId === undefined || body.parentId === ''
        ? null
        : String(body.parentId);
    const orderedIds = Array.isArray(body.orderedIds)
      ? body.orderedIds.map((id: unknown) => String(id))
      : [];

    const result = await adminService.reorderCategories({ parentId, orderedIds });

    await invalidateStorefrontCategoryCaches();

    return NextResponse.json(result);
  } catch (error: unknown) {
    const err = error as {
      type?: string;
      title?: string;
      status?: number;
      detail?: string;
      message?: string;
    };
    console.error('❌ [ADMIN CATEGORIES] Reorder Error:', error);
    return NextResponse.json(
      {
        type: err.type || 'https://api.shop.am/problems/internal-error',
        title: err.title || 'Internal Server Error',
        status: err.status || 500,
        detail: err.detail || err.message || 'An error occurred',
        instance: req.url,
      },
      { status: err.status || 500 },
    );
  }
}
