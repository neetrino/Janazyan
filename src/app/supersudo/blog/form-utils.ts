import { BLOG_LOCALES } from '../../../features/blog/blog-locales';
import type { AdminBlogPost, BlogPostFormData } from './types';

export function createEmptyFormData(): BlogPostFormData {
  return {
    translations: BLOG_LOCALES.map((locale) => ({
      locale,
      title: '',
      contentHtml: '',
      excerpt: '',
    })),
    images: [],
    published: 'draft',
    publishedAt: '',
  };
}

export function formDataFromPost(post: AdminBlogPost): BlogPostFormData {
  return {
    translations: BLOG_LOCALES.map((locale) => {
      const existing = post.translations.find((t) => t.locale === locale);
      return {
        locale,
        title: existing?.title ?? '',
        contentHtml: existing?.contentHtml ?? '',
        excerpt: existing?.excerpt ?? '',
      };
    }),
    images: post.images ?? [],
    published: post.published ? 'published' : 'draft',
    publishedAt: post.publishedAt ? post.publishedAt.slice(0, 10) : '',
  };
}

/** Converts plain text with line breaks to simple HTML paragraphs. */
export function textToHtml(text: string): string {
  const trimmed = text.trim();
  if (!trimmed) {
    return '';
  }
  if (/<[a-z][\s\S]*>/i.test(trimmed)) {
    return trimmed;
  }
  return trimmed
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean)
    .map((paragraph) => `<p>${paragraph.replace(/\n/g, '<br />')}</p>`)
    .join('');
}

export function parseFormPayload(formData: BlogPostFormData) {
  return {
    translations: formData.translations.map((t) => ({
      locale: t.locale,
      title: t.title,
      contentHtml: textToHtml(t.contentHtml),
      excerpt: t.excerpt.trim() || undefined,
    })),
    images: formData.images,
    published: formData.published === 'published',
    publishedAt: formData.publishedAt ? `${formData.publishedAt}T12:00:00.000Z` : null,
  };
}
