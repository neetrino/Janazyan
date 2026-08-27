'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTranslation } from '../../../lib/i18n-client';
import { formatDashboardAmdAmount } from '../utils/dashboardUtils';
import { resolveOrderTotalAmd } from '../../../lib/orders/resolve-order-total-amd';
import {
  ADMIN_CARD_CLASS,
  ADMIN_CARD_HOVER_CLASS,
} from '../admin-ui-classes';

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
}

interface DashboardRecentOrdersProps {
  recentOrders: RecentOrder[];
  loading: boolean;
}

function orderStatusBadgeClass(status: string): string {
  const normalized = status.toLowerCase();
  if (normalized.includes('pending')) {
    return 'bg-butter/60 text-ink-800';
  }
  if (normalized.includes('deliver')) {
    return 'bg-sky/30 text-ink-800';
  }
  if (normalized.includes('paid') || normalized.includes('complete')) {
    return 'bg-sage/60 text-ink-800';
  }
  return 'bg-gray-100 text-gray-700';
}

export function DashboardRecentOrders({
  recentOrders,
  loading,
}: DashboardRecentOrdersProps) {
  const { t } = useTranslation();
  const router = useRouter();

  return (
    <div className={`${ADMIN_CARD_CLASS} p-4`}>
      <div className="mb-2 flex items-center justify-between">
        <h2 className="text-base font-semibold text-gray-900">
          {t('admin.dashboard.recentOrders')}
        </h2>
        <Link
          href="/supersudo/orders"
          className="rounded-xl px-2 py-1 text-xs font-medium text-accent hover:bg-accent/5"
        >
          {t('admin.dashboard.viewAll')}
        </Link>
      </div>

      <div className="space-y-2">
        {loading ? (
          [1, 2, 3].map((item) => (
            <div key={item} className="h-14 animate-pulse rounded-xl bg-gray-100" />
          ))
        ) : recentOrders.length === 0 ? (
          <p className="py-6 text-center text-sm text-gray-600">
            {t('admin.dashboard.noRecentOrders')}
          </p>
        ) : (
          recentOrders.map((order) => (
            <button
              key={order.id}
              type="button"
              onClick={() => router.push(`/supersudo/orders?search=${order.number}`)}
              className={`block w-full rounded-xl px-3 py-2 text-left ring-1 ring-gray-100/80 ${ADMIN_CARD_HOVER_CLASS}`}
            >
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-sm font-medium text-gray-900">#{order.number}</p>
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase ${orderStatusBadgeClass(order.status || order.paymentStatus)}`}
                    >
                      {order.status || order.paymentStatus}
                    </span>
                  </div>
                  <p className="truncate text-[11px] text-gray-500">
                    {order.customerEmail || order.customerPhone || t('admin.dashboard.guest')}
                  </p>
                </div>
                <p className="shrink-0 text-sm font-semibold text-gray-900">
                  {formatDashboardAmdAmount(resolveOrderTotalAmd(order))}
                </p>
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  );
}
