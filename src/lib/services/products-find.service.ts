import { ProductFilters } from "./products-find-query.service";
import { productsFindQueryService } from "./products-find-query.service";
import { productsFindFilterService } from "./products-find-filter.service";
import { productsFindTransformService } from "./products-find-transform.service";
import { getProductDiscountSettings } from "./products-discount-settings.cache";
import { DEFAULT_LANGUAGE } from '../language';

class ProductsFindService {
  /**
   * Get all products with filters
   */
  async findAll(filters: ProductFilters) {
    const {
      page = 1,
      limit = 12,
      lang = DEFAULT_LANGUAGE,
    } = filters;

    // Step 1: Fetch products and discount settings in parallel (catalog hot path).
    const [{ products, bestsellerProductIds, total: totalFromQuery }, discountSettings] =
      await Promise.all([
        productsFindQueryService.buildQueryAndFetch(filters),
        getProductDiscountSettings(),
      ]);

    // Step 2: Filter products in memory (price, colors, sizes, brand) and sort.
    // Catalog path is already DB-paginated/ordered, so skip the in-memory pass.
    const filteredProducts = filters.catalog
      ? products
      : productsFindFilterService.filterProducts(
          products,
          filters,
          bestsellerProductIds
        );

    // Step 3: Pagination — use server total when provided (no filters), else client slice
    const isFastCatalog = filters.catalog === true && filters.fastCatalog === true;
    const hasNextPage = isFastCatalog ? filteredProducts.length > limit : undefined;
    const start = (page - 1) * limit;
    const paginatedProducts =
      totalFromQuery !== undefined
        ? filteredProducts
        : isFastCatalog
          ? filteredProducts.slice(0, limit)
          : filteredProducts.slice(start, start + limit);
    const total =
      totalFromQuery !== undefined
        ? totalFromQuery
        : isFastCatalog
          ? hasNextPage
            ? page * limit + 1
            : (page - 1) * limit + paginatedProducts.length
          : filteredProducts.length;

    // Step 4: Transform products to response format
    const data = await productsFindTransformService.transformProducts(
      paginatedProducts,
      lang,
      {
        catalog: filters.catalog === true,
        discountSettings,
      },
    );

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        hasNextPage,
      },
    };
  }
}

export const productsFindService = new ProductsFindService();






