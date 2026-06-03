const LOCALE_MAP: Record<string, string> = {
  en: 'en-US',
  hy: 'hy-AM',
  ru: 'ru-RU',
};

/**
 * Formats a blog post date for display in the given locale.
 */
export function formatBlogDate(isoDate: string | null, locale: string): string {
  if (!isoDate) {
    return '';
  }
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) {
    return '';
  }
  const intlLocale = LOCALE_MAP[locale] ?? 'en-US';

  if (locale === 'hy') {
    const day = date.getDate();
    const month = new Intl.DateTimeFormat('hy-AM', { month: 'long' }).format(date);
    const year = date.getFullYear();
    return `${day} ${month}, ${year} թ.`;
  }

  return new Intl.DateTimeFormat(intlLocale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
}
