import { Prisma } from "@white-shop/db";

/**
 * Product filters interface
 */
export interface ProductFilters {
  category?: string;
  search?: string;
  ids?: string[];
  filter?: string;
  minPrice?: number;
  maxPrice?: number;
  colors?: string;
  sizes?: string;
  brand?: string;
  sort?: string;
  page?: number;
  limit?: number;
  lang?: string;
  /** Lighter transform + query for catalog grids (cards do not need full color swatches). */
  catalog?: boolean;
}

/**
 * Type for product with all relations needed for find query service
 */
export type ProductWithRelations = Prisma.ProductGetPayload<{
  include: {
    translations: true;
    brand: {
      include: {
        translations: true;
      };
    };
    variants: {
      include: {
        options: {
          include: {
            attributeValue: {
              include: {
                attribute: true;
                translations: true;
              };
            };
          };
        };
      };
    };
    labels: true;
    categories: {
      include: {
        translations: true;
      };
    };
    productAttributes?: {
      include: {
        attribute: {
          include: {
            translations: true;
            values: {
              include: {
                translations: true;
              };
            };
          };
        };
      };
    };
  };
}>;




