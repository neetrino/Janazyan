import { parseProductSlugParam } from './parse-product-slug';

const PRODUCT_PAGE_SNAPSHOT_PREFIX = 'shop_product_page_snapshot_v1:';
const DEFAULT_SNAPSHOT_MAX_AGE_MS = 10 * 60 * 1000;

export type ProductPageSnapshot = {
  slug: string;
  title: string;
  image: string | null;
  previewImages?: string[];
  descriptionPreview?: string | null;
  price: number;
  originalPrice: number | null;
  compareAtPrice: number | null;
  discountPercent: number | null;
  averageRating?: number | null;
  reviewsCount?: number | null;
  hasVariantSelectors?: boolean;
  capturedAt: number;
};

export type ProductPageSnapshotInput = Omit<ProductPageSnapshot, 'capturedAt'>;

const inMemorySnapshots = new Map<string, ProductPageSnapshot>();

function canUseStorage(): boolean {
  return typeof window !== 'undefined' && typeof window.sessionStorage !== 'undefined';
}

function buildStorageKey(slug: string): string {
  return `${PRODUCT_PAGE_SNAPSHOT_PREFIX}${slug}`;
}

export function createProductPageSnapshot(
  input: ProductPageSnapshotInput,
): ProductPageSnapshot {
  return {
    ...input,
    capturedAt: Date.now(),
  };
}

export function writeProductPageSnapshot(snapshot: ProductPageSnapshot): void {
  inMemorySnapshots.set(snapshot.slug, snapshot);
  if (!canUseStorage()) return;
  try {
    window.sessionStorage.setItem(buildStorageKey(snapshot.slug), JSON.stringify(snapshot));
  } catch {
    // Best-effort cache only.
  }
}

export function primeProductPageSnapshot(input: ProductPageSnapshotInput): void {
  writeProductPageSnapshot(createProductPageSnapshot(input));
}

function readFromStorage(slug: string): ProductPageSnapshot | null {
  if (!canUseStorage()) return null;
  try {
    const raw = window.sessionStorage.getItem(buildStorageKey(slug));
    if (!raw) return null;
    const parsed = JSON.parse(raw) as ProductPageSnapshot;
    if (parsed.slug !== slug) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function readProductPageSnapshot(
  slug: string,
  maxAgeMs = DEFAULT_SNAPSHOT_MAX_AGE_MS,
): ProductPageSnapshot | null {
  if (!slug) return null;
  const fromMemory = inMemorySnapshots.get(slug) ?? null;
  const snapshot = fromMemory ?? readFromStorage(slug);
  if (!snapshot) return null;
  if (Date.now() - snapshot.capturedAt > maxAgeMs) return null;
  return snapshot;
}

export function readProductPageSnapshotByPathname(
  pathname: string | null,
): ProductPageSnapshot | null {
  if (!pathname) return null;
  const parts = pathname.split('/');
  const encodedSlug = parts[2];
  const rawSlug = encodedSlug ? decodeURIComponent(encodedSlug) : '';
  const { slug } = parseProductSlugParam(rawSlug);
  return readProductPageSnapshot(slug);
}
