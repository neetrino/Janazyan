import type { Prisma } from '@white-shop/db';
import { db } from '@white-shop/db';
import { logger } from '../../utils/logger';
import type { ProductWithRelations } from './types';

const CATALOG_LIST_ORDER: Prisma.ProductOrderByWithRelationInput = {
  createdAt: 'desc',
};

/** Minimal fields for storefront product cards (no variant options / categories join). */
const catalogProductSelect = {
  id: true,
  discountPercent: true,
  primaryCategoryId: true,
  brandId: true,
  media: true,
  translations: {
    select: { slug: true, title: true, locale: true },
  },
  brand: {
    select: {
      id: true,
      logoUrl: true,
      translations: {
        select: { name: true, locale: true },
      },
    },
  },
  variants: {
    where: { published: true },
    orderBy: { price: 'asc' as const },
    take: 1,
    select: {
      id: true,
      price: true,
      compareAtPrice: true,
      stock: true,
    },
  },
  labels: {
    select: {
      id: true,
      type: true,
      value: true,
      position: true,
      color: true,
    },
  },
} satisfies Prisma.ProductSelect;

/**
 * Lightweight list query for /products grid (single cheapest variant per row).
 */
export async function executeCatalogProductQuery(
  where: Prisma.ProductWhereInput,
  limit: number,
  skip: number = 0
): Promise<ProductWithRelations[]> {
  const products = await db.product.findMany({
    where,
    orderBy: CATALOG_LIST_ORDER,
    skip,
    take: limit,
    select: catalogProductSelect,
  });
  logger.debug(`Found ${products.length} products (catalog select)`);
  return products as unknown as ProductWithRelations[];
}
