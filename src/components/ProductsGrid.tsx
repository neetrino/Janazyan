'use client';

import { useEffect, useState } from 'react';
import { ProductCard } from './ProductCard';
import { useTranslation } from '../lib/i18n-client';

/** Number of leading cards eagerly loaded (above-the-fold first row). */
const PRIORITY_CARD_COUNT = 8;

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
  /** Pre-sorted on the server — avoids duplicate work after hydration. */
  products: Product[];
}

export function ProductsGrid({ products }: ProductsGridProps) {
  const { t } = useTranslation();
  const [viewMode, setViewMode] = useState<ViewMode>('grid-3');

  useEffect(() => {
    const stored = localStorage.getItem('products-view-mode');
    if (stored && ['list', 'grid-2', 'grid-3'].includes(stored)) {
      setViewMode(stored as ViewMode);
    }
  }, []);

  useEffect(() => {
    const handleViewModeChange = (_event: CustomEvent) => {
      setViewMode((_event as CustomEvent).detail);
    };

    window.addEventListener('view-mode-changed', handleViewModeChange as (_event: Event) => void);
    return () => {
      window.removeEventListener('view-mode-changed', handleViewModeChange as (_event: Event) => void);
    };
  }, []);

  const getGridClasses = () => {
    const mobileGridGap = 'gap-x-1 gap-y-0 lg:gap-x-6 lg:gap-y-10';

    switch (viewMode) {
      case 'list':
        return 'flex flex-col items-center gap-10';
      case 'grid-2':
        return `grid w-full grid-cols-1 justify-items-center ${mobileGridGap} sm:grid-cols-2`;
      case 'grid-3':
        return `grid w-full grid-cols-2 justify-items-center ${mobileGridGap} sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4`;
      default:
        return `grid w-full grid-cols-2 justify-items-center ${mobileGridGap} sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4`;
    }
  };

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">{t('products.grid.noProducts')}</p>
      </div>
    );
  }

  return (
    <div className={getGridClasses()}>
      {products.map((product, index) => (
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

