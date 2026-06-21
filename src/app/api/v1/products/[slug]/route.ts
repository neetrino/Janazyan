import { NextRequest, NextResponse } from 'next/server';
import { getProductDetailsCached } from '@/lib/products/load-product-details-cached';
import { logger } from '@/lib/utils/logger';

export const dynamic = 'force-dynamic';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    const { searchParams } = new URL(req.url);
    const lang = searchParams.get('lang') || 'en';
    const { slug } = await params;
    const result = await getProductDetailsCached(slug, lang);

    if (!result) {
      return NextResponse.json(errResponse('not-found', 'Product not found', 404, 'Not found', req.url), {
        status: 404,
      });
    }

    return NextResponse.json(result);
  } catch (error: unknown) {
    const err = error as { type?: string; title?: string; status?: number; detail?: string; message?: string };
    logger.error('GET product by slug failed', { error: err?.message ?? String(error) });
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

function errResponse(
  kind: string,
  title: string,
  status: number,
  detail: string,
  instance: string,
) {
  return {
    type: `https://api.shop.am/problems/${kind}`,
    title,
    status,
    detail,
    instance,
  };
}
