export const R2_IMAGE_FOLDERS = {
  products: 'products',
  categories: 'categories',
  attributes: 'attributes',
  brands: 'brands',
  blog: 'blog-media',
  partnerStores: 'partner-stores',
} as const;

export type R2ImageFolder = (typeof R2_IMAGE_FOLDERS)[keyof typeof R2_IMAGE_FOLDERS];

const ALLOWED_FOLDERS = new Set<string>(Object.values(R2_IMAGE_FOLDERS));

/** Validates an upload folder name; falls back to products when invalid. */
export function parseR2ImageFolder(
  value: unknown,
  fallback: R2ImageFolder = R2_IMAGE_FOLDERS.products,
): R2ImageFolder {
  if (typeof value === 'string' && ALLOWED_FOLDERS.has(value)) {
    return value as R2ImageFolder;
  }

  return fallback;
}
