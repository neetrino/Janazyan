import { db } from "@white-shop/db";

/**
 * Activity item interface
 */
export interface ActivityItem {
  type: string;
  title: string;
  description: string;
  timestamp: string;
}

/**
 * Get recent activity for dashboard
 */
export async function getActivity(limit: number = 10): Promise<ActivityItem[]> {
  const activities: ActivityItem[] = [];

  const [recentOrders, recentUsers] = await Promise.all([
    db.order.findMany({
      take: limit,
      orderBy: { createdAt: "desc" },
      select: {
        number: true,
        total: true,
        currency: true,
        createdAt: true,
        _count: {
          select: { items: true },
        },
      },
    }),
    db.user.findMany({
      take: Math.floor(limit / 2),
      orderBy: { createdAt: "desc" },
      where: { deletedAt: null },
      select: {
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        createdAt: true,
      },
    }),
  ]);

  recentOrders.forEach((order) => {
    activities.push({
      type: "order",
      title: `New Order #${order.number}`,
      description: `${order._count.items} items • ${order.total} ${order.currency}`,
      timestamp: order.createdAt.toISOString(),
    });
  });

  recentUsers.forEach((user) => {
    const name =
      [user.firstName, user.lastName].filter(Boolean).join(" ") ||
      user.email ||
      user.phone ||
      "New User";
    activities.push({
      type: "user",
      title: "New User Registration",
      description: name,
      timestamp: user.createdAt.toISOString(),
    });
  });

  return activities
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, limit);
}
