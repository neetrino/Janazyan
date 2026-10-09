import { transliterateForSlug } from './slug-transliterate';

const MAX_SLUG_INPUT_LENGTH = 500;
const PERCENT_ENCODED_PATTERN = /%[0-9A-Fa-f]{2}/;
const MAX_URI_DECODE_PASSES = 2;

/**
 * Decode a route/query slug that may still be percent-encoded (Next.js edge cases).
 */
export function decodeSlugParam(raw: string): string {
  let current = String(raw).trim();
  for (let pass = 0; pass < MAX_URI_DECODE_PASSES; pass += 1) {
    if (!PERCENT_ENCODED_PATTERN.test(current)) {
      break;
    }
    try {
      const decoded = decodeURIComponent(current);
      if (decoded === current) {
        break;
      }
      current = decoded;
    } catch {
      break;
    }
  }
  return current;
}

/**
 * Converts a string to a URL-safe ASCII slug.
 * Armenian/Cyrillic are transliterated to Latin first (no regex on user input).
 */
export function toSlug(input: string): string {
  const s = transliterateForSlug(String(input)).toLowerCase().trim();
  let out = '';
  let prevWasHyphen = false;

  for (let i = 0; i < Math.min(s.length, MAX_SLUG_INPUT_LENGTH); i++) {
    const c = s[i];
    const isAlnum = (c >= 'a' && c <= 'z') || (c >= '0' && c <= '9');

    if (isAlnum) {
      out += c;
      prevWasHyphen = false;
    } else if (!prevWasHyphen && out.length > 0) {
      out += '-';
      prevWasHyphen = true;
    }
  }

  let end = out.length;
  while (end > 0 && out[end - 1] === '-') end--;
  return out.slice(0, end);
}
