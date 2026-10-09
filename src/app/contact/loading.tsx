import { ProductsHeroShell } from '../../components/products/ProductsHeroShell';
import { CONTACT_PAGE_HERO_SHELL_PROPS } from './contact-page.constants';

/** Instant shell on client navigation — keeps embedded header visible. */
export default function ContactLoading() {
  return (
    <ProductsHeroShell
      sectionAriaLabel="Contact"
      {...CONTACT_PAGE_HERO_SHELL_PROPS}
      catalog={<div className="min-h-[40vh]" aria-hidden />}
    />
  );
}
