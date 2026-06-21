'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { apiClient } from '../../../lib/api-client';
import { getStoredCurrency } from '../../../lib/currency';
import { useAuth } from '../../../lib/auth/AuthContext';
import { useTranslation } from '../../../lib/i18n-client';
import { readGuestOrderAccess } from '../../checkout/utils/guest-order-access';
import { ProductsHeroShell } from '../../../components/products/ProductsHeroShell';
import { ACCOUNT_PAGE_HERO_SHELL_MOBILE_PROPS } from '../../../lib/layout/account-pages-layout.constants';
import { LoadingState } from './components/LoadingState';
import { ErrorState } from './components/ErrorState';
import { OrderItems } from './components/OrderItems';
import { ShippingAddress } from './components/ShippingAddress';
import { OrderPageHeader } from './components/OrderPageHeader';
import { OrderHelpCard } from './components/OrderHelpCard';
import { OrderSuccessFooterActions } from './components/OrderSuccessFooterActions';
import type { Order } from './types';
import { ORDER_DETAIL_INNER_CLASS } from './constants/order-detail-ui';

export default function OrderPage() {
  const params = useParams();
  const { isLoggedIn } = useAuth();
  const { t } = useTranslation();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currency, setCurrency] = useState(getStoredCurrency());
  const orderNumber = String(params.number);

  const fetchOrder = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      if (isLoggedIn) {
        const response = await apiClient.get<Order>(`/api/v1/orders/${orderNumber}`);
        setOrder(response);
        return;
      }

      const guestAccess = readGuestOrderAccess(orderNumber);
      if (!guestAccess) {
        setError(t('orders.notFound.description'));
        return;
      }

      const response = await apiClient.get<Order>(`/api/v1/orders/${orderNumber}`, {
        params: {
          email: guestAccess.email,
          phone: guestAccess.phone,
        },
      });
      setOrder(response);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : t('orders.notFound.description');
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [isLoggedIn, orderNumber, t]);

  useEffect(() => {
    void fetchOrder();

    const handleCurrencyUpdate = () => {
      setCurrency(getStoredCurrency());
    };

    window.addEventListener('currency-updated', handleCurrencyUpdate);

    return () => {
      window.removeEventListener('currency-updated', handleCurrencyUpdate);
    };
  }, [fetchOrder]);

  if (loading) {
    return (
      <ProductsHeroShell
        sectionAriaLabel="Order confirmation"
        {...ACCOUNT_PAGE_HERO_SHELL_MOBILE_PROPS}
        catalog={<LoadingState />}
      />
    );
  }

  if (error || !order) {
    return (
      <ProductsHeroShell
        sectionAriaLabel="Order confirmation"
        {...ACCOUNT_PAGE_HERO_SHELL_MOBILE_PROPS}
        catalog={<ErrorState error={error} />}
      />
    );
  }

  return (
    <ProductsHeroShell
      sectionAriaLabel="Order confirmation"
      {...ACCOUNT_PAGE_HERO_SHELL_MOBILE_PROPS}
      catalog={
        <div className={ORDER_DETAIL_INNER_CLASS}>
          <OrderPageHeader orderNumber={order.number} placedAt={order.createdAt} />
          <OrderItems
            items={order.items}
            currency={currency}
            presentation="highlight"
            orderTotals={order.totals}
          />
          <OrderHelpCard />
          <OrderSuccessFooterActions />

          {order.shippingAddress && (
            <section className="mt-4 space-y-6 border-t border-gray-200 pt-10">
              <ShippingAddress shippingAddress={order.shippingAddress} />
            </section>
          )}
        </div>
      }
    />
  );
}
