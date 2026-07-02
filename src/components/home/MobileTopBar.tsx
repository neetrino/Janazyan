'use client';

import { Globe, Phone, Search } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';
import { getSupportPhoneTelHref } from '../../app/orders/[number]/constants/support-phone';
import { useTranslation } from '../../lib/i18n-client';
import {
  LANGUAGES,
  type LanguageCode,
  getStoredLanguage,
  setStoredLanguage,
} from '../../lib/language';
import { SearchDropdown } from '../SearchDropdown';
import {
  useInstantSearch,
  type InstantSearchResultItem,
} from '../hooks/useInstantSearch';
import { primeProductPageSnapshot } from '@/lib/products/product-page-snapshot';

const LANGUAGE_MENU_Z_INDEX = 50;
const MOBILE_TOP_BAR_LOGO_SRC = '/figma/header-logo.webp';
const MOBILE_TOP_BAR_LOGO_WIDTH_PX = 55;
const MOBILE_TOP_BAR_LOGO_HEIGHT_PX = 44;

export function MobileTopBar() {
  const { t } = useTranslation();
  const router = useRouter();
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const [lang, setLang] = useState<LanguageCode>('hy');

  useEffect(() => {
    setLang(getStoredLanguage());
    const handleLanguageUpdate = () => setLang(getStoredLanguage());
    window.addEventListener('language-updated', handleLanguageUpdate);
    return () => window.removeEventListener('language-updated', handleLanguageUpdate);
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
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [setIsOpen]);

  const handleResultClick = useCallback(
    (result: InstantSearchResultItem) => {
      clearSearch();
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

    if (trimmed) {
      router.push(`/products?search=${encodeURIComponent(trimmed)}`);
      clearSearch();
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Link
        href="/"
        aria-label={t('common.navigation.home')}
        className="flex h-12 w-[55px] shrink-0 items-center justify-center"
      >
        <span
          className="relative block overflow-hidden"
          style={{
            width: MOBILE_TOP_BAR_LOGO_WIDTH_PX,
            height: MOBILE_TOP_BAR_LOGO_HEIGHT_PX,
          }}
        >
          <img
            src={MOBILE_TOP_BAR_LOGO_SRC}
            alt="Janazyan"
            className="absolute h-[213.14%] left-[-31.71%] max-w-none top-[-53.44%] w-[170.73%]"
          />
        </span>
      </Link>

      <div ref={searchContainerRef} className="relative flex h-12 flex-1 items-center">
        <label htmlFor="mobile-home-search" className="sr-only">
          {t('home.mobile.aria.search')}
        </label>
        <Search className="pointer-events-none absolute left-4 h-5 w-5 text-ink-500" aria-hidden />
        <input
          id="mobile-home-search"
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
          className="h-12 w-full rounded-full bg-white py-0 pl-11 pr-4 text-sm text-ink-800 shadow-[0_4px_18px_rgba(30,41,57,0.08)] placeholder:text-ink-400 focus:outline-none focus:ring-2 focus:ring-sky/60"
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
        />
      </div>

      <a
        href={getSupportPhoneTelHref()}
        aria-label={t('home.mobile.aria.call')}
        className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-sky text-ink-500"
      >
        <Phone className="h-5 w-5" />
      </a>

      <MobileLanguageButton label={t('home.mobile.aria.language')} />
    </div>
  );
}

function MobileLanguageButton({ label }: { label: string }) {
  const [showMenu, setShowMenu] = useState(false);
  const [currentLang, setCurrentLang] = useState<LanguageCode>('hy');
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setCurrentLang(getStoredLanguage());

    const handleLanguageUpdate = () => {
      setCurrentLang(getStoredLanguage());
    };

    window.addEventListener('language-updated', handleLanguageUpdate);
    return () => window.removeEventListener('language-updated', handleLanguageUpdate);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const changeLanguage = (langCode: LanguageCode) => {
    if (currentLang === langCode) {
      setShowMenu(false);
      return;
    }

    setShowMenu(false);
    setCurrentLang(langCode);
    setStoredLanguage(langCode);
  };

  return (
    <div className="relative shrink-0" ref={menuRef}>
      <button
        type="button"
        aria-label={label}
        aria-expanded={showMenu}
        onClick={() => setShowMenu((open) => !open)}
        className="grid h-12 w-12 place-items-center rounded-full bg-sky text-ink-500"
      >
        <Globe className="h-5 w-5" />
      </button>

      {showMenu && (
        <div
          className="absolute right-0 top-full z-[50] mt-2 w-44 overflow-hidden rounded-2xl border border-white/80 bg-white shadow-[0_8px_24px_rgba(30,41,57,0.12)]"
          style={{ zIndex: LANGUAGE_MENU_Z_INDEX }}
        >
          {Object.values(LANGUAGES).map((language) => {
              const isActive = currentLang === language.code;

              return (
                <button
                  key={language.code}
                  type="button"
                  disabled={isActive}
                  onClick={() => changeLanguage(language.code)}
                  className={`flex w-full items-center justify-between px-4 py-3 text-left text-sm transition-colors ${
                    isActive
                      ? 'cursor-default bg-sky/40 font-semibold text-ink-900'
                      : 'text-ink-700 hover:bg-sky/20'
                  }`}
                >
                  <span>{language.nativeName}</span>
                  <span className="text-xs uppercase text-ink-500">{language.code}</span>
                </button>
              );
            })}
        </div>
      )}
    </div>
  );
}
