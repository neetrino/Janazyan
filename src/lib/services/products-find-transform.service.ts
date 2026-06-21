import type { ProductLabel } from "../../components/ProductLabels";
import { processImageUrl } from "../utils/image-utils";
import { sanitizeStoredProductImageUrl } from "../products/resolve-stored-product-image-url";
import { translations } from "../translations";
import { ProductWithRelations } from "./products-find-query.service";
import {
  getProductDiscountSettings,
  type ProductDiscountSettings,
} from "./products-discount-settings.cache";

/**
 * Get "Out of Stock" translation for a given language
 */
const getOutOfStockLabel = (lang: string = "en"): string => {
  const langKey = lang as keyof typeof translations;
  const translation = translations[langKey] || translations.en;
  return translation.stock.outOfStock;
};

export type ProductListItem = {
  id: string;
  slug: string;
  title: string;
  defaultVariantId: string | null;
  brand: { id: string; name: string; logoUrl: string | null } | null;
  categories: Array<{ id: string; slug: string; title: string }>;
  price: number;
  originalPrice: number | null;
  compareAtPrice: number | null;
  discountPercent: number | null;
  image: string | null;
  inStock: boolean;
  labels: ProductLabel[];
  colors: Array<{ value: string; imageUrl?: string | null; colors?: string[] | null }>;
};

type TransformOptions = {
  /** Skip expensive per-variant color aggregation (catalog cards). */
  catalog?: boolean;
  /** Preloaded discount settings — avoids a sequential DB round-trip on cache miss. */
  discountSettings?: ProductDiscountSettings;
};

function collectProductColors(
  product: ProductWithRelations,
  variants: ProductWithRelations["variants"],
  lang: string
): Array<{ value: string; imageUrl?: string | null; colors?: string[] | null }> {
  const colorMap = new Map<
    string,
    { value: string; imageUrl?: string | null; colors?: string[] | null }
  >();

  variants.forEach((v) => {
    const options = Array.isArray(v.options) ? v.options : [];
    const colorOptions = options.filter(
      (opt: ProductWithRelations["variants"][number]["options"][number]) => {
        if ("attributeValue" in opt && opt.attributeValue) {
          return opt.attributeValue.attribute?.key === "color";
        }
        return opt.attributeKey === "color";
      }
    );

    colorOptions.forEach(
      (colorOption: ProductWithRelations["variants"][number]["options"][number]) => {
        let colorValue = "";
        let imageUrl: string | null | undefined = null;
        let colorsHex: string[] | null | undefined = null;

        if ("attributeValue" in colorOption && colorOption.attributeValue) {
          const colorTranslation =
            colorOption.attributeValue.translations?.find(
              (t: { locale: string }) => t.locale === lang
            ) || colorOption.attributeValue.translations?.[0];
          colorValue =
            colorTranslation?.label || colorOption.attributeValue.value || "";
          imageUrl = colorOption.attributeValue.imageUrl || null;
          const colorsValue = colorOption.attributeValue.colors;
          colorsHex =
            Array.isArray(colorsValue) &&
            colorsValue.every((c): c is string => typeof c === "string")
              ? colorsValue
              : null;
        } else {
          colorValue = colorOption.value || "";
        }

        if (colorValue) {
          const normalizedValue = colorValue.trim().toLowerCase();
          if (
            !colorMap.has(normalizedValue) ||
            (imageUrl && !colorMap.get(normalizedValue)?.imageUrl)
          ) {
            colorMap.set(normalizedValue, {
              value: colorValue.trim(),
              imageUrl: imageUrl || null,
              colors: colorsHex || null,
            });
          }
        }
      }
    );

    if (
      colorOptions.length === 0 &&
      v.attributes &&
      typeof v.attributes === "object" &&
      !Array.isArray(v.attributes) &&
      "color" in v.attributes
    ) {
      const colorAttr = (v.attributes as { color?: unknown }).color;
      const colorAttributes = Array.isArray(colorAttr)
        ? colorAttr
        : colorAttr
          ? [colorAttr]
          : [];
      colorAttributes.forEach((colorAttrItem: unknown) => {
        const colorValue =
          colorAttrItem &&
          typeof colorAttrItem === "object" &&
          "value" in colorAttrItem
            ? (colorAttrItem as { value?: unknown }).value
            : colorAttrItem;
        if (colorValue && typeof colorValue === "string") {
          const normalizedValue = colorValue.trim().toLowerCase();
          if (!colorMap.has(normalizedValue)) {
            colorMap.set(normalizedValue, {
              value: colorValue.trim(),
              imageUrl: null,
              colors: null,
            });
          }
        }
      });
    }
  });

  const productAttrs =
    product &&
    "productAttributes" in product &&
    Array.isArray(product.productAttributes)
      ? product.productAttributes
      : [];
  if (productAttrs.length > 0) {
    for (const productAttr of productAttrs) {
      const attr = (productAttr as {
        attribute?: {
          key?: string;
          values?: Array<{
            translations?: Array<{ locale: string; label?: string }>;
            value?: string;
            imageUrl?: string | null;
            colors?: string[] | null;
          }>;
        };
      }).attribute;
      if (
        attr &&
        typeof attr === "object" &&
        attr.key === "color" &&
        Array.isArray(attr.values)
      ) {
        attr.values.forEach((attrValue) => {
          const translation =
            attrValue.translations?.find((t) => t.locale === lang) ||
            attrValue.translations?.[0];
          const colorValue = translation?.label || attrValue.value || "";
          if (colorValue) {
            const normalizedValue = colorValue.trim().toLowerCase();
            if (colorMap.has(normalizedValue)) {
              const existing = colorMap.get(normalizedValue);
              if (attrValue.imageUrl || attrValue.colors) {
                colorMap.set(normalizedValue, {
                  value: colorValue.trim(),
                  imageUrl: attrValue.imageUrl || existing?.imageUrl || null,
                  colors: attrValue.colors || existing?.colors || null,
                });
              }
            }
          }
        });
      }
    }
  }

  return Array.from(colorMap.values());
}

function pickCheapestVariant(
  variants: ProductWithRelations["variants"]
): ProductWithRelations["variants"][number] | null {
  if (!Array.isArray(variants) || variants.length === 0) {
    return null;
  }
  return variants.reduce((cheapest, current) =>
    current.price < cheapest.price ? current : cheapest
  );
}

class ProductsFindTransformService {
  /**
   * Transform products to response format
   */
  async transformProducts(
    products: ProductWithRelations[],
    lang: string = "en",
    options?: TransformOptions
  ): Promise<ProductListItem[]> {
    const { globalDiscount, categoryDiscounts, brandDiscounts } =
      options?.discountSettings ?? (await getProductDiscountSettings());
    const isCatalog = options?.catalog === true;

    const data = products.map((product: ProductWithRelations) => {
      // Безопасное получение translation с проверкой на существование массива
      const translations = Array.isArray(product.translations) ? product.translations : [];
      const translation = translations.find((t: { locale: string }) => t.locale === lang) || translations[0] || null;
      
      // Безопасное получение brand translation
      const brandTranslations = product.brand && Array.isArray(product.brand.translations)
        ? product.brand.translations
        : [];
      const brandTranslation = brandTranslations.length > 0
        ? brandTranslations.find((t: { locale: string }) => t.locale === lang) || brandTranslations[0]
        : null;
      
      const variants = Array.isArray(product.variants) ? product.variants : [];
      const variant = pickCheapestVariant(variants);
      const availableColors = isCatalog
        ? []
        : collectProductColors(product, variants, lang);

      const originalPrice = variant?.price || 0;
      let finalPrice = originalPrice;
      const productDiscount = product.discountPercent || 0;
      
      // Calculate applied discount with priority: productDiscount > categoryDiscount > brandDiscount > globalDiscount
      let appliedDiscount = 0;
      if (productDiscount > 0) {
        appliedDiscount = productDiscount;
      } else {
        // Check category discounts
        const primaryCategoryId = product.primaryCategoryId;
        if (primaryCategoryId && categoryDiscounts[primaryCategoryId]) {
          appliedDiscount = categoryDiscounts[primaryCategoryId];
        } else {
          // Check brand discounts
          const brandId = product.brandId;
          if (brandId && brandDiscounts[brandId]) {
            appliedDiscount = brandDiscounts[brandId];
          } else if (globalDiscount > 0) {
            appliedDiscount = globalDiscount;
          }
        }
      }

      if (appliedDiscount > 0 && originalPrice > 0) {
        finalPrice = originalPrice * (1 - appliedDiscount / 100);
      }

      const categories = isCatalog
        ? []
        : Array.isArray(product.categories)
          ? product.categories.map((cat: {
              id: string;
              translations?: Array<{ locale: string; slug: string; title: string }>;
            }) => {
              const catTranslations = Array.isArray(cat.translations) ? cat.translations : [];
              const catTranslation =
                catTranslations.find((t: { locale: string }) => t.locale === lang) ||
                catTranslations[0] ||
                null;
              return {
                id: cat.id,
                slug: catTranslation?.slug || '',
                title: catTranslation?.title || '',
              };
            })
          : [];

      return {
        id: product.id,
        slug: translation?.slug || "",
        title: translation?.title || "",
        defaultVariantId: variant?.id ?? null,
        brand: product.brand
          ? {
              id: product.brand.id,
              name: brandTranslation?.name || "",
              logoUrl: product.brand.logoUrl || null,
            }
          : null,
        categories,
        price: finalPrice,
        originalPrice: appliedDiscount > 0 ? originalPrice : variant?.compareAtPrice || null,
        compareAtPrice: variant?.compareAtPrice || null,
        discountPercent: appliedDiscount > 0 ? appliedDiscount : null,
        image: sanitizeStoredProductImageUrl(
          (() => {
            if (!Array.isArray(product.media) || product.media.length === 0) {
              return null;
            }

            return processImageUrl(
              product.media[0] as
                | string
                | null
                | undefined
                | { url?: string; src?: string; value?: string },
            );
          })(),
        ),
        inStock: (variant?.stock || 0) > 0,
        labels: (() => {
          // Map existing labels
          const existingLabels: ProductLabel[] = Array.isArray(product.labels)
            ? product.labels.map((label) => ({
                id: label.id,
                type: label.type as ProductLabel["type"],
                value: label.value,
                position: label.position as ProductLabel["position"],
                color: label.color,
              }))
            : [];
          
          // Check if product is out of stock
          const isOutOfStock = (variant?.stock || 0) <= 0;
          
          // If out of stock, add "Out of Stock" label
          if (isOutOfStock) {
            // Check if "Out of Stock" label already exists
            const outOfStockText = getOutOfStockLabel(lang);
            const hasOutOfStockLabel = existingLabels.some(
              (label) => label.value.toLowerCase() === outOfStockText.toLowerCase() ||
                         label.value.toLowerCase().includes('out of stock') ||
                         label.value.toLowerCase().includes('արտադրված') ||
                         label.value.toLowerCase().includes('нет в наличии') ||
                         label.value.toLowerCase().includes('არ არის მარაგში')
            );
            
            if (!hasOutOfStockLabel) {
              // Check if top-left position is available, otherwise use top-right
              const topLeftOccupied = existingLabels.some((l) => l.position === 'top-left');
              const position = topLeftOccupied ? 'top-right' : 'top-left';
              
              existingLabels.push({
                id: `out-of-stock-${product.id}`,
                type: 'text',
                value: outOfStockText,
                position,
                color: '#6B7280', // Gray color for out of stock
              });
              
            }
          }
          
          return existingLabels;
        })(),
        colors: availableColors, // Add available colors array
      };
    });

    return data;
  }
}

export const productsFindTransformService = new ProductsFindTransformService();
                                                    
