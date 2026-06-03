'use client';

import { useState, useEffect } from 'react';
import { apiClient } from '../../../lib/api-client';
import { getStoredLanguage } from '../../../lib/language';
import { flattenCategories, type Category } from '../utils';

interface CategoriesResponse {
  data: Category[];
}

/**
 * Hook for fetching categories (skipped when server provides initialCategories).
 */
export function useCategories(initialCategories?: Category[]) {
  const hasInitial = Boolean(initialCategories?.length);
  const [categories, setCategories] = useState<Category[]>(initialCategories ?? []);
  const [loading, setLoading] = useState(!hasInitial);

  useEffect(() => {
    if (hasInitial) {
      return;
    }

    const fetchCategories = async () => {
      try {
        setLoading(true);
        const language = getStoredLanguage();
        const response = await apiClient.get<CategoriesResponse>('/api/v1/categories/tree', {
          params: { lang: language },
        });

        const categoriesList = response.data || [];
        setCategories(flattenCategories(categoriesList));
      } catch (err) {
        console.error('Error fetching categories:', err);
      } finally {
        setLoading(false);
      }
    };

    void fetchCategories();
  }, [hasInitial]);

  return { categories, loading };
}
