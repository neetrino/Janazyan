/** Slim Prisma shape for cart reads — one product join per item (no nested variant.product). */
export const CART_WITH_ITEMS_INCLUDE = {
  items: {
    include: {
      variant: {
        select: {
          id: true,
          sku: true,
          stock: true,
          price: true,
          compareAtPrice: true,
        },
      },
      product: {
        select: {
          id: true,
          media: true,
          discountPercent: true,
          primaryCategoryId: true,
          brandId: true,
          translations: {
            select: { locale: true, title: true, slug: true },
          },
        },
      },
    },
  },
} as const;
