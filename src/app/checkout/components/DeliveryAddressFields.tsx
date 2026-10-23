'use client';

import { useMemo } from 'react';
import { Input, Select, type SelectOption } from '@shop/ui';
import type { FieldErrors, UseFormRegister, UseFormSetValue } from 'react-hook-form';
import { useTranslation } from '@/lib/i18n-client';
import { deliveryLabelMatches, deliveryNameForLocale } from '@/lib/delivery/delivery-names';
import type { DeliveryOptionsPublic } from '@/lib/delivery/delivery-settings.types';
import { CHECKOUT_FIELD_SCROLL_MARGIN_CLASS } from '../checkout-layout.constants';
import type { CheckoutFormData } from '../types';

const CHECKOUT_FIELD_WRAPPER_CLASS = CHECKOUT_FIELD_SCROLL_MARGIN_CLASS;

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
  options,
  fieldName,
  fitContent = false,
}: {
  label: string;
  value: string;
  disabled?: boolean;
  error?: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  fieldName: string;
  fitContent?: boolean;
}) {
  return (
    <div className={`${CHECKOUT_FIELD_WRAPPER_CLASS} ${fitContent ? 'shrink-0' : ''}`} data-checkout-field={fieldName}>
      <label className="mb-1 block text-sm font-medium text-gray-700">{label}</label>
      <Select value={value} onChange={onChange} options={options} disabled={disabled} fitContent={fitContent} />
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
  const { t, lang } = useTranslation();

  const selectedCountry = useMemo(
    () =>
      options?.countries.find((country) =>
        deliveryLabelMatches(shippingCountry ?? '', country.name, country.names),
      ),
    [options, shippingCountry],
  );

  const selectedZone = useMemo(
    () =>
      selectedCountry?.zones.find(
        (zone) =>
          zone.slug === shippingCity ||
          deliveryLabelMatches(shippingCity ?? '', zone.name, zone.names),
      ),
    [selectedCountry, shippingCity],
  );

  const selectedZoneSlug = selectedZone?.slug ?? '';

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
      <div className="flex flex-col gap-4 md:flex-row md:items-start">
        <CheckoutSelectField
          label={t('checkout.form.country')}
          value={shippingCountry ?? ''}
          disabled={isSubmitting || optionsLoading}
          error={errors.shippingCountry?.message}
          onChange={handleCountryChange}
          fieldName="shippingCountry"
          fitContent
          options={[
            { value: '', label: t('checkout.placeholders.selectCountry') },
            ...(options?.countries.map((country) => ({
              value: country.name,
              label: deliveryNameForLocale(country.names, country.name, lang),
            })) ?? []),
          ]}
        />

        <CheckoutSelectField
          label={t('checkout.form.region')}
          value={selectedZoneSlug}
          disabled={isSubmitting || optionsLoading || !selectedCountry}
          error={errors.shippingCity?.message}
          onChange={handleRegionChange}
          fieldName="shippingCity"
          fitContent
          options={[
            { value: '', label: t('checkout.placeholders.selectRegion') },
            ...(selectedCountry?.zones.map((zone) => ({
              value: zone.slug,
              label: deliveryNameForLocale(zone.names, zone.name, lang),
            })) ?? []),
          ]}
        />
        <div className={`${CHECKOUT_FIELD_WRAPPER_CLASS} min-w-0 md:flex-1`} data-checkout-field="shippingAddress">
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
