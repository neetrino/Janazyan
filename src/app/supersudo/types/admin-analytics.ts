/** Admin analytics API payload (used by dashboard period insights). */

export interface AdminAnalyticsData {
  period: string;
  dateRange: {
    start: string;
    end: string;
  };
  orders: {
    totalOrders: number;
    totalRevenue: number;
    paidOrders: number;
    pendingOrders: number;
    completedOrders: number;
  };
  ordersByDay: Array<{
    _id: string;
    count: number;
    revenue: number;
  }>;
  totalUsers: number;
}
