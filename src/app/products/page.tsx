import type { Metadata } from 'next';
import { Suspense } from 'react';
import { getServerLanguage } from '@/lib/language-server';
import { t } from '@/lib/i18n';
import {
  parseCatalogSearchParams,
  resolveSearchParams,
} from '@/lib/products/catalog-search-params';
import { ProductsHeroShell } from '@/components/products/ProductsHeroShell';
import { ProductsShopHeroToolbar } from '@/components/products/ProductsShopHeroToolbar';
import { ProductsCatalogServer } from './ProductsCatalogServer';
import { ProductsCatalogMainSkeleton } from './ProductsCatalogSkeleton';
import { PRODUCTS_PAGE_MOBILE_CATALOG_SURFACE_CLASS } from './products-page-layout.constants';

export const revalidate = 120;

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}): Promise<Metadata> {
  const raw = await resolveSearchParams(searchParams);
  const language = await getServerLanguage();
  const parsed = parseCatalogSearchParams(raw);
  const title = parsed.category
    ? `${t(language, 'common.footer.shop')} — ${parsed.category}`
    : t(language, 'common.footer.shop');

  return {
    title,
    description: t(language, 'common.footer.shop'),
  };
}

/**
 * Shop catalog — shell + toolbar on server; products stream via RSC Suspense.
 */
export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const [raw, language] = await Promise.all([
    resolveSearchParams(searchParams),
    getServerLanguage(),
  ]);
  const parsed = parseCatalogSearchParams(raw);

  return (
    <ProductsHeroShell
      mobileContentSurfaceClassName={PRODUCTS_PAGE_MOBILE_CATALOG_SURFACE_CLASS}
      activeCategorySlug={parsed.category}
      toolbar={
        <ProductsShopHeroToolbar
          language={language}
          activeCategorySlug={parsed.category}
        />
      }
      catalog={
        <Suspense fallback={<ProductsCatalogMainSkeleton />}>
          <ProductsCatalogServer parsed={parsed} raw={raw} language={language} />
        </Suspense>
      }
    />
  );
}
