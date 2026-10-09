import { ProductsHeroShell } from '../../components/products/ProductsHeroShell';
import { ABOUT_PAGE_HERO_SHELL_PROPS } from './about-page.constants';

/** Instant shell on client navigation — keeps embedded header visible. */
export default function AboutLoading() {
  return (
    <ProductsHeroShell
      sectionAriaLabel="About us"
      {...ABOUT_PAGE_HERO_SHELL_PROPS}
      catalog={<div className="min-h-[40vh]" aria-hidden />}
    />
  );
}
