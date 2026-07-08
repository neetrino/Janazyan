import Link from 'next/link';
import { Button, Card } from '@shop/ui';
import { formatPriceInCurrency, convertPrice, type CurrencyCode } from '../../lib/currency';
import { getStatusColor, getPaymentStatusColor } from './utils';
import type { OrderListItem } from './types';
import {
  PROFILE_BODY_TEXT_CLASS,
  PROFILE_BORDER_DIVIDER_CLASS,
  PROFILE_CARD_CLASS,
  PROFILE_LABEL_TEXT_CLASS,
  PROFILE_MUTED_TEXT_CLASS,
  PROFILE_ORDER_ROW_CLASS,
  PROFILE_PRIMARY_BUTTON_CLASS,
  PROFILE_SECTION_TITLE_CLASS,
} from './profile-layout.constants';

interface ProfileOrdersProps {
  orders: OrderListItem[];
  ordersLoading: boolean;
  ordersPage: number;
  setOrdersPage: (page: number | ((prev: number) => number)) => void;
  ordersMeta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  } | null;
  currency: CurrencyCode;
  onOrderClick: (orderNumber: string, e: React.MouseEvent<HTMLAnchorElement>) => void;
  t: (key: string) => string;
}

function orderRowTotal(order: OrderListItem, currency: CurrencyCode): string {
  if (order.subtotal !== undefined && order.discountAmount !== undefined && order.taxAmount !== undefined) {
    const subtotalAMD = convertPrice(order.subtotal, 'USD', 'AMD');
    const discountAMD = convertPrice(order.discountAmount, 'USD', 'AMD');
    const taxAMD = convertPrice(order.taxAmount, 'USD', 'AMD');
    const totalWithoutShippingAMD = subtotalAMD - discountAMD + taxAMD;
    const totalDisplay = currency === 'AMD' ? totalWithoutShippingAMD : convertPrice(totalWithoutShippingAMD, 'AMD', currency);
    return formatPriceInCurrency(totalDisplay, currency);
  }
  const totalAMD = convertPrice(order.total, 'USD', 'AMD');
  const shippingAMD = order.shippingAmount || 0;
  const totalWithoutShippingAMD = totalAMD - shippingAMD;
  const totalDisplay = currency === 'AMD' ? totalWithoutShippingAMD : convertPrice(totalWithoutShippingAMD, 'AMD', currency);
  return formatPriceInCurrency(totalDisplay, currency);
}

function orderRowDiscount(order: OrderListItem, currency: CurrencyCode): string | null {
  if (!order.discountAmount || order.discountAmount <= 0) {
    return null;
  }

  const discountAMD = convertPrice(order.discountAmount, 'USD', 'AMD');
  const discountDisplay = currency === 'AMD' ? discountAMD : convertPrice(discountAMD, 'AMD', currency);
  return formatPriceInCurrency(discountDisplay, currency);
}

export function ProfileOrders({
  orders,
  ordersLoading,
  ordersPage,
  setOrdersPage,
  ordersMeta,
  currency,
  onOrderClick,
  t,
}: ProfileOrdersProps) {
  if (ordersLoading) {
    return (
      <Card className={PROFILE_CARD_CLASS}>
        <h2 className={`${PROFILE_SECTION_TITLE_CLASS} mb-6 sm:mb-8`}>{t('profile.orders.title')}</h2>
        <div className="space-y-3 sm:space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-28 animate-pulse rounded-2xl bg-sky-mist/40 sm:h-32" />
          ))}
        </div>
      </Card>
    );
  }

  if (orders.length === 0) {
    return (
      <Card className={PROFILE_CARD_CLASS}>
        <h2 className={`${PROFILE_SECTION_TITLE_CLASS} mb-6 sm:mb-8`}>{t('profile.orders.title')}</h2>
        <div className="flex flex-col items-center gap-5 py-12 sm:py-16">
          <p className={`max-w-sm text-center ${PROFILE_BODY_TEXT_CLASS}`}>{t('profile.orders.noOrders')}</p>
          <Link href="/products">
            <Button variant="primary" className={PROFILE_PRIMARY_BUTTON_CLASS}>
              {t('profile.dashboard.startShopping')}
            </Button>
          </Link>
        </div>
      </Card>
    );
  }

  return (
    <Card className={PROFILE_CARD_CLASS}>
      <h2 className={`${PROFILE_SECTION_TITLE_CLASS} mb-6 sm:mb-8`}>{t('profile.orders.title')}</h2>
      <ul className="space-y-3 sm:space-y-4">
        {orders.map((order) => {
          const discountDisplay = orderRowDiscount(order, currency);

          return (
            <li key={order.id}>
              <Link
                href={`/orders/${order.number}?from=profile`}
                onClick={(e) => onOrderClick(order.number, e)}
                className={PROFILE_ORDER_ROW_CLASS}
              >
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between lg:gap-6">
                  <div className="min-w-0 flex-1 space-y-3">
                    <h3 className="text-base font-semibold text-ink-800 sm:text-lg">
                      {t('profile.orders.orderNumber')}
                      {order.number}
                    </h3>
                    <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-x-8 sm:gap-y-2">
                      <div>
                        <p className={`mb-1 ${PROFILE_LABEL_TEXT_CLASS}`}>{t('profile.dashboard.orderStatus')}</p>
                        <span className={`inline-block rounded-md px-2 py-1 text-xs font-medium capitalize ${getStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                      </div>
                      <div>
                        <p className={`mb-1 ${PROFILE_LABEL_TEXT_CLASS}`}>{t('profile.dashboard.paymentStatus')}</p>
                        <span className={`inline-block rounded-md px-2 py-1 text-xs font-medium capitalize ${getPaymentStatusColor(order.paymentStatus)}`}>
                          {order.paymentStatus}
                        </span>
                      </div>
                    </div>
                    <p className={PROFILE_MUTED_TEXT_CLASS}>
                      {order.itemsCount} {order.itemsCount !== 1 ? t('profile.orders.items') : t('profile.orders.item')} • {t('profile.dashboard.placedOn')}{' '}
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex flex-row items-end justify-between gap-3 border-t border-sky-mist/50 pt-3 sm:items-center lg:flex-col lg:items-end lg:border-0 lg:pt-0">
                    <div className="text-left lg:text-right">
                      <p className="text-lg font-bold text-ink-800 sm:text-xl">{orderRowTotal(order, currency)}</p>
                      {discountDisplay && (
                        <p className="mt-0.5 text-xs font-medium text-success">
                          {t('profile.orderDetails.discount')}: -{discountDisplay}
                        </p>
                      )}
                      <p className="mt-0.5 text-xs text-ink-500">{t('profile.dashboard.viewDetails')}</p>
                    </div>
                  </div>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>

      {ordersMeta && ordersMeta.totalPages > 1 && (
        <div className={`mt-8 flex flex-col gap-4 pt-6 sm:mt-10 sm:flex-row sm:items-center sm:justify-between sm:pt-8 ${PROFILE_BORDER_DIVIDER_CLASS}`}>
          <p className={`text-center sm:text-left ${PROFILE_MUTED_TEXT_CLASS}`}>
            {t('profile.orders.page')} {ordersMeta.page} {t('profile.orders.of')} {ordersMeta.totalPages} • {ordersMeta.total} {t('profile.orders.totalOrders')}
          </p>
          <div className="flex justify-center gap-2 sm:justify-end">
            <Button
              variant="outline"
              size="sm"
              className="min-w-[100px] rounded-xl border-sky-mist"
              onClick={() => setOrdersPage((prev) => Math.max(1, prev - 1))}
              disabled={ordersPage === 1 || ordersLoading}
            >
              {t('profile.orders.previous')}
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="min-w-[100px] rounded-xl border-sky-mist"
              onClick={() => setOrdersPage((prev) => Math.min(ordersMeta.totalPages, prev + 1))}
              disabled={ordersPage === ordersMeta.totalPages || ordersLoading}
            >
              {t('profile.orders.next')}
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
}
