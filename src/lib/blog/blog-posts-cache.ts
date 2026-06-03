import { unstable_cache } from 'next/cache';
import {
  getBlogPostBySlugFromRedisOrDb,
  getBlogPostsFromRedisOrDb,
} from '@/lib/cache/content-pages-redis-cache';

export const BLOG_POSTS_REVALIDATE_SECONDS = 300;

export const getCachedPublishedBlogPosts = unstable_cache(
  async (locale: string) => getBlogPostsFromRedisOrDb(locale),
  ['blog-posts-published-v1'],
  { revalidate: BLOG_POSTS_REVALIDATE_SECONDS, tags: ['blog-posts'] },
);

export const getCachedPublishedBlogPostBySlug = unstable_cache(
  async (slug: string, locale: string) => getBlogPostBySlugFromRedisOrDb(slug, locale),
  ['blog-post-by-slug-v1'],
  { revalidate: BLOG_POSTS_REVALIDATE_SECONDS, tags: ['blog-posts'] },
);
