import { apiClient } from '@/lib/api-client';
import type { DeliveryOptionsPublic } from '@/lib/delivery/delivery-settings.types';

let deliveryOptionsInflight: Promise<DeliveryOptionsPublic> | null = null;

export async function fetchDeliveryOptionsCached(): Promise<DeliveryOptionsPublic> {
  if (deliveryOptionsInflight) {
    return deliveryOptionsInflight;
  }

  deliveryOptionsInflight = apiClient
    .get<DeliveryOptionsPublic>('/api/v1/delivery/options')
    .finally(() => {
      deliveryOptionsInflight = null;
    });

  return deliveryOptionsInflight;
}
