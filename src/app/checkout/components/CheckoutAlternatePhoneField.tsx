'use client';

import { Input } from '@shop/ui';
import type { FieldErrors, UseFormRegister } from 'react-hook-form';
import { useTranslation } from '../../../lib/i18n-client';
import type { CheckoutFormData } from '../types';

interface CheckoutAlternatePhoneFieldProps {
  register: UseFormRegister<CheckoutFormData>;
  errors: FieldErrors<CheckoutFormData>;
  isSubmitting: boolean;
}

export function CheckoutAlternatePhoneField({
  register,
  errors,
  isSubmitting,
}: CheckoutAlternatePhoneFieldProps) {
  const { t } = useTranslation();

  return (
    <div data-checkout-field="alternatePhone">
      <Input
        label={t('checkout.form.alternatePhone')}
        type="tel"
        placeholder={t('checkout.placeholders.phone')}
        className="rounded-xl"
        {...register('alternatePhone')}
        error={errors.alternatePhone?.message}
        disabled={isSubmitting}
      />
      {!errors.alternatePhone && (
        <p className="mt-1 text-xs text-gray-500">{t('checkout.form.alternatePhoneHint')}</p>
      )}
    </div>
  );
}
