'use client';

import { Search } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';
import { SearchDropdown } from '../SearchDropdown';
import {
  SEARCH_DROPDOWN_DESKTOP_PANEL_WIDTH_CLASS,
} from '../search-dropdown.constants';
import { useInstantSearch, type InstantSearchResultItem } from '../hooks/useInstantSearch';
import { useTranslation } from '../../lib/i18n-hooks';
import { getStoredLanguage, type LanguageCode } from '../../lib/language';
import { primeProductPageSnapshot } from '@/lib/products/product-page-snapshot';

export function HeaderProductSearch() {
  const router = useRouter();
  const { t } = useTranslation();
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [lang, setLang] = useState<LanguageCode>('hy');
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  useEffect(() => {
    const syncLang = () => setLang(getStoredLanguage());
    syncLang();
    window.addEventListener('language-updated', syncLang);
    return () => window.removeEventListener('language-updated', syncLang);
  }, []);

  const {
    query,
    setQuery,
    results,
    loading,
    error,
    isOpen,
    setIsOpen,
    selectedIndex,
    handleKeyDown,
    clearSearch,
  } = useInstantSearch({ lang });

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setIsPopupOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [setIsOpen]);

  useEffect(() => {
    if (!isPopupOpen) {
      return;
    }
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
        setIsPopupOpen(false);
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isPopupOpen, setIsOpen]);

  useEffect(() => {
    if (!isPopupOpen) {
      return;
    }
    searchInputRef.current?.focus();
  }, [isPopupOpen]);

  const handleResultClick = useCallback(
    (result: InstantSearchResultItem) => {
      clearSearch();
      setIsPopupOpen(false);
      primeProductPageSnapshot({
        slug: result.slug,
        title: result.title,
        image: result.image,
        price: result.price,
        originalPrice: result.compareAtPrice,
        compareAtPrice: result.compareAtPrice,
        discountPercent: null,
      });
      router.push(`/products/${result.slug}`);
    },
    [clearSearch, router],
  );

  const handleSearchKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    handleKeyDown(event);
    if (event.key !== 'Enter') {
      return;
    }

    event.preventDefault();
    const trimmed = query.trim();

    if (selectedIndex >= 0 && results[selectedIndex]) {
      handleResultClick(results[selectedIndex]);
      return;
    }

    router.push(trimmed ? `/products?search=${encodeURIComponent(trimmed)}` : '/products');
    clearSearch();
    setIsPopupOpen(false);
  };

  return (
    <div ref={searchContainerRef} className="relative flex items-center">
      <button
        type="button"
        aria-label={t('common.ariaLabels.searchPlaceholder')}
        aria-expanded={isPopupOpen}
        onClick={() => {
          setIsPopupOpen((prev) => !prev);
          setIsOpen(false);
        }}
        className="relative grid h-10 w-10 place-items-center rounded-full transition-opacity hover:opacity-80"
      >
        <Search className="h-[22px] w-[22px] text-ink-800" strokeWidth={2.2} />
      </button>

      {isPopupOpen ? (
        <div className={`absolute right-0 top-full z-[70] mt-2 ${SEARCH_DROPDOWN_DESKTOP_PANEL_WIDTH_CLASS} rounded-[24px] border border-white/70 bg-sky/25 p-2 shadow-[0_10px_30px_rgba(30,41,57,0.14)] backdrop-blur-md`}>
          <label htmlFor="header-product-search" className="sr-only">
            {t('common.ariaLabels.searchPlaceholder')}
          </label>
          <Search
            className="pointer-events-none absolute left-5 top-[26px] h-[18px] w-[18px] text-ink-500"
            aria-hidden
          />
          <input
            ref={searchInputRef}
            id="header-product-search"
            type="search"
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setIsOpen(true);
            }}
            onFocus={() => {
              if (query.trim().length > 0) {
                setIsOpen(true);
              }
            }}
            onKeyDown={handleSearchKeyDown}
            placeholder={t('common.ariaLabels.searchPlaceholder')}
            autoComplete="off"
            enterKeyHint="search"
            className="h-11 w-full rounded-full border border-white/70 bg-white/65 py-0 pl-11 pr-4 text-sm text-ink-800 placeholder:text-ink-400 focus:outline-none focus:ring-2 focus:ring-sky/60"
          />
          <SearchDropdown
            results={results}
            loading={loading}
            error={error}
            isOpen={isOpen}
            selectedIndex={selectedIndex}
            query={query}
            onResultClick={handleResultClick}
            onClose={() => setIsOpen(false)}
            className="mt-2"
          />
        </div>
      ) : null}
    </div>
  );
}
