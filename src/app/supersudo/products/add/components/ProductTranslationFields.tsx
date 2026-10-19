'use client';

import { useEffect, useRef, useState } from 'react';
import { Input } from '@shop/ui';
import { RichTextEditor } from '../../../../../components/RichTextEditor';
import { LANGUAGES, type LanguageCode } from '../../../../../lib/language';
import { useTranslation } from '../../../../../lib/i18n-client';
import {
  PRODUCT_CONTENT_LOCALES,
  pickProductTranslation,
  type ProductContentTranslation,
} from '../../../../../lib/products/product-translations';

interface ProductTranslationFieldsProps {
  syncKey: string;
  slug: string;
  translations: ProductContentTranslation[];
  onChange: (
    locale: LanguageCode,
    patch: Partial<Pick<ProductContentTranslation, 'title' | 'slug' | 'descriptionHtml'>>,
  ) => void;
}

export function ProductTranslationFields({
  syncKey,
  slug,
  translations,
  onChange,
}: ProductTranslationFieldsProps) {
  const { t } = useTranslation();
  const [activeLocale, setActiveLocale] = useState<LanguageCode>('hy');
  const syncedKeyRef = useRef<string | null>(null);
  const active = translations.find((row) => row.locale === activeLocale) ?? translations[0];

  useEffect(() => {
    if (syncedKeyRef.current === syncKey) {
      return;
    }
    const filled = translations.filter((row) => row.title.trim());
    if (filled.length === 0) {
      return;
    }
    syncedKeyRef.current = syncKey;
    setActiveLocale((current) => {
      if (filled.some((row) => row.locale === current)) {
        return current;
      }
      return pickProductTranslation(filled, current)?.locale ?? current;
    });
  }, [syncKey, translations]);

  if (!active) {
    return null;
  }

  return (
    <div className="space-y-4">
      <div>
        <p className="mb-2 text-sm font-medium text-gray-700">
          {t('admin.products.add.contentLanguage')}
        </p>
        <div className="flex flex-wrap gap-2">
          {PRODUCT_CONTENT_LOCALES.map((locale) => {
            const filled = Boolean(translations.find((row) => row.locale === locale)?.title.trim());
            const selected = activeLocale === locale;
            return (
              <button
                key={locale}
                type="button"
                className={`rounded-full px-4 py-1.5 text-sm transition-colors ${
                  selected ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                onClick={() => setActiveLocale(locale)}
              >
                {LANGUAGES[locale].nativeName}
                {filled ? <span className="ml-2 inline-block h-1.5 w-1.5 rounded-full bg-current align-middle" /> : null}
              </button>
            );
          })}
        </div>
        <p className="mt-2 text-xs text-gray-500">{t('admin.products.add.contentLanguageHint')}</p>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">
          {t('admin.products.add.title')} *
        </label>
        <Input
          type="text"
          value={active.title}
          onChange={(event) => onChange(active.locale, { title: event.target.value })}
          placeholder={t('admin.products.add.productTitlePlaceholder')}
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">
          {t('admin.products.add.slug')}
        </label>
        <Input
          type="text"
          value={slug}
          onChange={(event) => onChange(active.locale, { slug: event.target.value })}
          placeholder={t('admin.products.add.productSlugPlaceholder')}
        />
        <p className="mt-1 text-xs text-gray-500">{t('admin.products.add.slugLatinHint')}</p>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">
          {t('admin.products.add.description')}
        </label>
        <RichTextEditor
          key={active.locale}
          value={active.descriptionHtml}
          onChange={(html) => onChange(active.locale, { descriptionHtml: html })}
          placeholder={t('admin.products.add.productDescriptionPlaceholder')}
        />
      </div>
    </div>
  );
}
