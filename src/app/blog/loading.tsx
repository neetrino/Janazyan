import { ProductsHeroShell } from '../../components/products/ProductsHeroShell';

/** Instant shell on client navigation — keeps embedded header visible. */
export default function BlogLoading() {
  return (
    <ProductsHeroShell
      sectionAriaLabel="Blog"
      catalog={<div className="min-h-[40vh]" aria-hidden />}
    />
  );
}
