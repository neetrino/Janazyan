import { NextRequest, NextResponse } from 'next/server';
import { getCachedPublishedBlogPosts } from '@/lib/blog/blog-posts-cache';
import { LANGUAGES } from '@/lib/language';

const DEFAULT_LOCALE = 'en';

function parseLocale(value: string | null): string {
  if (value && value in LANGUAGES) {
    return value;
  }
  return DEFAULT_LOCALE;
}

/**
 * GET /api/v1/blog?locale=hy
 * Public list of published blog posts.
 */
export async function GET(req: NextRequest) {
  try {
    const locale = parseLocale(req.nextUrl.searchParams.get('locale'));
    const data = await getCachedPublishedBlogPosts(locale);
    return NextResponse.json({ data });
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
