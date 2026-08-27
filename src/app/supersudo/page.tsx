'use client';

import { Suspense, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '../../lib/auth/AuthContext';
import { useTranslation } from '../../lib/i18n-client';
import { logger } from '@/lib/utils/logger';
import { AdminPageTitle } from './components/AdminPageTitle';
import { DashboardPeriodOverview } from './components/DashboardPeriodOverview';
import { DashboardRecentOrders } from './components/DashboardRecentOrders';
import { DashboardStatsGrid } from './components/DashboardStatsGrid';
import { DashboardTopProducts } from './components/DashboardTopProducts';
import { DashboardTrendChart } from './components/DashboardTrendChart';
import { useAdminDashboard } from './hooks/useAdminDashboard';
import { useDashboardPeriodAnalytics } from './hooks/useDashboardPeriodAnalytics';
import { parseDashboardChartRange } from './utils/dashboard-periods';

function AdminDashboardContent() {
  const { t } = useTranslation();
  const { isLoggedIn, isAdmin, isLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const chartRange = parseDashboardChartRange(searchParams.get('chart'));

  const {
    stats,
    recentOrders,
    topProducts,
    recentOrdersLoading,
    topProductsLoading,
  } = useAdminDashboard({
    isLoggedIn: isLoggedIn ?? false,
    isAdmin: isAdmin ?? false,
    isLoading,
  });

  const { snapshots, trendPoints, loading: insightsLoading } = useDashboardPeriodAnalytics({
    isLoggedIn: isLoggedIn ?? false,
    isAdmin: isAdmin ?? false,
    chartRange,
  });

  useEffect(() => {
    if (!isLoading) {
      if (!isLoggedIn) {
        logger.debug('❌ [ADMIN] User not logged in, redirecting to login...');
        router.push('/login');
        return;
      }
      if (!isAdmin) {
        logger.debug('❌ [ADMIN] User is not admin, redirecting to home...');
        router.push('/');
      }
    }
  }, [isLoggedIn, isAdmin, isLoading, router]);

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center py-12">
        <div className="text-center">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-b-2 border-accent" />
          <p className="text-sm text-gray-500">{t('admin.common.loading')}</p>
        </div>
      </div>
    );
  }

  if (!isLoggedIn || !isAdmin) {
    return null;
  }

  return (
    <section>
      <div className="mb-3">
        <AdminPageTitle
          lead={t('admin.dashboard.welcomeLead')}
          accent={t('admin.dashboard.welcomeAccent')}
        />
      </div>

      <DashboardStatsGrid
        users={stats?.users.total ?? 0}
        products={stats?.products.total ?? 0}
        usersLabel={t('admin.dashboard.users')}
        productsLabel={t('admin.dashboard.activeProducts')}
      />

      <DashboardPeriodOverview snapshots={snapshots} loading={insightsLoading} />

      <DashboardTrendChart
        chartRange={chartRange}
        points={trendPoints}
        loading={insightsLoading}
      />

      <div className="mb-3 grid grid-cols-1 gap-3 lg:grid-cols-2">
        <DashboardRecentOrders
          recentOrders={recentOrders}
          loading={recentOrdersLoading}
        />
        <DashboardTopProducts
          topProducts={topProducts}
          loading={topProductsLoading}
        />
      </div>
    </section>
  );
}

export default function AdminPanel() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[40vh] items-center justify-center py-12">
          <div className="h-10 w-10 animate-spin rounded-full border-b-2 border-accent" />
        </div>
      }
    >
      <AdminDashboardContent />
    </Suspense>
  );
}
