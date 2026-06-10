import type { LanguageCode } from '../../lib/language';
import { buildFaqFromLocale } from './build-faq-from-locale';
import type { FaqSection } from './types';

type FaqApiResponse = {
  data: FaqSection[];
};

/**
 * Loads published FAQ from API; falls back to locale JSON when API is empty or unavailable.
 */
export async function fetchFaqSections(locale: LanguageCode): Promise<FaqSection[]> {
  try {
    const response = await fetch(`/api/v1/faq?locale=${locale}`);
    if (response.ok) {
      const payload = (await response.json()) as FaqApiResponse;
      if (payload.data?.length > 0) {
        return payload.data;
      }
    }
  } catch {
    // fallback below
  }

  return buildFaqFromLocale(locale);
}
