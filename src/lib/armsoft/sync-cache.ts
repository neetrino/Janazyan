import { revalidateTag } from "next/cache";
import {
  invalidateProductPageCaches,
  invalidateStorefrontProductRelatedCaches,
} from "@/lib/cache/storefront-cache";
import { cacheService } from "@/lib/services/cache.service";
import { logger } from "@/lib/utils/logger";

/** Invalidates storefront product caches after ArmSoft catalog sync. */
export async function invalidateAfterArmsoftSync(): Promise<void> {
  try {
    // @ts-expect-error - revalidateTag type issue in Next.js
    revalidateTag("products");
    // @ts-expect-error - revalidateTag type issue in Next.js
    revalidateTag("home-featured");
    await cacheService.deletePattern("products:*");
    await cacheService.deletePattern("cart:view:v1:*");
    await invalidateProductPageCaches();
    await invalidateStorefrontProductRelatedCaches();
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    logger.warn("ArmSoft catalog sync cache invalidation failed", { message });
  }
}
