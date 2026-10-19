import { LANGUAGES } from '@/lib/language';
import { writeInContentLocale } from '@/lib/i18n/locale-script';
import { CONTENT_LOCALES } from '@/lib/i18n/localized-text';

type NameRow = { locale: string; name: string; address?: string };

function localeName(rows: NameRow[] | undefined, locale: string, fallback: string): string {
  const saved = rows?.find((row) => row.locale === locale)?.name.trim() ?? '';
  if (saved) {
    return writeInContentLocale(saved, locale);
  }
  return locale === 'hy' ? fallback.trim() : '';
}

function localeAddress(rows: NameRow[] | undefined, locale: string): string {
  const saved = rows?.find((row) => row.locale === locale)?.address?.trim() ?? '';
  return saved ? writeInContentLocale(saved, locale) : '';
}

export function partnerNamesLabel(item: { name: string; translations?: NameRow[] }): string {
  const parts = CONTENT_LOCALES.map((locale) => localeName(item.translations, locale, item.name)).filter(Boolean);
  return parts.join(' · ') || item.name;
}

export function PartnerLocaleNames({ item }: { item: { name: string; translations?: NameRow[] } }) {
  return (
    <div className="space-y-0.5">
      {CONTENT_LOCALES.map((locale) => {
        const text = localeName(item.translations, locale, item.name);
        const address = localeAddress(item.translations, locale);
        return (
          <div key={locale} className="flex items-baseline gap-2">
            <span className="w-16 shrink-0 text-xs text-gray-400">{LANGUAGES[locale].nativeName}</span>
            <span className="min-w-0">
              <span className={text ? 'text-sm text-gray-900' : 'text-sm text-gray-300'}>{text || '—'}</span>
              {address ? <span className="mt-0.5 block text-xs text-gray-500">{address}</span> : null}
            </span>
          </div>
        );
      })}
    </div>
  );
}
