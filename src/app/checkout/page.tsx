import dynamic from 'next/dynamic';
import { CheckoutPageSkeleton } from './CheckoutPageSkeleton';

const CheckoutPageClient = dynamic(
  () =>
    import('./CheckoutPageClient').then((module) => ({
      default: module.CheckoutPageClient,
    })),
  {
    loading: () => <CheckoutPageSkeleton />,
  },
);

export default function CheckoutPage() {
  return <CheckoutPageClient />;
}
