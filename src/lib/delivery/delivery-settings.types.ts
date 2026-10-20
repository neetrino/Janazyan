import type { LanguageCode } from '@/lib/language';

export type DeliveryPricingFixed = {
  type: 'fixed';
  price: number;
};

export type DeliveryPricingTiered = {
  type: 'tiered';
  priceBelowThreshold: number;
  thresholdAmount: number;
};

export type DeliveryPricing = DeliveryPricingFixed | DeliveryPricingTiered;

export type DeliveryNameTranslation = {
  locale: LanguageCode;
  text: string;
};

export type DeliveryExtraFieldKey =
  | 'recipientFullName'
  | 'postalIndex'
  | 'additionalNotes';

export type DeliveryExtraField = {
  id: string;
  fieldKey: DeliveryExtraFieldKey;
  required: boolean;
};

export type DeliveryZone = {
  id: string;
  name: string;
  names: DeliveryNameTranslation[];
  slug: string;
  pricing: DeliveryPricing;
  carrier?: string;
  carrierNote?: string;
  extraFields: DeliveryExtraField[];
};

export type DeliveryCountry = {
  id: string;
  name: string;
  names: DeliveryNameTranslation[];
  zones: DeliveryZone[];
};

export type DeliverySettings = {
  version: 2;
  countries: DeliveryCountry[];
};

export type DeliveryPriceParams = {
  country: string;
  zoneSlug: string;
  orderSubtotalAmd: number;
};

export type DeliveryZonePublic = Omit<DeliveryZone, 'extraFields'> & {
  extraFields: Array<Pick<DeliveryExtraField, 'fieldKey' | 'required'>>;
};

export type DeliveryCountryPublic = {
  id: string;
  name: string;
  names: DeliveryNameTranslation[];
  zones: DeliveryZonePublic[];
};

export type DeliveryOptionsPublic = {
  countries: DeliveryCountryPublic[];
};
