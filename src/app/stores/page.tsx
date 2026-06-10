import { unstable_cache } from 'next/cache';
import { getServerLanguage } from '../../lib/language-server';
import { getPublishedPartnerStores } from '../../lib/services/partner-stores.service';
import { buildPartnerStoresFromLocale } from '../../features/stores/fetch-partner-stores';
import { loadStoresPageCopy } from '../../features/stores/load-stores-page-copy';
import { StoresPageView } from '../../features/stores/components/StoresPageView';

const PARTNER_STORES_REVALIDATE_SECONDS = 300;

const getPartnerStoresCached = unstable_cache(
  (locale: string) => getPublishedPartnerStores(locale),
  ['partner-stores-v1'],
  { revalidate: PARTNER_STORES_REVALIDATE_SECONDS }
);

/**
 * Our Stores page — partner locations fetched on the server (no client waterfall),
 * passed to the interactive client view.
 */
export default async function StoresPage() {
  const language = await getServerLanguage();
  const copy = loadStoresPageCopy(language);
  const dbStores = await getPartnerStoresCached(language);
  const stores =
    dbStores.length > 0 ? dbStores : buildPartnerStoresFromLocale(language);

  return <StoresPageView initialCopy={copy} initialStores={stores} />;
}
