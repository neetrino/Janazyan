import type {
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
  cityName: string;
  pricing: DeliveryPricing;
};

export type DeliveryLocationFormData = {
  countryName: string;
  cityName: string;
  pricingType: 'tiered' | 'fixed';
  fixedPrice: number;
  priceBelowThreshold: number;
  thresholdAmount: number;
};

export function createEmptyDeliveryLocationForm(): DeliveryLocationFormData {
  return {
    countryName: '',
    cityName: '',
    pricingType: 'tiered',
    fixedPrice: 1000,
    priceBelowThreshold: 1000,
    thresholdAmount: 15000,
  };
}

export function flattenDeliveryLocations(settings: DeliverySettings): DeliveryLocationRow[] {
  return settings.countries.flatMap((country) =>
    country.zones.map((zone) => ({
      countryId: country.id,
      zoneId: zone.id,
      countryName: country.name,
      cityName: zone.name,
      pricing: zone.pricing,
    })),
  );
}

export function formDataFromLocation(row: DeliveryLocationRow): DeliveryLocationFormData {
  if (row.pricing.type === 'fixed') {
    return {
      countryName: row.countryName,
      cityName: row.cityName,
      pricingType: 'fixed',
      fixedPrice: row.pricing.price,
      priceBelowThreshold: 1000,
      thresholdAmount: 15000,
    };
  }

  return {
    countryName: row.countryName,
    cityName: row.cityName,
    pricingType: 'tiered',
    fixedPrice: 1000,
    priceBelowThreshold: row.pricing.priceBelowThreshold,
    thresholdAmount: row.pricing.thresholdAmount,
  };
}

function slugify(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'zone';
}

function createId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
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

function findZone(
  settings: DeliverySettings,
  target: DeliveryLocationKey,
): DeliveryZone | undefined {
  const country = settings.countries.find((entry) => entry.id === target.countryId);
  return country?.zones.find((zone) => zone.id === target.zoneId);
}

export function upsertDeliveryLocation(
  settings: DeliverySettings,
  form: DeliveryLocationFormData,
  editing?: DeliveryLocationKey,
): DeliverySettings {
  const countryName = form.countryName.trim();
  const cityName = form.cityName.trim();
  const pricing = buildPricing(form);
  const existingZone = editing ? findZone(settings, editing) : undefined;
  const zoneId = editing?.zoneId ?? createId('zone');

  const nextZone: DeliveryZone = {
    id: zoneId,
    name: cityName,
    slug: slugify(cityName),
    pricing,
    carrier: existingZone?.carrier,
    carrierNote: existingZone?.carrierNote,
    extraFields: existingZone?.extraFields ?? [],
  };

  let countries = settings.countries.map((country) => ({
    ...country,
    zones: country.zones.filter(
      (zone) => !(editing && country.id === editing.countryId && zone.id === editing.zoneId),
    ),
  }));

  const targetCountry = countries.find(
    (country) => country.name.toLowerCase() === countryName.toLowerCase(),
  );

  if (targetCountry) {
    countries = countries.map((country) =>
      country.id === targetCountry.id
        ? { ...country, name: countryName, zones: [...country.zones, nextZone] }
        : country,
    );
  } else {
    countries = [
      ...countries,
      {
        id: createId('country'),
        name: countryName,
        zones: [nextZone],
      },
    ];
  }

  return removeEmptyCountries({ ...settings, countries });
}

export function deleteDeliveryLocation(
  settings: DeliverySettings,
  target: DeliveryLocationKey,
): DeliverySettings {
  const countries = settings.countries
    .map((country) =>
      country.id === target.countryId
        ? { ...country, zones: country.zones.filter((zone) => zone.id !== target.zoneId) }
        : country,
    );

  return removeEmptyCountries({ ...settings, countries });
}

export function formatDeliveryPricingSummary(
  pricing: DeliveryPricing,
  labels: {
    fixed: string;
    tiered: string;
  },
): string {
  if (pricing.type === 'fixed') {
    return labels.fixed.replace('{price}', String(pricing.price));
  }

  return labels.tiered
    .replace('{price}', String(pricing.priceBelowThreshold))
    .replace('{threshold}', String(pricing.thresholdAmount));
}
