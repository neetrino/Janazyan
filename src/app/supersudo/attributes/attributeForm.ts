import {
  applyLocalizedTextChange,
  emptyLocalizedTexts,
  filledLocalizedTexts,
  mergeLocalizedTexts,
  type LocalizedText,
} from '@/lib/i18n/localized-text';
import type { LanguageCode } from '@/lib/language';

export interface NamedFormState {
  name: string;
  slug: string;
  translations: LocalizedText[];
}

export function emptyNamedForm(): NamedFormState {
  return { name: '', slug: '', translations: emptyLocalizedTexts() };
}

export function namedFormFrom(
  rows: Array<{ locale: string; text: string }> | undefined,
  fallbackText: string,
  slug: string,
): NamedFormState {
  const translations = mergeLocalizedTexts(
    (rows && rows.length > 0 ? rows : [{ locale: 'en', text: fallbackText }]),
  );
  return {
    name: filledLocalizedTexts(translations)[0]?.text ?? fallbackText,
    slug,
    translations,
  };
}

export function updateNamedForm(
  form: NamedFormState,
  locale: LanguageCode,
  patch: { text?: string; slug?: string },
): NamedFormState {
  const next = applyLocalizedTextChange({ texts: form.translations, slug: form.slug }, locale, patch);
  return {
    translations: next.texts,
    slug: next.slug,
    name: filledLocalizedTexts(next.texts)[0]?.text ?? '',
  };
}

export function updateNamedText(
  form: NamedFormState,
  locale: LanguageCode,
  text: string,
): NamedFormState {
  const translations = form.translations.map((row) =>
    row.locale === locale ? { ...row, text } : row,
  );
  return {
    ...form,
    translations,
    name: filledLocalizedTexts(translations)[0]?.text ?? '',
  };
}

export function filledNamePayload(form: NamedFormState, textKey: 'name' | 'label'): Array<Record<string, string>> {
  return filledLocalizedTexts(form.translations).map((row) => ({
    locale: row.locale,
    [textKey]: row.text,
  }));
}
