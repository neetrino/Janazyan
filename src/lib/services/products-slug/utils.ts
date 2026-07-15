import { translations } from "../../translations";
import { DEFAULT_LANGUAGE } from '../../language';

/**
 * Get "Out of Stock" translation for a given language
 */
export function getOutOfStockLabel(lang: string = DEFAULT_LANGUAGE): string {
  const langKey = lang as keyof typeof translations;
  const translation = translations[langKey] || translations.en;
  return translation.stock.outOfStock;
}




