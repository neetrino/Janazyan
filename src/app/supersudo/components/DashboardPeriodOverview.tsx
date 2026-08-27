'use client';

import { useTranslation } from '../../../lib/i18n-client';
import { formatDashboardAmdAmount } from '../utils/dashboardUtils';
import {
  ADMIN_CARD_CLASS,
  ADMIN_CARD_HOVER_CLASS,
} from '../admin-ui-classes';
import { periodDeltaToneClass } from '../utils/period-delta';
import {
  DASHBOARD_METRIC_PERIODS,
  type DashboardMetricPeriod,
} from '../utils/dashboard-periods';
import type { DashboardPeriodSnapshot } from '../hooks/useDashboardPeriodAnalytics';

type DashboardPeriodOverviewProps = {
  snapshots: DashboardPeriodSnapshot[];
  loading: boolean;
};

function periodTitle(
  period: DashboardMetricPeriod,
  t: (key: string) => string,
): string {
  switch (period) {
    case 'today':
      return t('admin.dashboard.periodToday');
    case 'week':
      return t('admin.dashboard.periodWeek');
    case 'month':
      return t('admin.dashboard.periodMonth');
    case 'quarter':
      return t('admin.dashboard.periodQuarter');
  }
}

export function DashboardPeriodOverview({
  snapshots,
  loading,
}: DashboardPeriodOverviewProps) {
  const { t } = useTranslation();
  const byPeriod = new Map(snapshots.map((snapshot) => [snapshot.period, snapshot]));

  return (
    <div className="mb-3">
      <div className="mb-2">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500">
          {t('admin.dashboard.periodsTitle')}
        </h2>
      </div>

      <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        {DASHBOARD_METRIC_PERIODS.map((period) => {
          const snapshot = byPeriod.get(period);

          return (
            <div
              key={period}
              className={`${ADMIN_CARD_CLASS} ${ADMIN_CARD_HOVER_CLASS} px-3.5 py-3`}
            >
              <div className="mb-2 flex items-center justify-between gap-2">
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                  {periodTitle(period, t)}
                </p>
                {loading ? (
                  <span className="h-3 w-10 animate-pulse rounded bg-gray-200" />
                ) : (
                  <span
                    className={`text-[11px] font-semibold ${periodDeltaToneClass(snapshot?.revenueDelta ?? '0%')}`}
                  >
                    {snapshot?.revenueDelta ?? '—'}
                  </span>
                )}
              </div>

              {loading ? (
                <div className="space-y-2">
                  <div className="h-7 w-24 animate-pulse rounded bg-gray-200" />
                  <div className="h-3 w-16 animate-pulse rounded bg-gray-100" />
                </div>
              ) : (
                <>
                  <p className="text-xl font-bold leading-none text-gray-900">
                    {formatDashboardAmdAmount(snapshot?.revenueAmount ?? 0)}
                  </p>
                  <p className="mt-1 text-xs text-gray-500">
                    {t('admin.dashboard.revenue')}
                  </p>

                  <div className="mt-3 grid grid-cols-2 gap-2 border-t border-gray-100 pt-2.5">
                    <div>
                      <p className="text-sm font-semibold text-gray-900">
                        {snapshot?.orderCount ?? 0}
                      </p>
                      <p className="text-[11px] text-gray-500">
                        {t('admin.dashboard.totalOrders')}
                      </p>
                      <p
                        className={`mt-0.5 text-[11px] font-medium ${periodDeltaToneClass(snapshot?.orderDelta ?? '0%')}`}
                      >
                        {snapshot?.orderDelta ?? '—'}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">
                        {formatDashboardAmdAmount(snapshot?.averageOrderValue ?? 0)}
                      </p>
                      <p className="text-[11px] text-gray-500">
                        {t('admin.dashboard.aov')}
                      </p>
                    </div>
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
