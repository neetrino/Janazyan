type CheckoutCashPaymentIconProps = {
  className?: string;
};

/** Green banknote icon for the cash-on-delivery payment option. */
export function CheckoutCashPaymentIcon({ className = 'h-6 w-6' }: CheckoutCashPaymentIconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <rect x="3" y="6" width="18" height="12" rx="2" fill="#22C55E" />
      <rect x="5" y="8" width="14" height="8" rx="1" fill="#16A34A" />
      <circle cx="12" cy="12" r="2.5" fill="#BBF7D0" />
    </svg>
  );
}
