'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ChevronDown, Globe } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { HeaderAccountMenu } from './HeaderAccountMenu';
import { HeaderProductSearch } from './HeaderProductSearch';
import {
  HEADER_ACTION_PROFILE_GAP_PX,
  HEADER_ACTIONS_PILL_PADDING_X_PX,
  HEADER_ACTIONS_PILL_PADDING_Y_PX,
  HEADER_PILL_BORDER_RADIUS_PX,
  HEADER_PILL_HEIGHT_PX,
} from './header-shell-shape.constants';
import { openCartDrawer } from '../../lib/cart-drawer-events';
import { getStoredCurrency, type CurrencyCode } from '../../lib/currency';
import {
  LANGUAGES,
  getStoredLanguage,
  setStoredLanguage,
  type LanguageCode,
} from '../../lib/language';
import { formatCartBadgeCount, useCartItemCount } from '../hooks/useCartItemCount';
import { formatWishlistBadgeCount, useWishlistItemCount } from '../hooks/useWishlistItemCount';

const HEADER_ACTION_BUTTON_SIZE_PX = 40;
const HEADER_ACTION_ICON_SIZE_PX = 22;
const HEADER_CART_BADGE_COLOR = '#93B6E3';

const HEADER_HEART_ICON = '/figma/header-search-icon.svg';
const HEADER_CART_ICON = '/figma/header-cart-icon.svg';

function HeaderActionIcon({ src, alt }: { src: string; alt: string }) {
  return (
    <Image
      src={src}
      alt={alt}
      width={HEADER_ACTION_ICON_SIZE_PX}
      height={HEADER_ACTION_ICON_SIZE_PX}
      className="h-[22px] w-[22px]"
    />
  );
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
        style={{
          width: HEADER_ACTION_BUTTON_SIZE_PX,
          height: HEADER_ACTION_BUTTON_SIZE_PX,
        }}
      >
        <Globe className="h-[22px] w-[22px] text-ink-800" strokeWidth={2.2} />
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

function HeaderCurrencyLabel() {
  const [currency, setCurrency] = useState<CurrencyCode>('AMD');

  useEffect(() => {
    const syncCurrency = () => setCurrency(getStoredCurrency());
    syncCurrency();
    window.addEventListener('currency-updated', syncCurrency);
    return () => window.removeEventListener('currency-updated', syncCurrency);
  }, []);

  return (
    <span className="inline-flex items-center gap-1 text-[17px] font-medium leading-[26px] tracking-[-0.31px] text-ink-500">
      {currency}
      <ChevronDown className="h-3 w-3 shrink-0 opacity-70" aria-hidden />
    </span>
  );
}

export function HeaderStorefrontActions() {
  const wishlistCount = useWishlistItemCount();
  const wishlistBadgeLabel = formatWishlistBadgeCount(wishlistCount);
  const cartCount = useCartItemCount();
  const cartBadgeLabel = formatCartBadgeCount(cartCount);

  return (
    <div
      className="flex shrink-0 items-center bg-white shadow-soft"
      style={{
        gap: HEADER_ACTION_PROFILE_GAP_PX,
        height: HEADER_PILL_HEIGHT_PX,
        borderRadius: HEADER_PILL_BORDER_RADIUS_PX,
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
          className="relative grid place-items-center rounded-full transition-opacity hover:opacity-80"
          style={{
            width: HEADER_ACTION_BUTTON_SIZE_PX,
            height: HEADER_ACTION_BUTTON_SIZE_PX,
          }}
        >
          <HeaderActionIcon src={HEADER_HEART_ICON} alt="" />
          {wishlistCount > 0 ? (
            <span
              className="absolute left-5 top-0 grid min-w-4 place-items-center rounded-full px-0.5 text-[12px] font-medium leading-4 text-white"
              style={{ backgroundColor: HEADER_CART_BADGE_COLOR, height: 16 }}
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
          className="relative grid place-items-center rounded-full transition-opacity hover:opacity-80"
          style={{
            width: HEADER_ACTION_BUTTON_SIZE_PX,
            height: HEADER_ACTION_BUTTON_SIZE_PX,
          }}
        >
          <HeaderActionIcon src={HEADER_CART_ICON} alt="" />
          <span
            className="absolute left-5 top-0 grid min-w-4 place-items-center rounded-full px-0.5 text-[12px] font-medium leading-4 text-white"
            style={{ backgroundColor: HEADER_CART_BADGE_COLOR, height: 16 }}
            aria-hidden
          >
            {cartBadgeLabel}
          </span>
        </button>

        <HeaderLanguageControl />
        <HeaderCurrencyLabel />
      </div>

      <HeaderAccountMenu />
    </div>
  );
}
