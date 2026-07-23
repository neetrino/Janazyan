'use client';

import dynamic from 'next/dynamic';
import { X } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { Button } from '@shop/ui';
import { MAP_MODAL_Z_INDEX } from '@/features/stores/constants';
import { useTranslation } from '../../../lib/i18n-client';

const PartnerStoreLocationPickerMap = dynamic(
  () =>
    import('./PartnerStoreLocationPickerMap').then((module) => ({
      default: module.PartnerStoreLocationPickerMap,
    })),
  {
    ssr: false,
    loading: () => <div className="partner-stores-map-modal__loading" aria-hidden />,
  },
);

type PartnerStoreLocationPickerModalProps = {
  isOpen: boolean;
  initialLat: number | null;
  initialLng: number | null;
  onClose: () => void;
  onConfirm: (coordinates: { lat: number; lng: number }) => void | Promise<void>;
};

/**
 * Admin modal to place a store pin on an Armenia-focused OpenStreetMap view.
 */
export function PartnerStoreLocationPickerModal({
  isOpen,
  initialLat,
  initialLng,
  onClose,
  onConfirm,
}: PartnerStoreLocationPickerModalProps) {
  const { t } = useTranslation();
  const [isMounted, setIsMounted] = useState(false);
  const [mapReady, setMapReady] = useState(false);
  const [draftLat, setDraftLat] = useState<number | null>(null);
  const [draftLng, setDraftLng] = useState<number | null>(null);
  const [confirming, setConfirming] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isOpen) {
      setMapReady(false);
      setConfirming(false);
      return;
    }
    setDraftLat(initialLat);
    setDraftLng(initialLng);
    setMapReady(true);
  }, [isOpen, initialLat, initialLng]);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !confirming) {
        onClose();
      }
    },
    [confirming, onClose],
  );

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown, isOpen]);

  if (!isOpen || !isMounted) {
    return null;
  }

  const confirmedLat = draftLat;
  const confirmedLng = draftLng;
  const canConfirm = confirmedLat !== null && confirmedLng !== null && !confirming;

  const modal = (
    <div
      className="partner-stores-map-modal"
      style={{ zIndex: MAP_MODAL_Z_INDEX }}
      onClick={() => {
        if (!confirming) {
          onClose();
        }
      }}
      role="presentation"
    >
      <div
        className="partner-stores-map-modal__dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="partner-store-location-picker-title"
        onClick={(event) => event.stopPropagation()}
      >
        <header className="partner-stores-map-modal__header">
          <div className="partner-stores-map-modal__header-copy">
            <h2
              id="partner-store-location-picker-title"
              className="partner-stores-map-modal__title"
            >
              {t('admin.partnerStores.pickOnMapTitle')}
            </h2>
            <p className="partner-stores-map-modal__subtitle">
              {t('admin.partnerStores.pickOnMapHint')}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="partner-stores-map-modal__close"
            aria-label={t('admin.partnerStores.cancel')}
            disabled={confirming}
          >
            <X className="h-5 w-5" aria-hidden />
          </button>
        </header>

        <div className="partner-stores-map-modal__body">
          {mapReady ? (
            <PartnerStoreLocationPickerMap
              lat={draftLat}
              lng={draftLng}
              onChange={(coordinates) => {
                setDraftLat(coordinates.lat);
                setDraftLng(coordinates.lng);
              }}
              ariaLabel={t('admin.partnerStores.pickOnMapTitle')}
            />
          ) : (
            <div className="partner-stores-map-modal__loading" aria-hidden />
          )}
        </div>

        <footer className="flex shrink-0 items-center justify-between gap-3 border-t border-white/55 px-4 py-3">
          <p className="min-w-0 truncate text-xs text-slate-500">
            {canConfirm || confirming
              ? `${t('admin.partnerStores.latitude')}: ${confirmedLat?.toFixed(6)}, ${t('admin.partnerStores.longitude')}: ${confirmedLng?.toFixed(6)}`
              : t('admin.partnerStores.pickOnMapEmpty')}
          </p>
          <div className="flex shrink-0 gap-2">
            <Button type="button" variant="outline" onClick={onClose} disabled={confirming}>
              {t('admin.partnerStores.cancel')}
            </Button>
            <Button
              type="button"
              variant="primary"
              disabled={!canConfirm}
              onClick={() => {
                if (confirmedLat === null || confirmedLng === null) {
                  return;
                }
                setConfirming(true);
                void Promise.resolve(onConfirm({ lat: confirmedLat, lng: confirmedLng })).finally(
                  () => {
                    setConfirming(false);
                  },
                );
              }}
            >
              {confirming
                ? t('admin.partnerStores.resolvingLocation')
                : t('admin.partnerStores.useThisLocation')}
            </Button>
          </div>
        </footer>
      </div>
    </div>
  );

  return createPortal(modal, document.body);
}
