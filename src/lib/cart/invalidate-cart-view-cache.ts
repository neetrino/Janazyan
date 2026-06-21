import 'server-only';

import { cacheService } from '@/lib/services/cache.service';
import { buildCartViewCacheKey } from './cart-view-cache.types';

/** Drop cached cart JSON after mutations or discount changes. */
export async function invalidateCartViewCache(
  userId: string,
  locale?: string,
): Promise<void> {
  if (locale) {
    await cacheService.del(buildCartViewCacheKey(userId, locale));
    return;
  }

  await cacheService.deletePattern(`cart:view:v1:${userId}:*`);
}
