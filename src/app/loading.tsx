import { ProductsHeroShell } from '../components/products/ProductsHeroShell';

/**
 * Fallback for routes without a segment `loading.tsx`.
 * Uses the storefront hero shell so the embedded header stays visible
 * during client navigations (e.g. → home).
 */
export default function Loading() {
  return (
    <ProductsHeroShell
      sectionAriaLabel="Loading"
      catalog={<div className="min-h-[40vh]" aria-hidden />}
    />
  );
}
