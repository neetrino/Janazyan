'use client';

import { useEffect, useMemo, useState } from 'react';
import { ProductCard } from './ProductCard';
import { useTranslation } from '../lib/i18n-client';

/** Number of leading cards eagerly loaded (above-the-fold first row). */
const PRIORITY_CARD_COUNT = 4;

interface Product {
  id: string;
  slug: string;
  title: string;
  price: number;
  compareAtPrice: number | null;
  image: string | null;
  inStock: boolean;
  brand: {
    id: string;
    name: string;
  } | null;
  defaultVariantId?: string | null;
}

type ViewMode = 'list' | 'grid-2' | 'grid-3';

interface ProductsGridProps {
  products: Product[];
  sortBy?: string;
}

export function ProductsGrid({ products, sortBy = 'default' }: ProductsGridProps) {
  const { t } = useTranslation();
  const [viewMode, setViewMode] = useState<ViewMode>('grid-3');

  // Load view mode from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('products-view-mode');
    if (stored && ['list', 'grid-2', 'grid-3'].includes(stored)) {
      setViewMode(stored as ViewMode);
    } else {
      setViewMode('grid-3');
      localStorage.setItem('products-view-mode', 'grid-3');
    }
  }, []);

  // Listen for view mode changes
  useEffect(() => {
    const handleViewModeChange = (_event: CustomEvent) => {
      setViewMode((_event as CustomEvent).detail);
    };

    window.addEventListener('view-mode-changed', handleViewModeChange as (_event: Event) => void);
    return () => {
      window.removeEventListener('view-mode-changed', handleViewModeChange as (_event: Event) => void);
    };
  }, []);

  // Derive sorted list during render (no extra post-hydration re-render).
  const sortedProducts = useMemo(() => {
    const sorted = [...products];
    switch (sortBy) {
      case 'price-asc':
        return sorted.sort((a, b) => a.price - b.price);
      case 'price-desc':
        return sorted.sort((a, b) => b.price - a.price);
      case 'name-asc':
        return sorted.sort((a, b) => a.title.localeCompare(b.title));
      case 'name-desc':
        return sorted.sort((a, b) => b.title.localeCompare(a.title));
      default:
        return sorted;
    }
  }, [products, sortBy]);

  const getGridClasses = () => {
    switch (viewMode) {
      case 'list':
        return 'flex flex-col items-center gap-10';
      case 'grid-2':
        return 'grid w-full grid-cols-1 justify-items-center gap-x-6 gap-y-10 sm:grid-cols-2';
      case 'grid-3':
        return 'grid w-full grid-cols-2 justify-items-center gap-x-6 gap-y-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4';
      default:
        return 'grid w-full grid-cols-2 justify-items-center gap-x-6 gap-y-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4';
    }
  };

  if (sortedProducts.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">{t('products.grid.noProducts')}</p>
      </div>
    );
  }

  return (
    <div className={getGridClasses()}>
      {sortedProducts.map((product, index) => (
        <ProductCard 
          key={product.id} 
          product={{
            ...product,
            compareAtPrice: product.compareAtPrice ?? undefined
          }} 
          viewMode={viewMode} 
          priority={index < PRIORITY_CARD_COUNT}
        />
      ))}
    </div>
  );
}

