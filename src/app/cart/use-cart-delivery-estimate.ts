import { useState, useEffect } from 'react';
import { CART_DELIVERY_ESTIMATE_CITY } from './constants';
import { fetchDeliveryPriceCached } from '@/lib/delivery/fetch-delivery-price-cached';

const DELIVERY_ESTIMATE_CACHE_KEY = 'shop_cart_delivery_estimate_amd_v1';

interface UseCartDeliveryEstimateResult {
  deliveryPriceAMD: number | null;
  loadingDelivery: boolean;
}

function readCachedDeliveryPrice(): number | null {
  if (typeof window === 'undefined') {
    return null;
  }
  try {
    const raw = sessionStorage.getItem(DELIVERY_ESTIMATE_CACHE_KEY);
    if (raw === null) {
      return null;
    }
    const price = Number(raw);
    return Number.isFinite(price) ? price : null;
  } catch {
    return null;
  }
}

/**
 * Fetches a single delivery price estimate for the cart summary (no address yet).
 */
export function useCartDeliveryEstimate(): UseCartDeliveryEstimateResult {
  const [deliveryPriceAMD, setDeliveryPriceAMD] = useState<number | null>(
    () => readCachedDeliveryPrice(),
  );
  const [loadingDelivery, setLoadingDelivery] = useState(
    () => readCachedDeliveryPrice() === null,
  );

  useEffect(() => {
    let cancelled = false;
    const initialCached = readCachedDeliveryPrice();

    async function load() {
      if (initialCached === null) {
        setLoadingDelivery(true);
      }
      try {
        const price = await fetchDeliveryPriceCached({
          city: CART_DELIVERY_ESTIMATE_CITY,
          country: 'Armenia',
        });
        if (!cancelled) {
          setDeliveryPriceAMD(price);
          sessionStorage.setItem(DELIVERY_ESTIMATE_CACHE_KEY, String(price));
        }
      } catch {
        if (!cancelled) {
          setDeliveryPriceAMD(initialCached ?? 0);
        }
      } finally {
        if (!cancelled) {
          setLoadingDelivery(false);
        }
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  return { deliveryPriceAMD, loadingDelivery };
}
