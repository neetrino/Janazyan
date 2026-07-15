import { NextRequest, NextResponse } from 'next/server';
import { DEFAULT_LANGUAGE, LANGUAGES, type LanguageCode } from '@/lib/language';
import { DEFAULT_CATALOG_PAGE_SIZE } from '@/lib/products/catalog-page.constants';
import { getProductsCatalogFromRedisOrDb } from '@/lib/cache/products-catalog-redis-cache';
import { apiRouteErrorResponse, buildApiRouteErrorContext } from '@/lib/http/api-route-errors';

export const dynamic = 'force-dynamic';

const MAX_CATALOG_LIMIT = 24;

function parseLang(value: string | null): LanguageCode {
  if (value && value in LANGUAGES) {
    return value as LanguageCode;
  }
  return DEFAULT_LANGUAGE;
}

function parsePositiveInt(value: string | null, fallback: number): number {
  if (!value) {
    return fallback;
  }

  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

/** Storefront catalog JSON — same Redis/DB path as SSR, for instant client hydration. */
export async function GET(req: NextRequest): Promise<NextResponse> {
  try {
    const { searchParams } = req.nextUrl;
    const page = parsePositiveInt(searchParams.get('page'), 1);
    const limit = Math.min(
      parsePositiveInt(searchParams.get('limit'), DEFAULT_CATALOG_PAGE_SIZE),
      MAX_CATALOG_LIMIT,
    );
    const lang = parseLang(searchParams.get('lang'));
    const search = searchParams.get('search')?.trim() || undefined;
    const category = searchParams.get('category')?.trim() || undefined;

    const catalog = await getProductsCatalogFromRedisOrDb({
      page,
      limit,
      lang,
      search,
      category,
    });

    return NextResponse.json(catalog, {
      headers: {
        'Cache-Control': 'private, max-age=0, must-revalidate',
      },
    });
  } catch (error: unknown) {
    return apiRouteErrorResponse(req, error, '[STOREFRONT CATALOG]', buildApiRouteErrorContext(req));
  }
}
