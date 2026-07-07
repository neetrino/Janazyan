'use client';

import { type ReactNode, useMemo } from 'react';
import { Input } from '@shop/ui';
import type { FieldErrors, UseFormRegister, UseFormSetValue } from 'react-hook-form';
import { useTranslation } from '@/lib/i18n-client';
import type { DeliveryOptionsPublic } from '@/lib/delivery/delivery-settings.types';
import { CHECKOUT_FIELD_SCROLL_MARGIN_CLASS } from '../checkout-layout.constants';
import type { CheckoutFormData } from '../types';

const CHECKOUT_FIELD_WRAPPER_CLASS = CHECKOUT_FIELD_SCROLL_MARGIN_CLASS;

const CHECKOUT_SELECT_CLASS =
  'w-full rounded-xl border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-400';

type DeliveryAddressFieldsProps = {
  register: UseFormRegister<CheckoutFormData>;
  setValue: UseFormSetValue<CheckoutFormData>;
  errors: FieldErrors<CheckoutFormData>;
  isSubmitting: boolean;
  shippingCountry?: string;
  shippingCity?: string;
  options: DeliveryOptionsPublic | null;
  optionsLoading: boolean;
  onClearError?: () => void;
};

function CheckoutSelectField({
  label,
  value,
  disabled,
  error,
  onChange,
  children,
  fieldName,
}: {
  label: string;
  value: string;
  disabled?: boolean;
  error?: string;
  onChange: (value: string) => void;
  children: ReactNode;
  fieldName: string;
}) {
  return (
    <div className={CHECKOUT_FIELD_WRAPPER_CLASS} data-checkout-field={fieldName}>
      <label className="mb-1 block text-sm font-medium text-gray-700">{label}</label>
      <select
        disabled={disabled}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={CHECKOUT_SELECT_CLASS}
      >
        {children}
      </select>
      {error ? <p className="mt-1 text-sm text-red-600">{error}</p> : null}
    </div>
  );
}

export function DeliveryAddressFields({
  register,
  setValue,
  errors,
  isSubmitting,
  shippingCountry,
  shippingCity,
  options,
  optionsLoading,
  onClearError,
}: DeliveryAddressFieldsProps) {
  const { t } = useTranslation();

  const selectedCountry = useMemo(
    () => options?.countries.find((country) => country.name === shippingCountry),
    [options, shippingCountry],
  );

  const selectedZone = useMemo(
    () =>
      selectedCountry?.zones.find(
        (zone) => zone.slug === shippingCity || zone.name === shippingCity,
      ),
    [selectedCountry, shippingCity],
  );

  const selectedZoneSlug =
    selectedCountry?.zones.find(
      (zone) => zone.slug === shippingCity || zone.name === shippingCity,
    )?.slug ?? '';

  const handleCountryChange = (countryName: string) => {
    setValue('shippingCountry', countryName, { shouldValidate: true });
    setValue('shippingCity', '', { shouldValidate: true });
    onClearError?.();
  };

  const handleRegionChange = (zoneSlug: string) => {
    setValue('shippingCity', zoneSlug, { shouldValidate: true });
    onClearError?.();
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <CheckoutSelectField
          label={t('checkout.form.country')}
          value={shippingCountry ?? ''}
          disabled={isSubmitting || optionsLoading}
          error={errors.shippingCountry?.message}
          onChange={handleCountryChange}
          fieldName="shippingCountry"
        >
          <option value="">{t('checkout.placeholders.selectCountry')}</option>
          {options?.countries.map((country) => (
            <option key={country.id} value={country.name}>
              {country.name}
            </option>
          ))}
        </CheckoutSelectField>

        <CheckoutSelectField
          label={t('checkout.form.region')}
          value={selectedZoneSlug}
          disabled={isSubmitting || optionsLoading || !selectedCountry}
          error={errors.shippingCity?.message}
          onChange={handleRegionChange}
          fieldName="shippingCity"
        >
          <option value="">{t('checkout.placeholders.selectRegion')}</option>
          {selectedCountry?.zones.map((zone) => (
            <option key={zone.id} value={zone.slug}>
              {zone.name}
            </option>
          ))}
        </CheckoutSelectField>
      </div>

      <div className={CHECKOUT_FIELD_WRAPPER_CLASS} data-checkout-field="shippingAddress">
        <Input
          label={t('checkout.form.address')}
          type="text"
          placeholder={t('checkout.placeholders.address')}
          className="rounded-xl"
          {...register('shippingAddress', {
            onChange: () => onClearError?.(),
          })}
          error={errors.shippingAddress?.message}
          disabled={isSubmitting}
        />
      </div>

      {selectedZone?.extraFields.map((field) => {
        if (field.fieldKey === 'recipientFullName') {
          return (
            <div
              key={field.fieldKey}
              className={CHECKOUT_FIELD_WRAPPER_CLASS}
              data-checkout-field="shippingRecipientName"
            >
              <Input
                label={t('checkout.form.recipientFullName')}
                type="text"
                className="rounded-xl"
                {...register('shippingRecipientName')}
                error={errors.shippingRecipientName?.message}
                disabled={isSubmitting}
              />
            </div>
          );
        }

        if (field.fieldKey === 'postalIndex') {
          return (
            <div
              key={field.fieldKey}
              className={CHECKOUT_FIELD_WRAPPER_CLASS}
              data-checkout-field="shippingPostalIndex"
            >
              <Input
                label={t('checkout.form.postalIndex')}
                type="text"
                className="rounded-xl"
                {...register('shippingPostalIndex')}
                error={errors.shippingPostalIndex?.message}
                disabled={isSubmitting}
              />
            </div>
          );
        }

        return (
          <div
            key={field.fieldKey}
            className={CHECKOUT_FIELD_WRAPPER_CLASS}
            data-checkout-field="shippingAdditionalNotes"
          >
            <Input
              label={t('checkout.form.additionalNotes')}
              type="text"
              className="rounded-xl"
              {...register('shippingAdditionalNotes')}
              error={errors.shippingAdditionalNotes?.message}
              disabled={isSubmitting}
            />
          </div>
        );
      })}
    </div>
  );
}
