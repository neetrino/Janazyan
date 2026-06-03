'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, Input } from '@shop/ui';
import { useTranslation } from '../lib/i18n-client';
import { useProductsFilters } from './ProductsFiltersProvider';

interface BrandFilterProps {
  category?: string;
  search?: string;
  minPrice?: string;
  maxPrice?: string;
  selectedBrands?: string[];
}

export function BrandFilter({ selectedBrands = [] }: BrandFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const filtersContext = useProductsFilters();
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredBrands, setFilteredBrands] = useState(
    filtersContext?.data.brands ?? []
  );

  const brands = filtersContext?.data.brands ?? [];

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredBrands(brands);
    } else {
      const query = searchQuery.toLowerCase().trim();
      setFilteredBrands(brands.filter((brand) => brand.name.toLowerCase().includes(query)));
    }
  }, [searchQuery, brands]);

  const handleBrandSelect = (brandId: string) => {
    const params = new URLSearchParams(searchParams.toString());
    const currentBrands = selectedBrands || [];
    const newBrands = currentBrands.includes(brandId)
      ? currentBrands.filter((id) => id !== brandId)
      : [...currentBrands, brandId];
    if (newBrands.length > 0) {
      params.set('brand', newBrands.join(','));
    } else {
      params.delete('brand');
    }
    params.delete('page');
    router.push(`/products?${params.toString()}`);
  };

  if (!filtersContext || brands.length === 0) {
    return null;
  }

  return (
    <Card className="p-4 mb-6">
      <h3 className="text-base font-bold text-gray-800 mb-4 uppercase tracking-wide">
        {t('products.filters.brand.title')}
      </h3>

      <div className="mb-4 relative">
        <Input
          type="text"
          placeholder={t('products.filters.brand.searchPlaceholder')}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pr-10"
        />
        <svg
          className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>

      {filteredBrands.length > 0 ? (
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {filteredBrands.map((brand) => {
            const isSelected = selectedBrands.includes(brand.id);

            return (
              <button
                key={brand.id}
                onClick={() => handleBrandSelect(brand.id)}
                className={`w-full flex items-center justify-between py-2 px-3 rounded transition-all duration-200 group ${
                  isSelected
                    ? 'bg-blue-50 hover:bg-blue-100 border border-blue-200'
                    : 'hover:bg-gray-50 border border-transparent'
                }`}
              >
                <span
                  className={`text-sm transition-colors ${
                    isSelected
                      ? 'text-blue-900 font-medium'
                      : 'text-gray-900 group-hover:text-gray-700'
                  }`}
                >
                  {brand.name}
                </span>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full transition-colors ${
                    isSelected ? 'text-blue-700 bg-blue-100' : 'text-gray-500 bg-gray-100'
                  }`}
                >
                  {brand.count}
                </span>
              </button>
            );
          })}
        </div>
      ) : (
        <div className="text-sm text-gray-500 py-4 text-center">
          {t('products.filters.brand.noBrands')}
        </div>
      )}
    </Card>
  );
}
