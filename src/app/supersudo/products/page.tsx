'use client';

import { useEffect, useState, useMemo, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../lib/auth/AuthContext';
import { apiClient } from '../../../lib/api-client';
import { useTranslation } from '../../../lib/i18n-client';
import { getStoredCurrency, initializeCurrencyRates, type CurrencyCode } from '../../../lib/currency';
import { ProductBulkSelectionBar } from './components/ProductBulkSelectionBar';
import { ProductFilters } from './components/ProductFilters';
import { ProductsTable } from './components/ProductsTable';
import { useProductHandlers } from './hooks/useProductHandlers';
import type { Product, ProductsResponse, Category } from './types';
import { logger } from "@/lib/utils/logger";
import {
  ADMIN_LIST_CACHE_KEYS,
  buildAdminProductsCacheKey,
  fetchAdminListCached,
} from '@/lib/admin/admin-list-client-cache';

export default function ProductsPage() {
  const { t } = useTranslation();
  const { isLoggedIn, isAdmin, isLoading } = useAuth();
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchInput, setSearchInput] = useState('');
  const [appliedSearch, setAppliedSearch] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<Set<string>>(new Set());
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [categoriesExpanded, setCategoriesExpanded] = useState(false);
  const [skuInput, setSkuInput] = useState('');
  const [appliedSku, setAppliedSku] = useState('');
  const [stockFilter, setStockFilter] = useState<'all' | 'inStock' | 'outOfStock'>('all');
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState<ProductsResponse['meta'] | null>(null);
  const [sortBy, setSortBy] = useState<string>('createdAt-desc');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [bulkDeleting, setBulkDeleting] = useState(false);
  const [togglingAllFeatured, setTogglingAllFeatured] = useState(false);
  const [currency, setCurrency] = useState<CurrencyCode>('USD');

  useEffect(() => {
    if (!isLoading) {
      if (!isLoggedIn || !isAdmin) {
        router.push('/supersudo');
        return;
      }
    }
  }, [isLoggedIn, isAdmin, isLoading, router]);

  // Initialize currency rates and listen for currency changes
  useEffect(() => {
    const updateCurrency = () => {
      const newCurrency = getStoredCurrency();
      logger.debug('💱 [ADMIN PRODUCTS] Currency updated to:', newCurrency);
      setCurrency(newCurrency);
    };
    
    // Initialize currency rates
    initializeCurrencyRates().catch(console.error);
    
    // Load currency on mount
    updateCurrency();
    
    // Listen for currency changes
    if (typeof window !== 'undefined') {
      window.addEventListener('currency-updated', updateCurrency);
      const handleCurrencyRatesUpdate = () => {
        logger.debug('💱 [ADMIN PRODUCTS] Currency rates updated, refreshing currency...');
        updateCurrency();
      };
      window.addEventListener('currency-rates-updated', handleCurrencyRatesUpdate);
      
      return () => {
        window.removeEventListener('currency-updated', updateCurrency);
        window.removeEventListener('currency-rates-updated', handleCurrencyRatesUpdate);
      };
    }
  }, []);

  // Fetch categories on mount
  useEffect(() => {
    if (isLoggedIn && isAdmin) {
      fetchCategories();
    }
  }, [isLoggedIn, isAdmin]);

  // Close category dropdown when clicking outside
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
  }, [categoriesExpanded]);

  const fetchCategories = async () => {
    try {
      setCategoriesLoading(true);
      logger.debug('📂 [ADMIN] Fetching categories...');
      const response = await fetchAdminListCached(
        ADMIN_LIST_CACHE_KEYS.categories,
        () => apiClient.get<{ data: Category[] }>('/api/v1/admin/categories'),
      );
      setCategories(response.data || []);
      logger.debug('✅ [ADMIN] Categories loaded:', response.data?.length || 0);
    } catch (err: any) {
      console.error('❌ [ADMIN] Error fetching categories:', err);
      setCategories([]);
    } finally {
      setCategoriesLoading(false);
    }
  };

  /** Only `createdAt-*` is applied on the server; other sorts are client-only (avoids refetch on every header click). */
  const sortParamForApi = sortBy.startsWith('createdAt') ? sortBy : '';
  const categoryFilterKey = [...selectedCategories].sort().join(',');

  useEffect(() => {
    if (isLoggedIn && isAdmin) {
      void fetchProducts();
    }
  }, [
    isLoggedIn,
    isAdmin,
    page,
    appliedSearch,
    categoryFilterKey,
    appliedSku,
    stockFilter,
    sortParamForApi,
  ]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params: Record<string, string> = {
        page: page.toString(),
        limit: '20',
      };
      
      if (appliedSearch.trim()) {
        params.search = appliedSearch.trim();
      }

      if (selectedCategories.size > 0) {
        params.category = Array.from(selectedCategories).join(',');
      }

      if (appliedSku.trim()) {
        params.sku = appliedSku.trim();
      }

      if (sortBy && sortBy.startsWith('createdAt')) {
        params.sort = sortBy;
      }

      const response = await fetchAdminListCached(
        buildAdminProductsCacheKey(params),
        () => apiClient.get<ProductsResponse>('/api/v1/admin/products', { params }),
      );
      
      let filteredProducts = response.data || [];

      // Stock filter (client-side)
      if (stockFilter !== 'all') {
        filteredProducts = filteredProducts.filter(product => {
          const getTotalStock = (p: Product) => {
            if (p.colorStocks && p.colorStocks.length > 0) {
              return p.colorStocks.reduce((sum, cs) => sum + (cs.stock || 0), 0);
            }
            return p.stock ?? 0;
          };
          const totalStock = getTotalStock(product);
          if (stockFilter === 'inStock') {
            return totalStock > 0;
          } else if (stockFilter === 'outOfStock') {
            return totalStock === 0;
          }
          return true;
        });
      }

      setProducts(filteredProducts);
      setMeta(response.meta || null);
    } catch (err: any) {
      console.error('❌ [ADMIN] Error fetching products:', err);
      alert(t('admin.products.errorLoading').replace('{message}', err.message || t('admin.common.unknownErrorFallback')));
    } finally {
      setLoading(false);
    }
  };

  // Client-side sorting for Product / Price / Stock columns
  const sortedProducts = useMemo(() => {
    if (!Array.isArray(products)) return [];

    if (!sortBy || sortBy.startsWith('createdAt')) {
      return products;
    }

    const [field, directionRaw] = sortBy.split('-');
    const direction = directionRaw === 'asc' ? 1 : -1;

    logger.debug('📊 [ADMIN] Applying client-side sort:', { field, direction: directionRaw });

    const cloned = [...products];

    if (field === 'price') {
      cloned.sort((a, b) => {
        const aPrice = a.price ?? 0;
        const bPrice = b.price ?? 0;
        if (aPrice === bPrice) return 0;
        return aPrice > bPrice ? direction : -direction;
      });
    } else if (field === 'title') {
      cloned.sort((a, b) => {
        const aTitle = (a.title || '').toLowerCase();
        const bTitle = (b.title || '').toLowerCase();
        if (aTitle === bTitle) return 0;
        return aTitle > bTitle ? direction : -direction;
      });
    } else if (field === 'stock') {
      cloned.sort((a, b) => {
        const getTotalStock = (product: Product) => {
          if (product.colorStocks && product.colorStocks.length > 0) {
            return product.colorStocks.reduce((sum, cs) => sum + (cs.stock || 0), 0);
          }
          return product.stock ?? 0;
        };
        const aStock = getTotalStock(a);
        const bStock = getTotalStock(b);
        if (aStock === bStock) return 0;
        return aStock > bStock ? direction : -direction;
      });
    }

    return cloned;
  }, [products, sortBy]);

  const handleHeaderSort = (field: 'price' | 'createdAt' | 'title' | 'stock') => {
    setPage(1);

    setSortBy((current) => {
      let next = current;

      if (field === 'price') {
        if (current === 'price-asc') {
          next = 'price-desc';
        } else {
          next = 'price-asc';
        }
      }

      if (field === 'createdAt') {
        if (current === 'createdAt-asc') {
          next = 'createdAt-desc';
        } else {
          next = 'createdAt-asc';
        }
      }

      if (field === 'title') {
        if (current === 'title-asc') {
          next = 'title-desc';
        } else {
          next = 'title-asc';
        }
      }

      if (field === 'stock') {
        if (current === 'stock-asc') {
          next = 'stock-desc';
        } else {
          next = 'stock-asc';
        }
      }

      logger.debug('📊 [ADMIN] Sort changed from', current, 'to', next, 'by header click');
      return next;
    });
  };

  const applySearchFilters = () => {
    setAppliedSearch(searchInput.trim());
    setAppliedSku(skuInput.trim());
    setPage(1);
  };

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    applySearchFilters();
  };

  const handlers = useProductHandlers({
    products,
    setProducts,
    fetchProducts,
    selectedIds,
    setSelectedIds,
    setPage,
    setBulkDeleting,
    setTogglingAllFeatured,
  });

  const handleClearFilters = () => {
    setSearchInput('');
    setAppliedSearch('');
    setSkuInput('');
    setAppliedSku('');
    setSelectedCategories(new Set());
    setStockFilter('all');
    setPage(1);
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center py-12">
        <div className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-gray-900" />
          <p className="text-gray-600">{t('admin.common.loading')}</p>
        </div>
      </div>
    );
  }

  if (!isLoggedIn || !isAdmin) {
    return null;
  }

  const totalProductsCount = meta?.total ?? products.length;

  return (
    <>
      {(appliedSearch || selectedCategories.size > 0 || appliedSku || stockFilter !== 'all') && (
        <div className="mb-6 flex justify-end">
          <button
            type="button"
            onClick={handleClearFilters}
            className="text-sm text-gray-600 underline hover:text-gray-900"
          >
            {t('admin.products.clearAll')}
          </button>
        </div>
      )}
            <div className="mb-4 text-sm text-gray-700">
              {t('admin.products.totalProductsCount').replace('{count}', totalProductsCount.toString())}
            </div>

            <ProductFilters
              search={searchInput}
              setSearch={setSearchInput}
              skuSearch={skuInput}
              setSkuSearch={setSkuInput}
              selectedCategories={selectedCategories}
              setSelectedCategories={setSelectedCategories}
              categories={categories}
              categoriesLoading={categoriesLoading}
              categoriesExpanded={categoriesExpanded}
              setCategoriesExpanded={setCategoriesExpanded}
              stockFilter={stockFilter}
              setStockFilter={setStockFilter}
              handleSearch={handleSearch}
              setPage={setPage}
            />

            {/* Add New Product Button */}
            <div className="mb-6">
              <button
                onClick={() => router.push('/supersudo/products/add')}
                className="w-full px-4 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors flex items-center justify-center gap-2 font-medium text-sm"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                {t('admin.products.addNewProduct')}
              </button>
            </div>

            <ProductBulkSelectionBar
              selectedCount={selectedIds.size}
              onBulkDelete={handlers.handleBulkDelete}
              bulkDeleting={bulkDeleting}
            />

            {/* Products Table */}
            <ProductsTable
              loading={loading}
              sortedProducts={sortedProducts}
              products={products}
              selectedIds={selectedIds}
              toggleSelect={handlers.toggleSelect}
              toggleSelectAll={handlers.toggleSelectAll}
              sortBy={sortBy}
              handleHeaderSort={handleHeaderSort}
              currency={currency}
              handleDeleteProduct={handlers.handleDeleteProduct}
              handleDuplicateProduct={handlers.handleDuplicateProduct}
              duplicatingProductId={handlers.duplicatingProductId}
              handleTogglePublished={handlers.handleTogglePublished}
              handleToggleFeatured={handlers.handleToggleFeatured}
              meta={meta}
              page={page}
              setPage={setPage}
            />
    </>
  );
}
