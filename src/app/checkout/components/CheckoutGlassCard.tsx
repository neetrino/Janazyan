import type { HTMLAttributes, ReactNode } from 'react';
import { CHECKOUT_GLASS_CARD_CLASS } from '../checkout-glass-styles';

interface CheckoutGlassCardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

/** Frosted-glass section card for checkout blocks. */
export function CheckoutGlassCard({
  children,
  className = '',
  ...props
}: CheckoutGlassCardProps) {
  return (
    <div className={`${CHECKOUT_GLASS_CARD_CLASS} p-6 ${className}`.trim()} {...props}>
      {children}
    </div>
  );
}
