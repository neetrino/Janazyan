'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useMemo, useRef, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Heart, Search, Store, X } from 'lucide-react';
import { getCompareCount, getWishlistCount } from '../lib/storageCounts';
import { openCartDrawer } from '../lib/cart-drawer-events';
import { apiClient } from '../lib/api-client';
import { getStoredLanguage } from '../lib/language';

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

interface TopCategoryItem {
  id: string;
  slug: string;
  title: string;
  productCount: number;
  image: string | null;
}

interface TopCategoriesResponse {
  data: TopCategoryItem[];
}

/**
 * Ստեղծում է հաստատուն mobile նավիգացիոն վահանակ՝ էջի ներքևում,
 * որպեսզի հիմնական գործողությունները միշտ լինեն ձեռքի տակ փոքր էկրաններում։
 */
export function MobileBottomNav() {
  const router = useRouter();
  const pathname = usePathname();
  const [wishlistCount, setWishlistCount] = useState(0);
  const [compareCount, setCompareCount] = useState(0);
  const [showShopCategories, setShowShopCategories] = useState(false);
  const [shopCategories, setShopCategories] = useState<TopCategoryItem[]>([]);
  const [shopCategoriesLoading, setShopCategoriesLoading] = useState(false);
  const shopCategoriesFetchStartedRef = useRef(false);
  const [categorySearchQuery, setCategorySearchQuery] = useState('');

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

  useEffect(() => {
    if (!showShopCategories) {
      return;
    }
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [showShopCategories]);

  useEffect(() => {
    setShowShopCategories(false);
    setCategorySearchQuery('');
    shopCategoriesFetchStartedRef.current = false;
  }, [pathname]);

  useEffect(() => {
    if (!showShopCategories) {
      shopCategoriesFetchStartedRef.current = false;
      return;
    }
    if (shopCategories.length > 0 || shopCategoriesLoading || shopCategoriesFetchStartedRef.current) {
      return;
    }

    shopCategoriesFetchStartedRef.current = true;

    const fetchTopCategories = async () => {
      try {
        setShopCategoriesLoading(true);
        const language = getStoredLanguage();
        const response = await apiClient.get<TopCategoriesResponse>('/api/v1/categories/top', {
          params: { lang: language, limit: '12' },
        });
        setShopCategories(response.data || []);
      } catch {
        setShopCategories([]);
      } finally {
        setShopCategoriesLoading(false);
      }
    };

    void fetchTopCategories();
  }, [showShopCategories, shopCategories.length, shopCategoriesLoading]);

  const navItems: MobileNavItem[] = useMemo(
    () => [
      { 
        key: 'home',
        label: 'Գլխավոր',
        href: '/', 
        visible: true,
      },
      {
        key: 'wishlist',
        label: 'Ցանկ',
        href: '/wishlist',
        visible: false,
        badge: 'wishlist',
      },
      // Shop with Store icon
      { 
        key: 'shop',
        label: 'Խանութ',
        href: '/products', 
        visible: true,
        action: () => setShowShopCategories(true),
      },
      // On mobile we show Cart instead of Wishlist
      {
        key: 'cart',
        label: 'Զամբյուղ',
        visible: true,
        action: () => openCartDrawer(),
      },
      { key: 'account', label: 'Իմ էջը', href: '/profile', visible: true },
    ],
    []
  );

  const resolveBadgeValue = (badge?: MobileNavItem['badge']) => {
    if (badge === 'wishlist') return wishlistCount;
    if (badge === 'compare') return compareCount;
    return 0;
  };

  const filteredShopCategories = useMemo(() => {
    const query = categorySearchQuery.trim().toLowerCase();
    if (!query) {
      return shopCategories;
    }
    return shopCategories.filter((category) => category.title.toLowerCase().includes(query));
  }, [shopCategories, categorySearchQuery]);

  return (
    <>
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
                  key={label}
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
                key={label}
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
      {showShopCategories && (
        <div className="fixed inset-x-0 top-0 bottom-16 z-[60] bg-gray-50">
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Shop categories"
            className="mx-auto flex h-full w-full max-w-md flex-col border-x border-gray-200 bg-white shadow-sm"
          >
            <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
              <h3 className="text-base font-semibold text-gray-900">Categories</h3>
              <button
                type="button"
                onClick={() => setShowShopCategories(false)}
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 text-gray-600"
                aria-label="Close categories"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="border-b border-gray-100 px-4 py-3">
              <label htmlFor="category-search" className="sr-only">
                Search categories
              </label>
              <div className="flex items-center gap-2 rounded-xl border border-gray-200 bg-gray-50 px-3">
                <Search className="h-4 w-4 text-gray-400" />
                <input
                  id="category-search"
                  type="text"
                  value={categorySearchQuery}
                  onChange={(event) => setCategorySearchQuery(event.target.value)}
                  placeholder="Search category..."
                  className="h-10 w-full bg-transparent text-sm text-gray-800 outline-none placeholder:text-gray-400"
                />
              </div>
            </div>
            <div className="flex-1 overflow-y-auto px-4 pb-5 pt-4">
              {shopCategoriesLoading ? (
                <div className="grid grid-cols-2 gap-3">
                  {Array.from({ length: 6 }).map((_, index) => (
                    <div key={index} className="h-36 animate-pulse rounded-2xl bg-gray-100" />
                  ))}
                </div>
              ) : filteredShopCategories.length > 0 ? (
                <div className="grid grid-cols-2 gap-3">
                  {filteredShopCategories.map((category) => (
                    <button
                      key={category.id}
                      type="button"
                      onClick={() => {
                        setShowShopCategories(false);
                        router.push(`/products?category=${category.slug}`);
                      }}
                      className="overflow-hidden rounded-2xl border border-gray-200 bg-white text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                    >
                      <div className="relative h-24 w-full bg-gray-100">
                        {category.image ? (
                          <Image
                            src={category.image}
                            alt={category.title}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 50vw, 200px"
                            unoptimized
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-gray-400">
                            <Store className="h-7 w-7" />
                          </div>
                        )}
                      </div>
                      <div className="px-3 py-2.5">
                        <p className="line-clamp-1 text-sm font-semibold text-gray-900">{category.title}</p>
                        <p className="mt-0.5 text-xs text-gray-500">{category.productCount} products</p>
                      </div>
                    </button>
                  ))}
                </div>
              ) : categorySearchQuery.trim().length > 0 ? (
                <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 text-sm text-gray-600">
                  No categories found for &quot;{categorySearchQuery}&quot;.
                </div>
              ) : (
                <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 text-sm text-gray-600">
                  Categories are not available right now.
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
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

