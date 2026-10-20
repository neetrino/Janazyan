import { useMemo } from 'react';
import type { FieldErrors } from 'react-hook-form';
import { z } from 'zod';
import { useTranslation } from '../../../lib/i18n-client';
import { CHECKOUT_PHONE_PATTERN } from '@/lib/orders/checkout-phone';
import { CHECKOUT_SHIPPING_METHODS } from '@/lib/orders/shipping-method';
import type { CheckoutFormData } from '../types';

/** Map Zod issues to RHF field errors (first issue per field). */
export function mapZodIssuesToCheckoutFieldErrors(
  issues: z.ZodIssue[],
): FieldErrors<CheckoutFormData> {
  const errors: FieldErrors<CheckoutFormData> = {};

  for (const issue of issues) {
    const fieldName = issue.path[0];
    if (typeof fieldName !== 'string') {
      continue;
    }

    const key = fieldName as keyof CheckoutFormData;
    if (!errors[key]) {
      errors[key] = { type: issue.code, message: issue.message };
    }
  }

  return errors;
}

export function useCheckoutSchema() {
  const { t } = useTranslation();

  return useMemo(() => z.object({
    firstName: z.string().min(1, t('checkout.errors.firstNameRequired')),
    lastName: z.string().min(1, t('checkout.errors.lastNameRequired')),
    email: z.string().email(t('checkout.errors.invalidEmail')).min(1, t('checkout.errors.emailRequired')),
    phone: z.string().min(1, t('checkout.errors.phoneRequired')).regex(CHECKOUT_PHONE_PATTERN, t('checkout.errors.invalidPhone')),
    alternatePhone: z
      .string()
      .optional()
      .refine(
        (value) => !value?.trim() || CHECKOUT_PHONE_PATTERN.test(value.trim()),
        { message: t('checkout.errors.invalidPhone') },
      ),
    shippingMethod: z.enum(CHECKOUT_SHIPPING_METHODS, {
      message: t('checkout.errors.selectShippingMethod'),
    }),
    paymentMethod: z.enum(['idram', 'arca', 'cash_on_delivery'], {
      message: t('checkout.errors.selectPaymentMethod'),
    }),
    shippingAddress: z.string().optional(),
    shippingCountry: z.string().optional(),
    shippingCity: z.string().optional(),
    shippingRecipientName: z.string().optional(),
    shippingPostalIndex: z.string().optional(),
    shippingAdditionalNotes: z.string().optional(),
    cardNumber: z.string().optional(),
    cardExpiry: z.string().optional(),
    cardCvv: z.string().optional(),
    cardHolderName: z.string().optional(),
  }).refine((data) => Boolean(data.shippingAddress?.trim()), {
    message: t('checkout.errors.addressRequired'),
    path: ['shippingAddress'],
  }).refine((data) => Boolean(data.shippingCountry?.trim()), {
    message: t('checkout.errors.countryRequired'),
    path: ['shippingCountry'],
  }).refine((data) => Boolean(data.shippingCity?.trim()), {
    message: t('checkout.errors.zoneRequired'),
    path: ['shippingCity'],
  }), [t]);
}




