'use client';

import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { ProductsHeroShell } from '../../components/products/ProductsHeroShell';
import { ACCOUNT_PAGE_INNER_CLASS } from '../../lib/layout/account-pages-layout.constants';
import { CHECKOUT_PAGE_HERO_SHELL_MOBILE_PROPS } from './checkout-layout.constants';
import { STOREFRONT_SKY_PILL_BUTTON_CLASS } from '../products/[slug]/product-action-bar.constants';
import { useTranslation } from '../../lib/i18n-client';
import { CheckoutForm } from './CheckoutForm';
import { OrderSummary } from './OrderSummary';
import { CheckoutPageSkeleton } from './CheckoutPageSkeleton';
import { CheckoutGlassCard } from './components/CheckoutGlassCard';
import { useCheckout } from './useCheckout';
import { CHECKOUT_FORM_ID } from './utils/scroll-to-checkout-error';

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
    promoCode,
    onPromoCodeChange,
    promoError,
    promoApplying,
    appliedPromoCode,
    applyPromoCode,
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
    pickupStoreId,
    shippingCountry,
    shippingCity,
    pickupStores,
    pickupStoresLoading,
    deliveryOptions,
    deliveryOptionsLoading,
    paymentMethods,
    orderSummary,
    onCheckoutSubmit,
    onSubmit,
  } = useCheckout();

  if (loading) {
    return (
      <ProductsHeroShell
        sectionAriaLabel="Checkout"
        compactHero
        {...CHECKOUT_PAGE_HERO_SHELL_MOBILE_PROPS}
        catalog={<CheckoutPageSkeleton />}
      />
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <ProductsHeroShell
        sectionAriaLabel="Checkout"
        compactHero
        {...CHECKOUT_PAGE_HERO_SHELL_MOBILE_PROPS}
        catalog={
          <div className={ACCOUNT_PAGE_INNER_CLASS}>
            <h1 className="mb-8 text-3xl font-bold text-gray-900">{t('checkout.title')}</h1>
            <CheckoutGlassCard className="text-center">
              <p className="mb-4 text-gray-600">{t('checkout.errors.cartEmpty')}</p>
              <button
                type="button"
                className={STOREFRONT_SKY_PILL_BUTTON_CLASS}
                onClick={() => router.push('/products')}
              >
                {t('checkout.buttons.continueShopping')}
              </button>
            </CheckoutGlassCard>
          </div>
        }
      />
    );
  }

  const showModals = showShippingModal || showCardModal;

  return (
    <ProductsHeroShell
      sectionAriaLabel="Checkout"
      compactHero
      {...CHECKOUT_PAGE_HERO_SHELL_MOBILE_PROPS}
      catalog={
        <div className={ACCOUNT_PAGE_INNER_CLASS}>
          <h1 className="mb-8 text-3xl font-bold text-gray-900">{t('checkout.title')}</h1>

          <form id={CHECKOUT_FORM_ID} noValidate onSubmit={onCheckoutSubmit}>
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3 lg:items-start">
              <CheckoutForm
                cart={cart}
                register={register}
                setValue={setValue}
                errors={errors}
                isSubmitting={isSubmitting}
                shippingMethod={shippingMethod}
                pickupStoreId={pickupStoreId}
                paymentMethod={paymentMethod}
                shippingCountry={shippingCountry}
                shippingCity={shippingCity}
                pickupStores={pickupStores}
                pickupStoresLoading={pickupStoresLoading}
                deliveryOptions={deliveryOptions}
                deliveryOptionsLoading={deliveryOptionsLoading}
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
                shippingCountry={shippingCountry}
                shippingCity={shippingCity}
                deliveryOptions={deliveryOptions}
                loadingDeliveryPrice={loadingDeliveryPrice}
                deliveryPrice={deliveryPrice}
                error={error}
                isSubmitting={isSubmitting}
                promoCode={promoCode}
                promoError={promoError}
                promoApplying={promoApplying}
                appliedPromoCode={appliedPromoCode}
                onPromoCodeChange={onPromoCodeChange}
                onApplyPromo={applyPromoCode}
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
              shippingCountry={shippingCountry}
              shippingCity={shippingCity}
              deliveryOptions={deliveryOptions}
              deliveryOptionsLoading={deliveryOptionsLoading}
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
      }
    />
  );
}
