import { describe, expect, it } from 'vitest';
import { writeInContentLocale } from './locale-script';

describe('writeInContentLocale', () => {
  it('keeps Armenian and text that is already in the target script', () => {
    expect(writeInContentLocale('Երևան', 'hy')).toBe('Երևան');
    expect(writeInContentLocale('SAS', 'en')).toBe('SAS');
    expect(writeInContentLocale('Ереван', 'ru')).toBe('Ереван');
  });

  it('writes Armenian place names in English and Russian', () => {
    expect(writeInContentLocale('Երևան', 'en')).toBe('Yerevan');
    expect(writeInContentLocale('Երևան', 'ru')).toBe('Ереван');
    expect(writeInContentLocale('Աբովյան փողոց', 'en')).toBe('Abovyan Street');
    expect(writeInContentLocale('Աբովյան փողոց', 'ru')).toBe('улица Абовян');
  });

  it('writes known Latin region and district names in Russian', () => {
    expect(writeInContentLocale('Yerevan', 'ru')).toBe('Ереван');
    expect(writeInContentLocale('Kentron', 'ru')).toBe('Кентрон');
    expect(writeInContentLocale('Vayots Dzor', 'ru')).toBe('Вайоц Дзор');
    expect(writeInContentLocale('Yerevan', 'en')).toBe('Yerevan');
    expect(writeInContentLocale('SAS', 'ru')).toBe('SAS');
  });
});