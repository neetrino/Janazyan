import { ProductsHeroShell } from '../../components/products/ProductsHeroShell';
import { ProductsShopHeroToolbar } from '../../components/products/ProductsShopHeroToolbar';
import { getServerLanguage } from '../../lib/language-server';
import { ProductsCatalogMainSkeleton } from './ProductsCatalogSkeleton';

export default async function ProductsLoading() {
  const language = await getServerLanguage();

  return (
    <ProductsHeroShell
      toolbar={<ProductsShopHeroToolbar language={language} />}
      catalog={<ProductsCatalogMainSkeleton />}
    />
  );
}
