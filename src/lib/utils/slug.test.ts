import { describe, expect, it } from 'vitest';
import { decodeSlugParam, toSlug } from './slug';

describe('decodeSlugParam', () => {
  it('decodes percent-encoded Armenian slug', () => {
    const encoded =
      '%D6%81%D5%A5%D6%80%D5%A5%D5%AF%D5%A1%D5%B5%D5%AB%D5%B6-%D6%84%D5%BD%D5%B8%D6%82%D6%84-1033-hy';
    expect(decodeSlugParam(encoded)).toBe('ցերեկային-քսուք-1033-hy');
  });

  it('is idempotent for already-decoded values', () => {
    expect(decodeSlugParam('tserekayin-qsuq-1033-hy')).toBe('tserekayin-qsuq-1033-hy');
  });
});

describe('toSlug', () => {
  it('transliterates Armenian product titles to Latin ASCII', () => {
    expect(toSlug('Ցերեկային քսուք')).toBe('tserekayin-qsuq');
    expect(toSlug('ցերեկային-քսուք-1033-hy')).toBe('tserekayin-qsuq-1033-hy');
  });

  it('strips non-latin leftovers to ASCII slug shape', () => {
    expect(toSlug('Hello World!')).toBe('hello-world');
  });
});
