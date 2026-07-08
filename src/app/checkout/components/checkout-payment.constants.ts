/** Card payment logos shown together on the checkout payment option row. */
export const CHECKOUT_PAYMENT_CARD_LOGOS = [
  { src: '/figma/footer-pay-arca.png', alt: 'ArCa' },
  { src: '/figma/footer-pay-mastercard.png', alt: 'Mastercard' },
  { src: '/figma/footer-pay-visa.png', alt: 'Visa' },
] as const;

export const CHECKOUT_PAYMENT_IDRAM_LOGO = '/assets/payments/idram.svg';

export const CHECKOUT_PAYMENT_ICON_BOX_CLASS =
  'flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-white/50 bg-white/60 p-1.5 backdrop-blur-sm sm:h-12 sm:w-14';

export const CHECKOUT_PAYMENT_CARD_LOGOS_CLASS = 'flex shrink-0 items-center gap-1.5 sm:gap-2';

export const CHECKOUT_PAYMENT_OPTION_TEXT_CLASS = 'min-w-0 flex-1';

export const CHECKOUT_PAYMENT_OPTION_NAME_CLASS = 'font-medium text-gray-900';

export const CHECKOUT_PAYMENT_OPTION_DESCRIPTION_CLASS = 'hidden text-sm text-gray-600 md:block';
