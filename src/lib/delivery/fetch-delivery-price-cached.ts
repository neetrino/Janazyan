import { apiClient } from '@/lib/api-client';

const DELIVERY_PRICE_CACHE_PREFIX = 'delivery-price:';

let deliveryPriceInflight: Promise<number> | null = null;
let deliveryPriceInflightKey: string | null = null;

type DeliveryPriceParams = {
  city: string;
  country: string;
};

function buildDeliveryPriceKey(params: DeliveryPriceParams): string {
  return `${DELIVERY_PRICE_CACHE_PREFIX}${params.city}:${params.country}`;
}

/**
 * Fetches delivery price with in-flight dedup (Strict Mode / duplicate mounts).
 */
export async function fetchDeliveryPriceCached(params: DeliveryPriceParams): Promise<number> {
  const key = buildDeliveryPriceKey(params);

  if (deliveryPriceInflight && deliveryPriceInflightKey === key) {
    return deliveryPriceInflight;
  }

  deliveryPriceInflightKey = key;
  deliveryPriceInflight = apiClient
    .get<{ price: number }>('/api/v1/delivery/price', { params })
    .then((response) => response.price)
    .finally(() => {
      deliveryPriceInflight = null;
      deliveryPriceInflightKey = null;
    });

  return deliveryPriceInflight;
}
