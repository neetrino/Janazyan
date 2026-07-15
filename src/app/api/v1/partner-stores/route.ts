import { NextRequest, NextResponse } from 'next/server';
import { isDatabaseConnectionUrlConfigured } from '@white-shop/db/env';
import { buildPartnerStoresFromLocale } from '@/features/stores/fetch-partner-stores';
import { getPartnerStoresFromRedisOrDb } from '@/lib/cache/partner-stores-redis-cache';
import { DEFAULT_LANGUAGE, LANGUAGES, type LanguageCode } from '@/lib/language';

function parseLocale(value: string | null): string {
  if (value && value in LANGUAGES) {
    return value;
  }
  return DEFAULT_LANGUAGE;
}

/**
 * GET /api/v1/partner-stores?locale=hy
 * Public list of published partner stores for /stores page.
 */
export async function GET(req: NextRequest) {
  try {
    const locale = parseLocale(req.nextUrl.searchParams.get('locale'));
    const dbStores = await getPartnerStoresFromRedisOrDb(locale);
    const useFallback = !isDatabaseConnectionUrlConfigured() || dbStores.length === 0;
    const data = useFallback ? buildPartnerStoresFromLocale(locale as LanguageCode) : dbStores;

    return NextResponse.json({ data }, { headers: { 'X-Cache': 'MISS' } });
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
