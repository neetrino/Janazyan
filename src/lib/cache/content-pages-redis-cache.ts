import type { BlogPostDetail, BlogPostSummary } from '@/features/blog/types';
import type { FaqSection } from '@/features/faq/types';
import {
  getPublishedBlogPostBySlug,
  getPublishedBlogPosts,
} from '@/lib/services/blog.service';
import { getPublishedFaq } from '@/lib/services/faq.service';
import {
  readJsonCache,
  STOREFRONT_CACHE_KEYS,
  STOREFRONT_CACHE_TTL,
  writeJsonCache,
} from './storefront-cache';

export async function getBlogPostsFromRedisOrDb(
  locale: string,
): Promise<BlogPostSummary[]> {
  const key = STOREFRONT_CACHE_KEYS.blogPosts(locale);
  const cached = await readJsonCache<BlogPostSummary[]>(key);
  if (cached) {
    return cached;
  }

  const data = await getPublishedBlogPosts(locale);
  await writeJsonCache(key, STOREFRONT_CACHE_TTL.blogPosts, data);
  return data;
}

export async function getBlogPostBySlugFromRedisOrDb(
  slug: string,
  locale: string,
): Promise<BlogPostDetail | null> {
  const key = STOREFRONT_CACHE_KEYS.blogPostBySlug(locale, slug);
  const cached = await readJsonCache<BlogPostDetail>(key);
  if (cached) {
    return cached;
  }

  const data = await getPublishedBlogPostBySlug(slug, locale);
  if (data) {
    await writeJsonCache(key, STOREFRONT_CACHE_TTL.blogPostBySlug, data);
  }
  return data;
}

export async function getFaqFromRedisOrDb(locale: string): Promise<FaqSection[]> {
  const key = STOREFRONT_CACHE_KEYS.faqPublished(locale);
  const cached = await readJsonCache<FaqSection[]>(key);
  if (cached) {
    return cached;
  }

  const data = await getPublishedFaq(locale);
  await writeJsonCache(key, STOREFRONT_CACHE_TTL.faqPublished, data);
  return data;
}
