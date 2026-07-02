import { useMemo } from 'react';
import { convertPrice } from '../../../lib/currency';
import type { Cart } from '../types';

interface UseOrderSummaryProps {
  cart: Cart | null;
  shippingMethod: 'pickup' | 'delivery';
  deliveryPrice: number | null;
  currency: 'USD' | 'AMD' | 'EUR' | 'RUB' | 'GEL';
  appliedDiscountAmd?: number;
}

export function useOrderSummary({
  cart,
  shippingMethod,
  deliveryPrice,
  currency,
  appliedDiscountAmd = 0,
}: UseOrderSummaryProps) {
  const orderSummary = useMemo(() => {
    if (!cart || cart.items.length === 0) {
      return {
        subtotalAMD: 0,
        shippingAMD: 0,
        discountAMD: 0,
        totalAMD: 0,
        subtotalDisplay: 0,
        shippingDisplay: 0,
        discountDisplay: 0,
        totalDisplay: 0,
      };
    }

    const subtotalAMD = convertPrice(cart.totals.subtotal, 'USD', 'AMD');
    const shippingAMD = shippingMethod === 'delivery' && deliveryPrice !== null ? deliveryPrice : 0;
    const discountAMD = Math.max(0, Math.min(appliedDiscountAmd, subtotalAMD));
    const totalAMD = subtotalAMD + shippingAMD - discountAMD;
    
    const subtotalDisplay = currency === 'AMD' ? subtotalAMD : convertPrice(subtotalAMD, 'AMD', currency);
    const shippingDisplay = currency === 'AMD' ? shippingAMD : convertPrice(shippingAMD, 'AMD', currency);
    const discountDisplay = currency === 'AMD' ? discountAMD : convertPrice(discountAMD, 'AMD', currency);
    const totalDisplay = currency === 'AMD' ? totalAMD : convertPrice(totalAMD, 'AMD', currency);
    
    return {
      subtotalAMD,
      shippingAMD,
      discountAMD,
      totalAMD,
      subtotalDisplay,
      shippingDisplay,
      discountDisplay,
      totalDisplay,
    };
  }, [appliedDiscountAmd, cart, shippingMethod, deliveryPrice, currency]);

  return { orderSummary };
}




