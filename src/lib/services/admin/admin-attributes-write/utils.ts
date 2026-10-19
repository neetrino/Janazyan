import { pickLocalizedText } from '@/lib/i18n/localized-text';

/**
 * Parse colors data from various formats to string array
 */
export function parseColors(colorsData: unknown): string[] {
  if (!colorsData) {
    return [];
  }

  if (Array.isArray(colorsData)) {
    return colorsData.filter((item): item is string => typeof item === 'string');
  }

  if (typeof colorsData === 'string') {
    try {
      const parsed = JSON.parse(colorsData);
      return Array.isArray(parsed) ? parsed.filter((item): item is string => typeof item === 'string') : [];
    } catch {
      return [];
    }
  }

  if (typeof colorsData === 'object') {
    return Array.isArray(colorsData) ? colorsData.filter((item): item is string => typeof item === 'string') : [];
  }

  return [];
}

/**
 * Format attribute value for response
 */
export function formatAttributeValue(
  val: {
    id: string;
    value: string;
    translations?: Array<{ locale: string; label: string }>;
    colors?: unknown;
    imageUrl?: string | null;
  },
  locale: string
): {
  id: string;
  value: string;
  label: string;
  translations: Array<{ locale: string; label: string }>;
  colors: string[];
  imageUrl: string | null;
} {
  const translations = val.translations ?? [];
  const valTranslation = pickLocalizedText(translations, locale, (row) => row.label);
  return {
    id: val.id,
    value: val.value,
    label: valTranslation?.label || val.value,
    translations: translations.map((row) => ({ locale: row.locale, label: row.label })),
    colors: parseColors(val.colors),
    imageUrl: val.imageUrl || null,
  };
}

/**
 * Format attribute for response
 */
export function formatAttribute(
  attribute: {
    id: string;
    key: string;
    type: string;
    filterable: boolean;
    translations?: Array<{ locale: string; name: string }>;
    values?: Array<{
      id: string;
      value: string;
      translations?: Array<{ locale: string; label: string }>;
      colors?: unknown;
      imageUrl?: string | null;
    }>;
  },
  locale: string
): {
  id: string;
  key: string;
  name: string;
  translations: Array<{ locale: string; name: string }>;
  type: string;
  filterable: boolean;
  values: Array<{
    id: string;
    value: string;
    label: string;
    translations: Array<{ locale: string; label: string }>;
    colors: string[];
    imageUrl: string | null;
  }>;
} {
  const translations = attribute.translations ?? [];
  const translation = pickLocalizedText(translations, locale, (row) => row.name);
  const values = attribute.values || [];

  return {
    id: attribute.id,
    key: attribute.key,
    name: translation?.name || attribute.key,
    translations: translations.map((row) => ({ locale: row.locale, name: row.name })),
    type: attribute.type,
    filterable: attribute.filterable,
    values: values.map((val) => formatAttributeValue(val, locale)),
  };
}




