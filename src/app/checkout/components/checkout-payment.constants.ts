/** Card payment logos shown together on the checkout payment option row. */
export const CHECKOUT_PAYMENT_CARD_LOGOS = [
  { src: '/assets/payments/card-arca.png', alt: 'ArCa' },
  { src: '/assets/payments/card-mastercard.png', alt: 'Mastercard' },
  { src: '/assets/payments/card-visa.png', alt: 'Visa' },
] as const;

/** Card-shaped mark — wider than the cash icon so the chip and brand stay visible. */
export const CHECKOUT_PAYMENT_CARD_LOGO_BOX_CLASS =
  'flex h-11 w-20 shrink-0 items-center justify-center overflow-hidden rounded-lg sm:h-12 sm:w-24';

/** Fills the shared box so ArCa and Mastercard render at one size. */
export const CHECKOUT_PAYMENT_CARD_LOGO_IMAGE_CLASS =
  'h-11 w-20 object-cover object-center sm:h-12 sm:w-24';

/** Visa artwork sits a little smaller than the other two cards. */
export const CHECKOUT_PAYMENT_VISA_LOGO_IMAGE_CLASS =
  'h-9 w-16 object-cover object-center sm:h-10 sm:w-20';

export const CHECKOUT_PAYMENT_CASH_LOGO = '/assets/payments/cash.png';

export const CHECKOUT_PAYMENT_CASH_BOX_CLASS =
  'flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden sm:h-16 sm:w-16';

export const CHECKOUT_PAYMENT_IDRAM_LOGO = '/assets/payments/idram.webp';

/** Wider than the square icon box so the Idram wordmark stays readable. */
export const CHECKOUT_PAYMENT_IDRAM_BOX_CLASS =
  'flex h-10 w-[7.25rem] shrink-0 items-center justify-center overflow-hidden rounded-xl border border-white/50 bg-white/60 px-2 py-1.5 shadow-card backdrop-blur-sm sm:h-12 sm:w-32';

export const CHECKOUT_PAYMENT_ICON_BOX_CLASS =
  'flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-white/50 bg-white/60 p-1.5 backdrop-blur-sm sm:h-12 sm:w-14';

export const CHECKOUT_PAYMENT_CARD_LOGOS_CLASS = 'flex shrink-0 items-center gap-1';

export const CHECKOUT_PAYMENT_OPTION_TEXT_CLASS = 'min-w-0 flex-1';

export const CHECKOUT_PAYMENT_OPTION_NAME_CLASS = 'font-medium text-gray-900';

export const CHECKOUT_PAYMENT_OPTION_DESCRIPTION_CLASS = 'hidden text-sm text-gray-600 md:block';
