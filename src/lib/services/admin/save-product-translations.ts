import type { Prisma } from '@white-shop/db';
import type { ProductContentWriteRow } from '@/lib/products/product-translations';
import { ensureUniqueProductSlug } from './product-slug-utils';

interface StoredProductTranslation {
  locale: string;
  title: string;
  slug: string;
  descriptionHtml: string | null;
}

/**
 * Assign a unique Latin slug per locale without changing the other languages.
 */
export async function assignUniqueProductTranslationSlugs(
  tx: Prisma.TransactionClient,
  rows: ProductContentWriteRow[],
  excludeProductId?: string,
): Promise<StoredProductTranslation[]> {
  const stored: StoredProductTranslation[] = [];

  for (const row of rows) {
    const slug = await ensureUniqueProductSlug({
      tx,
      slug: row.slug || row.title,
      locale: row.locale,
      excludeProductId,
    });
    stored.push({
      locale: row.locale,
      title: row.title.trim(),
      slug,
      descriptionHtml: row.descriptionHtml.trim() ? row.descriptionHtml : null,
    });
  }

  return stored;
}

/**
 * Replace the product's language rows with the filled admin translations.
 * Locales left blank are removed so the storefront can fall back.
 */
export async function saveProductContentTranslations(
  tx: Prisma.TransactionClient,
  productId: string,
  rows: ProductContentWriteRow[],
): Promise<void> {
  const stored = await assignUniqueProductTranslationSlugs(tx, rows, productId);

  for (const row of stored) {
    await tx.productTranslation.upsert({
      where: {
        productId_locale: {
          productId,
          locale: row.locale,
        },
      },
      update: {
        title: row.title,
        slug: row.slug,
        descriptionHtml: row.descriptionHtml,
      },
      create: {
        productId,
        locale: row.locale,
        title: row.title,
        slug: row.slug,
        descriptionHtml: row.descriptionHtml,
      },
    });
  }

  await tx.productTranslation.deleteMany({
    where: {
      productId,
      locale: { notIn: stored.map((row) => row.locale) },
    },
  });
}
