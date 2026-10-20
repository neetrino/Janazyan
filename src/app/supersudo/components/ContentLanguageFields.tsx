'use client';

import { useEffect, useRef, useState } from 'react';
import { Input } from '@shop/ui';
import { LANGUAGES, type LanguageCode } from '@/lib/language';
import { useTranslation } from '@/lib/i18n-client';
import {
  CONTENT_LOCALES,
  pickLocalizedText,
  type LocalizedText,
} from '@/lib/i18n/localized-text';

interface ContentLanguageFieldsProps {
  syncKey: string;
  textLabel: string;
  slugLabel: string;
  slugHint: string;
  texts: LocalizedText[];
  slug: string;
  slugReadOnly?: boolean;
  showSlug?: boolean;
  onChange: (locale: LanguageCode, patch: { text?: string; slug?: string }) => void;
}

export function ContentLanguageFields({
  syncKey,
  textLabel,
  slugLabel,
  slugHint,
  texts,
  slug,
  slugReadOnly = false,
  showSlug = true,
  onChange,
}: ContentLanguageFieldsProps) {
  const { t } = useTranslation();
  const [activeLocale, setActiveLocale] = useState<LanguageCode>('hy');
  const syncedKeyRef = useRef<string | null>(null);
  const active = texts.find((row) => row.locale === activeLocale) ?? texts[0];

  useEffect(() => {
    if (syncedKeyRef.current === syncKey) {
      return;
    }
    const filled = texts.filter((row) => row.text.trim());
    if (filled.length === 0) {
      return;
    }
    syncedKeyRef.current = syncKey;
    setActiveLocale((current) => {
      if (filled.some((row) => row.locale === current)) {
        return current;
      }
      return pickLocalizedText(filled, current, (row) => row.text)?.locale ?? current;
    });
  }, [syncKey, texts]);

  if (!active) {
    return null;
  }

  return (
    <div className="space-y-4">
      <div>
        <p className="mb-2 text-sm font-medium text-gray-700">{t('admin.products.add.contentLanguage')}</p>
        <div className="flex flex-wrap gap-2">
          {CONTENT_LOCALES.map((locale) => {
            const filled = Boolean(texts.find((row) => row.locale === locale)?.text.trim());
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
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">{textLabel} *</label>
        <Input
          type="text"
          value={active.text}
          onChange={(event) => onChange(active.locale, { text: event.target.value })}
        />
      </div>
      {showSlug ? (
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">{slugLabel}</label>
          <Input
            type="text"
            value={slug}
            readOnly={slugReadOnly}
            onChange={(event) => onChange(active.locale, { slug: event.target.value })}
          />
          <p className="mt-1 text-xs text-gray-500">{slugHint}</p>
        </div>
      ) : null}
    </div>
  );
}
