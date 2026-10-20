import { LANGUAGES } from '@/lib/language';
import { CONTENT_LOCALES } from '@/lib/i18n/localized-text';
import type { DeliveryNameTranslation } from '@/lib/delivery/delivery-settings.types';

type DeliveryLocaleNamesProps = {
  names: DeliveryNameTranslation[];
};

export function DeliveryLocaleNames({ names }: DeliveryLocaleNamesProps) {
  return (
    <div className="space-y-0.5">
      {CONTENT_LOCALES.map((locale) => {
        const text = names.find((row) => row.locale === locale)?.text.trim() ?? '';
        return (
          <div key={locale} className="flex items-baseline gap-2">
            <span className="w-16 shrink-0 text-xs text-gray-400">{LANGUAGES[locale].nativeName}</span>
            <span className={text ? 'text-sm text-gray-900' : 'text-sm text-gray-300'}>{text || '—'}</span>
          </div>
        );
      })}
    </div>
  );
}
