import type { DeliveryPricing, DeliveryZone } from './delivery-settings.types';

export function calculatePriceFromRule(
  pricing: DeliveryPricing,
  orderSubtotalAmd: number,
): number {
  if (pricing.type === 'fixed') {
    return Math.max(0, pricing.price);
  }

  if (orderSubtotalAmd >= pricing.thresholdAmount) {
    return 0;
  }

  return Math.max(0, pricing.priceBelowThreshold);
}

export function calculateZoneDeliveryPrice(
  zone: DeliveryZone,
  orderSubtotalAmd: number,
): number {
  return calculatePriceFromRule(zone.pricing, orderSubtotalAmd);
}
