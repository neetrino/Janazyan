import { db } from '@white-shop/db';
import { toSlug } from '@/lib/utils/slug';
import type {
  FaqCategoryTranslationInput,
  FaqItemTranslationInput,
} from '@/features/faq/faq-locales';
import { revalidateFaqPublicCache } from '@/lib/faq/revalidate-faq-cache';
import { logger } from '@/lib/utils/logger';

function validateCategoryTranslations(translations: FaqCategoryTranslationInput[]): void {
  const en = translations.find((t) => t.locale === 'en');
  if (!en?.title.trim()) {
    throw {
      status: 400,
      type: 'https://api.shop.am/problems/validation-error',
      title: 'Validation Error',
      detail: 'English category title is required',
    };
  }
}

const DEFAULT_FAQ_CATEGORY_SLUG = 'general';

async function getOrCreateDefaultFaqCategory(): Promise<{ id: string }> {
  const existing = await db.faqCategory.findFirst({
    where: { slug: DEFAULT_FAQ_CATEGORY_SLUG, deletedAt: null },
    select: { id: true },
  });
  if (existing) {
    return existing;
  }

  const softDeleted = await db.faqCategory.findFirst({
    where: { slug: DEFAULT_FAQ_CATEGORY_SLUG, deletedAt: { not: null } },
    select: { id: true },
  });
  if (softDeleted) {
    await db.faqCategory.update({
      where: { id: softDeleted.id },
      data: { deletedAt: null, published: true },
    });
    return softDeleted;
  }

  return db.faqCategory.create({
    data: {
      slug: DEFAULT_FAQ_CATEGORY_SLUG,
      position: 0,
      published: true,
      translations: {
        create: [
          { locale: 'en', title: 'FAQ' },
          { locale: 'hy', title: 'Հաճախ տրվող հարցեր' },
          { locale: 'ru', title: 'Часто задаваемые вопросы' },
        ],
      },
    },
    select: { id: true },
  });
}

async function generateUniqueCategorySlug(baseName: string, excludeId?: string): Promise<string> {
  const baseSlug = toSlug(baseName) || 'faq-category';
  let slug = baseSlug;
  let counter = 1;

  while (true) {
    const existing = await db.faqCategory.findFirst({
      where: {
        slug,
        ...(excludeId ? { id: { not: excludeId } } : {}),
      },
    });
    if (!existing) {
      return slug;
    }
    slug = `${baseSlug}-${counter}`;
    counter += 1;
    if (counter > 1000) {
      throw {
        status: 500,
        type: 'https://api.shop.am/problems/internal-error',
        title: 'Unable to generate unique slug',
        detail: 'Could not generate a unique slug for the FAQ category',
      };
    }
  }
}

function mapAdminCategory(
  row: {
    id: string;
    slug: string;
    position: number;
    published: boolean;
    translations: Array<{ locale: string; title: string }>;
  },
  displayLocale = 'en',
) {
  const translation =
    row.translations.find((t) => t.locale === displayLocale) ?? row.translations[0];

  return {
    id: row.id,
    slug: row.slug,
    title: translation?.title ?? '',
    position: row.position,
    published: Boolean(row.published),
    translations: row.translations.map((t) => ({
      locale: t.locale,
      title: t.title,
    })),
  };
}

function mapAdminItem(
  row: {
    id: string;
    categoryId: string;
    position: number;
    published: boolean;
    translations: Array<{ locale: string; question: string; answer: string }>;
  },
  displayLocale = 'en',
) {
  const translation =
    row.translations.find((t) => t.locale === displayLocale) ?? row.translations[0];

  return {
    id: row.id,
    categoryId: row.categoryId,
    question: translation?.question ?? '',
    answer: translation?.answer ?? '',
    position: row.position,
    published: Boolean(row.published),
    translations: row.translations.map((t) => ({
      locale: t.locale,
      question: t.question,
      answer: t.answer,
    })),
  };
}

class AdminFaqService {
  async getFaqCategories() {
    const categories = await db.faqCategory.findMany({
      where: { deletedAt: null },
      include: { translations: true },
      orderBy: [{ position: 'asc' }, { createdAt: 'asc' }],
    });
    return { data: categories.map((c) => mapAdminCategory(c)) };
  }

  async createFaqCategory(data: {
    translations: FaqCategoryTranslationInput[];
    position?: number;
    published?: boolean;
  }) {
    validateCategoryTranslations(data.translations);
    const enTitle = data.translations.find((t) => t.locale === 'en')!.title.trim();
    const slug = await generateUniqueCategorySlug(enTitle);

    const category = await db.faqCategory.create({
      data: {
        slug,
        position: data.position ?? 0,
        published: data.published ?? false,
        translations: {
          create: data.translations
            .filter((t) => t.title.trim())
            .map((t) => ({
              locale: t.locale,
              title: t.title.trim(),
            })),
        },
      },
      include: { translations: true },
    });

    logger.info('FAQ category created', { id: category.id, slug: category.slug });
    await revalidateFaqPublicCache();
    return { data: mapAdminCategory(category) };
  }

  async updateFaqCategory(
    categoryId: string,
    data: {
      translations?: FaqCategoryTranslationInput[];
      position?: number;
      published?: boolean;
    },
  ) {
    const existing = await db.faqCategory.findFirst({
      where: { id: categoryId, deletedAt: null },
      include: { translations: true },
    });
    if (!existing) {
      throw {
        status: 404,
        type: 'https://api.shop.am/problems/not-found',
        title: 'Not Found',
        detail: 'FAQ category not found',
      };
    }

    if (data.translations) {
      validateCategoryTranslations(data.translations);
    }

    const enTitle = data.translations?.find((t) => t.locale === 'en')?.title.trim();
    const slug =
      enTitle && enTitle !== existing.translations.find((t) => t.locale === 'en')?.title
        ? await generateUniqueCategorySlug(enTitle, categoryId)
        : existing.slug;

    const category = await db.faqCategory.update({
      where: { id: categoryId },
      data: {
        ...(data.position !== undefined ? { position: data.position } : {}),
        ...(data.published !== undefined ? { published: data.published } : {}),
        slug,
        ...(data.translations
          ? {
              translations: {
                deleteMany: {},
                create: data.translations
                  .filter((t) => t.title.trim())
                  .map((t) => ({
                    locale: t.locale,
                    title: t.title.trim(),
                  })),
              },
            }
          : {}),
      },
      include: { translations: true },
    });

    logger.info('FAQ category updated', { id: category.id });
    await revalidateFaqPublicCache();
    return { data: mapAdminCategory(category) };
  }

  async deleteFaqCategory(categoryId: string) {
    const existing = await db.faqCategory.findFirst({
      where: { id: categoryId, deletedAt: null },
    });
    if (!existing) {
      throw {
        status: 404,
        type: 'https://api.shop.am/problems/not-found',
        title: 'Not Found',
        detail: 'FAQ category not found',
      };
    }

    await db.faqCategory.update({
      where: { id: categoryId },
      data: { deletedAt: new Date(), published: false },
    });

    logger.info('FAQ category deleted', { id: categoryId });
    await revalidateFaqPublicCache();
    return { success: true };
  }

  async getFaqItems() {
    const items = await db.faqItem.findMany({
      where: { deletedAt: null },
      include: { translations: true },
      orderBy: [{ position: 'asc' }, { createdAt: 'asc' }],
    });
    return { data: items.map((item) => mapAdminItem(item)) };
  }

  async createFaqItem(data: {
    categoryId?: string;
    translations: FaqItemTranslationInput[];
    position?: number;
    published?: boolean;
  }) {
    let categoryId = data.categoryId;
    if (categoryId) {
      const category = await db.faqCategory.findFirst({
        where: { id: categoryId, deletedAt: null },
      });
      if (!category) {
        throw {
          status: 400,
          type: 'https://api.shop.am/problems/validation-error',
          title: 'Validation Error',
          detail: 'FAQ category not found',
        };
      }
    } else {
      const defaultCategory = await getOrCreateDefaultFaqCategory();
      categoryId = defaultCategory.id;
    }

    const item = await db.faqItem.create({
      data: {
        categoryId,
        position: data.position ?? 0,
        published: data.published ?? false,
        translations: {
          create: data.translations
            .filter((t) => t.question.trim() && t.answer.trim())
            .map((t) => ({
              locale: t.locale,
              question: t.question.trim(),
              answer: t.answer.trim(),
            })),
        },
      },
      include: { translations: true },
    });

    logger.info('FAQ item created', { id: item.id, categoryId: item.categoryId });
    await revalidateFaqPublicCache();
    return { data: mapAdminItem(item) };
  }

  async updateFaqItem(
    itemId: string,
    data: {
      categoryId?: string;
      translations?: FaqItemTranslationInput[];
      position?: number;
      published?: boolean;
    },
  ) {
    const existing = await db.faqItem.findFirst({
      where: { id: itemId, deletedAt: null },
      include: { translations: true },
    });
    if (!existing) {
      throw {
        status: 404,
        type: 'https://api.shop.am/problems/not-found',
        title: 'Not Found',
        detail: 'FAQ item not found',
      };
    }

    if (data.categoryId) {
      const category = await db.faqCategory.findFirst({
        where: { id: data.categoryId, deletedAt: null },
      });
      if (!category) {
        throw {
          status: 400,
          type: 'https://api.shop.am/problems/validation-error',
          title: 'Validation Error',
          detail: 'FAQ category not found',
        };
      }
    }

    const item = await db.faqItem.update({
      where: { id: itemId },
      data: {
        ...(data.categoryId ? { categoryId: data.categoryId } : {}),
        ...(data.position !== undefined ? { position: data.position } : {}),
        ...(data.published !== undefined ? { published: data.published } : {}),
        ...(data.translations
          ? {
              translations: {
                deleteMany: {},
                create: data.translations
                  .filter((t) => t.question.trim() && t.answer.trim())
                  .map((t) => ({
                    locale: t.locale,
                    question: t.question.trim(),
                    answer: t.answer.trim(),
                  })),
              },
            }
          : {}),
      },
      include: { translations: true },
    });

    logger.info('FAQ item updated', { id: item.id });
    await revalidateFaqPublicCache();
    return { data: mapAdminItem(item) };
  }

  async deleteFaqItem(itemId: string) {
    const existing = await db.faqItem.findFirst({
      where: { id: itemId, deletedAt: null },
    });
    if (!existing) {
      throw {
        status: 404,
        type: 'https://api.shop.am/problems/not-found',
        title: 'Not Found',
        detail: 'FAQ item not found',
      };
    }

    await db.faqItem.update({
      where: { id: itemId },
      data: { deletedAt: new Date(), published: false },
    });

    logger.info('FAQ item deleted', { id: itemId });
    await revalidateFaqPublicCache();
    return { success: true };
  }
}

export const adminFaqService = new AdminFaqService();
