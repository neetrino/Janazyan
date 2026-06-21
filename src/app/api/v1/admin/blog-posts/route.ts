import { NextRequest, NextResponse } from 'next/server';
import { authenticateToken, requireAdmin } from '@/lib/middleware/auth';
import { adminService } from '@/lib/services/admin.service';
import {
  ADMIN_LIST_SERVER_CACHE_KEYS,
  invalidateAdminListServerCache,
  loadAdminListServerCached,
} from '@/lib/cache/admin-list-server-cache';

/**
 * GET /api/v1/admin/blog-posts
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

    const result = await loadAdminListServerCached(
      ADMIN_LIST_SERVER_CACHE_KEYS.blogPosts,
      () => adminService.getBlogPosts(),
    );
    return NextResponse.json(result);
  } catch (error: unknown) {
    const err = error as { status?: number; type?: string; title?: string; detail?: string; message?: string };
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

/**
 * POST /api/v1/admin/blog-posts
 */
export async function POST(req: NextRequest) {
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
    const result = await adminService.createBlogPost(body);
    await invalidateAdminListServerCache(ADMIN_LIST_SERVER_CACHE_KEYS.blogPosts);
    return NextResponse.json(result, { status: 201 });
  } catch (error: unknown) {
    const err = error as { status?: number; type?: string; title?: string; detail?: string; message?: string };
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
