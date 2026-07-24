import { useRouter } from 'next/navigation';
import { useRef, useState } from 'react';
import { apiClient } from '../../../lib/api-client';
import { isInsufficientStockProblem } from '../../../lib/api-client/error-handler';
import { ApiError } from '../../../lib/api-client/types';
import { useTranslation } from '../../../lib/i18n-client';
import { fetchLoggedInCart } from '../../../app/cart/cart-fetcher';
import { isOptimisticUserCartId } from '../../../lib/cart/cart-item-id';
import { markOrderCartClearOnSuccess } from '../../../lib/cart/order-success-cart-clear';
import { clearGuestCart } from '../checkoutUtils';
import { saveGuestOrderAccess } from '../utils/guest-order-access';
import type { CheckoutFormData, Cart, CartItem } from '../types';

function resolveCheckoutSubmitError(err: unknown, t: (key: string) => string): string {
  if (err instanceof ApiError && isInsufficientStockProblem(err.data)) {
    return t('checkout.errors.insufficientStock');
  }
  if (err instanceof Error && err.message.trim()) {
    return err.message;
  }
  return t('checkout.errors.failedToCreateOrder');
}

interface UseOrderSubmissionProps {
  cart: Cart | null;
  isLoggedIn: boolean;
  deliveryPrice: number | null;
  setError: (error: string | null) => void;
}

type SubmitOrderOptions = {
  promoCode?: string | null;
};

export function useOrderSubmission({
  cart,
  isLoggedIn,
  deliveryPrice,
  setError,
}: UseOrderSubmissionProps) {
  const router = useRouter();
  const { t } = useTranslation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isSubmittingRef = useRef(false);

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

      if (isLoggedIn && isOptimisticUserCartId(cart.id)) {
        const freshCart = await fetchLoggedInCart();
        if (!freshCart || freshCart.items.length === 0) {
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

      router.push(`/orders/${response.order.number}`);
    } catch (err: unknown) {
      setError(resolveCheckoutSubmitError(err, t));
      isSubmittingRef.current = false;
      setIsSubmitting(false);
    }
  };

  return { submitOrder, isSubmitting };
}
