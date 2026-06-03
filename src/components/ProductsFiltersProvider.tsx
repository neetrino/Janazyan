'use client';

import {
  createContext,
  useContext,
  useMemo,
  type ReactNode,
} from 'react';

export interface ColorOption {
  value: string;
  label: string;
  count: number;
  imageUrl?: string | null;
  colors?: string[] | null;
}

export interface SizeOption {
  value: string;
  count: number;
}

export interface BrandOption {
  id: string;
  name: string;
  count: number;
}

export interface PriceRangeOption {
  min: number;
  max: number;
  stepSize?: number | null;
  stepSizePerCurrency?: Record<string, number> | null;
}

export interface ProductsFiltersData {
  colors: ColorOption[];
  sizes: SizeOption[];
  brands: BrandOption[];
  priceRange: PriceRangeOption;
}

interface ProductsFiltersContextValue {
  data: ProductsFiltersData;
}

const ProductsFiltersContext = createContext<ProductsFiltersContextValue | null>(null);

interface ProductsFiltersProviderProps {
  data: ProductsFiltersData;
  children: ReactNode;
}

/**
 * Supplies server-fetched filter aggregates to catalog filter controls (no client API fetch).
 */
export function ProductsFiltersProvider({ data, children }: ProductsFiltersProviderProps) {
  const value = useMemo(() => ({ data }), [data]);

  return (
    <ProductsFiltersContext.Provider value={value}>
      {children}
    </ProductsFiltersContext.Provider>
  );
}

export function useProductsFilters(): ProductsFiltersContextValue | null {
  return useContext(ProductsFiltersContext);
}
