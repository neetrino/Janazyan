import dynamic from 'next/dynamic';
import { ProductsHeroShell } from '../../components/products/ProductsHeroShell';
import { CheckoutPageSkeleton } from './CheckoutPageSkeleton';

const CheckoutPageClient = dynamic(
  () =>
    import('./CheckoutPageClient').then((module) => ({
      default: module.CheckoutPageClient,
    })),
  {
    loading: () => (
      <ProductsHeroShell sectionAriaLabel="Checkout" catalog={<CheckoutPageSkeleton />} />
    ),
  },
);

export default function CheckoutPage() {
  return <CheckoutPageClient />;
}
