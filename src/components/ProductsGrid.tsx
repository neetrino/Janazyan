'use client';

import { useEffect, useState } from 'react';
import { ProductCard } from './ProductCard';
import { useTranslation } from '../lib/i18n-client';

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
  const [sortedProducts, setSortedProducts] = useState<Product[]>(products);

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

  // Sort products
  useEffect(() => {
    const sorted = [...products];

    switch (sortBy) {
      case 'price-asc':
        sorted.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        sorted.sort((a, b) => b.price - a.price);
        break;
      case 'name-asc':
        sorted.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'name-desc':
        sorted.sort((a, b) => b.title.localeCompare(a.title));
        break;
      default:
        // Keep original order
        break;
    }

    setSortedProducts(sorted);
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
      {sortedProducts.map((product) => (
        <ProductCard 
          key={product.id} 
          product={{
            ...product,
            compareAtPrice: product.compareAtPrice ?? undefined
          }} 
          viewMode={viewMode} 
        />
      ))}
    </div>
  );
}

