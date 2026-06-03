import { CategoryNavigationStripSkeleton } from '../../components/CategoryNavigation/CategoryNavigationStripSkeleton';
import { ProductsCatalogMainSkeleton } from './ProductsCatalogSkeleton';

export default function ProductsLoading() {
  return (
    <div className="w-full max-w-full">
      <CategoryNavigationStripSkeleton />
      <ProductsCatalogMainSkeleton />
    </div>
  );
}
