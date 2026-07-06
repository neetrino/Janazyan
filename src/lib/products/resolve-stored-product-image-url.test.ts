import { describe, expect, it, vi, afterEach } from 'vitest';
import {
  extractSanitizedProductImageUrl,
  resolveCartProductImageUrl,
  sanitizeStoredProductImageUrl,
} from './resolve-stored-product-image-url';

describe('sanitizeStoredProductImageUrl', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('returns https URLs unchanged', () => {
    expect(
      sanitizeStoredProductImageUrl('https://cdn.example.com/products/a.jpg'),
    ).toBe('https://cdn.example.com/products/a.jpg');
  });

  it('drops localhost http URLs in production', () => {
    vi.stubEnv('NODE_ENV', 'production');
    expect(
      sanitizeStoredProductImageUrl('http://localhost:3000/product-media/a.jpg'),
    ).toBeNull();
  });

  it('allows localhost http URLs in development', () => {
    vi.stubEnv('NODE_ENV', 'development');
    expect(
      sanitizeStoredProductImageUrl('http://localhost:3000/product-media/a.jpg'),
    ).toBe('http://localhost:3000/product-media/a.jpg');
  });
});

describe('extractSanitizedProductImageUrl', () => {
  it('extracts and sanitizes the first media entry', () => {
    expect(
      extractSanitizedProductImageUrl([
        { url: 'https://cdn.example.com/products/a.jpg' },
      ]),
    ).toBe('https://cdn.example.com/products/a.jpg');
  });
});

describe('resolveCartProductImageUrl', () => {
  it('falls back to variant image when media is empty', () => {
    expect(
      resolveCartProductImageUrl([], 'https://cdn.example.com/variant.jpg'),
    ).toBe('https://cdn.example.com/variant.jpg');
  });

  it('prefers sanitized product media over variant image', () => {
    expect(
      resolveCartProductImageUrl(
        ['https://cdn.example.com/product.jpg'],
        'https://cdn.example.com/variant.jpg',
      ),
    ).toBe('https://cdn.example.com/product.jpg');
  });
});
