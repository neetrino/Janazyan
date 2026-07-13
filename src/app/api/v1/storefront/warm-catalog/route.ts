import { NextRequest, NextResponse } from 'next/server';
import { DEFAULT_LANGUAGE, LANGUAGES, type LanguageCode } from '@/lib/language';
import { warmDefaultProductsCatalogCache } from '@/lib/products/warm-products-catalog-cache';
import { fetchProductsCatalog } from '@/lib/products/products-catalog-cache';
import { DEFAULT_CATALOG_PAGE_SIZE } from '@/lib/products/catalog-page.constants';

export const dynamic = 'force-dynamic';

function parseLang(value: string | null): LanguageCode {
  if (value && value in LANGUAGES) {
    return value as LanguageCode;
  }
  return DEFAULT_LANGUAGE;
}

/** Warms server cache and returns catalog JSON for client sessionStorage hydration. */
export async function GET(req: NextRequest): Promise<NextResponse> {
  const lang = parseLang(req.nextUrl.searchParams.get('lang'));

  try {
    const [, catalog] = await Promise.all([
      warmDefaultProductsCatalogCache(lang),
      fetchProductsCatalog(1, DEFAULT_CATALOG_PAGE_SIZE, lang),
    ]);

    return NextResponse.json({ ok: true, catalog }, { status: 200 });
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
