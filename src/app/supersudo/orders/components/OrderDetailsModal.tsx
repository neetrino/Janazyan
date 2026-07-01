'use client';

import { useEffect, useState } from 'react';
import { useTranslation } from '../../../../lib/i18n-client';
import { CurrencyCode } from '../../../../lib/currency';
import {
  AdminSideDrawer,
  ADMIN_SIDE_DRAWER_ANIMATION_MS,
} from '../../components/AdminSideDrawer';
import { OrderDetailsSummary } from './OrderDetailsSummary';
import { OrderDetailsAddresses } from './OrderDetailsAddresses';
import { OrderDetailsTotals } from './OrderDetailsTotals';
import { OrderDetailsItems } from './OrderDetailsItems';
import { OrderDetailsSkeleton } from './OrderDetailsSkeleton';
import type { Order, OrderDetails } from '../useOrders';
import { useBodyScrollLock } from '../../hooks/useBodyScrollLock';

interface OrderDetailsModalProps {
  open: boolean;
  orderPreview: Order | null;
  orderDetails: OrderDetails | null;
  loading: boolean;
  currency: string;
  onClose: () => void;
  formatCurrency: (amount: number, orderCurrency?: string, fromCurrency?: CurrencyCode) => string;
}

export function OrderDetailsModal({
  open,
  orderPreview,
  orderDetails,
  loading,
  currency,
  onClose,
  formatCurrency,
}: OrderDetailsModalProps) {
  const { t } = useTranslation();
  const [contentVisible, setContentVisible] = useState(false);
  useBodyScrollLock(open);

  useEffect(() => {
    if (!open || loading || !orderDetails) {
      setContentVisible(false);
      return;
    }

    const timer = window.setTimeout(
      () => setContentVisible(true),
      ADMIN_SIDE_DRAWER_ANIMATION_MS - 80,
    );
    return () => window.clearTimeout(timer);
  }, [open, loading, orderDetails]);

  const subtitle = orderDetails?.number ?? orderPreview?.number;

  return (
    <AdminSideDrawer
      open={open}
      onClose={onClose}
      side="right"
      size="panel"
      title={t('admin.orders.orderDetails.title')}
      subtitle={subtitle ? `#${subtitle}` : undefined}
    >
      {loading || !orderDetails ? (
        <OrderDetailsSkeleton />
      ) : (
        <div
          className={`space-y-8 transition-all duration-300 ease-out ${
            contentVisible ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'
          }`}
        >
          <OrderDetailsSummary
            orderDetails={orderDetails}
            currency={currency}
            formatCurrency={formatCurrency}
          />
          <OrderDetailsAddresses
            orderDetails={orderDetails}
            formatCurrency={formatCurrency}
          />
          <OrderDetailsTotals
            orderDetails={orderDetails}
            currency={currency}
            formatCurrency={formatCurrency}
          />
          <OrderDetailsItems
            orderDetails={orderDetails}
            formatCurrency={formatCurrency}
          />
        </div>
      )}
    </AdminSideDrawer>
  );
}
