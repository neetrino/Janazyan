'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card } from '@shop/ui';
import { getColorHex } from '../lib/colorMap';
import { useTranslation } from '../lib/i18n-client';
import { useProductsFilters } from './ProductsFiltersProvider';

interface ColorFilterProps {
  category?: string;
  search?: string;
  minPrice?: string;
  maxPrice?: string;
  selectedColors?: string[];
}

export function ColorFilter({
  selectedColors = [],
}: ColorFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const filtersContext = useProductsFilters();
  const { t } = useTranslation();
  const [selected, setSelected] = useState<string[]>(selectedColors);

  const colors = filtersContext?.data.colors ?? [];

  useEffect(() => {
    setSelected(selectedColors);
  }, [selectedColors]);

  const handleColorToggle = (colorValue: string) => {
    const newSelected = selected.includes(colorValue)
      ? selected.filter((c) => c !== colorValue)
      : [...selected, colorValue];

    setSelected(newSelected);
    applyFilters(newSelected);
  };

  const applyFilters = (colorsToApply: string[]) => {
    const params = new URLSearchParams(searchParams.toString());

    if (colorsToApply.length > 0) {
      params.set('colors', colorsToApply.join(','));
    } else {
      params.delete('colors');
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
        {t('products.filters.color.title')}
      </h3>
      {colors.length === 0 ? (
        <div className="text-sm text-gray-500 py-4 text-center">
          {t('products.filters.color.noColors')}
        </div>
      ) : (
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {colors.map((color) => {
            const isSelected = selected.includes(color.value);
            const colorHex =
              color.colors && Array.isArray(color.colors) && color.colors.length > 0
                ? color.colors[0]
                : getColorHex(color.label);
            const hasImage = color.imageUrl && color.imageUrl.trim() !== '';

            return (
              <button
                key={color.value}
                type="button"
                onClick={() => handleColorToggle(color.value)}
                aria-pressed={isSelected}
                className={`w-full flex items-center justify-between py-2 px-1 rounded transition-colors group ${
                  isSelected
                    ? 'bg-blue-50 hover:bg-blue-100 border border-blue-200'
                    : 'hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-4 h-4 rounded-full border flex-shrink-0 overflow-hidden ${
                      isSelected ? 'border-blue-500 border-2' : 'border-gray-300'
                    }`}
                    style={hasImage ? {} : { backgroundColor: colorHex }}
                    aria-label={color.label}
                  >
                    {hasImage ? (
                      <img
                        src={color.imageUrl!}
                        alt={color.label}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.backgroundColor = colorHex;
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                    ) : null}
                  </div>
                  <span
                    className={`text-sm group-hover:text-gray-700 ${
                      isSelected ? 'text-blue-900 font-medium' : 'text-gray-900'
                    }`}
                  >
                    {color.label}
                  </span>
                </div>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full ${
                    isSelected ? 'text-blue-700 bg-blue-100' : 'text-gray-500 bg-gray-100'
                  }`}
                >
                  {color.count}
                </span>
              </button>
            );
          })}
        </div>
      )}
    </Card>
  );
}
