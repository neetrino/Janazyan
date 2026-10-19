import { transliterateForSlug } from '@/lib/utils/slug-transliterate';

const ARMENIAN_PATTERN = /[\u0531-\u0587]/;

const EN_STREET_TYPES = ['Street', 'Avenue', 'Lane', 'Highway'];
const RU_LEADING_TYPES = ['улица', 'проспект', 'переулок'];
const RU_TRAILING_TYPES = ['шоссе'];

const KNOWN_EN: Array<[RegExp, string]> = [
  [/Երևան|երևան|Երեւան|երեւան/gu, 'Yerevan'],
  [/Փողոց|փողոց/gu, 'Street'],
  [/Պողոտա|պողոտա/gu, 'Avenue'],
  [/Նրբանցք|նրբանցք/gu, 'Lane'],
  [/Խճուղի|խճուղի/gu, 'Highway'],
];

const LATIN_RU_PLACES: Array<[string, string]> = [
  ['Malatia-Sebastia', 'Малатия-Себастия'],
  ['Kanaker-Zeytun', 'Канакер-Зейтун'],
  ['Vayots Dzor', 'Вайоц Дзор'],
  ['Gegharkunik', 'Гегаркуник'],
  ['Aragatsotn', 'Арагацотн'],
  ['Davtashen', 'Давташен'],
  ['Shengavit', 'Шенгавит'],
  ['Ajapnyak', 'Аджапняк'],
  ['Nor Nork', 'Нор-Норк'],
  ['Yerevan', 'Ереван'],
  ['Armavir', 'Армавир'],
  ['Arabkir', 'Арабкир'],
  ['Erebuni', 'Эребуни'],
  ['Kentron', 'Кентрон'],
  ['Ararat', 'Арарат'],
  ['Kotayk', 'Котайк'],
  ['Shirak', 'Ширак'],
  ['Syunik', 'Сюник'],
  ['Tavush', 'Тавуш'],
  ['Avan', 'Аван'],
  ['Lori', 'Лори'],
];

const KNOWN_RU: Array<[RegExp, string]> = [
  [/Երևան|երևան|Երեւան|երեւան/gu, 'Ереван'],
  [/Փողոց|փողոց/gu, 'улица'],
  [/Պողոտա|պողոտա/gu, 'проспект'],
  [/Նրբանցք|նրբանցք/gu, 'переулок'],
  [/Խճուղի|խճուղի/gu, 'шоссе'],
];

const HY_RU_DIGRAPHS: Array<[string, string]> = [
  ['Ու', 'У'],
  ['ու', 'у'],
  ['Եվ', 'Ев'],
  ['եւ', 'ев'],
  ['և', 'ев'],
  ['Յա', 'Я'],
  ['յա', 'я'],
  ['Յո', 'Ё'],
  ['յո', 'ё'],
  ['Յու', 'Ю'],
  ['յու', 'ю'],
  ['Յե', 'Е'],
  ['յե', 'е'],
];

const HY_RU_LETTERS: Record<string, string> = {
  Ա: 'А', ա: 'а', Բ: 'Б', բ: 'б', Գ: 'Г', գ: 'г', Դ: 'Д', դ: 'д',
  Ե: 'Е', ե: 'е', Զ: 'З', զ: 'з', Է: 'Э', է: 'э', Ը: 'Ы', ը: 'ы',
  Թ: 'Т', թ: 'т', Ժ: 'Ж', ժ: 'ж', Ի: 'И', ի: 'и', Լ: 'Л', լ: 'л',
  Խ: 'Х', խ: 'х', Ծ: 'Ц', ծ: 'ц', Կ: 'К', կ: 'к', Հ: 'Х', հ: 'х',
  Ձ: 'Дз', ձ: 'дз', Ղ: 'Г', ղ: 'г', Ճ: 'Ч', ճ: 'ч', Մ: 'М', մ: 'м',
  Յ: 'Й', յ: 'й', Ն: 'Н', ն: 'н', Շ: 'Ш', շ: 'ш', Ո: 'О', ո: 'о',
  Չ: 'Ч', չ: 'ч', Պ: 'П', պ: 'п', Ջ: 'Дж', ջ: 'дж', Ռ: 'Р', ռ: 'р',
  Ս: 'С', ս: 'с', Վ: 'В', վ: 'в', Տ: 'Т', տ: 'т', Ր: 'Р', ր: 'р',
  Ց: 'Ц', ց: 'ц', Ւ: 'У', ւ: 'у', Փ: 'П', փ: 'п', Ք: 'К', ք: 'к',
  Օ: 'О', օ: 'о', Ֆ: 'Ф', ֆ: 'ф',
};

function hasArmenian(text: string): boolean {
  return ARMENIAN_PATTERN.test(text);
}

function replaceKnown(text: string, pairs: Array<[RegExp, string]>): string {
  return pairs.reduce((current, [pattern, replacement]) => current.replace(pattern, replacement), text);
}

function transliterateArmenianToRussian(text: string): string {
  let out = text;
  for (const [from, to] of HY_RU_DIGRAPHS) {
    out = out.split(from).join(to);
  }
  let result = '';
  for (const char of out) {
    result += HY_RU_LETTERS[char] ?? char;
  }
  return result;
}

function titleCaseLowerLatin(text: string): string {
  return text.replace(/\b[a-z][a-z'-]*/g, (word) => word.charAt(0).toUpperCase() + word.slice(1));
}

function placeMarkedWords(text: string, leading: string[], trailing: string[]): string {
  const words = text.split(/\s+/).filter(Boolean);
  const lead = words.filter((word) => leading.includes(word));
  const tail = words.filter((word) => trailing.includes(word));
  const rest = words.filter((word) => !leading.includes(word) && !trailing.includes(word));
  if (lead.length === 0 && tail.length === 0) {
    return text.trim();
  }
  return [...lead, ...rest, ...tail].join(' ');
}

function toEnglish(text: string): string {
  const latin = transliterateForSlug(replaceKnown(text, KNOWN_EN));
  return placeMarkedWords(titleCaseLowerLatin(latin), [], EN_STREET_TYPES);
}

function replaceLatinPlaces(text: string): string {
  return LATIN_RU_PLACES.reduce((current, [from, to]) => {
    const escaped = from.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const pattern = new RegExp(`\\b${escaped}\\b`, 'gi');
    return current.replace(pattern, to);
  }, text);
}

function toRussian(text: string): string {
  const cyrillic = transliterateArmenianToRussian(replaceKnown(text, KNOWN_RU));
  return placeMarkedWords(cyrillic, RU_LEADING_TYPES, RU_TRAILING_TYPES);
}

/**
 * Writes partner-store text in the script of the target locale.
 * Armenian stays Armenian. Armenian copied into English becomes Latin.
 * Armenian copied into Russian becomes Cyrillic. Text already in the target script is kept.
 */
export function writeInContentLocale(text: string, locale: string): string {
  if (!text.trim() || locale === 'hy') {
    return text;
  }
  if (locale === 'ru') {
    return hasArmenian(text) ? toRussian(text) : replaceLatinPlaces(text);
  }
  if (!hasArmenian(text)) {
    return text;
  }
  if (locale === 'en') {
    return toEnglish(text);
  }
  return text;
}
