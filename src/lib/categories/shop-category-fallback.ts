import type { LanguageCode } from '../language';
import { t } from '../i18n';
import type { CategoryTreeNode } from './category-tree';

type ShopFilterFallbackKey =
  | 'assortment'
  | 'women'
  | 'men'
  | 'kids'
  | 'accessories';

type ShopFilterFallbackDef = {
  id: string;
  slug: string;
  labelKey: `products.shopFilters.${ShopFilterFallbackKey}`;
};

/** Figma shop toolbar categories — shown when the DB strip is empty. */
const SHOP_FILTER_FALLBACK_DEFS: readonly ShopFilterFallbackDef[] = [
  { id: 'shop-filter-assortment', slug: 'assortment', labelKey: 'products.shopFilters.assortment' },
  { id: 'shop-filter-women', slug: 'women', labelKey: 'products.shopFilters.women' },
  { id: 'shop-filter-men', slug: 'men', labelKey: 'products.shopFilters.men' },
  { id: 'shop-filter-kids', slug: 'kids', labelKey: 'products.shopFilters.kids' },
  {
    id: 'shop-filter-accessories',
    slug: 'accessories',
    labelKey: 'products.shopFilters.accessories',
  },
] as const;

/**
 * Static Figma-aligned category strip when no published categories exist in the DB.
 */
export function getShopCategoryFallbackStrip(language: LanguageCode): CategoryTreeNode[] {
  return SHOP_FILTER_FALLBACK_DEFS.map((def) => ({
    id: def.id,
    slug: def.slug,
    title: t(language, def.labelKey),
    fullPath:
      def.slug === 'assortment' ? '/products' : `/products?category=${def.slug}`,
    children: [],
  }));
}
