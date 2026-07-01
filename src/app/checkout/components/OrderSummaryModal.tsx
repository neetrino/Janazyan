'use client';

import { CheckoutOrderSummaryBreakdown } from './CheckoutOrderSummaryBreakdown';
import type { DeliveryOptionsPublic } from '@/lib/delivery/delivery-settings.types';
import { Cart } from '../types';

interface OrderSummaryModalProps {
  cart: Cart | null;
  orderSummary: {
    subtotalDisplay: number;
    taxDisplay: number;
    shippingDisplay: number;
    discountDisplay: number;
    totalDisplay: number;
  };
  currency: 'USD' | 'AMD' | 'EUR' | 'RUB' | 'GEL';
  shippingMethod: 'pickup' | 'delivery';
  shippingCountry?: string;
  shippingCity?: string;
  deliveryOptions: DeliveryOptionsPublic | null;
  loadingDeliveryPrice: boolean;
  deliveryPrice: number | null;
}

export function OrderSummaryModal({
  cart,
  orderSummary,
  currency,
  shippingMethod,
  shippingCountry,
  shippingCity,
  deliveryOptions,
  loadingDeliveryPrice,
  deliveryPrice,
}: OrderSummaryModalProps) {
  if (!cart) {
    return null;
  }

  return (
    <div className="bg-gray-50 rounded-lg p-4">
      <CheckoutOrderSummaryBreakdown
        cart={cart}
        orderSummary={orderSummary}
        currency={currency}
        shippingMethod={shippingMethod}
        shippingCountry={shippingCountry}
        shippingCity={shippingCity}
        deliveryOptions={deliveryOptions}
        loadingDeliveryPrice={loadingDeliveryPrice}
        deliveryPrice={deliveryPrice}
        compact
      />
    </div>
  );
}
