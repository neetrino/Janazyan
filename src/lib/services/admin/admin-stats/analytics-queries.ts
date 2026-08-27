import { db } from '@white-shop/db';
import { sanitizeStoredProductImageUrl } from '@/lib/products/resolve-stored-product-image-url';
import {
  DASHBOARD_REVENUE_ORDER_WHERE,
  resolveOrderTotalAmd,
  type OrderAmountFields,
} from '@/lib/orders/resolve-order-total-amd';

type DateRange = { start: Date; end: Date };

const ORDER_DATE_FILTER = (range: DateRange) => ({
  createdAt: { gte: range.start, lte: range.end },
});

const ORDER_AMOUNT_SELECT = {
  total: true,
  subtotal: true,
  discountAmount: true,
  shippingAmount: true,
  taxAmount: true,
  status: true,
  paymentStatus: true,
} as const;

function isRevenueEligible(order: {
  status: string;
  paymentStatus: string;
}): boolean {
  return (
    order.status === 'completed' ||
    order.paymentStatus === 'paid'
  );
}

function sumRevenueAmd(orders: Array<OrderAmountFields & { status: string; paymentStatus: string }>): number {
  return orders.reduce((sum, order) => {
    if (!isRevenueEligible(order)) {
      return sum;
    }
    return sum + resolveOrderTotalAmd(order);
  }, 0);
}

function extractImageFromMedia(media: unknown[] | undefined): string | null {
  if (!Array.isArray(media) || media.length === 0) {
    return null;
  }

  const firstMedia = media[0];
  if (typeof firstMedia === 'string') {
    return firstMedia;
  }

  if (firstMedia && typeof firstMedia === 'object' && 'url' in firstMedia) {
    return (firstMedia as { url?: string }).url ?? null;
  }

  return null;
}

export async function fetchAnalyticsOrderSummary(range: DateRange) {
  const where = ORDER_DATE_FILTER(range);

  const [totalOrders, paidOrders, pendingOrders, completedOrders, revenueOrders] =
    await Promise.all([
      db.order.count({ where }),
      db.order.count({ where: { ...where, paymentStatus: 'paid' } }),
      db.order.count({ where: { ...where, status: 'pending' } }),
      db.order.count({ where: { ...where, status: 'completed' } }),
      db.order.findMany({
        where: { ...where, ...DASHBOARD_REVENUE_ORDER_WHERE },
        select: ORDER_AMOUNT_SELECT,
      }),
    ]);

  return {
    totalOrders,
    paidOrders,
    pendingOrders,
    completedOrders,
    totalRevenue: sumRevenueAmd(revenueOrders),
  };
}

export async function fetchAnalyticsOrdersByDay(range: DateRange) {
  const orders = await db.order.findMany({
    where: ORDER_DATE_FILTER(range),
    select: { createdAt: true, ...ORDER_AMOUNT_SELECT },
  });

  const ordersByDayMap = new Map<string, { count: number; revenue: number }>();

  orders.forEach((order) => {
    const dateKey = order.createdAt.toISOString().split('T')[0];
    const existing = ordersByDayMap.get(dateKey) ?? { count: 0, revenue: 0 };
    existing.count += 1;
    if (isRevenueEligible(order)) {
      existing.revenue += resolveOrderTotalAmd(order);
    }
    ordersByDayMap.set(dateKey, existing);
  });

  return Array.from(ordersByDayMap.entries())
    .map(([date, data]) => ({
      _id: date,
      count: data.count,
      revenue: data.revenue,
    }))
    .sort((a, b) => a._id.localeCompare(b._id));
}

export async function fetchAnalyticsTopProducts(range: DateRange, limit: number) {
  const grouped = await db.orderItem.groupBy({
    by: ['variantId'],
    where: {
      variantId: { not: null },
      order: ORDER_DATE_FILTER(range),
    },
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
            where: { locale: 'en' },
            take: 1,
            select: { title: true },
          },
        },
      },
    },
  });

  const variantById = new Map(variants.map((variant) => [variant.id, variant]));

  return topVariants.map((row) => {
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
        productId: variant?.productId ?? '',
        title: translation?.title || 'Unknown Product',
        sku: variant?.sku || 'N/A',
        totalQuantity: row._sum.quantity ?? 0,
        totalRevenue: row._sum.total ?? 0,
        orderCount: row._count.orderId,
        image,
      };
    });
}

export async function fetchAnalyticsTopCategories(range: DateRange, limit: number) {
  const items = await db.orderItem.findMany({
    where: {
      variantId: { not: null },
      order: ORDER_DATE_FILTER(range),
    },
    select: {
      quantity: true,
      total: true,
      orderId: true,
      variant: {
        select: {
          product: {
            select: {
              categories: {
                select: {
                  id: true,
                  translations: {
                    where: { locale: 'en' },
                    take: 1,
                    select: { title: true },
                  },
                },
              },
            },
          },
        },
      },
    },
  });

  const categoryMap = new Map<
    string,
    {
      categoryId: string;
      categoryName: string;
      totalQuantity: number;
      totalRevenue: number;
      orderCount: number;
    }
  >();

  items.forEach((item) => {
    const categories = item.variant?.product?.categories ?? [];
    categories.forEach((category) => {
      const categoryName = category.translations[0]?.title || category.id;
      const existing = categoryMap.get(category.id) ?? {
        categoryId: category.id,
        categoryName,
        totalQuantity: 0,
        totalRevenue: 0,
        orderCount: 0,
      };
      existing.totalQuantity += item.quantity;
      existing.totalRevenue += item.total;
      existing.orderCount += 1;
      categoryMap.set(category.id, existing);
    });
  });

  return Array.from(categoryMap.values())
    .sort((a, b) => b.totalRevenue - a.totalRevenue)
    .slice(0, limit);
}
