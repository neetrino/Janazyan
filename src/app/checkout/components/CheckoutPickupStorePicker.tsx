'use client';

import { Search } from 'lucide-react';
import { useMemo, useState } from 'react';
import { PartnerStoresDirectory } from '@/features/stores/components/PartnerStoresDirectory';
import { filterPartnerStores } from '@/features/stores/filter-partner-stores';
import type { PartnerStore } from '@/features/stores/types';
import { useTranslation } from '../../../lib/i18n-client';
import { CHECKOUT_PICKUP_STORE_LIST_SHELL_CLASS } from '../checkout-layout.constants';
import {
  CHECKOUT_PICKUP_STORE_SEARCH_ICON_CLASS,
  CHECKOUT_PICKUP_STORE_SEARCH_INPUT_CLASS,
  CHECKOUT_PICKUP_STORE_SEARCH_MAX_WIDTH_CLASS,
  CHECKOUT_PICKUP_STORE_SEARCH_WRAPPER_CLASS,
} from './checkout-pickup-store.constants';

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
  const [searchQuery, setSearchQuery] = useState('');

  const filteredStores = useMemo(
    () => filterPartnerStores(stores, searchQuery),
    [searchQuery, stores],
  );

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
          <div className={`ml-auto h-10 w-full ${CHECKOUT_PICKUP_STORE_SEARCH_MAX_WIDTH_CLASS} rounded-xl bg-white/70`} />
          <div className="mt-4 space-y-3">
            <div className="h-16 rounded-2xl bg-white/70" />
            <div className="h-16 rounded-2xl bg-white/70" />
          </div>
        </div>
      ) : stores.length === 0 ? (
        <p className="text-sm text-gray-600">{t('checkout.shipping.noPickupStores')}</p>
      ) : (
        <div className={`partner-stores-directory-shell ${CHECKOUT_PICKUP_STORE_LIST_SHELL_CLASS}`}>
          <div className="partner-stores-directory-shell__header flex items-center justify-end">
            <label className={CHECKOUT_PICKUP_STORE_SEARCH_WRAPPER_CLASS}>
              <Search className={CHECKOUT_PICKUP_STORE_SEARCH_ICON_CLASS} aria-hidden="true" />
              <input
                type="search"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder={t('checkout.shipping.pickupStoreSearchPlaceholder')}
                className={CHECKOUT_PICKUP_STORE_SEARCH_INPUT_CLASS}
                aria-label={t('checkout.shipping.pickupStoreSearchPlaceholder')}
              />
            </label>
          </div>
          {filteredStores.length === 0 ? (
            <p className="px-5 pb-5 text-sm text-gray-600">
              {t('checkout.shipping.pickupStoreSearchNoResults')}
            </p>
          ) : (
            <PartnerStoresDirectory
              stores={filteredStores}
              selectedStoreId={selectedStoreId}
              viewOnMapLabel={t('stores.viewOnMap')}
              onSelect={(storeId) => onSelect(storeId)}
              ariaLabel={t('checkout.shipping.selectPickupStore')}
            />
          )}
        </div>
      )}
    </div>
  );
}
