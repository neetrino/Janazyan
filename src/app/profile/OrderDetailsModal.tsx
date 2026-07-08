import { ChevronLeft } from 'lucide-react';
import { Button, Card } from '@shop/ui';
import { formatPriceInCurrency, convertPrice, type CurrencyCode } from '../../lib/currency';
import { PickupStoreDetails } from '../../components/orders/PickupStoreDetails';
import { isPickupStoreAddress } from '../../lib/types/pickup-store';
import { getStatusColor, getPaymentStatusColor, getColorValue } from './utils';
import type { OrderDetails } from './types';
import {
  PROFILE_BODY_TEXT_CLASS,
  PROFILE_PRIMARY_BUTTON_CLASS,
  PROFILE_SECTION_TITLE_CLASS,
  PROFILE_SPINNER_CLASS,
} from './profile-layout.constants';

interface OrderDetailsModalProps {
  selectedOrder: OrderDetails;
  orderDetailsLoading: boolean;
  orderDetailsError: string | null;
  isReordering: boolean;
  currency: CurrencyCode;
  onClose: () => void;
  onReOrder: () => void;
  t: (key: string) => string;
}

export function OrderDetailsModal({
  selectedOrder,
  orderDetailsLoading,
  orderDetailsError,
  isReordering,
  currency,
  onClose,
  onReOrder,
  t,
}: OrderDetailsModalProps) {
  const getAttributeLabel = (key: string): string => {
    if (key === 'color' || key === 'colour') return t('profile.orderDetails.color');
    if (key === 'size') return t('profile.orderDetails.size');
    return key.charAt(0).toUpperCase() + key.slice(1);
  };

  const getColorsArray = (colors: any): string[] => {
    if (!colors) return [];
    if (Array.isArray(colors)) return colors;
    if (typeof colors === 'string') {
      try {
        const parsed = JSON.parse(colors);
        return Array.isArray(parsed) ? parsed : [];
      } catch {
        return [];
      }
    }
    return [];
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-ink-900/40 transition-opacity"
        onClick={onClose}
      ></div>

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative transform overflow-hidden rounded-2xl bg-cream/95 shadow-xl ring-1 ring-sky-mist/60 transition-all w-full max-w-4xl max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="sticky top-0 z-10 flex items-center justify-between gap-3 border-b border-sky-mist/50 bg-cream/95 px-4 py-4 sm:px-6">
            <div className="flex min-w-0 flex-1 items-start gap-3">
              <button
                type="button"
                onClick={onClose}
                className="mt-0.5 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-sky-mist/70 bg-white text-ink-700 shadow-sm"
                aria-label={t('common.navigation.back')}
              >
                <ChevronLeft className="h-5 w-5" strokeWidth={2} aria-hidden />
              </button>
              <div className="min-w-0">
                <h2 className="text-xl font-bold text-ink-800 sm:text-2xl">{t('profile.orderDetails.title')}{selectedOrder.number}</h2>
                <p className={`mt-1 ${PROFILE_BODY_TEXT_CLASS}`}>
                  {t('profile.orderDetails.placedOn')} {new Date(selectedOrder.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-3">
              <Button
                onClick={onReOrder}
                disabled={isReordering}
                variant="primary"
                size="sm"
                className={PROFILE_PRIMARY_BUTTON_CLASS}
              >
                {isReordering ? t('profile.orderDetails.adding') : t('profile.orderDetails.reorder')}
              </Button>
            </div>
          </div>

          {/* Content */}
          <div className="px-6 py-6">
            {orderDetailsLoading ? (
              <div className="text-center py-12">
                <div className={`${PROFILE_SPINNER_CLASS} mx-auto mb-4 h-12 w-12`} />
                <p className={PROFILE_BODY_TEXT_CLASS}>{t('profile.orderDetails.loading')}</p>
              </div>
            ) : orderDetailsError ? (
              <div className="text-center py-12">
                <p className="mb-4 text-sale">{orderDetailsError}</p>
                <Button onClick={onClose} variant="outline">{t('profile.orderDetails.close')}</Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Order Details */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Status */}
                  <Card className="p-6">
                    <h3 className="text-lg font-semibold text-ink-800 mb-4">{t('profile.orderDetails.orderStatus')}</h3>
                    <div className="flex flex-wrap items-center gap-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedOrder.status)}`}>
                        {selectedOrder.status}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPaymentStatusColor(selectedOrder.paymentStatus)}`}>
                        {t('profile.orderDetails.payment')}: {selectedOrder.paymentStatus}
                      </span>
                    </div>
                  </Card>

                  {/* Order Items */}
                  <Card className="p-6">
                    <h3 className="text-lg font-semibold text-ink-800 mb-6">{t('profile.orderDetails.orderItems')}</h3>
                    <div className="space-y-4">
                      {selectedOrder.items.map((item, index) => {
                        const allOptions = item.variantOptions || [];
                        
                        return (
                          <div key={index} className="flex gap-4 pb-4 border-b border-sky-mist/50 last:border-0">
                            {item.imageUrl && (
                              <div className="h-24 w-24 flex-shrink-0 rounded-lg overflow-hidden bg-sky-mist/30 p-1 sm:h-28 sm:w-28">
                                <img 
                                  src={item.imageUrl} 
                                  alt={item.productTitle}
                                  className="h-full w-full object-contain"
                                />
                              </div>
                            )}
                            <div className="flex-1">
                              <h4 className="text-lg font-semibold text-ink-800 mb-1">{item.productTitle}</h4>
                              
                              {/* Display all variation options */}
                              {allOptions.length > 0 && (
                                <div className="flex flex-wrap gap-3 mt-2 mb-2">
                                  {allOptions.map((opt, optIndex) => {
                                    if (!opt.attributeKey || !opt.value) return null;
                                    
                                    const attributeKey = opt.attributeKey.toLowerCase().trim();
                                    const isColor = attributeKey === 'color' || attributeKey === 'colour';
                                    const displayLabel = opt.label || opt.value;
                                    const hasImage = opt.imageUrl && opt.imageUrl.trim() !== '';
                                    const colors = getColorsArray(opt.colors);
                                    const colorHex = colors.length > 0 ? colors[0] : (isColor ? getColorValue(opt.value) : null);
                                    
                                    return (
                                      <div key={optIndex} className="flex items-center gap-2">
                                        <span className="text-sm font-medium text-ink-700">
                                          {getAttributeLabel(opt.attributeKey)}:
                                        </span>
                                        <div className="flex items-center gap-2">
                                          {hasImage ? (
                                            <img 
                                              src={opt.imageUrl!} 
                                              alt={displayLabel}
                                              className="w-6 h-6 rounded border border-sky-mist/60 object-cover"
                                              onError={(e) => {
                                                (e.target as HTMLImageElement).style.display = 'none';
                                              }}
                                            />
                                          ) : isColor && colorHex ? (
                                            <div 
                                              className="w-5 h-5 rounded-full border border-sky-mist/60"
                                              style={{ backgroundColor: colorHex }}
                                              title={displayLabel}
                                            />
                                          ) : null}
                                          <span className="text-sm text-ink-800 capitalize">
                                            {displayLabel}
                                          </span>
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              )}
                              
                              <p className="text-sm text-ink-600">{t('profile.orderDetails.sku')}: {item.sku}</p>
                              <p className="text-sm text-ink-600 mt-2">
                                {t('profile.orderDetails.quantity')}: {item.quantity} × {(() => {
                                  const priceAMD = convertPrice(item.price, 'USD', 'AMD');
                                  const priceDisplay = currency === 'AMD' ? priceAMD : convertPrice(priceAMD, 'AMD', currency);
                                  return formatPriceInCurrency(priceDisplay, currency);
                                })()} = {(() => {
                                  const totalAMD = convertPrice(item.total, 'USD', 'AMD');
                                  const totalDisplay = currency === 'AMD' ? totalAMD : convertPrice(totalAMD, 'AMD', currency);
                                  return formatPriceInCurrency(totalDisplay, currency);
                                })()}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </Card>
                </div>

                {/* Order Summary + Shipping */}
                <div className="space-y-4">
                  <Card className="p-6 sticky top-4">
                    <h3 className="text-lg font-semibold text-ink-800 mb-6">{t('profile.orderDetails.orderSummary')}</h3>
                    <div className="space-y-4 mb-6">
                      {selectedOrder.totals ? (
                        <>
                          <div className="flex justify-between text-ink-600">
                            <span>{t('profile.orderDetails.subtotal')}</span>
                            <span>
                              {(() => {
                                const subtotalAMD = convertPrice(selectedOrder.totals.subtotal, 'USD', 'AMD');
                                const subtotalDisplay = currency === 'AMD' ? subtotalAMD : convertPrice(subtotalAMD, 'AMD', currency);
                                return formatPriceInCurrency(subtotalDisplay, currency);
                              })()}
                            </span>
                          </div>
                          {selectedOrder.totals.discount > 0 && (
                            <div className="flex justify-between text-ink-600">
                              <span>{t('profile.orderDetails.discount')}</span>
                              <span>
                                -{(() => {
                                  const discountAMD = convertPrice(selectedOrder.totals.discount, 'USD', 'AMD');
                                  const discountDisplay = currency === 'AMD' ? discountAMD : convertPrice(discountAMD, 'AMD', currency);
                                  return formatPriceInCurrency(discountDisplay, currency);
                                })()}
                              </span>
                            </div>
                          )}
                          <div className="flex justify-between text-ink-600">
                            <span>{t('profile.orderDetails.shipping')}</span>
                            <span>
                              {selectedOrder.shippingMethod === 'pickup' 
                                ? t('checkout.shipping.freePickup')
                                : (() => {
                                    const shippingAMD = selectedOrder.totals.shipping;
                                    const shippingDisplay = currency === 'AMD' ? shippingAMD : convertPrice(shippingAMD, 'AMD', currency);
                                    return formatPriceInCurrency(shippingDisplay, currency) + (selectedOrder.shippingAddress?.city ? ` (${selectedOrder.shippingAddress.city})` : '');
                                  })()}
                            </span>
                          </div>
                          <div className="flex justify-between text-ink-600">
                            <span>{t('profile.orderDetails.tax')}</span>
                            <span>
                              {(() => {
                                const taxAMD = convertPrice(selectedOrder.totals.tax, 'USD', 'AMD');
                                const taxDisplay = currency === 'AMD' ? taxAMD : convertPrice(taxAMD, 'AMD', currency);
                                return formatPriceInCurrency(taxDisplay, currency);
                              })()}
                            </span>
                          </div>
                          <div className="border-t border-sky-mist/50 pt-4">
                            <div className="flex justify-between text-lg font-bold text-ink-800">
                              <span>{t('profile.orderDetails.total')}</span>
                              <span>
                                {(() => {
                                  const subtotalAMD = convertPrice(selectedOrder.totals.subtotal, 'USD', 'AMD');
                                  const discountAMD = convertPrice(selectedOrder.totals.discount, 'USD', 'AMD');
                                  const shippingAMD = selectedOrder.totals.shipping;
                                  const taxAMD = convertPrice(selectedOrder.totals.tax, 'USD', 'AMD');
                                  const totalAMD = subtotalAMD - discountAMD + shippingAMD + taxAMD;
                                  const totalDisplay = currency === 'AMD' ? totalAMD : convertPrice(totalAMD, 'AMD', currency);
                                  return formatPriceInCurrency(totalDisplay, currency);
                                })()}
                              </span>
                            </div>
                          </div>
                        </>
                      ) : (
                        <div className="text-ink-600">{t('profile.orderDetails.loadingTotals')}</div>
                      )}
                    </div>
                  </Card>

                  {/* Shipping Method */}
                  <Card className="p-6">
                    <h3 className="text-lg font-semibold text-ink-800 mb-4">{t('profile.orderDetails.shippingMethod')}</h3>
                    <div className="text-ink-700 space-y-3">
                      <div>
                        <span className="font-medium">{t('profile.orderDetails.method')}: </span>
                        <span className="capitalize">
                          {selectedOrder.shippingMethod === 'delivery' ? t('profile.orderDetails.delivery') : 
                           selectedOrder.shippingMethod === 'pickup' ? t('profile.orderDetails.pickup') : 
                           selectedOrder.shippingMethod || t('profile.orderDetails.notSpecified')}
                        </span>
                      </div>
                      {selectedOrder.shippingMethod === 'delivery' && selectedOrder.shippingAddress && (
                        <div className="mt-3 pt-3 border-t border-sky-mist/50">
                          <p className="font-medium text-ink-800 mb-2">{t('profile.orderDetails.deliveryAddress')}:</p>
                          <div className="text-ink-600">
                            {selectedOrder.shippingAddress.firstName && selectedOrder.shippingAddress.lastName && (
                              <p>{selectedOrder.shippingAddress.firstName} {selectedOrder.shippingAddress.lastName}</p>
                            )}
                            {selectedOrder.shippingAddress.addressLine1 && <p>{selectedOrder.shippingAddress.addressLine1}</p>}
                            {selectedOrder.shippingAddress.addressLine2 && <p>{selectedOrder.shippingAddress.addressLine2}</p>}
                            {selectedOrder.shippingAddress.city && (
                              <p>
                                {selectedOrder.shippingAddress.city}
                                {selectedOrder.shippingAddress.postalCode && `, ${selectedOrder.shippingAddress.postalCode}`}
                              </p>
                            )}
                            {selectedOrder.shippingAddress.countryCode && <p>{selectedOrder.shippingAddress.countryCode}</p>}
                            {selectedOrder.shippingAddress.phone && <p className="mt-2">{t('profile.orderDetails.phone')}: {selectedOrder.shippingAddress.phone}</p>}
                          </div>
                        </div>
                      )}
                      {selectedOrder.shippingMethod === 'pickup' &&
                        isPickupStoreAddress(selectedOrder.shippingAddress) && (
                        <div className="mt-3 pt-3 border-t border-sky-mist/50">
                          <p className="font-medium text-ink-800 mb-2">
                            {t('profile.orderDetails.pickupStore')}:
                          </p>
                          <PickupStoreDetails pickupStore={selectedOrder.shippingAddress} />
                        </div>
                      )}
                    </div>
                  </Card>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}



