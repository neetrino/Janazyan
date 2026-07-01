'use client';

import { Input } from '@shop/ui';
import { UseFormRegister, UseFormSetValue, FieldErrors } from 'react-hook-form';
import { useTranslation } from '../../lib/i18n-client';
import { CheckoutGlassCard } from './components/CheckoutGlassCard';
import { DeliveryAddressFields } from './components/DeliveryAddressFields';
import {
  CHECKOUT_GLASS_ERROR_CLASS,
  CHECKOUT_GLASS_INNER_CLASS,
  CHECKOUT_GLASS_OPTION_BASE,
  CHECKOUT_GLASS_OPTION_IDLE,
  CHECKOUT_GLASS_OPTION_SELECTED,
} from './checkout-glass-styles';
import { CHECKOUT_FIELD_SCROLL_MARGIN_CLASS } from './checkout-layout.constants';
import { CheckoutFormData } from './types';
import type { DeliveryOptionsPublic } from '@/lib/delivery/delivery-settings.types';

const CHECKOUT_FIELD_WRAPPER_CLASS = CHECKOUT_FIELD_SCROLL_MARGIN_CLASS;

interface CheckoutFormProps {
  register: UseFormRegister<CheckoutFormData>;
  setValue: UseFormSetValue<CheckoutFormData>;
  errors: FieldErrors<CheckoutFormData>;
  isSubmitting: boolean;
  shippingMethod: 'pickup' | 'delivery';
  paymentMethod: 'idram' | 'arca' | 'cash_on_delivery';
  shippingCountry?: string;
  shippingCity?: string;
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
  register,
  setValue,
  errors,
  isSubmitting,
  shippingMethod,
  paymentMethod,
  shippingCountry,
  shippingCity,
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
        <div className="space-y-3">
          {paymentMethods.map((method) => (
            <label key={method.id} className={optionClass(paymentMethod === method.id)}>
              <input
                type="radio"
                {...register('paymentMethod')}
                value={method.id}
                checked={paymentMethod === method.id}
                onChange={(e) => setValue('paymentMethod', e.target.value as 'idram' | 'arca' | 'cash_on_delivery')}
                className="mr-4"
                disabled={isSubmitting}
              />
              <div className="flex items-center gap-4 flex-1">
                <div
                  className={`relative w-20 h-12 flex-shrink-0 ${CHECKOUT_GLASS_INNER_CLASS} flex items-center justify-center overflow-hidden`}
                >
                  {!method.logo || logoErrors[method.id] ? (
                    <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  ) : (
                    <img
                      src={method.logo}
                      alt={method.name}
                      className="w-full h-full object-contain p-1.5"
                      loading="lazy"
                      onError={() => {
                        setLogoErrors((prev) => ({ ...prev, [method.id]: true }));
                      }}
                    />
                  )}
                </div>
                <div className="flex-1">
                  <div className="font-medium text-gray-900">{method.name}</div>
                  <div className="text-sm text-gray-600">{method.description}</div>
                </div>
              </div>
            </label>
          ))}
        </div>
      </CheckoutGlassCard>
    </div>
  );
}
