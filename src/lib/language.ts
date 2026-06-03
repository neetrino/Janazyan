// Language utilities
export const LANGUAGES = {
  en: { code: 'en', name: 'English', nativeName: 'English' },
  hy: { code: 'hy', name: 'Armenian', nativeName: 'Հայերեն' },
  ru: { code: 'ru', name: 'Russian', nativeName: 'Русский' },
  ka: { code: 'ka', name: 'Georgian', nativeName: 'ქართული' },
} as const;

export type LanguageCode = keyof typeof LANGUAGES;

export const LANGUAGE_STORAGE_KEY = 'shop_language';

function parseLanguageCode(value: string | null | undefined): LanguageCode | null {
  if (value && value in LANGUAGES) {
    return value as LanguageCode;
  }
  return null;
}

export function getStoredLanguage(): LanguageCode {
  if (typeof window === 'undefined') return 'en';
  try {
    const stored = localStorage.getItem(LANGUAGE_STORAGE_KEY);
    return parseLanguageCode(stored) ?? 'en';
  } catch {
    return 'en';
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

