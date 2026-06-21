import type { LanguageCode } from '@/lib/language';
import { fetchProductsCatalog } from '@/lib/products/products-catalog-cache';
import type { ParsedCatalogParams, SearchParamsInput } from '@/lib/products/catalog-search-params';
import { ProductsCatalogInstant } from './ProductsCatalogInstant';

type ProductsCatalogServerProps = {
  parsed: ParsedCatalogParams;
  raw: SearchParamsInput;
  language: LanguageCode;
};

/**
 * Server catalog segment — fetches via Redis/DB on the server for initial HTML.
 */
export async function ProductsCatalogServer({
  parsed,
  raw,
  language,
}: ProductsCatalogServerProps) {
  const initialCatalog = await fetchProductsCatalog(
    parsed.page,
    parsed.perPage,
    language,
    parsed.search,
    parsed.category,
  );

  return (
    <ProductsCatalogInstant
      parsed={parsed}
      raw={raw}
      language={language}
      initialCatalog={initialCatalog}
    />
  );
}
