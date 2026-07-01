import type { DeliveryOptionsPublic } from '@/lib/delivery/delivery-settings.types';
import type { CheckoutFormData } from '../types';

type DeliveryValidationError = {
  field: keyof CheckoutFormData;
  message: string;
};

export function validateDeliveryExtraFields(
  data: CheckoutFormData,
  options: DeliveryOptionsPublic | null,
  messages: {
    countryRequired: string;
    zoneRequired: string;
    recipientRequired: string;
    postalIndexRequired: string;
    additionalNotesRequired: string;
  },
): DeliveryValidationError[] {
  if (data.shippingMethod !== 'delivery') {
    return [];
  }

  const errors: DeliveryValidationError[] = [];

  if (!data.shippingCountry?.trim()) {
    errors.push({ field: 'shippingCountry', message: messages.countryRequired });
    return errors;
  }

  if (!data.shippingCity?.trim()) {
    errors.push({ field: 'shippingCity', message: messages.zoneRequired });
    return errors;
  }

  const country = options?.countries.find((entry) => entry.name === data.shippingCountry);
  const zone = country?.zones.find(
    (entry) => entry.slug === data.shippingCity || entry.name === data.shippingCity,
  );

  if (!zone) {
    return errors;
  }

  for (const field of zone.extraFields) {
    if (!field.required) {
      continue;
    }

    if (field.fieldKey === 'recipientFullName' && !data.shippingRecipientName?.trim()) {
      errors.push({ field: 'shippingRecipientName', message: messages.recipientRequired });
    }

    if (field.fieldKey === 'postalIndex' && !data.shippingPostalIndex?.trim()) {
      errors.push({ field: 'shippingPostalIndex', message: messages.postalIndexRequired });
    }

    if (field.fieldKey === 'additionalNotes' && !data.shippingAdditionalNotes?.trim()) {
      errors.push({ field: 'shippingAdditionalNotes', message: messages.additionalNotesRequired });
    }
  }

  return errors;
}
