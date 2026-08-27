'use client';

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { TrendingUp } from 'lucide-react';
import { useTranslation } from '../../../lib/i18n-client';
import { formatDashboardAmdAmount } from '../utils/dashboardUtils';
import {
  ADMIN_CARD_CLASS,
  ADMIN_CARD_HOVER_CLASS,
  DASHBOARD_ORDERS_COLOR,
  DASHBOARD_REVENUE_COLOR,
  analyticsMetricToneClass,
  type AnalyticsMetricTone,
} from '../admin-ui-classes';
import {
  DASHBOARD_CHART_RANGES,
  type DashboardChartRange,
  type DashboardTrendPoint,
} from '../utils/dashboard-periods';
import { DashboardTrendSvg } from './DashboardTrendSvg';

type DashboardTrendChartProps = {
  chartRange: DashboardChartRange;
  points: DashboardTrendPoint[];
  loading: boolean;
};

function buildHref(
  pathname: string,
  searchParams: URLSearchParams,
  nextChart: DashboardChartRange,
): string {
  const params = new URLSearchParams(searchParams.toString());
  params.set('chart', nextChart);
  return `${pathname}?${params.toString()}`;
}

function pickBestMonth(points: DashboardTrendPoint[]): DashboardTrendPoint | null {
  if (points.length === 0) {
    return null;
  }
  return points.reduce((best, point) =>
    point.revenueAmount > best.revenueAmount ? point : best,
  );
}

function StackStat({
  label,
  value,
  hint,
  tone,
}: {
  label: string;
  value: string;
  hint?: string;
  tone: AnalyticsMetricTone;
}) {
  return (
    <div
      className={`rounded-xl px-3.5 py-3 ring-1 ${analyticsMetricToneClass(tone)} ${ADMIN_CARD_HOVER_CLASS}`}
    >
      <p className="text-[11px] font-medium text-gray-500">{label}</p>
      <p className="mt-1 break-words text-base font-bold leading-snug text-gray-900">
        {value}
      </p>
      {hint ? (
        <p className="mt-1 break-words text-[11px] leading-snug text-gray-500">{hint}</p>
      ) : null}
    </div>
  );
}

export function DashboardTrendChart({
  chartRange,
  points,
  loading,
}: DashboardTrendChartProps) {
  const { t } = useTranslation();
  const pathname = usePathname() ?? '/supersudo';
  const searchParams = useSearchParams();

  const totalRevenue = points.reduce((sum, point) => sum + point.revenueAmount, 0);
  const totalOrders = points.reduce((sum, point) => sum + point.orderCount, 0);
  const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
  const bestMonth = pickBestMonth(points);
  const isEmpty = points.every(
    (point) => point.orderCount === 0 && point.revenueAmount === 0,
  );

  const rangeLabels: Record<DashboardChartRange, string> = {
    months_6: t('admin.dashboard.chartRange6Months'),
    year: t('admin.dashboard.chartRangeYear'),
  };

  return (
    <div className={`mb-3 ${ADMIN_CARD_CLASS} p-4`}>
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-coral/10 text-coral">
            <TrendingUp className="h-4 w-4" aria-hidden />
          </div>
          <div className="min-w-0">
            <h2 className="text-base font-semibold text-gray-900">
              {t('admin.dashboard.chartTitle')}
            </h2>
            <p className="text-xs text-gray-500">{t('admin.dashboard.chartSubtitle')}</p>
          </div>
        </div>

        <div
          className="relative inline-grid grid-cols-2 rounded-xl bg-cream p-0.5"
          role="tablist"
          aria-label={t('admin.dashboard.chartRangeLabel')}
        >
          <span
            aria-hidden
            className={`pointer-events-none absolute top-0.5 bottom-0.5 left-0.5 w-[calc(50%-0.125rem)] rounded-[10px] bg-white shadow-sm ring-1 ring-gray-100 transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] motion-reduce:transition-none ${
              chartRange === 'year' ? 'translate-x-full' : ''
            }`}
          />
          {DASHBOARD_CHART_RANGES.map((option) => {
            const active = option === chartRange;
            return (
              <Link
                key={option}
                href={buildHref(pathname, searchParams, option)}
                role="tab"
                aria-selected={active}
                className={`relative z-[1] rounded-[10px] px-2.5 py-1 text-center text-xs font-semibold transition-colors duration-300 ${
                  active ? 'text-gray-900' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {rangeLabels[option]}
              </Link>
            );
          })}
        </div>
      </div>

      {loading ? (
        <div className="py-10 text-center">
          <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-b-2 border-accent" />
          <p className="text-sm text-gray-500">{t('admin.common.loading')}</p>
        </div>
      ) : isEmpty ? (
        <p className="py-10 text-center text-sm text-gray-500">
          {t('admin.dashboard.chartEmpty')}
        </p>
      ) : (
        <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_15rem]">
          <div className="min-w-0 rounded-xl bg-gradient-to-b from-cream/70 to-white p-2 ring-1 ring-gray-100/80">
            <DashboardTrendSvg
              points={points}
              chartAria={t('admin.dashboard.chartAria')}
            />
            <div className="mt-1 flex flex-wrap items-center justify-center gap-4 text-[11px] text-gray-500">
              <span className="inline-flex items-center gap-1.5">
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: DASHBOARD_REVENUE_COLOR }}
                />
                {t('admin.dashboard.chartRevenue')}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: DASHBOARD_ORDERS_COLOR }}
                />
                {t('admin.dashboard.chartOrders')}
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <StackStat
              label={t('admin.dashboard.chartRevenue')}
              value={formatDashboardAmdAmount(totalRevenue)}
              tone="revenue"
            />
            <StackStat
              label={t('admin.dashboard.chartOrders')}
              value={String(totalOrders)}
              tone="orders"
            />
            <StackStat
              label={t('admin.dashboard.aov')}
              value={formatDashboardAmdAmount(averageOrderValue)}
              tone="aov"
            />
            <StackStat
              label={t('admin.dashboard.chartBestMonth')}
              value={
                bestMonth && bestMonth.revenueAmount > 0
                  ? bestMonth.label
                  : t('admin.dashboard.chartEmptyShort')
              }
              hint={
                bestMonth && bestMonth.revenueAmount > 0
                  ? formatDashboardAmdAmount(bestMonth.revenueAmount)
                  : undefined
              }
              tone="surface"
            />
          </div>
        </div>
      )}
    </div>
  );
}
