import { revalidatePath, revalidateTag } from 'next/cache';
import { invalidateBlogCaches } from '@/lib/cache/storefront-cache';
import { logger } from '@/lib/utils/logger';

/** Clears public blog cache (Redis + Next.js) after admin mutations. */
export async function revalidateBlogPublicCache(): Promise<void> {
  try {
    await invalidateBlogCaches();
    // @ts-expect-error - revalidateTag type issue in Next.js
    revalidateTag('blog-posts');
    revalidatePath('/blog');
  } catch (error) {
    logger.warn('Blog cache revalidation failed', { error });
  }
}
