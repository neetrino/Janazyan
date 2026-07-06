import dynamic from 'next/dynamic';
import { ProductsHeroShell } from '../../components/products/ProductsHeroShell';
import { CHECKOUT_PAGE_HERO_SHELL_MOBILE_PROPS } from './checkout-layout.constants';
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
        {...CHECKOUT_PAGE_HERO_SHELL_MOBILE_PROPS}
        catalog={<CheckoutPageSkeleton />}
      />
    ),
  },
);

export default function CheckoutPage() {
  return <CheckoutPageClient />;
}
