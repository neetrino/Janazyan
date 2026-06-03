import { NextRequest, NextResponse } from 'next/server';
import { authenticateToken, requireAdmin } from '@/lib/middleware/auth';
import { persistBlogImageFromDataUrl } from '@/lib/blog/persist-blog-image';

/**
 * POST /api/v1/admin/blog-posts/upload-images
 * Upload blog images to R2 (or public/blog in local dev).
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

    const body = (await req.json()) as { image?: unknown };
    if (typeof body.image !== 'string' || !body.image.startsWith('data:image/')) {
      return NextResponse.json(
        {
          type: 'https://api.shop.am/problems/validation-error',
          title: 'Validation Error',
          status: 400,
          detail: "Field 'image' must be a valid base64 image (data:image/...)",
          instance: req.url,
        },
        { status: 400 },
      );
    }

    const url = await persistBlogImageFromDataUrl(body.image);
    return NextResponse.json({ url });
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
