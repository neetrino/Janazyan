import { db } from "@white-shop/db";
import {
  DASHBOARD_REVENUE_ORDER_WHERE,
  resolveOrderTotalAmd,
} from "@/lib/orders/resolve-order-total-amd";

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
    revenueOrders,
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
    db.order.findMany({
      where: DASHBOARD_REVENUE_ORDER_WHERE,
      select: {
        total: true,
        subtotal: true,
        discountAmount: true,
        shippingAmount: true,
        taxAmount: true,
      },
    }),
    db.order.findFirst({
      where: DASHBOARD_REVENUE_ORDER_WHERE,
      select: { currency: true },
      orderBy: { createdAt: "desc" },
    }),
  ]);
  const totalRevenue = revenueOrders.reduce(
    (sum, order) => sum + resolveOrderTotalAmd(order),
    0,
  );

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
      total: totalRevenue,
      currency: currencySample?.currency || "AMD",
    },
  };
}
