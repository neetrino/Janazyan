'use client';

import dynamic from 'next/dynamic';
import { X } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import {
  MAP_MODAL_MAP_MIN_HEIGHT_MOBILE_PX,
  MAP_MODAL_MAP_MIN_HEIGHT_PX,
  MAP_MODAL_Z_INDEX,
} from '../constants';
import { useStoresMobileViewport } from '../use-stores-mobile-viewport';
import type { PartnerStore } from '../types';

const PartnerStoresMap = dynamic(
  () =>
    import('./PartnerStoresMap').then((module) => ({
      default: module.PartnerStoresMap,
    })),
  {
    ssr: false,
    loading: () => (
      <div className="partner-stores-map-modal__loading" aria-hidden />
    ),
  },
);

type PartnerStoresMapModalProps = {
  isOpen: boolean;
  stores: PartnerStore[];
  selectedStoreId: string | null;
  mapFocusRequest: number;
  mapTitle: string;
  mapAriaLabel: string;
  getDirectionsLabel: string;
  closeLabel: string;
  onClose: () => void;
  onStoreSelect: (storeId: string) => void;
};

/**
 * Fullscreen overlay with a large interactive partner stores map.
 * Portals to document.body so it is not clipped by page shells or 3D carousel layers.
 */
export function PartnerStoresMapModal({
  isOpen,
  stores,
  selectedStoreId,
  mapFocusRequest,
  mapTitle,
  mapAriaLabel,
  getDirectionsLabel,
  closeLabel,
  onClose,
  onStoreSelect,
}: PartnerStoresMapModalProps) {
  const [isMounted, setIsMounted] = useState(false);
  const isMobile = useStoresMobileViewport();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    },
    [onClose],
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

  const modalMapMinHeightPx = isMobile
    ? MAP_MODAL_MAP_MIN_HEIGHT_MOBILE_PX
    : MAP_MODAL_MAP_MIN_HEIGHT_PX;

  const modal = (
    <div
      className="partner-stores-map-modal"
      style={{ zIndex: MAP_MODAL_Z_INDEX }}
      onClick={onClose}
      role="presentation"
    >
      <div
        className="partner-stores-map-modal__dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="partner-stores-map-modal-title"
        onClick={(event) => event.stopPropagation()}
      >
        <header className="partner-stores-map-modal__header">
          <div className="partner-stores-map-modal__header-copy">
            <h2 id="partner-stores-map-modal-title" className="partner-stores-map-modal__title">
              {mapTitle}
            </h2>
            <p className="partner-stores-map-modal__subtitle">{mapAriaLabel}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="partner-stores-map-modal__close"
            aria-label={closeLabel}
          >
            <X className="h-5 w-5" aria-hidden />
          </button>
        </header>

        <div className="partner-stores-map-modal__body">
          <PartnerStoresMap
            stores={stores}
            selectedStoreId={selectedStoreId}
            mapFocusRequest={mapFocusRequest}
            onStoreSelect={(storeId) => onStoreSelect(storeId)}
            ariaLabel={mapAriaLabel}
            getDirectionsLabel={getDirectionsLabel}
            minHeightPx={modalMapMinHeightPx}
          />
        </div>
      </div>
    </div>
  );

  return createPortal(modal, document.body);
}
