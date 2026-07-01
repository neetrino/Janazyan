import { apiClient } from '@/lib/api-client';

const DELIVERY_PRICE_CACHE_PREFIX = 'delivery-price:';

let deliveryPriceInflight: Promise<number> | null = null;
let deliveryPriceInflightKey: string | null = null;

type DeliveryPriceParams = {
  zone: string;
  country: string;
  subtotalAmd: number;
};

function buildDeliveryPriceKey(params: DeliveryPriceParams): string {
  return `${DELIVERY_PRICE_CACHE_PREFIX}${params.zone}:${params.country}:${params.subtotalAmd}`;
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
    .get<{ price: number }>('/api/v1/delivery/price', {
      params: {
        zone: params.zone,
        country: params.country,
        subtotal: String(params.subtotalAmd),
      },
    })
    .then((response) => response.price)
    .finally(() => {
      deliveryPriceInflight = null;
      deliveryPriceInflightKey = null;
    });

  return deliveryPriceInflight;
}
