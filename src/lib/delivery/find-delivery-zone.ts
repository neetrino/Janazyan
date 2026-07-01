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
      normalize(entry.name) === normalizedCountry ||
      normalize(entry.id) === normalizedCountry,
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
      normalize(zone.name) === normalized,
  );
}
