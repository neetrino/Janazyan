'use client';

import { UseFormRegister, UseFormSetValue, UseFormHandleSubmit, FieldErrors } from 'react-hook-form';
import { ShippingAddressModal } from './components/ShippingAddressModal';
import { CardDetailsModal } from './components/CardDetailsModal';
import { CheckoutFormData, Cart } from './types';
import type { DeliveryOptionsPublic } from '@/lib/delivery/delivery-settings.types';

interface CheckoutModalsProps {
  showShippingModal: boolean;
  setShowShippingModal: (show: boolean) => void;
  showCardModal: boolean;
  setShowCardModal: (show: boolean) => void;
  register: UseFormRegister<CheckoutFormData>;
  setValue: UseFormSetValue<CheckoutFormData>;
  handleSubmit: UseFormHandleSubmit<CheckoutFormData>;
  errors: FieldErrors<CheckoutFormData>;
  isSubmitting: boolean;
  shippingMethod: 'pickup' | 'delivery';
  paymentMethod: 'idram' | 'arca' | 'cash_on_delivery';
  shippingCountry?: string;
  shippingCity?: string;
  deliveryOptions: DeliveryOptionsPublic | null;
  deliveryOptionsLoading: boolean;
  cart: Cart | null;
  orderSummary: {
    subtotalDisplay: number;
    taxDisplay: number;
    shippingDisplay: number;
    discountDisplay: number;
    totalDisplay: number;
  };
  currency: 'USD' | 'AMD' | 'EUR' | 'RUB' | 'GEL';
  loadingDeliveryPrice: boolean;
  deliveryPrice: number | null;
  logoErrors: Record<string, boolean>;
  setLogoErrors: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
  onSubmit: (data: CheckoutFormData) => void;
}

export function CheckoutModals({
  showShippingModal,
  setShowShippingModal,
  showCardModal,
  setShowCardModal,
  register,
  setValue,
  handleSubmit,
  errors,
  isSubmitting,
  shippingMethod,
  paymentMethod,
  shippingCountry,
  shippingCity,
  deliveryOptions,
  deliveryOptionsLoading,
  cart,
  orderSummary,
  currency,
  loadingDeliveryPrice,
  deliveryPrice,
  logoErrors,
  setLogoErrors,
  onSubmit,
}: CheckoutModalsProps) {
  return (
    <>
      <ShippingAddressModal
        isOpen={showShippingModal}
        onClose={() => setShowShippingModal(false)}
        register={register}
        setValue={setValue}
        handleSubmit={handleSubmit}
        errors={errors}
        isSubmitting={isSubmitting}
        shippingMethod={shippingMethod}
        paymentMethod={paymentMethod}
        cart={cart}
        orderSummary={orderSummary}
        currency={currency}
        shippingCountry={shippingCountry}
        shippingCity={shippingCity}
        deliveryOptions={deliveryOptions}
        deliveryOptionsLoading={deliveryOptionsLoading}
        loadingDeliveryPrice={loadingDeliveryPrice}
        deliveryPrice={deliveryPrice}
        onSubmit={onSubmit}
      />

      <CardDetailsModal
        isOpen={showCardModal}
        onClose={() => setShowCardModal(false)}
        register={register}
        setValue={setValue}
        handleSubmit={handleSubmit}
        errors={errors}
        isSubmitting={isSubmitting}
        paymentMethod={paymentMethod}
        shippingMethod={shippingMethod}
        shippingCountry={shippingCountry}
        shippingCity={shippingCity}
        deliveryOptions={deliveryOptions}
        cart={cart}
        orderSummary={orderSummary}
        currency={currency}
        loadingDeliveryPrice={loadingDeliveryPrice}
        deliveryPrice={deliveryPrice}
        logoErrors={logoErrors}
        setLogoErrors={setLogoErrors}
        onSubmit={onSubmit}
      />
    </>
  );
}
