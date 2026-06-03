import { db } from '@white-shop/db';
import { normalizeBlogImageUrls } from '@/lib/blog/normalize-blog-image-url';

type BlogPostRow = {
  id: string;
  slug: string;
  images: string[];
  published: boolean;
  publishedAt: Date | null;
  translations: Array<{
    locale: string;
    title: string;
    contentHtml: string;
    excerpt: string | null;
  }>;
};

function pickTranslation(row: BlogPostRow, locale: string) {
  return row.translations.find((t) => t.locale === locale) ?? row.translations[0];
}

function mapSummary(row: BlogPostRow, locale: string) {
  const translation = pickTranslation(row, locale);
  const images = normalizeBlogImageUrls(row.images ?? []);
  return {
    id: row.id,
    slug: row.slug,
    title: translation?.title ?? '',
    excerpt: translation?.excerpt ?? '',
    coverImage: images[0] ?? null,
    images,
    publishedAt: row.publishedAt?.toISOString() ?? null,
  };
}

function mapDetail(row: BlogPostRow, locale: string) {
  const translation = pickTranslation(row, locale);
  return {
    ...mapSummary(row, locale),
    contentHtml: translation?.contentHtml ?? '',
  };
}

export async function getPublishedBlogPosts(locale: string) {
  const posts = await db.blogPost.findMany({
    where: {
      deletedAt: null,
      published: true,
    },
    include: { translations: true },
    orderBy: [{ publishedAt: 'desc' }, { createdAt: 'desc' }],
  });

  return posts.map((post) => mapSummary(post, locale));
}

export async function getPublishedBlogPostBySlug(slug: string, locale: string) {
  const post = await db.blogPost.findFirst({
    where: {
      slug,
      deletedAt: null,
      published: true,
    },
    include: { translations: true },
  });

  if (!post) {
    return null;
  }

  return mapDetail(post, locale);
}
