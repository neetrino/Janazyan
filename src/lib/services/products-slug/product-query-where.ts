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
