import { Suspense } from 'react';
import { ProductsHeroShell } from '../../components/products/ProductsHeroShell';
import { getServerLanguage } from '../../lib/language-server';
import { fetchPartnerStores } from '../../lib/partner-stores/partner-stores-cache';
import { loadStoresPageCopy } from '../../features/stores/load-stores-page-copy';
import { StoresPageMain } from './StoresPageMain';
import { StoresPageFooter, StoresPageHeader } from './StoresPageSections';
import { StoresPageMainSkeleton } from './StoresPageSkeleton';

export const revalidate = 300;

/**
 * Our Stores — hero copy paints immediately; store list streams in via Suspense.
 */
export default async function StoresPage() {
  const language = await getServerLanguage();
  const copy = loadStoresPageCopy(language);
  const storesPromise = fetchPartnerStores(language);

  return (
    <ProductsHeroShell
      sectionAriaLabel="Our stores"
      catalog={
        <>
          <StoresPageHeader copy={copy} />
          <Suspense fallback={<StoresPageMainSkeleton />}>
            <StoresPageMain
              storesPromise={storesPromise}
              copy={copy}
              language={language}
            />
          </Suspense>
          <StoresPageFooter copy={copy} />
        </>
      }
    />
  );
}
