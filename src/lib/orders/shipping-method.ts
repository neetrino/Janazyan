export const CHECKOUT_SHIPPING_METHODS = ['delivery', 'pochta'] as const;

export type CheckoutShippingMethod = (typeof CHECKOUT_SHIPPING_METHODS)[number];

export function isCheckoutShippingMethod(value: string): value is CheckoutShippingMethod {
  return (CHECKOUT_SHIPPING_METHODS as readonly string[]).includes(value);
}
