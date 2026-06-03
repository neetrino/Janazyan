'use client';

import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { Button } from '@shop/ui';
import { useTranslation } from '../../lib/i18n-client';
import { CheckoutForm } from './CheckoutForm';
import { OrderSummary } from './OrderSummary';
import { CheckoutPageSkeleton } from './CheckoutPageSkeleton';
import { CheckoutGlassCard } from './components/CheckoutGlassCard';
import { useCheckout } from './useCheckout';

const CheckoutModals = dynamic(
  () => import('./CheckoutModals').then((module) => ({ default: module.CheckoutModals })),
  { ssr: false },
);

export function CheckoutPageClient() {
  const router = useRouter();
  const { t } = useTranslation();

  const {
    cart,
    loading,
    error,
    setError,
    currency,
    logoErrors,
    setLogoErrors,
    showShippingModal,
    setShowShippingModal,
    showCardModal,
    setShowCardModal,
    deliveryPrice,
    loadingDeliveryPrice,
    register,
    handleSubmit,
    errors,
    isSubmitting,
    setValue,
    paymentMethod,
    shippingMethod,
    shippingCity,
    paymentMethods,
    orderSummary,
    handlePlaceOrder,
    onSubmit,
  } = useCheckout();

  if (loading) {
    return <CheckoutPageSkeleton />;
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">{t('checkout.title')}</h1>
        <CheckoutGlassCard className="text-center">
          <p className="text-gray-600 mb-4">{t('checkout.errors.cartEmpty')}</p>
          <Button variant="primary" className="rounded-2xl" onClick={() => router.push('/products')}>
            {t('checkout.buttons.continueShopping')}
          </Button>
        </CheckoutGlassCard>
      </div>
    );
  }

  const showModals = showShippingModal || showCardModal;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">{t('checkout.title')}</h1>

      <form onSubmit={handlePlaceOrder}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <CheckoutForm
            register={register}
            setValue={setValue}
            errors={errors}
            isSubmitting={isSubmitting}
            shippingMethod={shippingMethod}
            paymentMethod={paymentMethod}
            paymentMethods={paymentMethods}
            logoErrors={logoErrors}
            setLogoErrors={setLogoErrors}
            error={error}
            setError={setError}
          />

          <OrderSummary
            cart={cart}
            orderSummary={orderSummary}
            currency={currency}
            shippingMethod={shippingMethod}
            shippingCity={shippingCity}
            loadingDeliveryPrice={loadingDeliveryPrice}
            deliveryPrice={deliveryPrice}
            error={error}
            isSubmitting={isSubmitting}
            onPlaceOrder={(e) => {
              if (e) {
                handlePlaceOrder(e);
              } else {
                handlePlaceOrder({ preventDefault: () => {} } as React.FormEvent);
              }
            }}
          />
        </div>
      </form>

      {showModals ? (
        <CheckoutModals
          showShippingModal={showShippingModal}
          setShowShippingModal={setShowShippingModal}
          showCardModal={showCardModal}
          setShowCardModal={setShowCardModal}
          register={register}
          setValue={setValue}
          handleSubmit={handleSubmit}
          errors={errors}
          isSubmitting={isSubmitting}
          shippingMethod={shippingMethod}
          paymentMethod={paymentMethod}
          shippingCity={shippingCity}
          cart={cart}
          orderSummary={orderSummary}
          currency={currency}
          loadingDeliveryPrice={loadingDeliveryPrice}
          deliveryPrice={deliveryPrice}
          logoErrors={logoErrors}
          setLogoErrors={setLogoErrors}
          onSubmit={onSubmit}
        />
      ) : null}
    </div>
  );
}
