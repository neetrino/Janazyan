import { Suspense } from 'react';
import { getServerLanguage } from '../../lib/language-server';
import { resolveSearchParams } from '../../lib/products/catalog-search-params';
import { ProductsCatalog } from './ProductsCatalog';
import { ProductsCatalogMainSkeleton } from './ProductsCatalogSkeleton';

export const revalidate = 60;

/**
 * Shop catalog product grid.
 */
export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const raw = await resolveSearchParams(searchParams);
  const language = await getServerLanguage();

  return (
    <div className="w-full max-w-full">
      <Suspense fallback={<ProductsCatalogMainSkeleton />}>
        <ProductsCatalog searchParams={raw} language={language} />
      </Suspense>
    </div>
  );
}
