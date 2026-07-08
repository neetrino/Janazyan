import { ProductCard } from './ProductCard';
import {
  CATALOG_PRIORITY_CARD_COUNT,
  PRODUCTS_CATALOG_GRID_CLASS,
} from '../lib/products/catalog-page.constants';

interface Product {
  id: string;
  slug: string;
  title: string;
  price: number;
  compareAtPrice: number | null;
  image: string | null;
  inStock: boolean;
  brand: {
    id: string;
    name: string;
  } | null;
  defaultVariantId?: string | null;
  categories?: Array<{ title: string }>;
  ratingAverage?: number | null;
}

interface ProductsGridProps {
  /** Pre-sorted on the server — avoids duplicate work after hydration. */
  products: Product[];
}

export function ProductsGrid({ products }: ProductsGridProps) {
  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">No products found</p>
      </div>
    );
  }

  return (
    <div className={PRODUCTS_CATALOG_GRID_CLASS}>
      {products.map((product, index) => (
        <ProductCard
          key={product.id}
          product={{
            ...product,
            compareAtPrice: product.compareAtPrice ?? undefined,
          }}
          priority={index < CATALOG_PRIORITY_CARD_COUNT}
        />
      ))}
    </div>
  );
}

