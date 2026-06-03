import { db } from '@white-shop/db';
import { resolveBlogImageUrls } from '@/lib/blog/persist-blog-image';
import { normalizeBlogImageUrls } from '@/lib/blog/normalize-blog-image-url';
import type { BlogTranslationInput } from '@/features/blog/blog-locales';
import { toSlug } from '@/lib/utils/slug';
import { revalidateBlogPublicCache } from '@/lib/blog/revalidate-blog-cache';
import { logger } from '@/lib/utils/logger';

type AdminBlogPostRow = {
  id: string;
  slug: string;
  images: string[];
  published: boolean;
  publishedAt: Date | null;
  createdAt: Date;
  translations: Array<{
    locale: string;
    title: string;
    contentHtml: string;
    excerpt: string | null;
  }>;
};

function mapAdminPost(row: AdminBlogPostRow, displayLocale = 'en') {
  const translation =
    row.translations.find((t) => t.locale === displayLocale) ?? row.translations[0];

  return {
    id: row.id,
    slug: row.slug,
    title: translation?.title ?? '',
    excerpt: translation?.excerpt ?? '',
    contentHtml: translation?.contentHtml ?? '',
    images: normalizeBlogImageUrls(row.images ?? []),
    published: Boolean(row.published),
    publishedAt: row.publishedAt?.toISOString() ?? null,
    createdAt: row.createdAt.toISOString(),
    translations: row.translations.map((t) => ({
      locale: t.locale,
      title: t.title,
      contentHtml: t.contentHtml,
      excerpt: t.excerpt ?? '',
    })),
  };
}

async function generateUniqueSlug(baseTitle: string, excludeId?: string): Promise<string> {
  const baseSlug = toSlug(baseTitle) || 'blog-post';
  let slug = baseSlug;
  let counter = 1;

  while (true) {
    const existing = await db.blogPost.findFirst({
      where: {
        slug,
        ...(excludeId ? { id: { not: excludeId } } : {}),
      },
    });
    if (!existing) {
      return slug;
    }
    slug = `${baseSlug}-${counter}`;
    counter += 1;
    if (counter > 1000) {
      throw {
        status: 500,
        type: 'https://api.shop.am/problems/internal-error',
        title: 'Unable to generate unique slug',
        detail: 'Could not generate a unique slug for the blog post',
      };
    }
  }
}

function validateTranslations(translations: BlogTranslationInput[]): void {
  if (!translations.length) {
    throw {
      status: 400,
      type: 'https://api.shop.am/problems/validation-error',
      title: 'Validation Error',
      detail: 'At least one translation is required',
    };
  }

  const enTranslation = translations.find((t) => t.locale === 'en');
  if (!enTranslation?.title.trim() || !enTranslation.contentHtml.trim()) {
    throw {
      status: 400,
      type: 'https://api.shop.am/problems/validation-error',
      title: 'Validation Error',
      detail: 'English title and content are required',
    };
  }
}

function parsePublishedAt(value: string | null | undefined): Date | null {
  if (!value) {
    return null;
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    throw {
      status: 400,
      type: 'https://api.shop.am/problems/validation-error',
      title: 'Validation Error',
      detail: 'Invalid publishedAt date',
    };
  }
  return date;
}

class AdminBlogService {
  async getBlogPosts() {
    const posts = await db.blogPost.findMany({
      where: { deletedAt: null },
      include: { translations: true },
      orderBy: [{ publishedAt: 'desc' }, { createdAt: 'desc' }],
    });

    return {
      data: posts.map((post) => mapAdminPost(post)),
    };
  }

  async createBlogPost(data: {
    translations: BlogTranslationInput[];
    images?: string[];
    published?: boolean;
    publishedAt?: string | null;
  }) {
    validateTranslations(data.translations);

    const enTitle = data.translations.find((t) => t.locale === 'en')!.title.trim();
    const slug = await generateUniqueSlug(enTitle);
    const images = await resolveBlogImageUrls(data.images);
    const published = data.published ?? false;
    const publishedAt = published
      ? (parsePublishedAt(data.publishedAt) ?? new Date())
      : parsePublishedAt(data.publishedAt);

    const post = await db.blogPost.create({
      data: {
        slug,
        images,
        published,
        publishedAt,
        translations: {
          create: data.translations
            .filter((t) => t.title.trim() && t.contentHtml.trim())
            .map((t) => ({
              locale: t.locale,
              title: t.title.trim(),
              contentHtml: t.contentHtml.trim(),
              excerpt: t.excerpt?.trim() || null,
            })),
        },
      },
      include: { translations: true },
    });

    logger.info('Blog post created', { id: post.id, slug: post.slug });
    await revalidateBlogPublicCache();
    return { data: mapAdminPost(post) };
  }

  async updateBlogPost(
    postId: string,
    data: {
      translations?: BlogTranslationInput[];
      images?: string[];
      published?: boolean;
      publishedAt?: string | null;
    },
  ) {
    const post = await db.blogPost.findUnique({
      where: { id: postId },
      include: { translations: true },
    });

    if (!post || post.deletedAt) {
      throw {
        status: 404,
        type: 'https://api.shop.am/problems/not-found',
        title: 'Blog post not found',
        detail: `Blog post with id '${postId}' does not exist`,
      };
    }

    if (data.translations) {
      validateTranslations(data.translations);
    }

    const updateData: {
      images?: string[];
      published?: boolean;
      publishedAt?: Date | null;
    } = {};

    if (data.images !== undefined) {
      updateData.images = await resolveBlogImageUrls(data.images);
    }
    if (data.published !== undefined) {
      updateData.published = data.published;
    }
    if (data.publishedAt !== undefined) {
      updateData.publishedAt = parsePublishedAt(data.publishedAt);
    } else if (data.published === true && !post.publishedAt) {
      updateData.publishedAt = new Date();
    }

    if (Object.keys(updateData).length > 0) {
      await db.blogPost.update({
        where: { id: postId },
        data: updateData,
      });
    }

    if (data.translations) {
      for (const translation of data.translations) {
        if (!translation.title.trim() || !translation.contentHtml.trim()) {
          continue;
        }
        await db.blogPostTranslation.upsert({
          where: {
            postId_locale: {
              postId,
              locale: translation.locale,
            },
          },
          create: {
            postId,
            locale: translation.locale,
            title: translation.title.trim(),
            contentHtml: translation.contentHtml.trim(),
            excerpt: translation.excerpt?.trim() || null,
          },
          update: {
            title: translation.title.trim(),
            contentHtml: translation.contentHtml.trim(),
            excerpt: translation.excerpt?.trim() || null,
          },
        });
      }
    }

    const updated = await db.blogPost.findUnique({
      where: { id: postId },
      include: { translations: true },
    });

    await revalidateBlogPublicCache();
    return { data: mapAdminPost(updated!) };
  }

  async deleteBlogPost(postId: string) {
    const post = await db.blogPost.findUnique({ where: { id: postId } });
    if (!post || post.deletedAt) {
      throw {
        status: 404,
        type: 'https://api.shop.am/problems/not-found',
        title: 'Blog post not found',
        detail: `Blog post with id '${postId}' does not exist`,
      };
    }

    await db.blogPost.update({
      where: { id: postId },
      data: { deletedAt: new Date(), published: false },
    });

    await revalidateBlogPublicCache();
    return { success: true };
  }
}

export const adminBlogService = new AdminBlogService();
