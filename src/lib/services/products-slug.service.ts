import { buildProductQuery } from "./products-slug/product-query-builder";
import { transformProduct } from "./products-slug/product-transformer";
import { getProductDiscountSettings } from "./products-discount-settings.cache";

/**
 * Service for fetching products by slug
 */
class ProductsSlugService {
  /**
   * Get product by slug
   */
  async findBySlug(slug: string, lang: string = "en") {
    const [product, discountSettings] = await Promise.all([
      buildProductQuery(slug, lang),
      getProductDiscountSettings(),
    ]);

    if (!product) {
      throw {
        status: 404,
        type: "https://api.shop.am/problems/not-found",
        title: "Product not found",
        detail: `Product with slug '${slug}' does not exist or is not published`,
      };
    }

    return transformProduct(product, lang, discountSettings);
  }
}

export const productsSlugService = new ProductsSlugService();
