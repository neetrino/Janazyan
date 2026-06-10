import { revalidatePath, revalidateTag } from 'next/cache';
import { invalidatePartnerStoresCaches } from '@/lib/cache/storefront-cache';
import { logger } from '@/lib/utils/logger';

/** Clears public partner-stores cache (Redis + Next.js) after admin mutations. */
export async function revalidatePartnerStoresPublicCache(): Promise<void> {
  try {
    await invalidatePartnerStoresCaches();
    // @ts-expect-error - revalidateTag type issue in Next.js
    revalidateTag('partner-stores');
    revalidatePath('/stores');
  } catch (error) {
    logger.warn('Partner stores cache revalidation failed', { error });
  }
}
