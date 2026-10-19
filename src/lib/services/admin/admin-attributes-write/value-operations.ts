import { db } from "@white-shop/db";
import { logger } from "../../../utils/logger";
import { ensureColorsColumnsExist } from "./migration";
import { formatAttribute } from "./utils";
import { resolveAdminImageReference } from "@/lib/r2/resolve-admin-image-reference";
import { R2_IMAGE_FOLDERS } from "@/lib/r2/r2-image-folders";
import { readNamedLocaleRows } from "../category-content";
import { attributeValueKey, saveAttributeValueLabels } from "../attribute-content";

/**
 * Add attribute value
 */
export async function addAttributeValue(
  attributeId: string,
  data: { label?: string; locale?: string; translations?: unknown; value?: string }
) {
  const rows = readNamedLocaleRows(data.translations, { locale: data.locale, text: data.label });
  if (rows.length === 0) {
    throw {
      status: 400,
      type: "https://api.shop.am/problems/validation-error",
      title: "Validation Error",
      detail: "Enter a label in at least one language",
    };
  }

  logger.info('Adding attribute value', { attributeId, label: rows[0].text });

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

  const value = attributeValueKey(data.value || rows[0].text);

  const existing = await db.attributeValue.findFirst({
    where: {
      attributeId,
      value,
    },
  });

  if (existing) {
    throw {
      status: 400,
      type: "https://api.shop.am/problems/validation-error",
      title: "Value already exists",
      detail: `Value '${rows[0].text}' already exists for this attribute`,
    };
  }

  await db.attributeValue.create({
    data: {
      attributeId,
      value,
      translations: {
        create: rows.map((row) => ({ locale: row.locale, label: row.text })),
      },
    },
  });

  const updatedAttribute = await db.attribute.findUnique({
    where: { id: attributeId },
    include: {
      translations: true,
      values: {
        include: { translations: true },
        orderBy: { position: "asc" },
      },
    },
  });

  if (!updatedAttribute) {
    throw {
      status: 500,
      type: "https://api.shop.am/problems/internal-error",
      title: "Internal Server Error",
      detail: "Failed to retrieve updated attribute",
    };
  }

  return formatAttribute(updatedAttribute, rows[0].locale);
}

/**
 * Update attribute value
 */
export async function updateAttributeValue(
  attributeId: string,
  valueId: string,
  data: {
    label?: string;
    colors?: string[];
    imageUrl?: string | null;
    translations?: unknown;
    locale?: string;
  }
) {
  logger.info('Updating attribute value', { attributeId, valueId, data });

  // Ensure colors and imageUrl columns exist (runtime migration)
  try {
    await ensureColorsColumnsExist();
  } catch (migrationError: unknown) {
    const errorMessage = migrationError instanceof Error ? migrationError.message : String(migrationError);
    logger.warn('Migration check failed', { error: errorMessage });
    // Continue anyway - might already exist
  }

  const attributeValue = await db.attributeValue.findUnique({
    where: { id: valueId },
    include: {
      attribute: true,
      translations: true,
    },
  });

  if (!attributeValue) {
    throw {
      status: 404,
      type: "https://api.shop.am/problems/not-found",
      title: "Attribute value not found",
      detail: `Attribute value with id '${valueId}' does not exist`,
    };
  }

  if (attributeValue.attributeId !== attributeId) {
    throw {
      status: 400,
      type: "https://api.shop.am/problems/validation-error",
      title: "Validation Error",
      detail: "Attribute value does not belong to the specified attribute",
    };
  }

  const labelRows = data.translations !== undefined || data.label !== undefined
    ? readNamedLocaleRows(data.translations, { locale: data.locale, text: data.label })
    : [];
  if (labelRows.length > 0) {
    await saveAttributeValueLabels(valueId, labelRows);
  }

  const locale = labelRows[0]?.locale || data.locale || "en";
  const updateData: {
    colors?: string[];
    imageUrl?: string | null;
  } = {};

  // Update colors if provided
  if (data.colors !== undefined) {
    // Ensure colors is always an array (even if empty)
    // Prisma JSONB field expects an array format
    updateData.colors = Array.isArray(data.colors) ? data.colors : [];
    logger.debug('Setting colors', { 
      valueId, 
      colors: updateData.colors, 
      colorsType: typeof updateData.colors,
      isArray: Array.isArray(updateData.colors)
    });
  }

  // Update imageUrl if provided
  if (data.imageUrl !== undefined) {
    updateData.imageUrl = await resolveAdminImageReference(data.imageUrl, R2_IMAGE_FOLDERS.attributes);
  }

  // Update attribute value if colors or imageUrl changed
  if (Object.keys(updateData).length > 0) {
    logger.debug('Updating attribute value in database', { 
      valueId, 
      updateData,
      updateDataKeys: Object.keys(updateData)
    });
    const updatedValue = await db.attributeValue.update({
      where: { id: valueId },
      data: updateData,
    });
    logger.debug('Attribute value updated', { 
      valueId, 
      savedColors: updatedValue.colors,
      savedColorsType: typeof updatedValue.colors
    });
  }

  // Return updated attribute with all values
  const updatedAttribute = await db.attribute.findUnique({
    where: { id: attributeId },
    include: {
      translations: true,
      values: {
        include: { translations: true },
        orderBy: { position: "asc" },
      },
    },
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




