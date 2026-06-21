import type { Prisma } from "@white-shop/db";

export type ProductVariantOptionRow = {
  attributeKey: string | null;
  value: string | null;
  attributeValue?: {
    id: string;
    value: string;
    translations: Array<{ locale: string; label: string }>;
    attribute: { id: string; key: string };
  } | null;
};

/** Variant row loaded for PDP slug queries (select-based). */
export type ProductVariantWithOptions = {
  id: string;
  sku: string | null;
  price: number;
  compareAtPrice: number | null;
  stock: number;
  imageUrl: string | null;
  position: number;
  options: ProductVariantOptionRow[];
};

/**
 * Product row loaded for PDP/API slug service (select-based, locale-filtered relations).
 */
export type ProductWithFullRelations = {
  id: string;
  brandId: string | null;
  primaryCategoryId: string | null;
  discountPercent: number;
  media: Prisma.JsonValue[];
  published: boolean;
  publishedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  translations: Array<{
    locale: string;
    slug: string;
    title: string;
    subtitle: string | null;
    descriptionHtml: string | null;
    seoTitle: string | null;
    seoDescription: string | null;
  }>;
  brand: {
    id: string;
    slug: string;
    logoUrl: string | null;
    translations: Array<{ locale: string; name: string }>;
  } | null;
  categories: Array<{
    id: string;
    translations: Array<{ locale: string; slug: string; title: string }>;
  }>;
  variants: ProductVariantWithOptions[];
  labels: Array<{
    id: string;
    type: string;
    value: string;
    position: string;
    color: string | null;
  }>;
  productAttributes?: Array<{
    id: string;
    attribute: {
      id: string;
      key: string;
      translations: Array<{ locale: string; name: string }>;
      values: Array<{
        id: string;
        value: string;
        imageUrl: string | null;
        colors: Prisma.JsonValue | null;
        translations: Array<{ locale: string; label: string }>;
      }>;
    };
  }>;
};
