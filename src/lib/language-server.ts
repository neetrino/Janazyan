import { cookies } from 'next/headers';
import { headers } from 'next/headers';
import { LANGUAGES, LANGUAGE_STORAGE_KEY, type LanguageCode } from './language';

function parseLanguageCode(value: string | null | undefined): LanguageCode | null {
  if (value && value in LANGUAGES) {
    return value as LanguageCode;
  }
  return null;
}

function resolveLanguageFromAcceptLanguage(headerValue: string | null): LanguageCode | null {
  if (!headerValue) {
    return null;
  }

  const languageTags = headerValue.split(',').map((part) => part.split(';')[0]?.trim().toLowerCase());
  for (const languageTag of languageTags) {
    if (!languageTag) {
      continue;
    }

    const primarySubtag = languageTag.split('-')[0];
    const parsed = parseLanguageCode(primarySubtag);
    if (parsed) {
      return parsed;
    }
  }

  return null;
}

/** Server Components: read language from cookie (set when user changes language). */
export async function getServerLanguage(): Promise<LanguageCode> {
  try {
    const cookieStore = await cookies();
    const cookieLanguage = parseLanguageCode(cookieStore.get(LANGUAGE_STORAGE_KEY)?.value);
    if (cookieLanguage) {
      return cookieLanguage;
    }

    const requestHeaders = await headers();
    const headerLanguage = resolveLanguageFromAcceptLanguage(requestHeaders.get('accept-language'));
    return headerLanguage ?? 'hy';
  } catch {
    return 'hy';
  }
}
