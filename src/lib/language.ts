// Language utilities
export const LANGUAGES = {
  hy: { code: 'hy', name: 'Armenian', nativeName: 'Հայերեն' },
  en: { code: 'en', name: 'English', nativeName: 'English' },
  ru: { code: 'ru', name: 'Russian', nativeName: 'Русский' },
} as const;

export type LanguageCode = keyof typeof LANGUAGES;

/** Storefront primary / default locale when the user has not chosen one. */
export const DEFAULT_LANGUAGE: LanguageCode = 'hy';

export const LANGUAGE_STORAGE_KEY = 'shop_language';

function parseLanguageCode(value: string | null | undefined): LanguageCode | null {
  if (value && value in LANGUAGES) {
    return value as LanguageCode;
  }
  return null;
}

export function getStoredLanguage(): LanguageCode {
  if (typeof window === 'undefined') return DEFAULT_LANGUAGE;
  try {
    const stored = localStorage.getItem(LANGUAGE_STORAGE_KEY);
    return parseLanguageCode(stored) ?? DEFAULT_LANGUAGE;
  } catch {
    return DEFAULT_LANGUAGE;
  }
}

export function setStoredLanguage(language: LanguageCode, options?: { skipReload?: boolean }): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
    document.cookie = `${LANGUAGE_STORAGE_KEY}=${language};path=/;max-age=31536000;SameSite=Lax`;
    window.dispatchEvent(new Event('language-updated'));
    // Only reload if skipReload is not true
    if (!options?.skipReload) {
      // Use a small delay to ensure state updates are visible before reload
      setTimeout(() => {
        window.location.reload();
      }, 50);
    }
  } catch (error) {
    console.error('Failed to save language:', error);
  }
}
