import { useState, useEffect, useMemo, useCallback } from 'react';
import { useForm, type FieldErrors } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { apiClient } from '../../lib/api-client';
import { convertPrice } from '../../lib/currency';
import { useAuth } from '../../lib/auth/AuthContext';
import { useTranslation } from '../../lib/i18n-client';
import { handleRemoveItem } from '../cart/cart-handlers';
import { usePaymentMethods } from './utils/payment-methods';
import {
  mapZodIssuesToCheckoutFieldErrors,
  useCheckoutSchema,
} from './utils/validation-schema';
import { validateDeliveryExtraFields } from './utils/validate-delivery-fields';
import { useDeliveryPrice } from './hooks/useDeliveryPrice';
import { useDeliveryOptions } from './hooks/useDeliveryOptions';
import { useCart } from './hooks/useCart';
import { useUserProfile } from './hooks/useUserProfile';
import { useOrderSubmission } from './hooks/useOrderSubmission';
import { useOrderSummary } from './hooks/useOrderSummary';
import { useCheckoutPartnerStores } from './hooks/useCheckoutPartnerStores';
import { useCurrency } from '../../components/hooks/useCurrency';
import type { CheckoutFormData } from './types';
import {
  scrollToFirstCheckoutError,
} from './utils/scroll-to-checkout-error';
import type { AppliedPromo } from './types';

export function useCheckout() {
  const { isLoggedIn, isLoading, user } = useAuth();
  const { t } = useTranslation();
  const [error, setCheckoutError] = useState<string | null>(null);
  const currency = useCurrency();
  const [logoErrors, setLogoErrors] = useState<Record<string, boolean>>({});
  const [showShippingModal, setShowShippingModal] = useState(false);
  const [showCardModal, setShowCardModal] = useState(false);
  const [removingItemIds, setRemovingItemIds] = useState<Set<string>>(new Set());
  const [promoCode, setPromoCode] = useState('');
  const [promoError, setPromoError] = useState<string | null>(null);
  const [promoApplying, setPromoApplying] = useState(false);
  const [appliedPromo, setAppliedPromo] = useState<AppliedPromo | null>(null);

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
      pickupStoreId: '',
      paymentMethod: 'cash_on_delivery',
      shippingAddress: '',
      shippingCountry: '',
      shippingCity: '',
      shippingRecipientName: '',
      shippingPostalIndex: '',
      shippingAdditionalNotes: '',
      cardNumber: '',
      cardExpiry: '',
      cardCvv: '',
      cardHolderName: '',
    },
  });

  const paymentMethod = watch('paymentMethod');
  const shippingMethod = watch('shippingMethod');
  const pickupStoreId = watch('pickupStoreId');
  const shippingCountry = watch('shippingCountry');
  const shippingCity = watch('shippingCity');

  const { stores: pickupStores, loading: pickupStoresLoading } = useCheckoutPartnerStores();

  const { options: deliveryOptions, loading: deliveryOptionsLoading } = useDeliveryOptions();
  const { cart, loading, setCart, fetchCart } = useCart(isLoggedIn);
  useUserProfile(isLoggedIn, isLoading, setValue);

  const orderSubtotalAmd = useMemo(() => {
    if (!cart) {
      return 0;
    }
    return convertPrice(cart.totals.subtotal, 'USD', 'AMD');
  }, [cart]);

  const { deliveryPrice, loadingDeliveryPrice } = useDeliveryPrice(
    shippingMethod,
    shippingCity,
    shippingCountry,
    orderSubtotalAmd,
  );

  const { submitOrder } = useOrderSubmission({
    cart,
    isLoggedIn,
    deliveryPrice,
    setError: setCheckoutError,
  });

  const applyPromoCode = async () => {
    const normalizedCode = promoCode.trim().toUpperCase();
    if (!normalizedCode) {
      setPromoError(t('checkout.errors.promoCodeRequired'));
      setAppliedPromo(null);
      return;
    }

    if (orderSubtotalAmd <= 0) {
      setPromoError(t('checkout.errors.cartEmpty'));
      setAppliedPromo(null);
      return;
    }

    setPromoApplying(true);
    setPromoError(null);

    try {
      const response = await apiClient.post<{
        code: string;
        discountAmount: number;
      }>('/api/v1/promo-codes/preview', {
        code: normalizedCode,
        subtotal: orderSubtotalAmd,
      });

      setAppliedPromo({
        code: response.code,
        discountAmountAmd: response.discountAmount,
      });
      setPromoCode(response.code);
    } catch (err: unknown) {
      const promoApplyError = err as { message?: string };
      setAppliedPromo(null);
      setPromoError(promoApplyError.message || t('checkout.errors.invalidPromoCode'));
    } finally {
      setPromoApplying(false);
    }
  };

  const onPromoCodeChange = (value: string) => {
    setPromoCode(value);
    setPromoError(null);
    if (appliedPromo && value.trim().toUpperCase() !== appliedPromo.code) {
      setAppliedPromo(null);
    }
  };

  const { orderSummary } = useOrderSummary({
    cart,
    shippingMethod,
    deliveryPrice,
    currency,
    appliedDiscountAmd: appliedPromo?.discountAmountAmd ?? 0,
  });

  useEffect(() => {
    if (shippingMethod === 'delivery') {
      setValue('pickupStoreId', '');
      clearErrors('pickupStoreId');
    }
  }, [shippingMethod, setValue, clearErrors]);

  useEffect(() => {
    if (!deliveryOptions?.countries.length) {
      return;
    }

    const currentCountry = getValues('shippingCountry');
    if (!currentCountry) {
      const defaultCountry = deliveryOptions.countries[0];
      setValue('shippingCountry', defaultCountry.name);
    }
  }, [deliveryOptions, getValues, setValue]);

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

    const deliveryErrors = validateDeliveryExtraFields(parsed.data, deliveryOptions, {
      countryRequired: t('checkout.errors.countryRequired'),
      zoneRequired: t('checkout.errors.zoneRequired'),
      recipientRequired: t('checkout.errors.recipientRequired'),
      postalIndexRequired: t('checkout.errors.postalIndexRequired'),
      additionalNotesRequired: t('checkout.errors.additionalNotesRequired'),
    });

    if (deliveryErrors.length > 0) {
      const validationErrors = deliveryErrors.reduce<FieldErrors<CheckoutFormData>>((acc, entry) => {
        acc[entry.field] = { type: 'manual', message: entry.message };
        return acc;
      }, {});
      applyCheckoutFieldErrors(validationErrors);
      scrollToFirstCheckoutError(validationErrors, { immediate: true });
      return;
    }

    void submitOrder(parsed.data, {
      promoCode: appliedPromo?.code ?? null,
    });
  };

  const onSubmit = (data: CheckoutFormData) => {
    submitOrder(data, {
      promoCode: appliedPromo?.code ?? null,
    });
  };

  const removeCartItem = useCallback(
    async (itemId: string) => {
      if (!cart) {
        return;
      }

      setRemovingItemIds((previous) => new Set(previous).add(itemId));

      try {
        await handleRemoveItem(
          itemId,
          cart,
          isLoggedIn,
          setCart,
          fetchCart,
          user?.id,
          t,
        );
      } finally {
        setRemovingItemIds((previous) => {
          const next = new Set(previous);
          next.delete(itemId);
          return next;
        });
      }
    },
    [cart, fetchCart, isLoggedIn, setCart, t, user?.id],
  );

  return {
    // State
    cart,
    loading,
    error,
    setError: setCheckoutError,
    promoCode,
    onPromoCodeChange,
    promoError,
    promoApplying,
    appliedPromoCode: appliedPromo?.code ?? null,
    applyPromoCode,
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
    pickupStoreId,
    shippingCountry,
    shippingCity,
    pickupStores,
    pickupStoresLoading,
    deliveryOptions,
    deliveryOptionsLoading,
    paymentMethods,
    orderSummary,
    // Actions
    onCheckoutSubmit,
    onSubmit,
    removeCartItem,
    removingItemIds,
    // Auth
    isLoggedIn,
  };
}
