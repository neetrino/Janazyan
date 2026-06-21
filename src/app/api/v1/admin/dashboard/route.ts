import { NextRequest, NextResponse } from 'next/server';
import { authenticateToken, requireAdmin } from '@/lib/middleware/auth';
import { loadAdminDashboardCached } from '@/lib/cache/load-admin-dashboard-cached';
import { logger } from '@/lib/utils/logger';

export const dynamic = 'force-dynamic';

function parseLimit(value: string | null, fallback: number): number {
  const parsed = Number.parseInt(value ?? '', 10);
  if (!Number.isFinite(parsed) || parsed < 1) {
    return fallback;
  }
  return Math.min(parsed, 50);
}

/**
 * GET /api/v1/admin/dashboard
 * Bundled admin dashboard payload with server-side cache.
 */
export async function GET(req: NextRequest) {
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

    const { searchParams } = new URL(req.url);
    const activityLimit = parseLimit(searchParams.get('activityLimit'), 10);
    const ordersLimit = parseLimit(searchParams.get('ordersLimit'), 5);
    const productsLimit = parseLimit(searchParams.get('productsLimit'), 5);
    const usersLimit = parseLimit(searchParams.get('usersLimit'), 10);

    logger.debug('📊 [ADMIN DASHBOARD] Request received', {
      userId: user.id,
      activityLimit,
      ordersLimit,
      productsLimit,
      usersLimit,
    });

    const data = await loadAdminDashboardCached({
      activityLimit,
      ordersLimit,
      productsLimit,
      usersLimit,
    });

    return NextResponse.json({ data });
  } catch (error: unknown) {
    const err = error as {
      type?: string;
      title?: string;
      status?: number;
      detail?: string;
      message?: string;
    };

    console.error('❌ [ADMIN DASHBOARD] Error:', error);
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
