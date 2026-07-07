'use client';

import { UseFormRegister, UseFormSetValue } from 'react-hook-form';
import {
  CHECKOUT_GLASS_OPTION_BASE,
  CHECKOUT_GLASS_OPTION_IDLE,
  CHECKOUT_GLASS_OPTION_SELECTED,
} from '../checkout-glass-styles';
import type { CheckoutFormData } from '../types';
import type { PaymentMethod } from '../utils/payment-methods';
import { CheckoutCashPaymentIcon } from './CheckoutCashPaymentIcon';
import {
  CHECKOUT_PAYMENT_CARD_LOGOS,
  CHECKOUT_PAYMENT_CARD_LOGOS_CLASS,
  CHECKOUT_PAYMENT_ICON_BOX_CLASS,
  CHECKOUT_PAYMENT_IDRAM_LOGO,
  CHECKOUT_PAYMENT_OPTION_DESCRIPTION_CLASS,
  CHECKOUT_PAYMENT_OPTION_NAME_CLASS,
  CHECKOUT_PAYMENT_OPTION_TEXT_CLASS,
} from './checkout-payment.constants';

type CheckoutPaymentMethodOptionsProps = {
  register: UseFormRegister<CheckoutFormData>;
  setValue: UseFormSetValue<CheckoutFormData>;
  isSubmitting: boolean;
  paymentMethod: CheckoutFormData['paymentMethod'];
  paymentMethods: PaymentMethod[];
  logoErrors: Record<string, boolean>;
  setLogoErrors: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
};

function paymentOptionClass(isSelected: boolean): string {
  return `${CHECKOUT_GLASS_OPTION_BASE} ${
    isSelected ? CHECKOUT_GLASS_OPTION_SELECTED : CHECKOUT_GLASS_OPTION_IDLE
  }`;
}

function PaymentMethodIcon({
  methodId,
  logoErrors,
  onLogoError,
}: {
  methodId: PaymentMethod['id'];
  logoErrors: Record<string, boolean>;
  onLogoError: (methodId: PaymentMethod['id']) => void;
}) {
  if (methodId === 'cash_on_delivery') {
    return (
      <div className={CHECKOUT_PAYMENT_ICON_BOX_CLASS}>
        <CheckoutCashPaymentIcon />
      </div>
    );
  }

  if (methodId === 'arca') {
    return (
      <div className={CHECKOUT_PAYMENT_CARD_LOGOS_CLASS}>
        {CHECKOUT_PAYMENT_CARD_LOGOS.map((logo) => (
          <div key={logo.alt} className={CHECKOUT_PAYMENT_ICON_BOX_CLASS}>
            <img src={logo.src} alt={logo.alt} className="h-full w-full object-contain" loading="lazy" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={CHECKOUT_PAYMENT_ICON_BOX_CLASS}>
      {!logoErrors.idram ? (
        <img
          src={CHECKOUT_PAYMENT_IDRAM_LOGO}
          alt="Idram"
          className="h-full w-full object-contain"
          loading="lazy"
          onError={() => onLogoError('idram')}
        />
      ) : (
        <svg className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
          />
        </svg>
      )}
    </div>
  );
}

export function CheckoutPaymentMethodOptions({
  register,
  setValue,
  isSubmitting,
  paymentMethod,
  paymentMethods,
  logoErrors,
  setLogoErrors,
}: CheckoutPaymentMethodOptionsProps) {
  return (
    <div className="space-y-3">
      {paymentMethods.map((method) => (
        <label key={method.id} className={`${paymentOptionClass(paymentMethod === method.id)} gap-3 md:gap-4`}>
          <input
            type="radio"
            {...register('paymentMethod')}
            value={method.id}
            checked={paymentMethod === method.id}
            onChange={(event) =>
              setValue('paymentMethod', event.target.value as CheckoutFormData['paymentMethod'])
            }
            className="sr-only"
            disabled={isSubmitting}
          />
          <PaymentMethodIcon
            methodId={method.id}
            logoErrors={logoErrors}
            onLogoError={(methodId) => {
              setLogoErrors((prev) => ({ ...prev, [methodId]: true }));
            }}
          />
          <div className={CHECKOUT_PAYMENT_OPTION_TEXT_CLASS}>
            <div className={CHECKOUT_PAYMENT_OPTION_NAME_CLASS}>{method.name}</div>
            <div className={CHECKOUT_PAYMENT_OPTION_DESCRIPTION_CLASS}>{method.description}</div>
          </div>
        </label>
      ))}
    </div>
  );
}
