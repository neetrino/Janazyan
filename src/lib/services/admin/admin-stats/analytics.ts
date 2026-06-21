import { db } from '@white-shop/db';
import {
  fetchAnalyticsOrderSummary,
  fetchAnalyticsOrdersByDay,
  fetchAnalyticsTopCategories,
  fetchAnalyticsTopProducts,
} from './analytics-queries';

const ANALYTICS_TOP_LIMIT = 10;

async function fetchAnalyticsTotalUsers(): Promise<number> {
  return db.user.count({ where: { deletedAt: null } });
}

/**
 * Calculate date range based on period
 */
function calculateDateRange(
  period: string,
  startDate?: string,
  endDate?: string,
): { start: Date; end: Date } {
  let start: Date;
  let end: Date = new Date();
  end.setHours(23, 59, 59, 999);

  switch (period) {
    case 'day':
      start = new Date();
      start.setHours(0, 0, 0, 0);
      break;
    case 'week':
      start = new Date();
      start.setDate(start.getDate() - 7);
      start.setHours(0, 0, 0, 0);
      break;
    case 'month':
      start = new Date();
      start.setDate(start.getDate() - 30);
      start.setHours(0, 0, 0, 0);
      break;
    case 'year':
      start = new Date();
      start.setFullYear(start.getFullYear() - 1);
      start.setHours(0, 0, 0, 0);
      break;
    case 'custom':
      if (startDate && endDate) {
        start = new Date(startDate);
        start.setHours(0, 0, 0, 0);
        end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
      } else {
        start = new Date();
        start.setDate(start.getDate() - 7);
        start.setHours(0, 0, 0, 0);
      }
      break;
    default:
      start = new Date();
      start.setDate(start.getDate() - 7);
      start.setHours(0, 0, 0, 0);
  }

  return { start, end };
}

/** Aggregated analytics for the admin dashboard (lightweight queries + cache-friendly). */
export async function getAnalytics(
  period: string = 'week',
  startDate?: string,
  endDate?: string,
) {
  const range = calculateDateRange(period, startDate, endDate);

  const [orders, topProducts, topCategories, ordersByDay, totalUsers] =
    await Promise.all([
      fetchAnalyticsOrderSummary(range),
      fetchAnalyticsTopProducts(range, ANALYTICS_TOP_LIMIT),
      fetchAnalyticsTopCategories(range, ANALYTICS_TOP_LIMIT),
      fetchAnalyticsOrdersByDay(range),
      fetchAnalyticsTotalUsers(),
    ]);

  return {
    period,
    dateRange: {
      start: range.start.toISOString(),
      end: range.end.toISOString(),
    },
    orders,
    topProducts,
    topCategories,
    ordersByDay,
    totalUsers,
  };
}
