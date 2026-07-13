import { NextRequest, NextResponse } from 'next/server';
import { getProductRelatedCached } from '@/lib/products/load-product-related-cached';
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
    const body = await getProductRelatedCached(slug, lang);

    return NextResponse.json(body);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    logger.error('GET product related failed', { error: message });
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
