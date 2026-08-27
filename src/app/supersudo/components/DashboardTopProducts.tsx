'use client';

import Link from 'next/link';
import { useTranslation } from '../../../lib/i18n-client';
import {
  ADMIN_CARD_CLASS,
  ADMIN_CARD_HOVER_CLASS,
} from '../admin-ui-classes';

interface TopProduct {
  variantId: string;
  productId: string;
  title: string;
  totalQuantity: number;
}

interface DashboardTopProductsProps {
  topProducts: TopProduct[];
  loading: boolean;
}

export function DashboardTopProducts({
  topProducts,
  loading,
}: DashboardTopProductsProps) {
  const { t } = useTranslation();

  return (
    <div className={`${ADMIN_CARD_CLASS} p-4`}>
      <div className="mb-2 flex items-center justify-between">
        <h2 className="text-base font-semibold text-gray-900">
          {t('admin.dashboard.topProductsTitle')}
        </h2>
        <Link
          href="/supersudo/products"
          className="rounded-xl px-2 py-1 text-xs font-medium text-accent hover:bg-accent/5"
        >
          {t('admin.dashboard.viewAll')}
        </Link>
      </div>

      <div className="space-y-2">
        {loading ? (
          [1, 2, 3, 4].map((item) => (
            <div key={item} className="h-12 animate-pulse rounded-xl bg-gray-100" />
          ))
        ) : topProducts.length === 0 ? (
          <p className="py-6 text-center text-sm text-gray-600">
            {t('admin.dashboard.noProductSales')}
          </p>
        ) : (
          topProducts.map((product, index) => (
            <div
              key={product.variantId}
              className={`flex items-center gap-3 rounded-xl px-2.5 py-2 ring-1 ring-gray-100/80 ${ADMIN_CARD_HOVER_CLASS}`}
            >
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-butter/50 text-[11px] font-bold text-ink-800">
                {index + 1}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-gray-900">
                  {product.title}
                </p>
                <p className="text-[11px] text-gray-500">
                  {t('admin.dashboard.soldCount').replace(
                    '{quantity}',
                    String(product.totalQuantity),
                  )}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
