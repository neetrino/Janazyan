import { useRouter } from 'next/navigation';
import { useRef, useState } from 'react';
import { apiClient } from '../../../lib/api-client';
import { isInsufficientStockProblem } from '../../../lib/api-client/error-handler';
import { ApiError } from '../../../lib/api-client/types';
import { useTranslation } from '../../../lib/i18n-client';
import { fetchCart, fetchLoggedInCart } from '../../../app/cart/cart-fetcher';
import { dispatchCartUpdated } from '../../../lib/cart/cart-events';
import { markOrderCartClearOnSuccess } from '../../../lib/cart/order-success-cart-clear';
import { resetBodyScrollLock } from '../../../lib/dom/body-scroll-lock';
import { clearGuestCart } from '../checkoutUtils';
import { saveGuestOrderAccess } from '../utils/guest-order-access';
import type { CheckoutFormData, Cart, CartItem } from '../types';

function resolveCheckoutSubmitError(err: unknown, t: (key: string) => string): string {
  if (err instanceof ApiError && isInsufficientStockProblem(err.data)) {
    return t('checkout.errors.insufficientStock');
  }
  if (err instanceof ApiError && err.data && typeof err.data === 'object') {
    const title = 'title' in err.data ? String(err.data.title) : '';
    if (title === 'Cart is empty') {
      return t('checkout.errors.cartEmpty');
    }
  }
  if (err instanceof Error && err.message.trim()) {
    return err.message;
  }
  return t('checkout.errors.failedToCreateOrder');
}

interface UseOrderSubmissionProps {
  cart: Cart | null;
  isLoggedIn: boolean;
  userId: string | null | undefined;
  deliveryPrice: number | null;
  setError: (error: string | null) => void;
  setCart: (cart: Cart | null) => void;
}

type SubmitOrderOptions = {
  promoCode?: string | null;
};

export function useOrderSubmission({
  cart,
  isLoggedIn,
  userId,
  deliveryPrice,
  setError,
  setCart,
}: UseOrderSubmissionProps) {
  const router = useRouter();
  const { t } = useTranslation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isSubmittingRef = useRef(false);

  const syncEmptyCheckoutCart = async () => {
    const freshCart = await fetchCart(isLoggedIn, t, userId, {
      forceFresh: true,
    });
    setCart(freshCart);
    dispatchCartUpdated({
      itemsCount: freshCart?.itemsCount ?? 0,
      fromSync: true,
      skipRevalidate: true,
    });
  };

  const submitOrder = async (data: CheckoutFormData, options?: SubmitOrderOptions) => {
    if (isSubmittingRef.current) {
      return;
    }

    isSubmittingRef.current = true;
    setIsSubmitting(true);
    setError(null);

    try {
      if (!cart) {
        throw new Error(t('checkout.errors.cartEmpty'));
      }

      let checkoutCart = cart;

      if (isLoggedIn) {
        const freshCart = await fetchLoggedInCart(true);
        if (!freshCart || freshCart.items.length === 0) {
          await syncEmptyCheckoutCart();
          throw new Error(t('checkout.errors.cartEmpty'));
        }
        checkoutCart = freshCart;
      }

      let cartId = checkoutCart.id;
      let items = undefined;

      if (!isLoggedIn && checkoutCart.id === 'guest-cart') {
        items = checkoutCart.items.map((item: CartItem) => ({
          productId: item.variant.product.id,
          variantId: item.variant.id,
          quantity: item.quantity,
        }));
        cartId = 'guest-cart';
      }

      const shippingAddress = data.shippingMethod === 'delivery' &&
        data.shippingAddress &&
        data.shippingCity &&
        data.shippingCountry
        ? {
            firstName: data.firstName,
            lastName: data.lastName,
            addressLine1: data.shippingAddress,
            city: data.shippingCity,
            countryCode: data.shippingCountry,
            phone: data.phone,
            ...(data.shippingRecipientName?.trim()
              ? { recipientFullName: data.shippingRecipientName.trim() }
              : {}),
            ...(data.shippingPostalIndex?.trim()
              ? { postalCode: data.shippingPostalIndex.trim() }
              : {}),
            ...(data.shippingAdditionalNotes?.trim()
              ? { additionalNotes: data.shippingAdditionalNotes.trim() }
              : {}),
          }
        : undefined;

      const shippingAmount = data.shippingMethod === 'delivery' && deliveryPrice !== null ? deliveryPrice : 0;

      const response = await apiClient.post<{
        order: {
          id: string;
          number: string;
          status: string;
          paymentStatus: string;
          total: number;
          currency: string;
        };
        payment: {
          provider: string;
          paymentUrl: string | null;
          expiresAt: string | null;
        };
        nextAction: string;
      }>('/api/v1/orders/checkout', {
        cartId: cartId,
        ...(items ? { items } : {}),
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        shippingMethod: data.shippingMethod,
        ...(data.shippingMethod === 'pickup' && data.pickupStoreId?.trim()
          ? { pickupStoreId: data.pickupStoreId.trim() }
          : {}),
        ...(shippingAddress ? { shippingAddress } : {}),
        shippingAmount: shippingAmount,
        paymentMethod: data.paymentMethod,
        ...(options?.promoCode ? { promoCode: options.promoCode } : {}),
      });

      markOrderCartClearOnSuccess(response.order.number);

      if (response.payment?.paymentUrl) {
        if (!isLoggedIn) {
          saveGuestOrderAccess(response.order.number, data.email, data.phone);
        }
        window.location.href = response.payment.paymentUrl;
        return;
      }

      if (!isLoggedIn) {
        clearGuestCart();
        saveGuestOrderAccess(response.order.number, data.email, data.phone);
      }

      resetBodyScrollLock();
      router.push(`/orders/${response.order.number}`);
    } catch (err: unknown) {
      if (
        err instanceof ApiError &&
        err.data &&
        typeof err.data === 'object' &&
        'title' in err.data &&
        err.data.title === 'Cart is empty'
      ) {
        await syncEmptyCheckoutCart();
      }
      setError(resolveCheckoutSubmitError(err, t));
      isSubmittingRef.current = false;
      setIsSubmitting(false);
    }
  };

  return { submitOrder, isSubmitting };
}
