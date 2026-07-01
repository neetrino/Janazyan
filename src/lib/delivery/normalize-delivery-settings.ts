import { DELIVERY_EXTRA_FIELD_KEYS } from './delivery-settings.constants';
import { DEFAULT_DELIVERY_SETTINGS } from './delivery-settings.defaults';
import type {
  DeliveryCountry,
  DeliveryExtraField,
  DeliveryExtraFieldKey,
  DeliveryPricing,
  DeliverySettings,
  DeliveryZone,
} from './delivery-settings.types';

type LegacyLocation = {
  id?: string;
  country: string;
  city: string;
  price: number;
};

function isExtraFieldKey(value: string): value is DeliveryExtraFieldKey {
  return DELIVERY_EXTRA_FIELD_KEYS.includes(value as DeliveryExtraFieldKey);
}

function createId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function slugify(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'zone';
}

function normalizePricing(pricing: DeliveryPricing): DeliveryPricing {
  if (pricing.type === 'fixed') {
    return { type: 'fixed', price: Math.max(0, Number(pricing.price) || 0) };
  }

  return {
    type: 'tiered',
    priceBelowThreshold: Math.max(0, Number(pricing.priceBelowThreshold) || 0),
    thresholdAmount: Math.max(0, Number(pricing.thresholdAmount) || 0),
  };
}

function normalizeExtraField(field: DeliveryExtraField): DeliveryExtraField | null {
  if (!isExtraFieldKey(field.fieldKey)) {
    return null;
  }

  return {
    id: field.id || createId('ef'),
    fieldKey: field.fieldKey,
    required: Boolean(field.required),
  };
}

function normalizeZone(zone: DeliveryZone, index: number): DeliveryZone {
  const extraFields = (zone.extraFields ?? [])
    .map(normalizeExtraField)
    .filter((field): field is DeliveryExtraField => field !== null);

  return {
    id: zone.id || createId(`zone-${index}`),
    name: zone.name?.trim() || `Zone ${index + 1}`,
    slug: zone.slug?.trim() || slugify(zone.name || `zone-${index + 1}`),
    pricing: normalizePricing(zone.pricing),
    carrier: zone.carrier?.trim() || undefined,
    carrierNote: zone.carrierNote?.trim() || undefined,
    extraFields,
  };
}

function normalizeCountry(country: DeliveryCountry, index: number): DeliveryCountry {
  return {
    id: country.id || createId(`country-${index}`),
    name: country.name?.trim() || `Country ${index + 1}`,
    zones: (country.zones ?? []).map(normalizeZone),
  };
}

function migrateLegacyLocations(locations: LegacyLocation[]): DeliverySettings {
  const countriesMap = new Map<string, DeliveryCountry>();

  locations.forEach((location, index) => {
    const countryName = location.country?.trim() || 'Armenia';
    const existing = countriesMap.get(countryName.toLowerCase());

    const zone: DeliveryZone = {
      id: location.id || createId(`zone-${index}`),
      name: location.city?.trim() || `City ${index + 1}`,
      slug: slugify(location.city || `city-${index + 1}`),
      pricing: { type: 'fixed', price: Math.max(0, location.price || 0) },
      extraFields: [],
    };

    if (existing) {
      existing.zones.push(zone);
      return;
    }

    countriesMap.set(countryName.toLowerCase(), {
      id: createId('country'),
      name: countryName,
      zones: [zone],
    });
  });

  return {
    version: 2,
    countries: Array.from(countriesMap.values()),
  };
}

export function normalizeDeliverySettings(raw: unknown): DeliverySettings {
  if (!raw || typeof raw !== 'object') {
    return DEFAULT_DELIVERY_SETTINGS;
  }

  const value = raw as Partial<DeliverySettings> & { locations?: LegacyLocation[] };

  if (value.version === 2 && Array.isArray(value.countries)) {
    return {
      version: 2,
      countries: value.countries.map(normalizeCountry),
    };
  }

  if (Array.isArray(value.locations) && value.locations.length > 0) {
    return migrateLegacyLocations(value.locations);
  }

  return DEFAULT_DELIVERY_SETTINGS;
}

export function toPublicDeliverySettings(settings: DeliverySettings) {
  return {
    countries: settings.countries.map((country) => ({
      id: country.id,
      name: country.name,
      zones: country.zones.map((zone) => ({
        id: zone.id,
        name: zone.name,
        slug: zone.slug,
        pricing: zone.pricing,
        carrier: zone.carrier,
        carrierNote: zone.carrierNote,
        extraFields: zone.extraFields.map(({ fieldKey, required }) => ({
          fieldKey,
          required,
        })),
      })),
    })),
  };
}

export function createEmptyCountry(): DeliveryCountry {
  return {
    id: createId('country'),
    name: '',
    zones: [createEmptyZone()],
  };
}

export function createEmptyZone(): DeliveryZone {
  return {
    id: createId('zone'),
    name: '',
    slug: '',
    pricing: {
      type: 'tiered',
      priceBelowThreshold: 1000,
      thresholdAmount: 15000,
    },
    extraFields: [],
  };
}
