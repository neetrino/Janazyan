import { NextRequest, NextResponse } from 'next/server';
import { authenticateToken, requireAdmin } from '@/lib/middleware/auth';
import { persistR2ImageFromBuffer } from '@/lib/r2/persist-r2-image';
import { parseR2ImageFolder } from '@/lib/r2/r2-image-folders';
import { logger } from '@/lib/utils/logger';

/**
 * POST /api/v1/admin/products/upload-images
 * Upload admin images (multipart/form-data) to R2. Optional form field: folder.
 */
export async function POST(req: NextRequest) {
  const requestStartTime = Date.now();
  logger.debug('Admin upload images: POST received', { url: req.url });

  try {
    const user = await authenticateToken(req);
    if (!user || !requireAdmin(user)) {
      logger.warn('Admin upload images: unauthorized', { userId: user?.id });
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

    const formData = await req.formData();
    const folder = parseR2ImageFolder(formData.get('folder'));
    const entries = formData.getAll('images');
    const files = entries.filter((entry): entry is File => entry instanceof File);

    if (files.length === 0) {
      return NextResponse.json(
        {
          type: 'https://api.shop.am/problems/validation-error',
          title: 'Validation Error',
          status: 400,
          detail: "Field 'images' is required and must contain at least one image file",
          instance: req.url,
        },
        { status: 400 },
      );
    }

    const urls: string[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (!file.type.startsWith('image/')) {
        return NextResponse.json(
          {
            type: 'https://api.shop.am/problems/validation-error',
            title: 'Validation Error',
            status: 400,
            detail: `File at index ${i} must be an image (got ${file.type || 'unknown'})`,
            instance: req.url,
          },
          { status: 400 },
        );
      }

      const buffer = Buffer.from(await file.arrayBuffer());
      const url = await persistR2ImageFromBuffer(buffer, file.type, folder);
      urls.push(url);
    }

    const totalTime = Date.now() - requestStartTime;
    logger.info('Admin upload images: done', { count: urls.length, totalTime });

    return NextResponse.json({ urls }, { status: 200 });
  } catch (error: unknown) {
    const totalTime = Date.now() - requestStartTime;
    const err = error as { message?: string; status?: number; type?: string; title?: string; detail?: string };
    logger.error('Admin upload images: POST error', {
      message: err?.message,
      status: err?.status,
      totalTime,
    });
    return NextResponse.json(
      {
        type: err?.type ?? 'https://api.shop.am/problems/internal-error',
        title: err?.title ?? 'Internal Server Error',
        status: err?.status ?? 500,
        detail: err?.detail ?? err?.message ?? 'An error occurred',
        instance: req.url,
      },
      { status: err?.status ?? 500 },
    );
  }
}
