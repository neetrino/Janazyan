'use client';

import { AccountMobileBackBar } from '../../../../components/layout/AccountMobileBackBar';
import { useTranslation } from '../../../../lib/i18n-client';
import { ORDER_DETAIL_MOBILE_BACK_ROW_CLASS } from '../constants/order-detail-ui';

export function OrderProfileBackBar() {
  const { t } = useTranslation();

  return (
    <div className={ORDER_DETAIL_MOBILE_BACK_ROW_CLASS}>
      <AccountMobileBackBar
        href="/profile?tab=dashboard"
        label={t('common.navigation.back')}
      />
    </div>
  );
}
