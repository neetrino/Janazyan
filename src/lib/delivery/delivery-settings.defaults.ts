import {
  DELIVERY_DEFAULT_PRICE_AMD,
  DELIVERY_FREE_ORDER_THRESHOLD_AMD,
} from './delivery-settings.constants';
import type { DeliverySettings } from './delivery-settings.types';

export const DEFAULT_DELIVERY_SETTINGS: DeliverySettings = {
  version: 2,
  countries: [
    {
      id: 'country-armenia',
      name: 'Armenia',
      zones: [
        {
          id: 'zone-yerevan',
          name: 'Yerevan',
          slug: 'yerevan',
          pricing: {
            type: 'tiered',
            priceBelowThreshold: DELIVERY_DEFAULT_PRICE_AMD,
            thresholdAmount: DELIVERY_FREE_ORDER_THRESHOLD_AMD,
          },
          extraFields: [],
        },
        {
          id: 'zone-regions',
          name: 'Marzer',
          slug: 'regions',
          pricing: {
            type: 'fixed',
            price: DELIVERY_DEFAULT_PRICE_AMD,
          },
          carrier: 'HayPost',
          carrierNote: 'Առաքումն իրականացվում է ՀայՓոստով',
          extraFields: [
            { id: 'ef-recipient', fieldKey: 'recipientFullName', required: true },
            { id: 'ef-index', fieldKey: 'postalIndex', required: true },
            { id: 'ef-notes', fieldKey: 'additionalNotes', required: true },
          ],
        },
      ],
    },
  ],
};
