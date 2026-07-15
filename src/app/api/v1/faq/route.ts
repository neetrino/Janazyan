import { NextRequest, NextResponse } from 'next/server';
import { buildFaqFromLocale } from '@/features/faq/build-faq-from-locale';
import type { FaqSection } from '@/features/faq/types';
import { getFaqFromRedisOrDb } from '@/lib/cache/content-pages-redis-cache';
import {
  readJsonCache,
  STOREFRONT_CACHE_KEYS,
  STOREFRONT_CACHE_TTL,
  writeJsonCache,
} from '@/lib/cache/storefront-cache';
import { DEFAULT_LANGUAGE, LANGUAGES, type LanguageCode } from '@/lib/language';

function parseLocale(value: string | null): string {
  if (value && value in LANGUAGES) {
    return value;
  }
  return DEFAULT_LANGUAGE;
}

/**
 * GET /api/v1/faq?locale=hy
 * Public published FAQ for /faq page.
 */
export async function GET(req: NextRequest) {
  try {
    const locale = parseLocale(req.nextUrl.searchParams.get('locale'));
    const cacheKey = STOREFRONT_CACHE_KEYS.faqPublished(locale);

    const cached = await readJsonCache<FaqSection[]>(cacheKey);
    if (cached) {
      return NextResponse.json({ data: cached }, { headers: { 'X-Cache': 'HIT' } });
    }

    const dbSections = await getFaqFromRedisOrDb(locale);
    const data =
      dbSections.length > 0
        ? dbSections
        : buildFaqFromLocale(locale as LanguageCode);

    if (dbSections.length === 0 && data.length > 0) {
      await writeJsonCache(cacheKey, STOREFRONT_CACHE_TTL.faqPublished, data);
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
