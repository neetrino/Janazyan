'use client';

import { PartnerStoresDirectory } from '@/features/stores/components/PartnerStoresDirectory';
import type { PartnerStore } from '@/features/stores/types';
import { useTranslation } from '../../../lib/i18n-client';
import { CHECKOUT_PICKUP_STORE_LIST_SHELL_CLASS } from '../checkout-layout.constants';

type CheckoutPickupStorePickerProps = {
  stores: PartnerStore[];
  loading: boolean;
  selectedStoreId: string | null;
  onSelect: (storeId: string) => void;
  errorMessage?: string;
};

export function CheckoutPickupStorePicker({
  stores,
  loading,
  selectedStoreId,
  onSelect,
  errorMessage,
}: CheckoutPickupStorePickerProps) {
  const { t } = useTranslation();

  return (
    <div data-checkout-field="pickupStoreId" data-checkout-section="pickup-store">
      <h3 className="mb-2 text-base font-semibold text-gray-900">
        {t('checkout.shipping.selectPickupStore')}
      </h3>
      <p className="mb-4 text-sm text-gray-600">
        {t('checkout.shipping.selectPickupStoreDescription')}
      </p>

      {errorMessage ? (
        <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-3">
          <p className="text-sm text-red-600">{errorMessage}</p>
        </div>
      ) : null}

      {loading ? (
        <div className="partner-stores-directory-shell animate-pulse p-6">
          <div className="h-4 w-40 rounded bg-white/70" />
          <div className="mt-4 space-y-3">
            <div className="h-16 rounded-2xl bg-white/70" />
            <div className="h-16 rounded-2xl bg-white/70" />
          </div>
        </div>
      ) : stores.length === 0 ? (
        <p className="text-sm text-gray-600">{t('checkout.shipping.noPickupStores')}</p>
      ) : (
        <div className={`partner-stores-directory-shell ${CHECKOUT_PICKUP_STORE_LIST_SHELL_CLASS}`}>
          <div className="partner-stores-directory-shell__header">
            <p className="text-sm font-semibold text-gray-900">
              {t('checkout.shipping.pickupStoreListTitle')}
            </p>
            <p className="partner-stores-directory-shell__subtitle">
              {t('checkout.shipping.pickupStoreListHint')}
            </p>
          </div>
          <PartnerStoresDirectory
            stores={stores}
            selectedStoreId={selectedStoreId}
            viewOnMapLabel={t('stores.viewOnMap')}
            onSelect={(storeId) => onSelect(storeId)}
            ariaLabel={t('checkout.shipping.pickupStoreListTitle')}
          />
        </div>
      )}
    </div>
  );
}
