import { revalidatePath, revalidateTag } from 'next/cache';
import { invalidateFaqCaches } from '@/lib/cache/storefront-cache';
import { logger } from '@/lib/utils/logger';

/** Clears public FAQ cache (Redis + Next.js) after admin mutations. */
export async function revalidateFaqPublicCache(): Promise<void> {
  try {
    await invalidateFaqCaches();
    // @ts-expect-error - revalidateTag type issue in Next.js
    revalidateTag('faq-published');
    revalidatePath('/faq');
  } catch (error) {
    logger.warn('FAQ cache revalidation failed', { error });
  }
}
