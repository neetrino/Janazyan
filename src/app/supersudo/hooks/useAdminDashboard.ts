import { logger } from "@/lib/utils/logger";
/**
 * Hook for admin dashboard data fetching
 */

import { useState, useCallback, useEffect } from 'react';
import { apiClient } from '../../../lib/api-client';
import {
  ADMIN_DASHBOARD_CLIENT_QUERY_KEY,
  fetchAdminDashboardWithClientCache,
  readAdminDashboardClientCache,
} from '@/lib/admin/admin-dashboard-client-cache';

interface Stats {
  users: { total: number };
  products: { total: number; lowStock: number };
  orders: { total: number; recent: number; pending: number };
  revenue: { total: number; currency: string };
}

interface ActivityItem {
  type: string;
  title: string;
  description: string;
  timestamp: string;
}

interface RecentOrder {
  id: string;
  number: string;
  status: string;
  paymentStatus: string;
  total: number;
  subtotal?: number;
  discountAmount?: number;
  shippingAmount?: number;
  taxAmount?: number;
  currency: string;
  customerEmail?: string;
  customerPhone?: string;
  itemsCount: number;
  createdAt: string;
}

interface TopProduct {
  variantId: string;
  productId: string;
  title: string;
  sku: string;
  totalQuantity: number;
  totalRevenue: number;
  orderCount: number;
  image?: string | null;
}

interface UserActivity {
  recentRegistrations: Array<{
    id: string;
    email?: string;
    phone?: string;
    name: string;
    registeredAt: string;
    lastLoginAt?: string;
  }>;
  activeUsers: Array<{
    id: string;
    email?: string;
    phone?: string;
    name: string;
    orderCount: number;
    totalSpent: number;
    lastOrderDate: string;
    lastLoginAt?: string;
  }>;
}

interface AdminDashboardResponse {
  stats: Stats;
  activity: ActivityItem[];
  recentOrders: RecentOrder[];
  topProducts: TopProduct[];
  userActivity: UserActivity;
}

interface UseAdminDashboardProps {
  isLoggedIn: boolean;
  isAdmin: boolean;
  isLoading: boolean;
}

const DASHBOARD_QUERY_PARAMS = {
  activityLimit: '10',
  ordersLimit: '5',
  productsLimit: '5',
  usersLimit: '10',
} as const;

export function useAdminDashboard({ isLoggedIn, isAdmin, isLoading }: UseAdminDashboardProps) {
  const cachedDashboard = readAdminDashboardClientCache<AdminDashboardResponse>(
    ADMIN_DASHBOARD_CLIENT_QUERY_KEY,
  );

  const [stats, setStats] = useState<Stats | null>(cachedDashboard?.stats ?? null);
  const [activity, setActivity] = useState<ActivityItem[]>(cachedDashboard?.activity ?? []);
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>(cachedDashboard?.recentOrders ?? []);
  const [topProducts, setTopProducts] = useState<TopProduct[]>(cachedDashboard?.topProducts ?? []);
  const [userActivity, setUserActivity] = useState<UserActivity | null>(cachedDashboard?.userActivity ?? null);
  const [statsLoading, setStatsLoading] = useState(!cachedDashboard);
  const [activityLoading, setActivityLoading] = useState(!cachedDashboard);
  const [recentOrdersLoading, setRecentOrdersLoading] = useState(!cachedDashboard);
  const [topProductsLoading, setTopProductsLoading] = useState(!cachedDashboard);
  const [userActivityLoading, setUserActivityLoading] = useState(!cachedDashboard);

  const applyDashboardData = useCallback((data: AdminDashboardResponse) => {
    setStats(data.stats);
    setActivity(data.activity);
    setRecentOrders(data.recentOrders);
    setTopProducts(data.topProducts);
    setUserActivity(data.userActivity);
  }, []);

  const fetchDashboard = useCallback(async () => {
    try {
      logger.debug('📊 [ADMIN] Fetching bundled dashboard...');
      setStatsLoading(true);
      setActivityLoading(true);
      setRecentOrdersLoading(true);
      setTopProductsLoading(true);
      setUserActivityLoading(true);

      const data = await fetchAdminDashboardWithClientCache(
        ADMIN_DASHBOARD_CLIENT_QUERY_KEY,
        async () => {
          const response = await apiClient.get<{ data: AdminDashboardResponse }>(
            '/api/v1/admin/dashboard',
            { params: DASHBOARD_QUERY_PARAMS },
          );
          return response.data;
        },
      );

      applyDashboardData(data);
    } catch (err: unknown) {
      console.error('❌ [ADMIN] Error fetching dashboard:', err);
      setStats(null);
      setActivity([]);
      setRecentOrders([]);
      setTopProducts([]);
      setUserActivity(null);
    } finally {
      setStatsLoading(false);
      setActivityLoading(false);
      setRecentOrdersLoading(false);
      setTopProductsLoading(false);
      setUserActivityLoading(false);
    }
  }, [applyDashboardData]);

  useEffect(() => {
    if (!isLoading && isLoggedIn && isAdmin) {
      void fetchDashboard();
    }
  }, [isLoading, isLoggedIn, isAdmin, fetchDashboard]);

  return {
    stats,
    activity,
    recentOrders,
    topProducts,
    userActivity,
    statsLoading,
    activityLoading,
    recentOrdersLoading,
    topProductsLoading,
    userActivityLoading,
  };
}
