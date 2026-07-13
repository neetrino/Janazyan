import { db } from "@white-shop/db";
import { ensureProductVariantAttributesColumn } from "../../utils/db-ensure";
import { logger } from "../../utils/logger";
import { getPublishedProductRefCached } from "@/lib/products/published-product-ref.cache";
import { buildProductDetailsSelect } from "./product-query-select";
import { getBaseWhere } from "./product-query-where";
import type { ProductWithFullRelations } from "./types";
import { DEFAULT_LANGUAGE } from '../../language';

export { getBaseWhere } from "./product-query-where";

type FetchDetailsOptions = {
  includeProductAttributes: boolean;
  includeAttributeValueOnOptions: boolean;
};

function isProductAttributesError(error: unknown): boolean {
  const errorMessage = error instanceof Error ? error.message : String(error);
  const errorCode =
    error && typeof error === "object" && "code" in error
      ? String(error.code)
      : "";
  return (
    errorCode === "P2021" ||
    errorMessage.includes("product_attributes") ||
    errorMessage.includes("does not exist")
  );
}

function isVariantAttributesError(error: unknown): boolean {
  const errorMessage = error instanceof Error ? error.message : String(error);
  return (
    errorMessage.includes("product_variants.attributes") ||
    (errorMessage.includes("attributes") && errorMessage.includes("does not exist"))
  );
}

function isAttributeValuesColorsError(error: unknown): boolean {
  const errorObj = error as { code?: string; message?: string };
  const errorMessage = error instanceof Error ? error.message : String(error);
  return (
    errorObj?.code === "P2022" ||
    errorMessage.includes("attribute_values.colors") ||
    errorMessage.includes("does not exist")
  );
}

async function fetchProductDetailsById(
  productId: string,
  lang: string,
  options: FetchDetailsOptions,
): Promise<ProductWithFullRelations | null> {
  const select = buildProductDetailsSelect(lang, options);
  const row = await db.product.findUnique({
    where: { id: productId },
    select,
  });
  return row as ProductWithFullRelations | null;
}

async function fetchWithFallbacks(
  productId: string,
  lang: string,
): Promise<ProductWithFullRelations | null> {
  const fullOptions: FetchDetailsOptions = {
    includeProductAttributes: true,
    includeAttributeValueOnOptions: true,
  };

  try {
    return await fetchProductDetailsById(productId, lang, fullOptions);
  } catch (error: unknown) {
    if (isProductAttributesError(error)) {
      logger.warn("product_attributes table not found, fetching without it", {
        error: error instanceof Error ? error.message : String(error),
      });
      return fetchProductDetailsById(productId, lang, {
        includeProductAttributes: false,
        includeAttributeValueOnOptions: true,
      });
    }

    if (isVariantAttributesError(error)) {
      logger.warn("product_variants.attributes column not found, attempting to create it");
      try {
        await ensureProductVariantAttributesColumn();
        return await fetchProductDetailsById(productId, lang, fullOptions);
      } catch (attributesError: unknown) {
        return handleAttributesError(productId, lang, attributesError);
      }
    }

    if (isAttributeValuesColorsError(error)) {
      logger.warn("attribute_values.colors column not found, fetching without attributeValue", {
        error: error instanceof Error ? error.message : String(error),
      });
      return fetchWithoutAttributeValue(productId, lang);
    }

    throw error;
  }
}

async function handleAttributesError(
  productId: string,
  lang: string,
  error: unknown,
): Promise<ProductWithFullRelations | null> {
  if (isAttributeValuesColorsError(error)) {
    logger.warn("attribute_values.colors column not found, fetching without attributeValue", {
      error: error instanceof Error ? error.message : String(error),
    });
    return fetchWithoutAttributeValue(productId, lang);
  }
  throw error;
}

async function fetchWithoutAttributeValue(
  productId: string,
  lang: string,
): Promise<ProductWithFullRelations | null> {
  try {
    return await fetchProductDetailsById(productId, lang, {
      includeProductAttributes: true,
      includeAttributeValueOnOptions: false,
    });
  } catch (productAttrError: unknown) {
    if (isProductAttributesError(productAttrError)) {
      return fetchProductDetailsById(productId, lang, {
        includeProductAttributes: false,
        includeAttributeValueOnOptions: false,
      });
    }
    throw productAttrError;
  }
}

/**
 * Build and execute product query by slug with comprehensive error handling.
 * Uses shared slug→id ref cache, then PK select (faster than translation join on cold miss).
 */
export async function buildProductQuery(
  slug: string,
  lang: string = DEFAULT_LANGUAGE,
): Promise<ProductWithFullRelations | null> {
  const ref = await getPublishedProductRefCached(slug, lang);
  if (!ref) {
    await logProductNotFoundDiagnostics(slug, lang);
    return null;
  }

  return fetchWithFallbacks(ref.id, lang);
}

/**
 * Log diagnostic information when product is not found.
 */
async function logProductNotFoundDiagnostics(slug: string, lang: string): Promise<void> {
  try {
    const productAnyLang = await db.product.findFirst({
      where: {
        translations: {
          some: { slug },
        },
      },
      select: {
        published: true,
        deletedAt: true,
        translations: {
          select: { locale: true, slug: true },
        },
      },
    });

    if (productAnyLang) {
      const availableLangs = productAnyLang.translations
        .map((translation) => translation.locale)
        .join(", ");
      logger.warn("Product found with slug but not in requested language", {
        slug,
        requestedLang: lang,
        availableLangs,
        published: productAnyLang.published,
        deletedAt: productAnyLang.deletedAt,
      });
      return;
    }

    const productUnpublished = await db.product.findFirst({
      where: {
        translations: {
          some: { slug, locale: lang },
        },
      },
      select: {
        id: true,
        published: true,
        deletedAt: true,
      },
    });

    if (productUnpublished) {
      logger.warn("Product found but not available", {
        slug,
        lang,
        published: productUnpublished.published,
        deletedAt: productUnpublished.deletedAt,
      });
    } else {
      logger.debug("Product not found in database", { slug, lang });
    }
  } catch (error) {
    logger.error("Error during product diagnostics", {
      error: error instanceof Error ? error.message : String(error),
      slug,
      lang,
    });
  }
}
