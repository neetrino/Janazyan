import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/lib/api-client';
import { CURRENCIES, type CurrencyCode } from '@/lib/currency';
import type { Category, Attribute } from '../types';
import { logger } from "@/lib/utils/logger";
import {
  ADMIN_LIST_CACHE_KEYS,
  fetchAdminListCached,
} from '@/lib/admin/admin-list-client-cache';

interface UseProductDataLoadingProps {
  isLoggedIn: boolean;
  isAdmin: boolean;
  isLoading: boolean;
  setCategories: (categories: Category[]) => void;
  setAttributes: (attributes: Attribute[]) => void;
  setDefaultCurrency: (currency: CurrencyCode) => void;
  attributesDropdownOpen: boolean;
  setAttributesDropdownOpen: (open: boolean) => void;
  attributesDropdownRef: React.RefObject<HTMLDivElement>;
  categoriesExpanded: boolean;
  setCategoriesExpanded: (expanded: boolean) => void;
}

export function useProductDataLoading({
  isLoggedIn,
  isAdmin,
  isLoading,
  setCategories,
  setAttributes,
  setDefaultCurrency,
  attributesDropdownOpen,
  setAttributesDropdownOpen,
  attributesDropdownRef,
  categoriesExpanded,
  setCategoriesExpanded,
}: UseProductDataLoadingProps) {
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (!isLoggedIn || !isAdmin) {
        router.push('/supersudo');
        return;
      }
    }
  }, [isLoggedIn, isAdmin, isLoading, router]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (attributesDropdownRef.current && !attributesDropdownRef.current.contains(event.target as Node)) {
        setAttributesDropdownOpen(false);
      }
    };

    if (attributesDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [attributesDropdownOpen, attributesDropdownRef, setAttributesDropdownOpen]);

  useEffect(() => {
    if (!isLoggedIn || !isAdmin) {
      return;
    }

    const loadDefaultCurrency = async () => {
      try {
        const settingsRes = await fetchAdminListCached(
          ADMIN_LIST_CACHE_KEYS.settings,
          () => apiClient.get<{ defaultCurrency?: string }>('/api/v1/admin/settings'),
        );
        const currency = (settingsRes.defaultCurrency || 'AMD') as CurrencyCode;
        if (currency in CURRENCIES) {
          setDefaultCurrency(currency);
          logger.debug('✅ [ADMIN] Default currency loaded:', currency);
        }
      } catch (err) {
        console.error('❌ [ADMIN] Error loading default currency:', err);
        setDefaultCurrency('AMD');
      }
    };

    void loadDefaultCurrency();
  }, [isLoggedIn, isAdmin, setDefaultCurrency]);

  useEffect(() => {
    if (!isLoggedIn || !isAdmin) {
      return;
    }

    const fetchData = async () => {
      try {
        logger.debug('📥 [ADMIN] Fetching categories and attributes...');
        const [categoriesRes, attributesRes] = await Promise.all([
          fetchAdminListCached(
            ADMIN_LIST_CACHE_KEYS.categories,
            () => apiClient.get<{ data: Category[] }>('/api/v1/admin/categories'),
          ),
          fetchAdminListCached(
            ADMIN_LIST_CACHE_KEYS.attributes,
            () => apiClient.get<{ data: Attribute[] }>('/api/v1/admin/attributes'),
          ),
        ]);
        setCategories(categoriesRes.data || []);
        setAttributes(attributesRes.data || []);
        logger.debug('✅ [ADMIN] Data fetched:', {
          categories: categoriesRes.data?.length || 0,
          attributes: attributesRes.data?.length || 0,
        });
      } catch (err: unknown) {
        console.error('❌ [ADMIN] Error fetching data:', err);
      }
    };
    void fetchData();
  }, [isLoggedIn, isAdmin, setCategories, setAttributes]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (categoriesExpanded && !target.closest('[data-category-dropdown]')) {
        setCategoriesExpanded(false);
      }
    };

    if (categoriesExpanded) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [categoriesExpanded, setCategoriesExpanded]);
}
