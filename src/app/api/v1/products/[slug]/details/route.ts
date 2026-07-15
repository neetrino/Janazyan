import { NextRequest, NextResponse } from 'next/server';
import { getProductDetailsCached } from '@/lib/products/load-product-details-cached';
import { logger } from '@/lib/utils/logger';
import { DEFAULT_LANGUAGE } from '@/lib/language';

export const dynamic = 'force-dynamic';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    const { searchParams } = new URL(req.url);
    const lang = searchParams.get('lang') || DEFAULT_LANGUAGE;
    const { slug } = await params;
    const result = await getProductDetailsCached(slug, lang);

    if (!result) {
      return NextResponse.json(
        {
          type: 'https://api.shop.am/problems/not-found',
          title: 'Product not found',
          status: 404,
          detail: 'Not found',
          instance: req.url,
        },
        { status: 404 },
      );
    }

    return NextResponse.json(result);
  } catch (error: unknown) {
    const err = error as { status?: number; title?: string; detail?: string; type?: string };
    if (err?.status === 404) {
      return NextResponse.json(
        {
          type: err.type || 'https://api.shop.am/problems/not-found',
          title: err.title || 'Product not found',
          status: 404,
          detail: err.detail || 'Not found',
          instance: req.url,
        },
        { status: 404 },
      );
    }
    const message = error instanceof Error ? error.message : String(error);
    logger.error('GET product details failed', { error: message });
    return NextResponse.json(
      {
        type: 'https://api.shop.am/problems/internal-error',
        title: 'Internal Server Error',
        status: 500,
        detail: message,
        instance: req.url,
      },
      { status: 500 },
    );
  }
}
