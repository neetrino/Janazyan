/** Public cart GET response shape — safe to cache in Redis. */
export type CartViewItem = {
  id: string;
  variant: {
    id: string;
    sku: string;
    stock: number;
    product: {
      id: string;
      title: string;
      slug: string;
      image: string | null;
    };
  };
  quantity: number;
  price: number;
  originalPrice: number | null;
  total: number;
};

export type CartViewResponse = {
  cart: {
    id: string;
    items: CartViewItem[];
    totals: {
      subtotal: number;
      discount: number;
      shipping: number;
      tax: number;
      total: number;
      currency: string;
    };
    itemsCount: number;
  };
};

export function buildCartViewCacheKey(userId: string, locale: string): string {
  return `cart:view:v1:${userId}:${locale}`;
}
