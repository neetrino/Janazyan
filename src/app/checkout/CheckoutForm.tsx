'use client';

import { Input } from '@shop/ui';
import { UseFormRegister, UseFormSetValue, FieldErrors } from 'react-hook-form';
import { useTranslation } from '../../lib/i18n-client';
import { CheckoutGlassCard } from './components/CheckoutGlassCard';
import { CheckoutProductsInOrder } from './components/CheckoutProductsInOrder';
import { DeliveryAddressFields } from './components/DeliveryAddressFields';
import { CheckoutPickupStorePicker } from './components/CheckoutPickupStorePicker';
import {
  CHECKOUT_GLASS_ERROR_CLASS,
  CHECKOUT_GLASS_OPTION_BASE,
  CHECKOUT_GLASS_OPTION_IDLE,
  CHECKOUT_GLASS_OPTION_SELECTED,
} from './checkout-glass-styles';
import { CheckoutPaymentMethodOptions } from './components/CheckoutPaymentMethodOptions';
import {
  CHECKOUT_FIELD_SCROLL_MARGIN_CLASS,
} from './checkout-layout.constants';
import type { Cart, CheckoutFormData } from './types';
import type { DeliveryOptionsPublic } from '@/lib/delivery/delivery-settings.types';
import type { PartnerStore } from '@/features/stores/types';

const CHECKOUT_FIELD_WRAPPER_CLASS = CHECKOUT_FIELD_SCROLL_MARGIN_CLASS;

interface CheckoutFormProps {
  cart: Cart;
  onRemoveCartItem: (itemId: string) => void;
  removingItemIds: Set<string>;
  register: UseFormRegister<CheckoutFormData>;
  setValue: UseFormSetValue<CheckoutFormData>;
  errors: FieldErrors<CheckoutFormData>;
  isSubmitting: boolean;
  shippingMethod: 'pickup' | 'delivery';
  pickupStoreId?: string;
  paymentMethod: 'idram' | 'arca' | 'cash_on_delivery';
  shippingCountry?: string;
  shippingCity?: string;
  pickupStores: PartnerStore[];
  pickupStoresLoading: boolean;
  deliveryOptions: DeliveryOptionsPublic | null;
  deliveryOptionsLoading: boolean;
  paymentMethods: Array<{
    id: 'idram' | 'arca' | 'cash_on_delivery';
    name: string;
    description: string;
    logo: string | null;
  }>;
  logoErrors: Record<string, boolean>;
  setLogoErrors: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
  error: string | null;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
}

function optionClass(isSelected: boolean): string {
  return `${CHECKOUT_GLASS_OPTION_BASE} ${
    isSelected ? CHECKOUT_GLASS_OPTION_SELECTED : CHECKOUT_GLASS_OPTION_IDLE
  }`;
}

export function CheckoutForm({
  cart,
  onRemoveCartItem,
  removingItemIds,
  register,
  setValue,
  errors,
  isSubmitting,
  shippingMethod,
  pickupStoreId,
  paymentMethod,
  shippingCountry,
  shippingCity,
  pickupStores,
  pickupStoresLoading,
  deliveryOptions,
  deliveryOptionsLoading,
  paymentMethods,
  logoErrors,
  setLogoErrors,
  error,
  setError,
}: CheckoutFormProps) {
  const { t } = useTranslation();

  return (
    <div className="lg:col-span-2 space-y-6">
      <CheckoutProductsInOrder
        cart={cart}
        onRemoveItem={onRemoveCartItem}
        removingItemIds={removingItemIds}
      />

      <CheckoutGlassCard
        className={CHECKOUT_FIELD_SCROLL_MARGIN_CLASS}
        data-checkout-section="contact"
      >
        <h2 className="text-xl font-semibold text-gray-900 mb-6">{t('checkout.contactInformation')}</h2>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className={CHECKOUT_FIELD_WRAPPER_CLASS} data-checkout-field="firstName">
              <Input
                label={t('checkout.form.firstName')}
                type="text"
                className="rounded-xl"
                {...register('firstName')}
                error={errors.firstName?.message}
                disabled={isSubmitting}
              />
            </div>
            <div className={CHECKOUT_FIELD_WRAPPER_CLASS} data-checkout-field="lastName">
              <Input
                label={t('checkout.form.lastName')}
                type="text"
                className="rounded-xl"
                {...register('lastName')}
                error={errors.lastName?.message}
                disabled={isSubmitting}
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className={CHECKOUT_FIELD_WRAPPER_CLASS} data-checkout-field="email">
              <Input
                label={t('checkout.form.email')}
                type="email"
                className="rounded-xl"
                {...register('email')}
                error={errors.email?.message}
                disabled={isSubmitting}
              />
            </div>
            <div className={CHECKOUT_FIELD_WRAPPER_CLASS} data-checkout-field="phone">
              <Input
                label={t('checkout.form.phone')}
                type="tel"
                placeholder={t('checkout.placeholders.phone')}
                className="rounded-xl"
                {...register('phone')}
                error={errors.phone?.message}
                disabled={isSubmitting}
              />
            </div>
          </div>
        </div>
      </CheckoutGlassCard>

      <CheckoutGlassCard
        className={CHECKOUT_FIELD_SCROLL_MARGIN_CLASS}
        data-checkout-field="shippingMethod"
        data-checkout-section="shipping-method"
      >
        <h2 className="text-xl font-semibold text-gray-900 mb-6">{t('checkout.shippingMethod')}</h2>
        {errors.shippingMethod && (
          <div className={`mb-4 p-3 ${CHECKOUT_GLASS_ERROR_CLASS}`}>
            <p className="text-sm text-red-600">{errors.shippingMethod.message}</p>
          </div>
        )}
        <div className="space-y-3">
          <label className={optionClass(shippingMethod === 'pickup')}>
            <input
              type="radio"
              {...register('shippingMethod')}
              value="pickup"
              checked={shippingMethod === 'pickup'}
              onChange={(e) => setValue('shippingMethod', e.target.value as 'pickup' | 'delivery')}
              className="mr-4"
              disabled={isSubmitting}
            />
            <div className="flex-1">
              <div className="font-medium text-gray-900">{t('checkout.shipping.storePickup')}</div>
              <div className="text-sm text-gray-600">{t('checkout.shipping.storePickupDescription')}</div>
            </div>
          </label>
          <label className={optionClass(shippingMethod === 'delivery')}>
            <input
              type="radio"
              {...register('shippingMethod')}
              value="delivery"
              checked={shippingMethod === 'delivery'}
              onChange={(e) => setValue('shippingMethod', e.target.value as 'pickup' | 'delivery')}
              className="mr-4"
              disabled={isSubmitting}
            />
            <div className="flex-1">
              <div className="font-medium text-gray-900">{t('checkout.shipping.delivery')}</div>
              <div className="text-sm text-gray-600">{t('checkout.shipping.deliveryDescription')}</div>
            </div>
          </label>
        </div>
      </CheckoutGlassCard>

      {shippingMethod === 'pickup' && (
        <CheckoutGlassCard className={CHECKOUT_FIELD_SCROLL_MARGIN_CLASS}>
          <input type="hidden" {...register('pickupStoreId')} />
          <CheckoutPickupStorePicker
            stores={pickupStores}
            loading={pickupStoresLoading}
            selectedStoreId={pickupStoreId?.trim() ? pickupStoreId : null}
            onSelect={(storeId) => setValue('pickupStoreId', storeId, { shouldValidate: true })}
            errorMessage={errors.pickupStoreId?.message}
          />
        </CheckoutGlassCard>
      )}

      {shippingMethod === 'delivery' && (
        <CheckoutGlassCard
          className={CHECKOUT_FIELD_SCROLL_MARGIN_CLASS}
          data-shipping-section
        >
          <h2 className="text-xl font-semibold text-gray-900 mb-6">{t('checkout.shippingAddress')}</h2>
          {(error && error.includes('shipping address')) ||
          errors.shippingAddress ||
          errors.shippingCountry ||
          errors.shippingCity ||
          errors.shippingRecipientName ||
          errors.shippingPostalIndex ||
          errors.shippingAdditionalNotes ? (
            <div className={`mb-4 p-3 ${CHECKOUT_GLASS_ERROR_CLASS}`}>
              <p className="text-sm text-red-600">
                {error && error.includes('shipping address')
                  ? error
                  : (
                    errors.shippingAddress?.message ||
                    errors.shippingCountry?.message ||
                    errors.shippingCity?.message ||
                    errors.shippingRecipientName?.message ||
                    errors.shippingPostalIndex?.message ||
                    errors.shippingAdditionalNotes?.message
                  )}
              </p>
            </div>
          ) : null}
          <DeliveryAddressFields
            register={register}
            setValue={setValue}
            errors={errors}
            isSubmitting={isSubmitting}
            shippingCountry={shippingCountry}
            shippingCity={shippingCity}
            options={deliveryOptions}
            optionsLoading={deliveryOptionsLoading}
            onClearError={() => {
              if (error && error.includes('shipping address')) {
                setError(null);
              }
            }}
          />
        </CheckoutGlassCard>
      )}

      <CheckoutGlassCard
        className={CHECKOUT_FIELD_SCROLL_MARGIN_CLASS}
        data-checkout-field="paymentMethod"
        data-checkout-section="payment-method"
      >
        <h2 className="text-xl font-semibold text-gray-900 mb-6">{t('checkout.paymentMethod')}</h2>
        {errors.paymentMethod && (
          <div className={`mb-4 p-3 ${CHECKOUT_GLASS_ERROR_CLASS}`}>
            <p className="text-sm text-red-600">{errors.paymentMethod.message}</p>
          </div>
        )}
        <CheckoutPaymentMethodOptions
          register={register}
          setValue={setValue}
          isSubmitting={isSubmitting}
          paymentMethod={paymentMethod}
          paymentMethods={paymentMethods}
          logoErrors={logoErrors}
          setLogoErrors={setLogoErrors}
        />
      </CheckoutGlassCard>
    </div>
  );
}
