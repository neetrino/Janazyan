/**
 * Display title — first letter of each word uppercased, remainder lowercased.
 */
export function formatTitleCaseWords(value: string): string {
  const trimmed = value.trim();
  if (!trimmed) {
    return trimmed;
  }

  return trimmed
    .split(/\s+/)
    .map((word) => {
      if (!word) {
        return word;
      }

      return word.charAt(0).toLocaleUpperCase() + word.slice(1).toLocaleLowerCase();
    })
    .join(' ');
}
