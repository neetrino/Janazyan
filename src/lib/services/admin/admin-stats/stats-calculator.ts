import { db } from "@white-shop/db";

const COMPLETED_ORDER_WHERE = {
  OR: [{ status: "completed" }, { paymentStatus: "paid" }],
};

/**
 * Get dashboard stats
 */
export async function getStats() {
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const [
    totalUsers,
    totalProducts,
    lowStockProducts,
    totalOrders,
    recentOrders,
    pendingOrders,
    revenueAgg,
    currencySample,
  ] = await Promise.all([
    db.user.count({ where: { deletedAt: null } }),
    db.product.count({ where: { deletedAt: null } }),
    db.productVariant.count({
      where: {
        stock: { lt: 10 },
        published: true,
      },
    }),
    db.order.count(),
    db.order.count({
      where: {
        createdAt: { gte: sevenDaysAgo },
      },
    }),
    db.order.count({ where: { status: "pending" } }),
    db.order.aggregate({
      where: COMPLETED_ORDER_WHERE,
      _sum: { total: true },
    }),
    db.order.findFirst({
      where: COMPLETED_ORDER_WHERE,
      select: { currency: true },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  return {
    users: {
      total: totalUsers,
    },
    products: {
      total: totalProducts,
      lowStock: lowStockProducts,
    },
    orders: {
      total: totalOrders,
      recent: recentOrders,
      pending: pendingOrders,
    },
    revenue: {
      total: revenueAgg._sum?.total ?? 0,
      currency: currencySample?.currency || "AMD",
    },
  };
}
