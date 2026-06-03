/** Product card fields cached for instant wishlist page render. */
export type WishlistProductSnapshot = {
  id: string;
  slug: string;
  title: string;
  price: number;
  originalPrice: number | null;
  compareAtPrice: number | null;
  discountPercent: number | null;
  image: string | null;
  inStock: boolean;
  defaultVariantId?: string | null;
  brand: {
    id: string;
    name: string;
  } | null;
};
