import { apiClient } from '@/lib/api-client';
import { useTranslation } from '@/lib/i18n-client';
import type { Category } from '../types';
import { logger } from "@/lib/utils/logger";

interface UseBrandAndCategoryCreationProps {
  formData: {
    brandIds: string[];
    primaryCategoryId: string;
  };
  useNewCategory: boolean;
  newCategoryName: string;
  setCategories: (updater: (prev: Category[]) => Category[]) => void;
  setLoading: (loading: boolean) => void;
}

export function useBrandAndCategoryCreation({
  formData,
  useNewCategory,
  newCategoryName,
  setCategories,
  setLoading,
}: UseBrandAndCategoryCreationProps) {
  const { t } = useTranslation();

  const createBrandAndCategory = async (): Promise<{
    finalBrandIds: string[];
    finalPrimaryCategoryId: string;
    creationMessages: string[];
    error: boolean;
  }> => {
    const creationMessages: string[] = [];
    const finalBrandIds = [...formData.brandIds];
    let finalPrimaryCategoryId = formData.primaryCategoryId;

    if (useNewCategory && newCategoryName.trim()) {
      try {
        logger.debug('📁 [ADMIN] Creating new category:', newCategoryName);
        const categoryResponse = await apiClient.post<{ data: Category }>('/api/v1/admin/categories', {
          title: newCategoryName.trim(),
          locale: 'en',
          requiresSizes: false,
        });
        if (categoryResponse.data) {
          finalPrimaryCategoryId = categoryResponse.data.id;
          setCategories((prev) => [...prev, categoryResponse.data]);
          logger.debug('✅ [ADMIN] Category created:', categoryResponse.data.id);
          creationMessages.push(
            t('admin.products.add.categoryCreatedSuccess').replace('{name}', newCategoryName.trim())
          );
        }
      } catch (err: unknown) {
        console.error('❌ [ADMIN] Error creating category:', err);
        setLoading(false);
        return { finalBrandIds, finalPrimaryCategoryId, creationMessages, error: true };
      }
    }

    return { finalBrandIds, finalPrimaryCategoryId, creationMessages, error: false };
  };

  return { createBrandAndCategory };
}
