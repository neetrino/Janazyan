import { unstable_cache } from 'next/cache';
import { getFaqFromRedisOrDb } from '@/lib/cache/content-pages-redis-cache';

export const FAQ_PUBLISHED_REVALIDATE_SECONDS = 300;

export const getCachedPublishedFaq = unstable_cache(
  async (locale: string) => getFaqFromRedisOrDb(locale),
  ['faq-published-v1'],
  { revalidate: FAQ_PUBLISHED_REVALIDATE_SECONDS, tags: ['faq-published'] },
);
