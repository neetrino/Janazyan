'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { usePathname } from 'next/navigation';
import { Heart } from 'lucide-react';
import { getCompareCount, getWishlistCount } from '../lib/storageCounts';
import { openCartDrawer } from '../lib/cart-drawer-events';
import { useTranslation } from '../lib/i18n-client';

interface MobileNavItem {
  key: 'home' | 'wishlist' | 'shop' | 'cart' | 'account';
  label: string;
  href?: string;
  action?: () => void;
  onClick?: (_event: React.MouseEvent<HTMLAnchorElement>) => void;
  badge?: 'wishlist' | 'compare';
  visible?: boolean;
}

type MobileNavVisualKey = Exclude<MobileNavItem['key'], 'wishlist'>;

const MOBILE_NAV_ICONS: Record<
  MobileNavVisualKey,
  { src: string; width: number; height: number; alt: string; sizeClass: string }
> = {
  home: {
    src: '/figma/nav-home-icon.svg',
    width: 61,
    height: 62,
    alt: 'Home',
    sizeClass: 'h-[30px] w-[30px]',
  },
  shop: {
    src: '/figma/nav-shop-icon.svg',
    width: 36,
    height: 38,
    alt: 'Shop',
    sizeClass: 'h-[28px] w-[26px]',
  },
  cart: {
    src: '/figma/nav-cart-icon.svg',
    width: 42,
    height: 42,
    alt: 'Cart',
    sizeClass: 'h-[28px] w-[28px]',
  },
  account: {
    src: '/figma/nav-account-icon.svg',
    width: 47,
    height: 47,
    alt: 'Account',
    sizeClass: 'h-[30px] w-[30px]',
  },
};

/**
 * Ստեղծում է հաստատուն mobile նավիգացիոն վահանակ՝ էջի ներքևում,
 * որպեսզի հիմնական գործողությունները միշտ լինեն ձեռքի տակ փոքր էկրաններում։
 */
export function MobileBottomNav() {
  const { t } = useTranslation();
  const pathname = usePathname();
  const [wishlistCount, setWishlistCount] = useState(0);
  const [compareCount, setCompareCount] = useState(0);

  useEffect(() => {
    const updateCounts = () => {
      const wishlist = getWishlistCount();
      const compare = getCompareCount();
      setWishlistCount(wishlist);
      setCompareCount(compare);
    };

    updateCounts();
    window.addEventListener('wishlist-updated', updateCounts);
    window.addEventListener('compare-updated', updateCounts);

    return () => {
      window.removeEventListener('wishlist-updated', updateCounts);
      window.removeEventListener('compare-updated', updateCounts);
    };
  }, []);

  const navItems: MobileNavItem[] = useMemo(
    () => [
      {
        key: 'home',
        label: t('common.navigation.home'),
        href: '/',
        visible: true,
      },
      {
        key: 'wishlist',
        label: t('common.navigation.wishlist'),
        href: '/wishlist',
        visible: false,
        badge: 'wishlist',
      },
      {
        key: 'shop',
        label: t('common.navigation.shop'),
        href: '/products',
        visible: true,
      },
      {
        key: 'cart',
        label: t('common.navigation.cart'),
        visible: true,
        action: () => openCartDrawer(),
      },
      {
        key: 'account',
        label: t('common.navigation.myPage'),
        href: '/profile',
        visible: true,
      },
    ],
    [t],
  );

  const resolveBadgeValue = (badge?: MobileNavItem['badge']) => {
    if (badge === 'wishlist') return wishlistCount;
    if (badge === 'compare') return compareCount;
    return 0;
  };

  return (
    <nav className="lg:hidden fixed bottom-0 inset-x-0 z-[70] px-2 pt-1 pb-[calc(0.5rem+env(safe-area-inset-bottom,0px))]">
      <div className="mx-auto grid max-w-md grid-cols-4 items-start rounded-t-[34px] border border-white/30 bg-white/55 px-3 py-2 shadow-[0_-4px_4px_rgba(135,123,135,0.13)] backdrop-blur-md">
        {navItems.filter(item => item.visible).map(({ key, label, href, badge, action, onClick }) => {
          const isActive = key === 'shop' ? pathname?.startsWith('/products') : href ? pathname === href : false;
          const badgeValue = resolveBadgeValue(badge);
          const slotClass =
            key === 'home'
              ? 'col-start-1'
              : key === 'shop'
                ? 'col-start-2'
                : key === 'cart'
                  ? 'col-start-3'
                  : 'col-start-4';

          const defaultContent = (
            <>
              <div className="relative">
                <NavIcon itemKey={key} isActive={Boolean(isActive)} />
                {badgeValue > 0 && (
                  <span className="absolute -right-2 -top-2 rounded-full bg-coral px-1.5 text-[10px] font-semibold text-white">
                    {badgeValue > 99 ? '99+' : badgeValue}
                  </span>
                )}
              </div>
              <span className={`mt-1 text-[12px] ${isActive ? 'font-semibold text-ink-800' : 'text-ink-500'}`}>
                {label}
              </span>
            </>
          );

          if (action) {
            return (
              <button
                key={key}
                type="button"
                onClick={action}
                aria-label={label}
                className={`flex flex-col items-center rounded-xl px-2 py-1 transition ${slotClass}`}
              >
                {defaultContent}
              </button>
            );
          }

          return (
            <Link
              key={key}
              href={href || '#'}
              onClick={onClick}
              aria-label={label}
              className={`flex flex-col items-center rounded-xl px-2 py-1 transition ${slotClass}`}
            >
              {defaultContent}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

function NavIcon({
  itemKey,
  isActive,
}: {
  itemKey: MobileNavItem['key'];
  isActive: boolean;
}) {
  if (itemKey in MOBILE_NAV_ICONS) {
    const icon = MOBILE_NAV_ICONS[itemKey as MobileNavVisualKey];
    return (
      <span className={`relative block ${icon.sizeClass}`}>
        <Image
          src={icon.src}
          alt={icon.alt}
          fill
          sizes="32px"
          className={isActive ? 'opacity-100' : 'opacity-85'}
        />
      </span>
    );
  }

  return <Heart className={`h-5 w-5 ${isActive ? 'text-ink-800' : 'text-ink-500'}`} />;
}
