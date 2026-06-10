import type { LanguageCode } from '../../lib/language';
import { buildPartnerStoresFromLocale } from '../../features/stores/fetch-partner-stores';
import type { PartnerStore, StoresTranslation } from '../../features/stores/types';
import { StoresPageInteractive } from '../../features/stores/components/StoresPageInteractive';

type StoresPageMainProps = {
  storesPromise: Promise<PartnerStore[]>;
  copy: StoresTranslation;
  language: LanguageCode;
};

export async function StoresPageMain({
  storesPromise,
  copy,
  language,
}: StoresPageMainProps) {
  const dbStores = await storesPromise;
  const stores =
    dbStores.length > 0 ? dbStores : buildPartnerStoresFromLocale(language);

  return <StoresPageInteractive copy={copy} stores={stores} />;
}
