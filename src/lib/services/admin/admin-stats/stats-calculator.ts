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

  const totalUsers = await db.user.count({ where: { deletedAt: null } });
  const totalProducts = await db.product.count({ where: { deletedAt: null } });
  const lowStockProducts = await db.productVariant.count({
    where: {
      stock: { lt: 10 },
      published: true,
    },
  });
  const totalOrders = await db.order.count();
  const recentOrders = await db.order.count({
    where: {
      createdAt: { gte: sevenDaysAgo },
    },
  });
  const pendingOrders = await db.order.count({ where: { status: "pending" } });
  const revenueAgg = await db.order.aggregate({
    where: COMPLETED_ORDER_WHERE,
    _sum: { total: true },
  });
  const currencySample = await db.order.findFirst({
    where: COMPLETED_ORDER_WHERE,
    select: { currency: true },
    orderBy: { createdAt: "desc" },
  });

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
