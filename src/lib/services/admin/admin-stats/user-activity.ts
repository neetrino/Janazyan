import { db } from "@white-shop/db";

/**
 * Format user for activity response
 */
function formatUser(user: {
  id: string;
  email: string | null;
  phone: string | null;
  firstName: string | null;
  lastName: string | null;
  createdAt: Date;
}) {
  return {
    id: user.id,
    email: user.email || undefined,
    phone: user.phone || undefined,
    name:
      [user.firstName, user.lastName].filter(Boolean).join(" ") ||
      user.email ||
      user.phone ||
      "Unknown",
    registeredAt: user.createdAt.toISOString(),
    lastLoginAt: undefined,
  };
}

/**
 * Get user activity (recent registrations and active users)
 */
export async function getUserActivity(limit: number = 10) {
  const [recentUsers, usersWithOrders] = await Promise.all([
    db.user.findMany({
      where: {
        deletedAt: null,
      },
      take: limit,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        email: true,
        phone: true,
        firstName: true,
        lastName: true,
        createdAt: true,
      },
    }),
    db.user.findMany({
      where: {
        deletedAt: null,
        orders: {
          some: {},
        },
      },
      take: limit,
      select: {
        id: true,
        email: true,
        phone: true,
        firstName: true,
        lastName: true,
        createdAt: true,
        _count: {
          select: { orders: true },
        },
        orders: {
          select: {
            id: true,
            total: true,
            createdAt: true,
          },
          orderBy: { createdAt: "desc" },
          take: 1,
        },
      },
    }),
  ]);

  const userIds = usersWithOrders.map((user) => user.id);
  const spendingByUser =
    userIds.length > 0
      ? await db.order.groupBy({
          by: ["userId"],
          where: { userId: { in: userIds } },
          _sum: { total: true },
        })
      : [];

  const totalSpentByUserId = new Map(
    spendingByUser
      .filter((row) => row.userId)
      .map((row) => [row.userId as string, row._sum.total ?? 0]),
  );

  const recentRegistrations = recentUsers.map(formatUser);

  const activeUsers = usersWithOrders.map((user) => {
    const orders = user.orders;
    const lastOrder = orders[0] ?? null;
    const orderCount = user._count.orders;
    const totalSpent = totalSpentByUserId.get(user.id) ?? 0;

    return {
      id: user.id,
      email: user.email || undefined,
      phone: user.phone || undefined,
      name:
        [user.firstName, user.lastName].filter(Boolean).join(" ") ||
        user.email ||
        user.phone ||
        "Unknown",
      orderCount,
      totalSpent,
      lastOrderDate: lastOrder
        ? lastOrder.createdAt.toISOString()
        : user.createdAt.toISOString(),
      lastLoginAt: undefined,
    };
  });

  return {
    recentRegistrations,
    activeUsers,
  };
}
