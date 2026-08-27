import { useCallback, useEffect, useState } from 'react';
import { apiClient } from '../../../lib/api-client';
import { logger } from '../../../lib/utils/logger';
import type { AdminAnalyticsData } from '../types/admin-analytics';
import {
  buildAdminPaginatedListCacheKey,
  fetchAdminListCached,
} from '@/lib/admin/admin-list-client-cache';
import {
  buildDashboardMonthlySeries,
  DASHBOARD_METRIC_PERIODS,
  type DashboardChartRange,
  type DashboardDateRange,
  type DashboardMetricPeriod,
  type DashboardTrendPoint,
  previousRangeForDashboardMetricPeriod,
  rangeForDashboardChartRange,
  rangeForDashboardMetricPeriod,
} from '../utils/dashboard-periods';
import { formatPeriodDelta } from '../utils/period-delta';

export type DashboardPeriodSnapshot = {
  period: DashboardMetricPeriod;
  orderCount: number;
  revenueAmount: number;
  averageOrderValue: number;
  revenueDelta: string;
  orderDelta: string;
};

type FetchAnalyticsParams = {
  startDate: string;
  endDate: string;
};

async function fetchAnalyticsRange({
  startDate,
  endDate,
}: FetchAnalyticsParams): Promise<AdminAnalyticsData> {
  const params = { period: 'custom', startDate, endDate };
  return fetchAdminListCached(
    buildAdminPaginatedListCacheKey('analytics', params),
    () => apiClient.get<AdminAnalyticsData>('/api/v1/admin/analytics', { params }),
  );
}

function toSnapshot(
  period: DashboardMetricPeriod,
  current: AdminAnalyticsData,
  previous: AdminAnalyticsData,
): DashboardPeriodSnapshot {
  const orderCount = current.orders.totalOrders;
  const revenueAmount = current.orders.totalRevenue;
  const averageOrderValue = orderCount > 0 ? revenueAmount / orderCount : 0;

  return {
    period,
    orderCount,
    revenueAmount,
    averageOrderValue,
    revenueDelta: formatPeriodDelta(revenueAmount, previous.orders.totalRevenue),
    orderDelta: formatPeriodDelta(orderCount, previous.orders.totalOrders),
  };
}

interface UseDashboardPeriodAnalyticsParams {
  isLoggedIn: boolean;
  isAdmin: boolean;
  chartRange: DashboardChartRange;
}

interface UseDashboardPeriodAnalyticsReturn {
  snapshots: DashboardPeriodSnapshot[];
  trendPoints: DashboardTrendPoint[];
  loading: boolean;
}

export function useDashboardPeriodAnalytics({
  isLoggedIn,
  isAdmin,
  chartRange,
}: UseDashboardPeriodAnalyticsParams): UseDashboardPeriodAnalyticsReturn {
  const [snapshots, setSnapshots] = useState<DashboardPeriodSnapshot[]>([]);
  const [trendPoints, setTrendPoints] = useState<DashboardTrendPoint[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchInsights = useCallback(async () => {
    try {
      setLoading(true);

      const chartRangeDates = rangeForDashboardChartRange(chartRange);
      const periodRequests = DASHBOARD_METRIC_PERIODS.flatMap((period) => {
        const current = rangeForDashboardMetricPeriod(period);
        const previous = previousRangeForDashboardMetricPeriod(period);
        return [
          { period, kind: 'current' as const, range: current },
          { period, kind: 'previous' as const, range: previous },
        ];
      });

      const responses = await Promise.all([
        ...periodRequests.map((request) => fetchAnalyticsRange(request.range)),
        fetchAnalyticsRange(chartRangeDates),
      ]);

      const chartAnalytics = responses[responses.length - 1] as AdminAnalyticsData;
      const nextSnapshots = DASHBOARD_METRIC_PERIODS.map((period, index) => {
        const current = responses[index * 2] as AdminAnalyticsData;
        const previous = responses[index * 2 + 1] as AdminAnalyticsData;
        return toSnapshot(period, current, previous);
      });

      setSnapshots(nextSnapshots);
      setTrendPoints(
        buildDashboardMonthlySeries(chartAnalytics.ordersByDay, chartRangeDates),
      );
    } catch (error) {
      logger.error('Failed to load dashboard period analytics', { error });
      setSnapshots([]);
      setTrendPoints([]);
    } finally {
      setLoading(false);
    }
  }, [chartRange]);

  useEffect(() => {
    if (isLoggedIn && isAdmin) {
      void fetchInsights();
    }
  }, [fetchInsights, isAdmin, isLoggedIn]);

  return { snapshots, trendPoints, loading };
}
