'use client';

import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';
import { HeaderAccountMenu } from './HeaderAccountMenu';
import { HeaderProductSearch } from './HeaderProductSearch';
import {
  HEADER_ACTION_PROFILE_GAP_PX,
  HEADER_ACTIONS_PILL_HEIGHT_PX,
  HEADER_ACTIONS_PILL_PADDING_X_PX,
  HEADER_ACTIONS_PILL_PADDING_Y_PX,
  HEADER_PILL_BORDER_RADIUS_PX,
} from './header-shell-shape.constants';
import { openCartDrawer } from '../../lib/cart-drawer-events';
import { CURRENCIES, getStoredCurrency, setStoredCurrency, type CurrencyCode } from '../../lib/currency';
import {
  LANGUAGES,
  getStoredLanguage,
  setStoredLanguage,
  type LanguageCode,
} from '../../lib/language';
import { formatCartBadgeCount, useCartItemCount } from '../hooks/useCartItemCount';
import { formatWishlistBadgeCount, useWishlistItemCount } from '../hooks/useWishlistItemCount';

const HEADER_SELECTABLE_CURRENCIES: readonly CurrencyCode[] = ['AMD', 'USD', 'RUB'];

const HEADER_HEART_ICON = '/figma/header-actions-heart.svg';
const HEADER_CART_ICON = '/figma/header-actions-cart.svg';
const HEADER_LANGUAGE_ICON = '/figma/header-actions-language.svg';
const HEADER_CURRENCY_CHEVRON_ICON = '/figma/header-actions-chevron.svg';

function HeaderActionIcon({ src }: { src: string }) {
  return <img src={src} alt="" />;
}

function HeaderLanguageControl() {
  const [currentLang, setCurrentLang] = useState<LanguageCode>('hy');
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const syncLang = () => setCurrentLang(getStoredLanguage());
    syncLang();
    window.addEventListener('language-updated', syncLang);
    return () => window.removeEventListener('language-updated', syncLang);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const changeLanguage = useCallback(
    (langCode: LanguageCode) => {
      if (langCode === currentLang) {
        setMenuOpen(false);
        return;
      }
      setMenuOpen(false);
      setCurrentLang(langCode);
      setStoredLanguage(langCode);
    },
    [currentLang],
  );

  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        aria-label="Language"
        aria-expanded={menuOpen}
        onClick={() => setMenuOpen((open) => !open)}
        className="grid place-items-center rounded-full transition-opacity hover:opacity-80"
      >
        <img src={HEADER_LANGUAGE_ICON} alt="" />
      </button>
      {menuOpen ? (
        <div className="absolute right-0 top-full z-50 mt-2 min-w-[9rem] overflow-hidden rounded-xl bg-white shadow-card">
          {Object.values(LANGUAGES).map((lang) => {
              const isActive = currentLang === lang.code;
              return (
                <button
                  key={lang.code}
                  type="button"
                  disabled={isActive}
                  onClick={() => changeLanguage(lang.code)}
                  className={`flex w-full items-center justify-between px-4 py-2.5 text-left text-sm ${
                    isActive
                      ? 'cursor-default bg-sky/20 font-semibold text-ink-800'
                      : 'text-ink-600 hover:bg-gray-50'
                  }`}
                >
                  <span>{lang.nativeName}</span>
                  <span className="text-xs uppercase text-ink-400">{lang.code}</span>
                </button>
              );
            })}
        </div>
      ) : null}
    </div>
  );
}

function HeaderCurrencyControl() {
  const [currency, setCurrency] = useState<CurrencyCode>('AMD');
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const syncCurrency = useCallback(() => {
    const storedCurrency = getStoredCurrency();
    if (HEADER_SELECTABLE_CURRENCIES.includes(storedCurrency)) {
      setCurrency(storedCurrency);
      return;
    }

    setStoredCurrency('AMD');
    setCurrency('AMD');
  }, []);

  useEffect(() => {
    syncCurrency();
    window.addEventListener('currency-updated', syncCurrency);
    return () => window.removeEventListener('currency-updated', syncCurrency);
  }, [syncCurrency]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleCurrencySelect = (nextCurrency: CurrencyCode) => {
    setMenuOpen(false);
    if (nextCurrency === currency) {
      return;
    }

    setStoredCurrency(nextCurrency);
    setCurrency(nextCurrency);
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        aria-label="Currency"
        aria-expanded={menuOpen}
        onClick={() => setMenuOpen((open) => !open)}
        className="inline-flex items-center gap-2.5 text-[16px] font-medium leading-6 tracking-[-0.3125px] text-ink-500 transition-opacity hover:opacity-80"
      >
        {currency}
        <img src={HEADER_CURRENCY_CHEVRON_ICON} alt="" />
      </button>
      {menuOpen ? (
        <div className="absolute right-0 top-full z-50 mt-2 min-w-[9rem] overflow-hidden rounded-xl bg-white shadow-card">
          {HEADER_SELECTABLE_CURRENCIES.map((currencyCode) => {
            const isActive = currencyCode === currency;
            return (
              <button
                key={currencyCode}
                type="button"
                disabled={isActive}
                onClick={() => handleCurrencySelect(currencyCode)}
                className={`flex w-full items-center justify-between px-4 py-2.5 text-left text-sm ${
                  isActive
                    ? 'cursor-default bg-sky/20 font-semibold text-ink-800'
                    : 'text-ink-600 hover:bg-gray-50'
                }`}
              >
                <span>{currencyCode}</span>
                <span className="text-xs text-ink-400">{CURRENCIES[currencyCode].symbol}</span>
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}

export function HeaderStorefrontActions({
  isHomePage,
  pill = true,
}: {
  isHomePage: boolean;
  pill?: boolean;
}) {
  const wishlistCount = useWishlistItemCount();
  const wishlistBadgeLabel = formatWishlistBadgeCount(wishlistCount);
  const cartCount = useCartItemCount();
  const cartBadgeLabel = formatCartBadgeCount(cartCount);
  const shadowClassName = isHomePage
    ? 'shadow-soft'
    : 'shadow-[0_10px_26px_rgba(15,23,42,0.06)]';
  const surfaceClassName = pill
    ? `bg-white ${shadowClassName}`
    : 'bg-transparent shadow-none';

  return (
    <div
      className={`flex shrink-0 items-center transition-[background-color,box-shadow,border-radius] duration-300 ease-out ${surfaceClassName}`}
      style={{
        gap: HEADER_ACTION_PROFILE_GAP_PX,
        height: HEADER_ACTIONS_PILL_HEIGHT_PX,
        borderRadius: pill ? HEADER_PILL_BORDER_RADIUS_PX : 0,
        paddingLeft: HEADER_ACTIONS_PILL_PADDING_X_PX,
        paddingRight: HEADER_ACTIONS_PILL_PADDING_X_PX,
        paddingTop: HEADER_ACTIONS_PILL_PADDING_Y_PX,
        paddingBottom: HEADER_ACTIONS_PILL_PADDING_Y_PX,
      }}
    >
      <div className="flex items-center">
        <HeaderProductSearch />

        <Link
          href="/wishlist"
          aria-label={
            wishlistCount === 0
              ? 'Wishlist'
              : `Wishlist, ${wishlistCount} ${wishlistCount === 1 ? 'item' : 'items'}`
          }
          className="relative grid size-9 place-items-center rounded-full transition-opacity hover:opacity-80"
        >
          <HeaderActionIcon src={HEADER_HEART_ICON} />
          {wishlistCount > 0 ? (
            <span
              className="absolute left-5 top-0 grid h-4 min-w-4 place-items-center rounded-full bg-sky-deep px-0.5 text-[12px] font-medium leading-4 text-white"
              aria-hidden
            >
              {wishlistBadgeLabel}
            </span>
          ) : null}
        </Link>

        <button
          type="button"
          data-cart-fly-target
          onClick={() => openCartDrawer()}
          aria-label={
            cartCount === 0 ? 'Cart' : `Cart, ${cartCount} ${cartCount === 1 ? 'item' : 'items'}`
          }
          className="relative grid size-9 place-items-center rounded-full transition-opacity hover:opacity-80"
        >
          <HeaderActionIcon src={HEADER_CART_ICON} />
          <span
            className="absolute left-5 top-0 grid h-4 min-w-4 place-items-center rounded-full bg-sky-deep px-0.5 text-[12px] font-medium leading-4 text-white"
            aria-hidden
          >
            {cartBadgeLabel}
          </span>
        </button>

        <HeaderLanguageControl />
        <HeaderCurrencyControl />
      </div>

      <HeaderAccountMenu />
    </div>
  );
}
