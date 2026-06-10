import { unstable_cache } from 'next/cache';
import type { FaqSection } from '@/features/faq/types';
import { getFaqFromRedisOrDb } from '@/lib/cache/content-pages-redis-cache';

export const FAQ_PUBLISHED_REVALIDATE_SECONDS = 300;

export function fetchPublishedFaq(locale: string): Promise<FaqSection[]> {
  return getCachedPublishedFaq(locale);
}

const getCachedPublishedFaq = unstable_cache(
  async (locale: string): Promise<FaqSection[]> => getFaqFromRedisOrDb(locale),
  ['faq-published-v2'],
  { revalidate: FAQ_PUBLISHED_REVALIDATE_SECONDS, tags: ['faq-published'] },
);

/** @deprecated Use fetchPublishedFaq */
export { getCachedPublishedFaq };
