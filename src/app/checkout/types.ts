import type { CheckoutShippingMethod } from '@/lib/orders/shipping-method';

export type { CheckoutShippingMethod };

export type CheckoutFormData = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  /** Optional second number if the first is not answered. */
  alternatePhone?: string;
  shippingMethod: CheckoutShippingMethod;
  paymentMethod: 'idram' | 'arca' | 'cash_on_delivery';
  shippingCountry?: string;
  shippingCity?: string;
  shippingAddress?: string;
  shippingRecipientName?: string;
  shippingPostalIndex?: string;
  shippingAdditionalNotes?: string;
  cardNumber?: string;
  cardExpiry?: string;
  cardCvv?: string;
  cardHolderName?: string;
};

export interface CartItem {
  id: string;
  variant: {
    id: string;
    sku: string;
    product: {
      id: string;
      title: string;
      slug: string;
      image?: string | null;
    };
  };
  quantity: number;
  price: number;
  total: number;
}

export interface Cart {
  id: string;
  items: CartItem[];
  totals: {
    subtotal: number;
    discount: number;
    shipping: number;
    tax: number;
    total: number;
    currency: string;
  };
  itemsCount: number;
}

export interface AppliedPromo {
  code: string;
  discountAmountAmd: number;
}
