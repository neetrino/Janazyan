'use client';

import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import {
  PRODUCTS_PAGE_TOOLBAR_CONTROL_HEIGHT_CLASS,
  PRODUCTS_PAGE_TOOLBAR_PILL_RADIUS_CLASS,
} from '../../app/products/products-page-layout.constants';
import { useTranslation } from '../../lib/i18n-client';
import {
  STOREFRONT_PILL_INTERACTIVE_CLASS,
} from '../../lib/ui/storefront-interactive-button-classes';

type SortOption = 'default' | 'price-asc' | 'price-desc' | 'name-asc' | 'name-desc';

type DropdownPosition = {
  top: number;
  right: number;
};

const SORT_DROPDOWN_GAP_PX = 8;
const SORT_DROPDOWN_Z_INDEX = 100;

function useSortDropdownPosition(
  triggerRef: React.RefObject<HTMLButtonElement | null>,
  isOpen: boolean,
): DropdownPosition | null {
  const [position, setPosition] = useState<DropdownPosition | null>(null);

  const updatePosition = useCallback(() => {
    const trigger = triggerRef.current;
    if (!trigger) {
      return;
    }

    const rect = trigger.getBoundingClientRect();
    setPosition({
      top: rect.bottom + SORT_DROPDOWN_GAP_PX,
      right: window.innerWidth - rect.right,
    });
  }, [triggerRef]);

  useEffect(() => {
    if (!isOpen) {
      setPosition(null);
      return;
    }

    updatePosition();
    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition, true);

    return () => {
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition, true);
    };
  }, [isOpen, updatePosition]);

  return position;
}

/**
 * Sort dropdown — Figma shop toolbar (node 269:918).
 */
export function ProductsToolbarControls() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t } = useTranslation();
  const [sortBy, setSortBy] = useState<SortOption>('default');
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const sortTriggerRef = useRef<HTMLButtonElement>(null);
  const sortPanelRef = useRef<HTMLDivElement>(null);
  const dropdownPosition = useSortDropdownPosition(sortTriggerRef, showSortDropdown);

  const sortOptions: { value: SortOption; label: string }[] = [
    { value: 'default', label: t('products.header.sort.default') },
    { value: 'price-asc', label: t('products.header.sort.priceAsc') },
    { value: 'price-desc', label: t('products.header.sort.priceDesc') },
    { value: 'name-asc', label: t('products.header.sort.nameAsc') },
    { value: 'name-desc', label: t('products.header.sort.nameDesc') },
  ];

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const sortParam = searchParams.get('sort') as SortOption;
    if (sortParam && sortOptions.some((opt) => opt.value === sortParam)) {
      setSortBy(sortParam);
    }
  }, [searchParams]);

  useEffect(() => {
    if (!showSortDropdown) {
      return;
    }

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (sortTriggerRef.current?.contains(target) || sortPanelRef.current?.contains(target)) {
        return;
      }
      setShowSortDropdown(false);
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setShowSortDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [showSortDropdown]);

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

  const sortDropdownPanel =
    showSortDropdown && dropdownPosition ? (
      <div
        ref={sortPanelRef}
        role="listbox"
        aria-label={t('products.header.sortBy')}
        className="fixed w-56 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg"
        style={{
          top: dropdownPosition.top,
          right: dropdownPosition.right,
          zIndex: SORT_DROPDOWN_Z_INDEX,
        }}
      >
        {sortOptions.map((option) => (
          <button
            key={option.value}
            type="button"
            role="option"
            aria-selected={sortBy === option.value}
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
    ) : null;

  return (
    <div className="flex shrink-0 items-center">
      <div className="relative">
        <button
          ref={sortTriggerRef}
          type="button"
          onClick={() => setShowSortDropdown((open) => !open)}
          aria-expanded={showSortDropdown}
          aria-haspopup="listbox"
          className={`inline-flex ${PRODUCTS_PAGE_TOOLBAR_CONTROL_HEIGHT_CLASS} w-[231px] items-center justify-center gap-2 bg-sky-deep px-5 text-base font-normal text-white ${PRODUCTS_PAGE_TOOLBAR_PILL_RADIUS_CLASS} ${STOREFRONT_PILL_INTERACTIVE_CLASS}`}
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
            className={`h-[15px] w-2 shrink-0 transition-transform ${showSortDropdown ? 'rotate-90' : ''}`}
            aria-hidden
          />
        </button>
      </div>

      {isMounted && sortDropdownPanel ? createPortal(sortDropdownPanel, document.body) : null}
    </div>
  );
}
