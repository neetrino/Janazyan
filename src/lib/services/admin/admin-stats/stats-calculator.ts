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
  const revenueOrders = await db.order.findMany({
    where: DASHBOARD_REVENUE_ORDER_WHERE,
    select: {
      total: true,
      subtotal: true,
      discountAmount: true,
      shippingAmount: true,
      taxAmount: true,
    },
  });
  const totalRevenue = revenueOrders.reduce(
    (sum, order) => sum + resolveOrderTotalAmd(order),
    0,
  );
  const currencySample = await db.order.findFirst({
    where: DASHBOARD_REVENUE_ORDER_WHERE,
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
      total: totalRevenue,
      currency: currencySample?.currency || "AMD",
    },
  };
}
