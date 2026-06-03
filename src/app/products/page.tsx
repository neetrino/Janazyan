import { Suspense } from 'react';
import { CategoryNavigationServer } from '../../components/CategoryNavigation/CategoryNavigationServer';
import { CategoryNavigationStripSkeleton } from '../../components/CategoryNavigation/CategoryNavigationStripSkeleton';
import { getServerLanguage } from '../../lib/language-server';
import { resolveSearchParams } from '../../lib/products/catalog-search-params';
import { ProductsCatalog } from './ProductsCatalog';
import { ProductsCatalogMainSkeleton } from './ProductsCatalogSkeleton';

export const revalidate = 60;

/**
 * Shop catalog: category strip and grid stream in parallel (no blocking client nav).
 */
export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const raw = await resolveSearchParams(searchParams);
  const language = await getServerLanguage();
  const activeCategorySlug =
    typeof raw.category === 'string' ? raw.category : undefined;

  return (
    <div className="w-full max-w-full">
      <Suspense fallback={<CategoryNavigationStripSkeleton />}>
        <CategoryNavigationServer
          language={language}
          activeCategorySlug={activeCategorySlug}
        />
      </Suspense>
      <Suspense fallback={<ProductsCatalogMainSkeleton />}>
        <ProductsCatalog searchParams={raw} language={language} />
      </Suspense>
    </div>
  );
}
