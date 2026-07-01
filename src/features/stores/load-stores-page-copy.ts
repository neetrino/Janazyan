import { loadTranslation } from '../../lib/i18n';
import type { LanguageCode } from '../../lib/language';
import type { StoresTranslation } from './types';

/** Page shell copy for /stores (title, map labels, CTA — not store list). */
export function loadStoresPageCopy(lang: LanguageCode): StoresTranslation {
  const raw = loadTranslation(lang, 'stores') as StoresTranslation & {
    partnerStores?: unknown;
  };
  const common = loadTranslation(lang, 'common') as {
    buttons: { close: string };
  };
  return {
    subtitle: raw.subtitle,
    title: raw.title,
    description: raw.description,
    map: raw.map,
    listTitle: raw.listTitle,
    getDirections: raw.getDirections,
    viewOnMap: raw.viewOnMap,
    closeLabel: common.buttons.close,
    cantFind: raw.cantFind,
  };
}
