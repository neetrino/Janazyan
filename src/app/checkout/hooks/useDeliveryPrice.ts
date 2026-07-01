import { useState, useEffect } from 'react';
import { fetchDeliveryPriceCached } from '@/lib/delivery/fetch-delivery-price-cached';

export function useDeliveryPrice(
  shippingMethod: 'pickup' | 'delivery',
  shippingZone: string | undefined,
  shippingCountry: string | undefined,
  orderSubtotalAmd: number,
) {
  const [deliveryPrice, setDeliveryPrice] = useState<number | null>(null);
  const [loadingDeliveryPrice, setLoadingDeliveryPrice] = useState(false);

  useEffect(() => {
    const fetchDeliveryPrice = async () => {
      if (
        shippingMethod === 'delivery' &&
        shippingZone &&
        shippingZone.trim().length > 0 &&
        shippingCountry &&
        shippingCountry.trim().length > 0
      ) {
        setLoadingDeliveryPrice(true);
        try {
          const price = await fetchDeliveryPriceCached({
            zone: shippingZone.trim(),
            country: shippingCountry.trim(),
            subtotalAmd: orderSubtotalAmd,
          });
          setDeliveryPrice(price);
        } catch {
          setDeliveryPrice(0);
        } finally {
          setLoadingDeliveryPrice(false);
        }
      } else {
        setDeliveryPrice(null);
      }
    };

    const timeoutId = setTimeout(() => {
      void fetchDeliveryPrice();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [shippingZone, shippingCountry, shippingMethod, orderSubtotalAmd]);

  return { deliveryPrice, loadingDeliveryPrice };
}
