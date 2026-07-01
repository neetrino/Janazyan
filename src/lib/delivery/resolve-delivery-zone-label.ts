import type { DeliveryOptionsPublic } from './delivery-settings.types';

export function resolveDeliveryZoneLabel(
  options: DeliveryOptionsPublic | null,
  countryName: string | undefined,
  zoneSlugOrName: string | undefined,
): string | undefined {
  if (!options || !countryName?.trim() || !zoneSlugOrName?.trim()) {
    return undefined;
  }

  const country = options.countries.find((entry) => entry.name === countryName);
  const zone = country?.zones.find(
    (entry) => entry.slug === zoneSlugOrName || entry.name === zoneSlugOrName,
  );

  return zone?.name;
}
