import { deliveryLabelMatches } from './delivery-names';
import type { DeliveryCountry, DeliverySettings, DeliveryZone } from './delivery-settings.types';

function normalize(value: string): string {
  return value.trim().toLowerCase();
}

export function findDeliveryCountry(
  settings: DeliverySettings,
  country: string,
): DeliveryCountry | undefined {
  const normalizedCountry = normalize(country);

  return settings.countries.find(
    (entry) =>
      normalize(entry.id) === normalizedCountry ||
      deliveryLabelMatches(country, entry.name, entry.names),
  );
}

export function findDeliveryZone(
  country: DeliveryCountry,
  zoneSlugOrName: string,
): DeliveryZone | undefined {
  const normalized = normalize(zoneSlugOrName);

  return country.zones.find(
    (zone) =>
      normalize(zone.slug) === normalized ||
      deliveryLabelMatches(zoneSlugOrName, zone.name, zone.names),
  );
}
