import type { LanguageCode } from '../language';
import { t } from '../i18n';
import type { CategoryTreeNode } from './category-tree';

type ShopFilterFallbackKey = 'face' | 'hair' | 'body' | 'kids' | 'sun';

type ShopFilterFallbackDef = {
  id: string;
  slug: string;
  labelKey: `products.shopFilters.${ShopFilterFallbackKey}`;
};

/** Figma shop toolbar categories — aligned with mobile home filter tabs. */
const SHOP_FILTER_FALLBACK_DEFS: readonly ShopFilterFallbackDef[] = [
  { id: 'shop-filter-face', slug: 'face', labelKey: 'products.shopFilters.face' },
  { id: 'shop-filter-hair', slug: 'hair', labelKey: 'products.shopFilters.hair' },
  { id: 'shop-filter-body', slug: 'body', labelKey: 'products.shopFilters.body' },
  { id: 'shop-filter-kids', slug: 'kids', labelKey: 'products.shopFilters.kids' },
  { id: 'shop-filter-sun', slug: 'sun', labelKey: 'products.shopFilters.sun' },
] as const;

/**
 * Static Figma-aligned category strip when no published categories exist in the DB.
 */
export function getShopCategoryFallbackStrip(language: LanguageCode): CategoryTreeNode[] {
  return SHOP_FILTER_FALLBACK_DEFS.map((def) => ({
    id: def.id,
    slug: def.slug,
    title: t(language, def.labelKey),
    fullPath: `/products?category=${def.slug}`,
    children: [],
  }));
}
