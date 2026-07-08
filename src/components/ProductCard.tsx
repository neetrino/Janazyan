import { FeaturedProductCardSlot } from './home/FeaturedProductCardSlot';
import type { ProductLabel } from './ProductLabels';
import { mapToHomeFeaturedProduct } from '../lib/home/map-to-home-featured-product';

interface Product {
  id: string;
  slug: string;
  title: string;
  price: number;
  image: string | null;
  inStock: boolean;
  brand: {
    id: string;
    name: string;
    logoUrl?: string | null;
  } | null;
  defaultVariantId?: string | null;
  labels?: ProductLabel[];
  compareAtPrice?: number | null;
  originalPrice?: number | null;
  globalDiscount?: number | null;
  discountPercent?: number | null;
  colors?: Array<{ value: string; imageUrl?: string | null; colors?: string[] | null }>;
  categories?: Array<{ title: string }>;
  ratingAverage?: number | null;
}

type ViewMode = 'list' | 'grid-2' | 'grid-3';

interface ProductCardProps {
  product: Product;
  viewMode?: ViewMode;
  /** Eagerly load the product image (above-the-fold cards only). */
  priority?: boolean;
}

/** Product card — server-rendered visual shell with client action islands inside. */
export function ProductCard({ product, viewMode = 'grid-3', priority = false }: ProductCardProps) {
  const featuredProduct = mapToHomeFeaturedProduct(
    {
      id: product.id,
      slug: product.slug,
      title: product.title,
      price: product.price,
      image: product.image,
      inStock: product.inStock,
      defaultVariantId: product.defaultVariantId,
      labels: product.labels,
      compareAtPrice: product.compareAtPrice,
      originalPrice: product.originalPrice,
      discountPercent: product.discountPercent,
      brand: product.brand,
      categories: product.categories,
    },
    {
      ratingAverage: product.ratingAverage ?? undefined,
    },
  );

  if (viewMode === 'list') {
    return (
      <div data-product-card className="flex w-full justify-center">
        <FeaturedProductCardSlot product={featuredProduct} scale="full" priority={priority} />
      </div>
    );
  }

  return (
    <div data-product-card className="flex w-full min-w-0 justify-center">
      <FeaturedProductCardSlot product={featuredProduct} scale="responsive-catalog" priority={priority} />
    </div>
  );
}
