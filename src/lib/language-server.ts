import { cookies } from 'next/headers';
import { DEFAULT_LANGUAGE, LANGUAGES, LANGUAGE_STORAGE_KEY, type LanguageCode } from './language';

function parseLanguageCode(value: string | null | undefined): LanguageCode | null {
  if (value && value in LANGUAGES) {
    return value as LanguageCode;
  }
  return null;
}

/** Server Components: read language from cookie (set when user changes language). */
export async function getServerLanguage(): Promise<LanguageCode> {
  try {
    const cookieStore = await cookies();
    const cookieLanguage = parseLanguageCode(cookieStore.get(LANGUAGE_STORAGE_KEY)?.value);
    return cookieLanguage ?? DEFAULT_LANGUAGE;
  } catch {
    return DEFAULT_LANGUAGE;
  }
}
