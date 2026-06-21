import { db } from "@white-shop/db";
import { sanitizeStoredProductImageUrl } from "@/lib/products/resolve-stored-product-image-url";

/**
 * Extract image from product media
 */
function extractImageFromMedia(media: unknown[] | undefined): string | null {
  if (!Array.isArray(media) || media.length === 0) {
    return null;
  }

  const firstMedia = media[0];

  if (typeof firstMedia === "string") {
    return firstMedia;
  }

  if (firstMedia && typeof firstMedia === "object" && "url" in firstMedia) {
    const mediaObj = firstMedia as { url?: string };
    return mediaObj.url || null;
  }

  return null;
}

/**
 * Get top products for dashboard
 */
export async function getTopProducts(limit: number = 5) {
  const grouped = await db.orderItem.groupBy({
    by: ["variantId"],
    where: { variantId: { not: null } },
    _sum: { quantity: true, total: true },
    _count: { orderId: true },
  });

  const topVariants = grouped
    .filter((row) => row.variantId)
    .sort((a, b) => (b._sum.total ?? 0) - (a._sum.total ?? 0))
    .slice(0, limit);

  if (topVariants.length === 0) {
    return [];
  }

  const variantIds = topVariants
    .map((row) => row.variantId)
    .filter((id): id is string => Boolean(id));

  const variants = await db.productVariant.findMany({
    where: { id: { in: variantIds } },
    select: {
      id: true,
      productId: true,
      sku: true,
      imageUrl: true,
      product: {
        select: {
          media: true,
          translations: {
            where: { locale: "en" },
            take: 1,
            select: { title: true },
          },
        },
      },
    },
  });

  const variantById = new Map(variants.map((variant) => [variant.id, variant]));

  const rows = topVariants.map((row) => {
      const variantId = row.variantId as string;
      const variant = variantById.get(variantId);
      const product = variant?.product;
      const translation = product?.translations[0];
      const rawImage =
        variant?.imageUrl?.trim() ||
        extractImageFromMedia(product?.media as unknown[] | undefined);
      const image = sanitizeStoredProductImageUrl(rawImage);

      return {
        variantId,
        productId: variant?.productId ?? "",
        title: translation?.title || "Unknown Product",
        sku: variant?.sku || "N/A",
        totalQuantity: row._sum.quantity ?? 0,
        totalRevenue: row._sum.total ?? 0,
        orderCount: row._count.orderId,
        image,
      };
    });

  return rows;
}