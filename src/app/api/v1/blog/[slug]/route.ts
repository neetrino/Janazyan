import { NextRequest, NextResponse } from 'next/server';
import { getCachedPublishedBlogPostBySlug } from '@/lib/blog/blog-posts-cache';
import { LANGUAGES } from '@/lib/language';

const DEFAULT_LOCALE = 'en';

function parseLocale(value: string | null): string {
  if (value && value in LANGUAGES) {
    return value;
  }
  return DEFAULT_LOCALE;
}

/**
 * GET /api/v1/blog/[slug]?locale=hy
 * Public single blog post by slug.
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    const { slug } = await params;
    const locale = parseLocale(req.nextUrl.searchParams.get('locale'));
    const data = await getCachedPublishedBlogPostBySlug(slug, locale);

    if (!data) {
      return NextResponse.json(
        {
          type: 'https://api.shop.am/problems/not-found',
          title: 'Not Found',
          status: 404,
          detail: `Blog post '${slug}' not found`,
          instance: req.url,
        },
        { status: 404 },
      );
    }

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
