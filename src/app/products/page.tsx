import { Suspense } from 'react';
import { ProductsHeroShell } from '../../components/products/ProductsHeroShell';
import { ProductsShopHeroToolbar } from '../../components/products/ProductsShopHeroToolbar';
import { getServerLanguage } from '../../lib/language-server';
import {
  parseCatalogSearchParams,
  resolveSearchParams,
} from '../../lib/products/catalog-search-params';
import { ProductsCatalog } from './ProductsCatalog';
import { ProductsCatalogMainSkeleton } from './ProductsCatalogSkeleton';

export const revalidate = 60;

/**
 * Shop catalog — hero-gradient shell grows with the product grid.
 */
export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const raw = await resolveSearchParams(searchParams);
  const language = await getServerLanguage();
  const parsed = parseCatalogSearchParams(raw);

  return (
    <ProductsHeroShell
      toolbar={
        <ProductsShopHeroToolbar
          language={language}
          activeCategorySlug={parsed.category}
        />
      }
      catalog={
        <Suspense fallback={<ProductsCatalogMainSkeleton />}>
          <ProductsCatalog searchParams={raw} language={language} />
        </Suspense>
      }
    />
  );
}
