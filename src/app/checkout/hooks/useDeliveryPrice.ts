import { useState, useEffect } from 'react';
import { fetchDeliveryPriceCached } from '@/lib/delivery/fetch-delivery-price-cached';

export function useDeliveryPrice(
  shippingMethod: 'pickup' | 'delivery',
  shippingCity: string | undefined
) {
  const [deliveryPrice, setDeliveryPrice] = useState<number | null>(null);
  const [loadingDeliveryPrice, setLoadingDeliveryPrice] = useState(false);

  useEffect(() => {
    const fetchDeliveryPrice = async () => {
      if (shippingMethod === 'delivery' && shippingCity && shippingCity.trim().length > 0) {
        setLoadingDeliveryPrice(true);
        try {
          const price = await fetchDeliveryPriceCached({
            city: shippingCity.trim(),
            country: 'Armenia',
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
      fetchDeliveryPrice();
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [shippingCity, shippingMethod]);

  return { deliveryPrice, loadingDeliveryPrice };
}




