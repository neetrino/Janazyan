export const DASHBOARD_METRIC_PERIODS = ['today', 'week', 'month', 'quarter'] as const;
export type DashboardMetricPeriod = (typeof DASHBOARD_METRIC_PERIODS)[number];

export const DASHBOARD_CHART_RANGES = ['months_6', 'year'] as const;
export type DashboardChartRange = (typeof DASHBOARD_CHART_RANGES)[number];

export type DashboardDateRange = {
  startDate: string;
  endDate: string;
};

export type DashboardTrendPoint = {
  key: string;
  label: string;
  orderCount: number;
  revenueAmount: number;
};

function startOfDay(date: Date): Date {
  const next = new Date(date);
  next.setHours(0, 0, 0, 0);
  return next;
}

function toIsoDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function addDays(date: Date, days: number): Date {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

function calendarQuarterStart(date: Date): Date {
  const quarterMonth = Math.floor(date.getMonth() / 3) * 3;
  return new Date(date.getFullYear(), quarterMonth, 1);
}

function previousQuarterStart(date: Date): Date {
  const current = calendarQuarterStart(date);
  return new Date(current.getFullYear(), current.getMonth() - 3, 1);
}

function previousQuarterEnd(date: Date): Date {
  const current = calendarQuarterStart(date);
  return addDays(current, -1);
}

export function rangeForDashboardMetricPeriod(
  period: DashboardMetricPeriod,
): DashboardDateRange {
  const today = startOfDay(new Date());
  const endDate = toIsoDate(today);

  if (period === 'today') {
    return { startDate: endDate, endDate };
  }

  if (period === 'week') {
    return { startDate: toIsoDate(addDays(today, -6)), endDate };
  }

  if (period === 'quarter') {
    return { startDate: toIsoDate(calendarQuarterStart(today)), endDate };
  }

  const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
  return { startDate: toIsoDate(monthStart), endDate };
}

export function previousRangeForDashboardMetricPeriod(
  period: DashboardMetricPeriod,
): DashboardDateRange {
  const today = startOfDay(new Date());

  if (period === 'today') {
    const yesterday = toIsoDate(addDays(today, -1));
    return { startDate: yesterday, endDate: yesterday };
  }

  if (period === 'week') {
    const end = addDays(today, -7);
    return { startDate: toIsoDate(addDays(end, -6)), endDate: toIsoDate(end) };
  }

  if (period === 'quarter') {
    const start = previousQuarterStart(today);
    return { startDate: toIsoDate(start), endDate: toIsoDate(previousQuarterEnd(today)) };
  }

  const previousMonthEnd = addDays(new Date(today.getFullYear(), today.getMonth(), 1), -1);
  const previousMonthStart = new Date(
    previousMonthEnd.getFullYear(),
    previousMonthEnd.getMonth(),
    1,
  );
  return {
    startDate: toIsoDate(previousMonthStart),
    endDate: toIsoDate(previousMonthEnd),
  };
}

export function rangeForDashboardChartRange(
  range: DashboardChartRange,
): DashboardDateRange {
  const today = startOfDay(new Date());
  const endDate = toIsoDate(today);

  if (range === 'year') {
    const start = new Date(today.getFullYear(), today.getMonth() - 11, 1);
    return { startDate: toIsoDate(start), endDate };
  }

  const start = new Date(today.getFullYear(), today.getMonth() - 5, 1);
  return { startDate: toIsoDate(start), endDate };
}

export function parseDashboardChartRange(value: string | null): DashboardChartRange {
  return value === 'year' ? 'year' : 'months_6';
}

function formatMonthLabel(monthKey: string): string {
  const [year, month] = monthKey.split('-').map(Number);
  return new Date(year, (month ?? 1) - 1, 1).toLocaleDateString('hy-AM', {
    month: 'short',
    year: '2-digit',
  });
}

function listMonthKeys(from: string, to: string): string[] {
  const keys: string[] = [];
  const [fromYear, fromMonth] = from.split('-').map(Number) as [number, number];
  const [toYear, toMonth] = to.split('-').map(Number) as [number, number];

  let year = fromYear;
  let month = fromMonth;

  while (year < toYear || (year === toYear && month <= toMonth)) {
    keys.push(`${year}-${String(month).padStart(2, '0')}`);
    month += 1;
    if (month > 12) {
      month = 1;
      year += 1;
    }
  }

  return keys;
}

export function buildDashboardMonthlySeries(
  ordersByDay: Array<{ _id: string; count: number; revenue: number }>,
  range: DashboardDateRange,
): DashboardTrendPoint[] {
  const totals = new Map<string, { orderCount: number; revenueAmount: number }>();

  for (const day of ordersByDay) {
    const key = day._id.slice(0, 7);
    const current = totals.get(key) ?? { orderCount: 0, revenueAmount: 0 };
    totals.set(key, {
      orderCount: current.orderCount + day.count,
      revenueAmount: current.revenueAmount + day.revenue,
    });
  }

  return listMonthKeys(range.startDate.slice(0, 7), range.endDate.slice(0, 7)).map(
    (key) => {
      const data = totals.get(key) ?? { orderCount: 0, revenueAmount: 0 };
      return {
        key,
        label: formatMonthLabel(key),
        orderCount: data.orderCount,
        revenueAmount: data.revenueAmount,
      };
    },
  );
}
