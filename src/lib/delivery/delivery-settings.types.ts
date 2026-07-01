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
  slug: string;
  pricing: DeliveryPricing;
  carrier?: string;
  carrierNote?: string;
  extraFields: DeliveryExtraField[];
};

export type DeliveryCountry = {
  id: string;
  name: string;
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
  zones: DeliveryZonePublic[];
};

export type DeliveryOptionsPublic = {
  countries: DeliveryCountryPublic[];
};
