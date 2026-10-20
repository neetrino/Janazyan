import { filledLocalizedTexts, mergeLocalizedTexts, type LocalizedText } from '@/lib/i18n/localized-text';
import { canonicalDeliveryName } from '@/lib/delivery/delivery-names';
import { toSlug } from '@/lib/utils/slug';
import type {
  DeliveryNameTranslation,
  DeliveryPricing,
  DeliverySettings,
  DeliveryZone,
} from '@/lib/delivery/delivery-settings.types';

export type DeliveryLocationKey = {
  countryId: string;
  zoneId: string;
};

export type DeliveryLocationRow = DeliveryLocationKey & {
  countryName: string;
  countryNames: DeliveryNameTranslation[];
  cityName: string;
  cityNames: DeliveryNameTranslation[];
  citySlug: string;
  pricing: DeliveryPricing;
};

export type DeliveryLocationFormData = {
  countryNames: LocalizedText[];
  cityNames: LocalizedText[];
  citySlug: string;
  pricingType: 'tiered' | 'fixed';
  fixedPrice: number;
  priceBelowThreshold: number;
  thresholdAmount: number;
};

const EMPTY_TIER_PRICE = 1000;
const EMPTY_TIER_THRESHOLD = 15000;

export function createEmptyDeliveryLocationForm(): DeliveryLocationFormData {
  return {
    countryNames: mergeLocalizedTexts([]),
    cityNames: mergeLocalizedTexts([]),
    citySlug: '',
    pricingType: 'fixed',
    fixedPrice: EMPTY_TIER_PRICE,
    priceBelowThreshold: EMPTY_TIER_PRICE,
    thresholdAmount: EMPTY_TIER_THRESHOLD,
  };
}

export function flattenDeliveryLocations(settings: DeliverySettings): DeliveryLocationRow[] {
  return settings.countries.flatMap((country) =>
    country.zones.map((zone) => ({
      countryId: country.id,
      zoneId: zone.id,
      countryName: country.name,
      countryNames: country.names,
      cityName: zone.name,
      cityNames: zone.names,
      citySlug: zone.slug,
      pricing: zone.pricing,
    })),
  );
}

function namesFromRows(rows: DeliveryNameTranslation[]): LocalizedText[] {
  return mergeLocalizedTexts(rows.map((row) => ({ locale: row.locale, text: row.text })));
}

export function formDataFromLocation(row: DeliveryLocationRow): DeliveryLocationFormData {
  const shared = {
    countryNames: namesFromRows(row.countryNames),
    cityNames: namesFromRows(row.cityNames),
    citySlug: row.citySlug,
  };

  if (row.pricing.type === 'fixed') {
    return {
      ...shared,
      pricingType: 'fixed',
      fixedPrice: row.pricing.price,
      priceBelowThreshold: EMPTY_TIER_PRICE,
      thresholdAmount: EMPTY_TIER_THRESHOLD,
    };
  }

  return {
    ...shared,
    pricingType: 'tiered',
    fixedPrice: EMPTY_TIER_PRICE,
    priceBelowThreshold: row.pricing.priceBelowThreshold,
    thresholdAmount: row.pricing.thresholdAmount,
  };
}

function createId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function toStoredNames(texts: LocalizedText[]): DeliveryNameTranslation[] {
  return filledLocalizedTexts(texts).map((row) => ({ locale: row.locale, text: row.text }));
}

function buildPricing(form: DeliveryLocationFormData): DeliveryPricing {
  if (form.pricingType === 'fixed') {
    return { type: 'fixed', price: Math.max(0, form.fixedPrice) };
  }

  return {
    type: 'tiered',
    priceBelowThreshold: Math.max(0, form.priceBelowThreshold),
    thresholdAmount: Math.max(0, form.thresholdAmount),
  };
}

function removeEmptyCountries(settings: DeliverySettings): DeliverySettings {
  return {
    ...settings,
    countries: settings.countries.filter((country) => country.zones.length > 0),
  };
}

function findZone(settings: DeliverySettings, target: DeliveryLocationKey): DeliveryZone | undefined {
  const country = settings.countries.find((entry) => entry.id === target.countryId);
  return country?.zones.find((zone) => zone.id === target.zoneId);
}

function countryMatches(countryName: string, countryNames: DeliveryNameTranslation[], formNames: DeliveryNameTranslation[]): boolean {
  const saved = [countryName, ...countryNames.map((row) => row.text)].map((value) => value.trim().toLowerCase());
  return formNames.some((row) => saved.includes(row.text.trim().toLowerCase()));
}

function buildZone(
  form: DeliveryLocationFormData,
  zoneId: string,
  existingZone: DeliveryZone | undefined,
): DeliveryZone {
  const cityNames = toStoredNames(form.cityNames);
  const cityName = canonicalDeliveryName(cityNames);

  return {
    id: zoneId,
    name: cityName,
    names: cityNames,
    slug: form.citySlug.trim() || toSlug(cityName),
    pricing: buildPricing(form),
    carrier: existingZone?.carrier,
    carrierNote: existingZone?.carrierNote,
    extraFields: existingZone?.extraFields ?? [],
  };
}

export function upsertDeliveryLocation(
  settings: DeliverySettings,
  form: DeliveryLocationFormData,
  editing?: DeliveryLocationKey,
): DeliverySettings {
  const countryNames = toStoredNames(form.countryNames);
  const countryName = canonicalDeliveryName(countryNames);
  const existingZone = editing ? findZone(settings, editing) : undefined;
  const nextZone = buildZone(form, editing?.zoneId ?? createId('zone'), existingZone);

  let countries = settings.countries.map((country) => ({
    ...country,
    zones: country.zones.filter(
      (zone) => !(editing && country.id === editing.countryId && zone.id === editing.zoneId),
    ),
  }));

  const targetCountry = countries.find((country) => countryMatches(country.name, country.names, countryNames));

  if (targetCountry) {
    countries = countries.map((country) =>
      country.id === targetCountry.id
        ? { ...country, name: countryName, names: countryNames, zones: [...country.zones, nextZone] }
        : country,
    );
  } else {
    countries = [
      ...countries,
      { id: createId('country'), name: countryName, names: countryNames, zones: [nextZone] },
    ];
  }

  return removeEmptyCountries({ ...settings, countries });
}

export function deleteDeliveryLocation(
  settings: DeliverySettings,
  target: DeliveryLocationKey,
): DeliverySettings {
  const countries = settings.countries.map((country) =>
    country.id === target.countryId
      ? { ...country, zones: country.zones.filter((zone) => zone.id !== target.zoneId) }
      : country,
  );

  return removeEmptyCountries({ ...settings, countries });
}

export function formatDeliveryPricingSummary(
  pricing: DeliveryPricing,
  labels: { fixed: string; tiered: string },
): string {
  if (pricing.type === 'fixed') {
    return labels.fixed.replace('{price}', String(pricing.price));
  }

  return labels.tiered
    .replace('{price}', String(pricing.priceBelowThreshold))
    .replace('{threshold}', String(pricing.thresholdAmount));
}

export function deliveryLocationHasNames(form: DeliveryLocationFormData): boolean {
  return filledLocalizedTexts(form.countryNames).length > 0 && filledLocalizedTexts(form.cityNames).length > 0;
}
