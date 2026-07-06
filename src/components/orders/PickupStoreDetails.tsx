'use client';

import { MapPin } from 'lucide-react';
import { useTranslation } from '../../lib/i18n-client';
import type { PickupStoreAddress } from '../../lib/types/pickup-store';

type PickupStoreDetailsProps = {
  pickupStore: PickupStoreAddress;
  className?: string;
};

export function PickupStoreDetails({ pickupStore, className = '' }: PickupStoreDetailsProps) {
  const { t } = useTranslation();

  return (
    <div className={`space-y-1 text-gray-600 ${className}`.trim()}>
      <p className="font-medium text-gray-900">{pickupStore.storeName}</p>
      <p className="flex items-start gap-2">
        <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gray-400" aria-hidden />
        <span>{pickupStore.address}</span>
      </p>
      <p className="text-sm text-gray-500">
        {t('checkout.shipping.selectedPickupStoreHint')}
      </p>
    </div>
  );
}
