import { db } from '@white-shop/db';

/**
 * Average published review rating per product id (empty map when none).
 */
export async function fetchProductAverageRatings(
  productIds: string[],
): Promise<Map<string, number>> {
  if (productIds.length === 0) {
    return new Map();
  }

  try {
    const rows = await db.productReview.groupBy({
      by: ['productId'],
      where: {
        productId: { in: productIds },
        published: true,
      },
      _avg: { rating: true },
    });

    return new Map(
      rows
        .filter((row) => row._avg.rating != null && row._avg.rating > 0)
        .map((row) => [row.productId, row._avg.rating as number]),
    );
  } catch {
    return new Map();
  }
}
