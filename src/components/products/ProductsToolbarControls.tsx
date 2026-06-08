'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { PRODUCTS_PAGE_TOOLBAR_PILL_CLASS } from '../../app/products/products-page-layout.constants';
import { useTranslation } from '../../lib/i18n-client';

type ViewMode = 'list' | 'grid-2' | 'grid-3';
type SortOption = 'default' | 'price-asc' | 'price-desc' | 'name-asc' | 'name-desc';

function SortFilterIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
      <path
        d="M3 5H17M5 10H15M7 15H13"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

/**
 * View-mode toggles + sort dropdown — Figma shop toolbar (node 269:906 / 269:918).
 */
export function ProductsToolbarControls() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t } = useTranslation();
  const [viewMode, setViewMode] = useState<ViewMode>('grid-3');
  const [sortBy, setSortBy] = useState<SortOption>('default');
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const sortDropdownRef = useRef<HTMLDivElement>(null);

  const sortOptions: { value: SortOption; label: string }[] = [
    { value: 'default', label: t('products.header.sort.default') },
    { value: 'price-asc', label: t('products.header.sort.priceAsc') },
    { value: 'price-desc', label: t('products.header.sort.priceDesc') },
    { value: 'name-asc', label: t('products.header.sort.nameAsc') },
    { value: 'name-desc', label: t('products.header.sort.nameDesc') },
  ];

  useEffect(() => {
    const stored = localStorage.getItem('products-view-mode');
    if (stored && ['list', 'grid-2', 'grid-3'].includes(stored)) {
      setViewMode(stored as ViewMode);
    }
  }, []);

  useEffect(() => {
    const sortParam = searchParams.get('sort') as SortOption;
    if (sortParam && sortOptions.some((opt) => opt.value === sortParam)) {
      setSortBy(sortParam);
    }
  }, [searchParams]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!sortDropdownRef.current?.contains(event.target as Node)) {
        setShowSortDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleViewModeChange = (mode: ViewMode) => {
    setViewMode(mode);
    localStorage.setItem('products-view-mode', mode);
    window.dispatchEvent(new CustomEvent('view-mode-changed', { detail: mode }));
  };

  const handleSortChange = (option: SortOption) => {
    setSortBy(option);
    setShowSortDropdown(false);

    const params = new URLSearchParams(searchParams.toString());
    if (option === 'default') {
      params.delete('sort');
    } else {
      params.set('sort', option);
    }
    params.delete('page');
    router.push(`/products?${params.toString()}`);
  };

  return (
    <div className="flex shrink-0 items-center gap-[11px]">
      <div
        className={`inline-flex h-[54px] w-[182px] items-center justify-center gap-1 bg-white px-3 ${PRODUCTS_PAGE_TOOLBAR_PILL_CLASS}`}
      >
        <button
          type="button"
          onClick={() => handleViewModeChange('list')}
          className={`rounded-lg p-2 transition-colors ${
            viewMode === 'list' ? 'bg-gray-100 text-ink-900' : 'text-gray-400 hover:text-gray-600'
          }`}
          aria-label={t('products.header.viewModes.list')}
        >
          <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden>
            <line x1="3" y1="5" x2="17" y2="5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="3" y1="10" x2="17" y2="10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="3" y1="15" x2="17" y2="15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>
        <button
          type="button"
          onClick={() => handleViewModeChange('grid-2')}
          className={`rounded-lg p-2 transition-colors ${
            viewMode === 'grid-2' ? 'bg-gray-100 text-ink-900' : 'text-gray-400 hover:text-gray-600'
          }`}
          aria-label={t('products.header.viewModes.grid2')}
        >
          <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden>
            <rect x="2" y="2" width="7" height="7" stroke="currentColor" strokeWidth="1.5" fill={viewMode === 'grid-2' ? 'currentColor' : 'none'} />
            <rect x="11" y="2" width="7" height="7" stroke="currentColor" strokeWidth="1.5" fill={viewMode === 'grid-2' ? 'currentColor' : 'none'} />
            <rect x="2" y="11" width="7" height="7" stroke="currentColor" strokeWidth="1.5" fill={viewMode === 'grid-2' ? 'currentColor' : 'none'} />
            <rect x="11" y="11" width="7" height="7" stroke="currentColor" strokeWidth="1.5" fill={viewMode === 'grid-2' ? 'currentColor' : 'none'} />
          </svg>
        </button>
        <button
          type="button"
          onClick={() => handleViewModeChange('grid-3')}
          className={`rounded-lg p-2 transition-colors ${
            viewMode === 'grid-3' ? 'bg-gray-100 text-ink-900' : 'text-gray-400 hover:text-gray-600'
          }`}
          aria-label={t('products.header.viewModes.grid3')}
        >
          <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden>
            <circle cx="4" cy="4" r="1.5" fill="currentColor" />
            <circle cx="10" cy="4" r="1.5" fill="currentColor" />
            <circle cx="16" cy="4" r="1.5" fill="currentColor" />
            <circle cx="4" cy="10" r="1.5" fill="currentColor" />
            <circle cx="10" cy="10" r="1.5" fill="currentColor" />
            <circle cx="16" cy="10" r="1.5" fill="currentColor" />
            <circle cx="4" cy="16" r="1.5" fill="currentColor" />
            <circle cx="10" cy="16" r="1.5" fill="currentColor" />
            <circle cx="16" cy="16" r="1.5" fill="currentColor" />
          </svg>
        </button>
      </div>

      <div className="relative" ref={sortDropdownRef}>
        <button
          type="button"
          onClick={() => setShowSortDropdown((open) => !open)}
          className={`inline-flex h-[54px] w-[231px] items-center justify-center gap-2 bg-sky-deep px-5 text-base text-white ${PRODUCTS_PAGE_TOOLBAR_PILL_CLASS}`}
        >
          <SortFilterIcon />
          <span>{t('products.header.sortBy')}</span>
          <svg
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
            className={`transition-transform ${showSortDropdown ? 'rotate-180' : ''}`}
            aria-hidden
          >
            <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        {showSortDropdown ? (
          <div className="absolute top-full right-0 z-50 mt-2 w-56 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg">
            {sortOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => handleSortChange(option.value)}
                className={`w-full px-4 py-2.5 text-left text-sm transition-colors ${
                  sortBy === option.value
                    ? 'bg-gray-100 font-semibold text-gray-900'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}
