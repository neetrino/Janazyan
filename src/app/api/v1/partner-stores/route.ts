import { NextRequest, NextResponse } from 'next/server';
import { buildPartnerStoresFromLocale } from '@/features/stores/fetch-partner-stores';
import type { PartnerStore } from '@/features/stores/types';
import {
  readJsonCache,
  STOREFRONT_CACHE_KEYS,
  STOREFRONT_CACHE_TTL,
  writeJsonCache,
} from '@/lib/cache/storefront-cache';
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
    const cacheKey = STOREFRONT_CACHE_KEYS.partnerStores(locale);

    const cached = await readJsonCache<PartnerStore[]>(cacheKey);
    if (cached) {
      return NextResponse.json({ data: cached }, { headers: { 'X-Cache': 'HIT' } });
    }

    const dbStores = await getPartnerStoresFromRedisOrDb(locale);
    const data =
      dbStores.length > 0
        ? dbStores
        : buildPartnerStoresFromLocale(locale as LanguageCode);

    if (dbStores.length === 0 && data.length > 0) {
      await writeJsonCache(cacheKey, STOREFRONT_CACHE_TTL.partnerStores, data);
    }

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
