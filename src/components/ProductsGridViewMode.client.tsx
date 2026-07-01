'use client';

import { useEffect, useState, type ReactNode } from 'react';

type ViewMode = 'list' | 'grid-2' | 'grid-3';

type ProductsGridViewModeProps = {
  children: ReactNode;
};

const DEFAULT_VIEW_MODE: ViewMode = 'grid-3';
const VIEW_MODE_STORAGE_KEY = 'products-view-mode';
const VALID_VIEW_MODES = new Set<ViewMode>(['list', 'grid-2', 'grid-3']);

function getGridClasses(viewMode: ViewMode): string {
  const mobileGridGap = 'gap-x-1 gap-y-4 lg:gap-x-6 lg:gap-y-10';

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
}

function parseViewMode(value: string | null): ViewMode | null {
  return value && VALID_VIEW_MODES.has(value as ViewMode) ? (value as ViewMode) : null;
}

export function ProductsGridViewMode({ children }: ProductsGridViewModeProps) {
  const [viewMode, setViewMode] = useState<ViewMode>(DEFAULT_VIEW_MODE);

  useEffect(() => {
    const stored = parseViewMode(localStorage.getItem(VIEW_MODE_STORAGE_KEY));
    if (stored) {
      setViewMode(stored);
    }
  }, []);

  useEffect(() => {
    const handleViewModeChange = (event: Event) => {
      const nextViewMode = parseViewMode((event as CustomEvent<unknown>).detail as string);
      if (nextViewMode) {
        setViewMode(nextViewMode);
      }
    };

    window.addEventListener('view-mode-changed', handleViewModeChange);
    return () => {
      window.removeEventListener('view-mode-changed', handleViewModeChange);
    };
  }, []);

  return (
    <div className={getGridClasses(viewMode)} data-view-mode={viewMode}>
      {children}
    </div>
  );
}
