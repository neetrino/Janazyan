import type { BlogLocale } from '../../../features/blog/blog-locales';

export type AdminBlogPost = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  contentHtml: string;
  images: string[];
  published: boolean;
  publishedAt: string | null;
  createdAt: string;
  translations: Array<{
    locale: BlogLocale;
    title: string;
    contentHtml: string;
    excerpt: string;
  }>;
};

export type BlogPostFormData = {
  translations: Array<{
    locale: BlogLocale;
    title: string;
    contentHtml: string;
    excerpt: string;
  }>;
  images: string[];
  published: 'published' | 'draft';
  publishedAt: string;
};
