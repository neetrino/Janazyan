'use client';

import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { PRODUCTS_PAGE_TOOLBAR_PILL_CLASS } from '../../app/products/products-page-layout.constants';
import { useTranslation } from '../../lib/i18n-client';

type ViewMode = 'list' | 'grid-2' | 'grid-3';
type SortOption = 'default' | 'price-asc' | 'price-desc' | 'name-asc' | 'name-desc';

const VIEW_MODE_ICONS: Record<ViewMode, { src: string; width: number; height: number }> = {
  list: { src: '/figma/shop-view-list-icon.svg', width: 28, height: 25 },
  'grid-2': { src: '/figma/shop-view-grid-2-icon.svg', width: 16, height: 25 },
  'grid-3': { src: '/figma/shop-view-grid-3-icon.svg', width: 26, height: 25 },
};

const VIEW_MODE_BUTTON_CLASS =
  'flex h-[25px] items-center justify-center rounded-md transition-opacity hover:opacity-80';

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
        className={`inline-flex h-[54px] w-[182px] items-center justify-center gap-7 bg-white ${PRODUCTS_PAGE_TOOLBAR_PILL_CLASS}`}
        role="group"
        aria-label={t('products.header.sortProducts')}
      >
        {(Object.keys(VIEW_MODE_ICONS) as ViewMode[]).map((mode) => {
          const icon = VIEW_MODE_ICONS[mode];
          const isSelected = viewMode === mode;

          return (
            <button
              key={mode}
              type="button"
              onClick={() => handleViewModeChange(mode)}
              className={`${VIEW_MODE_BUTTON_CLASS} ${isSelected ? 'opacity-100' : 'opacity-70'}`}
              aria-label={t(`products.header.viewModes.${mode === 'grid-2' ? 'grid2' : mode === 'grid-3' ? 'grid3' : 'list'}`)}
              aria-pressed={isSelected}
            >
              <Image
                src={icon.src}
                alt=""
                width={icon.width}
                height={icon.height}
                className="h-[25px] w-auto"
                aria-hidden
              />
            </button>
          );
        })}
      </div>

      <div className="relative" ref={sortDropdownRef}>
        <button
          type="button"
          onClick={() => setShowSortDropdown((open) => !open)}
          className={`inline-flex h-[54px] w-[231px] items-center justify-center gap-2 bg-sky-deep px-5 text-base font-normal text-white ${PRODUCTS_PAGE_TOOLBAR_PILL_CLASS}`}
        >
          <Image
            src="/figma/shop-sort-filter-icon.svg"
            alt=""
            width={16}
            height={18}
            className="h-[18px] w-4 shrink-0"
            aria-hidden
          />
          <span>{t('products.header.sortBy')}</span>
          <Image
            src="/figma/shop-sort-chevron.svg"
            alt=""
            width={8}
            height={15}
            className={`h-[15px] w-2 shrink-0 transition-transform ${showSortDropdown ? 'rotate-180' : ''}`}
            aria-hidden
          />
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
