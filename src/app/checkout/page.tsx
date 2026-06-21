import dynamic from 'next/dynamic';
import { ProductsHeroShell } from '../../components/products/ProductsHeroShell';
import { ACCOUNT_PAGE_HERO_SHELL_MOBILE_PROPS } from '../../lib/layout/account-pages-layout.constants';
import { CheckoutPageSkeleton } from './CheckoutPageSkeleton';

const CheckoutPageClient = dynamic(
  () =>
    import('./CheckoutPageClient').then((module) => ({
      default: module.CheckoutPageClient,
    })),
  {
    loading: () => (
      <ProductsHeroShell
        sectionAriaLabel="Checkout"
        compactHero
        {...ACCOUNT_PAGE_HERO_SHELL_MOBILE_PROPS}
        catalog={<CheckoutPageSkeleton />}
      />
    ),
  },
);

export default function CheckoutPage() {
  return <CheckoutPageClient />;
}
