import { CHECKOUT_GLASS_CARD_CLASS } from './checkout-glass-styles';

export function CheckoutPageSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="animate-pulse" aria-busy="true" aria-label="Loading checkout">
        <div className="h-8 bg-white/40 rounded-2xl w-1/4 mb-8 backdrop-blur-sm" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className={`h-52 ${CHECKOUT_GLASS_CARD_CLASS} bg-white/30`} />
            <div className={`h-44 ${CHECKOUT_GLASS_CARD_CLASS} bg-white/30`} />
          </div>
          <div className={`h-64 ${CHECKOUT_GLASS_CARD_CLASS} bg-white/30`} />
        </div>
      </div>
    </div>
  );
}
