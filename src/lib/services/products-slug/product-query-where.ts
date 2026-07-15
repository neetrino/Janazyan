/**
 * Shared Prisma where clause for published storefront products by slug + locale.
 */
export function getBaseWhere(slug: string, lang: string) {
  return {
    translations: {
      some: {
        slug,
        locale: lang,
      },
    },
    published: true,
    deletedAt: null,
  };
}

/**
 * Published product by slug in any locale (admin may publish only one translation).
 */
export function getBaseWhereAnyLocale(slug: string) {
  return {
    translations: {
      some: { slug },
    },
    published: true,
    deletedAt: null,
  };
}
