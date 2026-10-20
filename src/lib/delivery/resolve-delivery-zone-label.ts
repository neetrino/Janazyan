import { deliveryLabelMatches, deliveryNameForLocale } from './delivery-names';
import type { DeliveryOptionsPublic } from './delivery-settings.types';

export function resolveDeliveryZoneLabel(
  options: DeliveryOptionsPublic | null,
  countryName: string | undefined,
  zoneSlugOrName: string | undefined,
  locale = 'hy',
): string | undefined {
  if (!options || !countryName?.trim() || !zoneSlugOrName?.trim()) {
    return undefined;
  }

  const country = options.countries.find((entry) =>
    deliveryLabelMatches(countryName, entry.name, entry.names),
  );
  const zone = country?.zones.find(
    (entry) =>
      entry.slug === zoneSlugOrName ||
      deliveryLabelMatches(zoneSlugOrName, entry.name, entry.names),
  );

  if (!zone) {
    return undefined;
  }

  return deliveryNameForLocale(zone.names, zone.name, locale);
}
