import { db } from "@white-shop/db";
import { logger } from "../../../utils/logger";
import { readNamedLocaleRows } from "../category-content";
import { reserveAttributeKey, saveAttributeNames } from "../attribute-content";
import { formatAttribute } from "./utils";

const attributeInclude = {
  translations: true,
  values: {
    include: { translations: true },
    orderBy: { position: "asc" as const },
  },
};

/**
 * Create attribute
 */
export async function createAttribute(data: {
  name?: string;
  key?: string;
  type?: string;
  filterable?: boolean;
  locale?: string;
  translations?: unknown;
}) {
  const rows = readNamedLocaleRows(data.translations, { locale: data.locale, text: data.name });
  if (rows.length === 0) {
    throw {
      status: 400,
      type: "https://api.shop.am/problems/validation-error",
      title: "Validation Error",
      detail: "Enter a name in at least one language",
    };
  }

  const key = await reserveAttributeKey(data.key || rows[0].text);
  logger.info('Creating attribute', { key });

  const attribute = await db.attribute.create({
    data: {
      key,
      type: data.type || "select",
      filterable: data.filterable !== false,
      translations: {
        create: rows.map((row) => ({ locale: row.locale, name: row.text })),
      },
    },
    include: attributeInclude,
  });

  return formatAttribute(attribute, rows[0].locale);
}

/**
 * Update attribute translation (name)
 */
export async function updateAttributeTranslation(
  attributeId: string,
  data: {
    name?: string;
    locale?: string;
    key?: string;
    translations?: unknown;
  }
) {
  logger.info('Updating attribute translation', { attributeId, name: data.name });

  const attribute = await db.attribute.findUnique({
    where: { id: attributeId },
  });

  if (!attribute) {
    throw {
      status: 404,
      type: "https://api.shop.am/problems/not-found",
      title: "Attribute not found",
      detail: `Attribute with id '${attributeId}' does not exist`,
    };
  }

  const rows = readNamedLocaleRows(data.translations, { locale: data.locale, text: data.name });
  if (rows.length > 0) {
    await saveAttributeNames(attributeId, rows);
  }

  if (typeof data.key === 'string' && data.key.trim()) {
    const key = await reserveAttributeKey(data.key, attributeId);
    if (key !== attribute.key) {
      await db.attribute.update({ where: { id: attributeId }, data: { key } });
    }
  }

  const locale = rows[0]?.locale || data.locale || "en";

  const updatedAttribute = await db.attribute.findUnique({
    where: { id: attributeId },
    include: attributeInclude,
  });

  if (!updatedAttribute) {
    throw {
      status: 500,
      type: "https://api.shop.am/problems/internal-error",
      title: "Internal Server Error",
      detail: "Failed to retrieve updated attribute",
    };
  }

  return formatAttribute(updatedAttribute, locale);
}




