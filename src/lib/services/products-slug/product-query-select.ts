import type { Prisma } from "@white-shop/db";
import { LANGUAGES, type LanguageCode } from "@/lib/language";

const STOREFRONT_LOCALES = Object.keys(LANGUAGES) as LanguageCode[];

/**
 * Locales loaded for a storefront request.
 * Prefer the requested locale first; include others so en-only (etc.) products still render.
 */
export function localeCandidates(lang: string): string[] {
  const preferred = STOREFRONT_LOCALES.includes(lang as LanguageCode)
    ? (lang as LanguageCode)
    : STOREFRONT_LOCALES[0];
  return [preferred, ...STOREFRONT_LOCALES.filter((locale) => locale !== preferred)];
}

function translationWhere(lang: string) {
  const locales = localeCandidates(lang);
  return { locale: { in: locales } };
}

type ProductDetailsSelectOptions = {
  includeProductAttributes: boolean;
  includeAttributeValueOnOptions: boolean;
};

/**
 * Targeted Prisma select for PDP/API payloads — locale-filtered translations, no table-wide includes.
 */
export function buildProductDetailsSelect(
  lang: string,
  options: ProductDetailsSelectOptions,
): Prisma.ProductSelect {
  const localeWhere = translationWhere(lang);

  const variantOptionsSelect: Prisma.ProductVariantOptionSelect = options.includeAttributeValueOnOptions
    ? {
        attributeKey: true,
        value: true,
        attributeValue: {
          select: {
            id: true,
            value: true,
            translations: {
              where: localeWhere,
              select: { locale: true, label: true },
            },
            attribute: {
              select: {
                id: true,
                key: true,
              },
            },
          },
        },
      }
    : {
        attributeKey: true,
        value: true,
      };

  const productAttributesSelect: Prisma.ProductAttributeSelect | undefined =
    options.includeProductAttributes
      ? {
          id: true,
          attribute: {
            select: {
              id: true,
              key: true,
              translations: {
                where: localeWhere,
                select: { locale: true, name: true },
              },
              values: {
                orderBy: { position: "asc" },
                select: {
                  id: true,
                  value: true,
                  imageUrl: true,
                  colors: true,
                  translations: {
                    where: localeWhere,
                    select: { locale: true, label: true },
                  },
                },
              },
            },
          },
        }
      : undefined;

  const select: Prisma.ProductSelect = {
    id: true,
    brandId: true,
    primaryCategoryId: true,
    discountPercent: true,
    media: true,
    published: true,
    publishedAt: true,
    createdAt: true,
    updatedAt: true,
    translations: {
      where: localeWhere,
      select: {
        locale: true,
        slug: true,
        title: true,
        subtitle: true,
        descriptionHtml: true,
        seoTitle: true,
        seoDescription: true,
      },
    },
    brand: {
      select: {
        id: true,
        slug: true,
        logoUrl: true,
        translations: {
          where: localeWhere,
          select: { locale: true, name: true },
        },
      },
    },
    categories: {
      select: {
        id: true,
        translations: {
          where: localeWhere,
          select: { locale: true, slug: true, title: true },
        },
      },
    },
    variants: {
      where: { published: true },
      orderBy: { position: "asc" },
      select: {
        id: true,
        sku: true,
        price: true,
        compareAtPrice: true,
        stock: true,
        imageUrl: true,
        position: true,
        options: {
          select: variantOptionsSelect,
        },
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
  };

  if (productAttributesSelect) {
    select.productAttributes = { select: productAttributesSelect };
  }

  return select;
}
