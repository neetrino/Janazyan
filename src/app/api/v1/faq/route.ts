import { NextRequest, NextResponse } from 'next/server';

import { getCachedPublishedFaq } from '@/lib/faq/faq-cache';

import { LANGUAGES } from '@/lib/language';



const DEFAULT_LOCALE = 'en';



function parseLocale(value: string | null): string {

  if (value && value in LANGUAGES) {

    return value;

  }

  return DEFAULT_LOCALE;

}



/**

 * GET /api/v1/faq?locale=hy

 * Public published FAQ for /faq page.

 */

export async function GET(req: NextRequest) {

  try {

    const locale = parseLocale(req.nextUrl.searchParams.get('locale'));

    const data = await getCachedPublishedFaq(locale);

    return NextResponse.json(
      { data },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
        },
      },
    );

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

