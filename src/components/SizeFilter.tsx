'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card } from '@shop/ui';
import { useTranslation } from '../lib/i18n-client';
import { useProductsFilters } from './ProductsFiltersProvider';

interface SizeFilterProps {
  category?: string;
  search?: string;
  minPrice?: string;
  maxPrice?: string;
  selectedSizes?: string[];
}

export function SizeFilter({ selectedSizes = [] }: SizeFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const filtersContext = useProductsFilters();
  const { t } = useTranslation();
  const [selected, setSelected] = useState<string[]>(selectedSizes);

  const sizes = filtersContext?.data.sizes ?? [];

  useEffect(() => {
    setSelected(selectedSizes);
  }, [selectedSizes]);

  const handleSizeToggle = (sizeValue: string) => {
    const newSelected = selected.includes(sizeValue)
      ? selected.filter((s) => s !== sizeValue)
      : [...selected, sizeValue];

    setSelected(newSelected);
    applyFilters(newSelected);
  };

  const applyFilters = (sizesToApply: string[]) => {
    const params = new URLSearchParams(searchParams.toString());

    if (sizesToApply.length > 0) {
      params.set('sizes', sizesToApply.join(','));
    } else {
      params.delete('sizes');
    }

    params.delete('page');
    router.push(`/products?${params.toString()}`);
  };

  if (!filtersContext) {
    return null;
  }

  return (
    <Card className="p-4 mb-6">
      <h3 className="text-base font-bold text-gray-800 mb-4 uppercase tracking-wide">
        {t('products.filters.size.title')}
      </h3>
      {sizes.length === 0 ? (
        <div className="text-sm text-gray-500 py-4 text-center">
          {t('products.filters.size.noSizes')}
        </div>
      ) : (
        <div className="flex flex-wrap gap-2">
          {sizes.map((size) => {
            const isSelected = selected.includes(size.value);

            return (
              <button
                key={size.value}
                type="button"
                onClick={() => handleSizeToggle(size.value)}
                aria-pressed={isSelected}
                className={`px-3 py-1.5 text-sm rounded-lg border transition-colors ${
                  isSelected
                    ? 'bg-blue-50 border-blue-300 text-blue-900 font-medium'
                    : 'bg-white border-gray-300 text-gray-700 hover:border-gray-400'
                }`}
              >
                {size.value}
                <span className="ml-1 text-xs text-gray-500">({size.count})</span>
              </button>
            );
          })}
        </div>
      )}
    </Card>
  );
}
