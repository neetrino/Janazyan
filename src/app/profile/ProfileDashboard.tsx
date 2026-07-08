import Link from 'next/link';
import { Button, Card } from '@shop/ui';
import { formatPriceInCurrency, convertPrice, type CurrencyCode } from '../../lib/currency';
import { getStatusColor, getPaymentStatusColor } from './utils';
import type { DashboardData, ProfileTab } from './types';
import {
  PROFILE_BODY_TEXT_CLASS,
  PROFILE_BORDER_DIVIDER_CLASS,
  PROFILE_CARD_CLASS,
  PROFILE_LABEL_TEXT_CLASS,
  PROFILE_MUTED_TEXT_CLASS,
  PROFILE_ORDER_ROW_CLASS,
  PROFILE_PRIMARY_BUTTON_CLASS,
  PROFILE_SECTION_TITLE_CLASS,
  PROFILE_SPINNER_CLASS,
  PROFILE_STAT_CARD_CLASS,
} from './profile-layout.constants';

interface ProfileDashboardProps {
  dashboardData: DashboardData | null;
  dashboardLoading: boolean;
  currency: CurrencyCode;
  onTabChange: (tab: ProfileTab) => void;
  onOrderClick: (orderNumber: string, e: React.MouseEvent<HTMLAnchorElement>) => void;
  t: (key: string) => string;
}

function orderTotalDisplay(
  order: DashboardData['recentOrders'][number],
  currency: CurrencyCode,
): string {
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

export function ProfileDashboard({
  dashboardData,
  dashboardLoading,
  currency,
  onTabChange,
  onOrderClick,
  t,
}: ProfileDashboardProps) {
  if (dashboardLoading) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-16 sm:py-20">
        <div className={PROFILE_SPINNER_CLASS} />
        <p className={PROFILE_BODY_TEXT_CLASS}>{t('profile.dashboard.loading')}</p>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <Card className={PROFILE_CARD_CLASS}>
        <p className={`text-center ${PROFILE_BODY_TEXT_CLASS}`}>{t('profile.dashboard.failedToLoad')}</p>
      </Card>
    );
  }

  const statItems = [
    {
      label: t('profile.dashboard.totalOrders'),
      value: String(dashboardData.stats.totalOrders),
      icon: (
        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      ),
    },
    {
      label: t('profile.dashboard.totalSpent'),
      value: formatPriceInCurrency(dashboardData.stats.totalSpent, currency),
      icon: (
        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      valueClass: 'break-words text-lg sm:text-xl lg:text-2xl',
    },
    {
      label: t('profile.dashboard.pendingOrders'),
      value: String(dashboardData.stats.pendingOrders),
      icon: (
        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      label: t('profile.dashboard.savedAddresses'),
      value: String(dashboardData.stats.addressesCount),
      icon: (
        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
    },
  ] as const;

  return (
    <div className="space-y-8 sm:space-y-10">
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {statItems.map((item) => (
          <Card key={item.label} className={PROFILE_STAT_CARD_CLASS}>
            <div className="absolute right-3 top-3 text-sky-mist sm:right-4 sm:top-4">{item.icon}</div>
            <p className={`pr-14 ${PROFILE_LABEL_TEXT_CLASS}`}>{item.label}</p>
            <p
              className={`mt-2 font-bold tracking-tight text-ink-800 sm:mt-3 ${'valueClass' in item && item.valueClass ? item.valueClass : 'text-2xl sm:text-3xl'}`}
            >
              {item.value}
            </p>
          </Card>
        ))}
      </div>

      <Card className={PROFILE_CARD_CLASS}>
        <div className={`mb-6 flex flex-col gap-4 pb-5 sm:mb-8 sm:flex-row sm:items-end sm:justify-between sm:pb-6 ${PROFILE_BORDER_DIVIDER_CLASS}`}>
          <h2 className={PROFILE_SECTION_TITLE_CLASS}>{t('profile.dashboard.recentOrders')}</h2>
          <Button variant="ghost" size="sm" className="self-start text-sky-deep hover:bg-sky/15 sm:self-auto" onClick={() => onTabChange('orders')}>
            {t('profile.dashboard.viewAll')}
          </Button>
        </div>
        {dashboardData.recentOrders.length === 0 ? (
          <div className="flex flex-col items-center gap-5 py-12 sm:py-16">
            <p className={`max-w-sm text-center ${PROFILE_BODY_TEXT_CLASS}`}>{t('profile.dashboard.noOrders')}</p>
            <Link href="/products">
              <Button variant="primary" className={PROFILE_PRIMARY_BUTTON_CLASS}>
                {t('profile.dashboard.startShopping')}
              </Button>
            </Link>
          </div>
        ) : (
          <ul className="space-y-3 sm:space-y-4">
            {dashboardData.recentOrders.map((order) => (
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
                        <p className="text-lg font-bold text-ink-800 sm:text-xl">{orderTotalDisplay(order, currency)}</p>
                        <p className="mt-0.5 text-xs text-ink-500">{t('profile.dashboard.viewDetails')}</p>
                      </div>
                    </div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </Card>

      <Card className={PROFILE_CARD_CLASS}>
        <h2 className={`mb-5 sm:mb-6 ${PROFILE_SECTION_TITLE_CLASS}`}>{t('profile.dashboard.quickActions')}</h2>
        <div className="flex flex-col gap-3 sm:gap-4 lg:flex-row lg:flex-wrap">
          <Button
            variant="outline"
            onClick={() => onTabChange('orders')}
            className="flex min-h-12 w-full items-center justify-between rounded-xl border-sky-mist px-4 text-ink-700 hover:border-sky-soft hover:bg-sky-mist/20 sm:justify-start lg:min-w-[200px] lg:flex-1"
          >
            <span className="flex min-w-0 items-center gap-3 text-left leading-snug">
              <svg className="h-5 w-5 shrink-0 text-sky-deep" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              {t('profile.dashboard.viewAllOrders')}
            </span>
          </Button>
          <Button
            variant="outline"
            onClick={() => onTabChange('addresses')}
            className="flex min-h-12 w-full items-center justify-between rounded-xl border-sky-mist px-4 text-ink-700 hover:border-sky-soft hover:bg-sky-mist/20 sm:justify-start lg:min-w-[200px] lg:flex-1"
          >
            <span className="flex min-w-0 items-center gap-3 text-left leading-snug">
              <svg className="h-5 w-5 shrink-0 text-sky-deep" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {t('profile.dashboard.manageAddresses')}
            </span>
          </Button>
          <Link href="/products" className="block w-full lg:min-w-[200px] lg:flex-1">
            <Button
              variant="outline"
              className="flex min-h-12 w-full items-center justify-between rounded-xl border-sky-mist px-4 text-ink-700 hover:border-sky-soft hover:bg-sky-mist/20 sm:justify-start"
            >
              <span className="flex min-w-0 items-center gap-3 text-left leading-snug">
                <svg className="h-5 w-5 shrink-0 text-sky-deep" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                {t('profile.dashboard.continueShopping')}
              </span>
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}
