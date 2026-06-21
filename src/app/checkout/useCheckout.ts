import { useState, useEffect } from 'react';
import { useForm, type FieldErrors } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { getStoredCurrency } from '../../lib/currency';
import { useAuth } from '../../lib/auth/AuthContext';
import { usePaymentMethods } from './utils/payment-methods';
import {
  mapZodIssuesToCheckoutFieldErrors,
  useCheckoutSchema,
} from './utils/validation-schema';
import { useDeliveryPrice } from './hooks/useDeliveryPrice';
import { useCart } from './hooks/useCart';
import { useUserProfile } from './hooks/useUserProfile';
import { useOrderSubmission } from './hooks/useOrderSubmission';
import { useOrderSummary } from './hooks/useOrderSummary';
import type { CheckoutFormData } from './types';
import {
  scrollToFirstCheckoutError,
} from './utils/scroll-to-checkout-error';

export function useCheckout() {
  const { isLoggedIn, isLoading } = useAuth();
  const [error, setCheckoutError] = useState<string | null>(null);
  const [currency, setCurrency] = useState(getStoredCurrency());
  const [logoErrors, setLogoErrors] = useState<Record<string, boolean>>({});
  const [showShippingModal, setShowShippingModal] = useState(false);
  const [showCardModal, setShowCardModal] = useState(false);

  const paymentMethods = usePaymentMethods();
  const checkoutSchema = useCheckoutSchema();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
    getValues,
    setError: setFieldError,
    clearErrors,
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    shouldFocusError: false,
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      shippingMethod: 'pickup',
      paymentMethod: 'cash_on_delivery',
      shippingAddress: '',
      shippingCity: '',
      cardNumber: '',
      cardExpiry: '',
      cardCvv: '',
      cardHolderName: '',
    },
  });

  const paymentMethod = watch('paymentMethod');
  const shippingMethod = watch('shippingMethod');
  const shippingCity = watch('shippingCity');

  const { deliveryPrice, loadingDeliveryPrice } = useDeliveryPrice(shippingMethod, shippingCity);
  const { cart, loading } = useCart(isLoggedIn);
  useUserProfile(isLoggedIn, isLoading, setValue);

  const { submitOrder } = useOrderSubmission({
    cart,
    isLoggedIn,
    deliveryPrice,
    setError: setCheckoutError,
  });

  const { orderSummary } = useOrderSummary({
    cart,
    shippingMethod,
    deliveryPrice,
    currency,
  });

  useEffect(() => {
    const handleCurrencyUpdate = () => {
      setCurrency(getStoredCurrency());
    };

    const handleCurrencyRatesUpdate = () => {
      setCurrency(getStoredCurrency());
    };

    window.addEventListener('currency-updated', handleCurrencyUpdate);
    window.addEventListener('currency-rates-updated', handleCurrencyRatesUpdate);

    return () => {
      window.removeEventListener('currency-updated', handleCurrencyUpdate);
      window.removeEventListener('currency-rates-updated', handleCurrencyRatesUpdate);
    };
  }, []);

  const applyCheckoutFieldErrors = (validationErrors: FieldErrors<CheckoutFormData>) => {
    clearErrors();

    for (const [fieldName, fieldError] of Object.entries(validationErrors)) {
      if (fieldError?.message) {
        setFieldError(fieldName as keyof CheckoutFormData, {
          type: 'manual',
          message: fieldError.message,
        });
      }
    }
  };

  const onCheckoutSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setCheckoutError(null);

    const values = getValues();
    const parsed = checkoutSchema.safeParse(values);

    if (!parsed.success) {
      const validationErrors = mapZodIssuesToCheckoutFieldErrors(parsed.error.issues);
      applyCheckoutFieldErrors(validationErrors);
      scrollToFirstCheckoutError(validationErrors, { immediate: true });
      return;
    }

    if (paymentMethod === 'arca' || paymentMethod === 'idram') {
      setShowCardModal(true);
      return;
    }

    void submitOrder(parsed.data);
  };

  const onSubmit = (data: CheckoutFormData) => {
    submitOrder(data);
  };

  return {
    // State
    cart,
    loading,
    error,
    setError: setCheckoutError,
    currency,
    logoErrors,
    setLogoErrors,
    showShippingModal,
    setShowShippingModal,
    showCardModal,
    setShowCardModal,
    deliveryPrice,
    loadingDeliveryPrice,
    // Form
    register,
    handleSubmit,
    errors,
    isSubmitting,
    setValue,
    watch,
    // Computed
    paymentMethod,
    shippingMethod,
    shippingCity,
    paymentMethods,
    orderSummary,
    // Actions
    onCheckoutSubmit,
    onSubmit,
    // Auth
    isLoggedIn,
  };
}
