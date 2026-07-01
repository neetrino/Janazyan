'use client';

import dynamic from 'next/dynamic';
import { useCallback, useEffect, useRef, useState } from 'react';
import { normalizePartnerStoreCoordinates } from '../coordinates';
import { getStoredLanguage } from '../../../lib/language';
import { fetchPartnerStores } from '../fetch-partner-stores';
import { MAP_HEIGHT_PX } from '../constants';
import { scrollPartnerMapIntoView } from '../scroll-to-map';
import { PartnerStoresCarousel } from './PartnerStoresCarousel';
import { PartnerStoresMapModal } from './PartnerStoresMapModal';
import type { PartnerStore, StoreSelectHandler, StoresTranslation } from '../types';

const PartnerStoresMap = dynamic(
  () =>
    import('./PartnerStoresMap').then((module) => ({
      default: module.PartnerStoresMap,
    })),
  {
    ssr: false,
    loading: () => (
      <div
        className="animate-pulse bg-gray-100"
        style={{ minHeight: MAP_HEIGHT_PX }}
        aria-hidden
      />
    ),
  },
);

type StoresPageInteractiveProps = {
  copy: StoresTranslation;
  stores: PartnerStore[];
};

function usePartnerStoresOnLanguageChange(initialStores: PartnerStore[]) {
  const [stores, setStores] = useState<PartnerStore[]>(initialStores);

  useEffect(() => {
    const onLanguageUpdated = async () => {
      const lang = getStoredLanguage();
      setStores(await fetchPartnerStores(lang));
    };
    window.addEventListener('language-updated', onLanguageUpdated);
    return () => window.removeEventListener('language-updated', onLanguageUpdated);
  }, []);

  return stores;
}

/**
 * Interactive stores block — carousel + map only (header/footer rendered on server).
 */
export function StoresPageInteractive({ copy, stores: initialStores }: StoresPageInteractiveProps) {
  const stores = usePartnerStoresOnLanguageChange(initialStores);
  const [selectedStoreId, setSelectedStoreId] = useState<string | null>(null);
  const [mapFocusRequest, setMapFocusRequest] = useState(0);
  const [mapModalOpen, setMapModalOpen] = useState(false);
  const mapSectionRef = useRef<HTMLDivElement>(null);

  const handleStoreSelect = useCallback<StoreSelectHandler>((storeId, options) => {
    setSelectedStoreId(storeId);
    if (options?.openMapModal) {
      setMapModalOpen(true);
      setMapFocusRequest((count) => count + 1);
      return;
    }
    if (options?.scrollToMap) {
      scrollPartnerMapIntoView(mapSectionRef.current);
      setMapFocusRequest((count) => count + 1);
    }
  }, []);

  const handleMapModalStoreSelect = useCallback((storeId: string) => {
    setSelectedStoreId(storeId);
    setMapFocusRequest((count) => count + 1);
  }, []);

  const closeMapModal = useCallback(() => {
    setMapModalOpen(false);
  }, []);

  const resolvedSelectedStoreId =
    selectedStoreId ??
    stores.find((store) => normalizePartnerStoreCoordinates(store.lat, store.lng) !== null)?.id ??
    null;

  return (
    <section className="pb-10 md:pb-16">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-5 lg:gap-10">
          <div className="relative z-10 lg:col-span-2">
            <div className="overflow-visible lg:sticky lg:top-28">
              <h2 className="text-2xl font-bold text-gray-900">{copy.listTitle}</h2>
              <p className="mt-2 text-sm text-gray-500">{copy.map.hint}</p>
              <div className="mt-6 -mx-6 w-[calc(100%+3rem)] overflow-visible sm:-mx-8 sm:w-[calc(100%+4rem)] md:mx-0 md:w-full">
                <PartnerStoresCarousel
                  stores={stores}
                  selectedStoreId={resolvedSelectedStoreId}
                  viewOnMapLabel={copy.viewOnMap}
                  onSelect={handleStoreSelect}
                  ariaLabel={copy.listTitle}
                />
              </div>
            </div>
          </div>

          <div ref={mapSectionRef} className="scroll-mt-28 lg:col-span-3">
            <div className="partner-stores-map-section lg:sticky lg:top-28">
              <div className="partner-stores-map-section__header">
                <h2 className="partner-stores-map-section__title">{copy.map.title}</h2>
                <p className="partner-stores-map-section__subtitle lg:hidden">{copy.map.hint}</p>
              </div>
              <div className="partner-stores-map-shell">
                <PartnerStoresMap
                  stores={stores}
                  selectedStoreId={resolvedSelectedStoreId}
                  mapFocusRequest={mapFocusRequest}
                  onStoreSelect={handleStoreSelect}
                  ariaLabel={copy.map.ariaLabel}
                  getDirectionsLabel={copy.getDirections}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <PartnerStoresMapModal
        isOpen={mapModalOpen}
        stores={stores}
        selectedStoreId={resolvedSelectedStoreId}
        mapFocusRequest={mapFocusRequest}
        mapTitle={copy.map.title}
        mapAriaLabel={copy.map.ariaLabel}
        getDirectionsLabel={copy.getDirections}
        closeLabel={copy.closeLabel}
        onClose={closeMapModal}
        onStoreSelect={handleMapModalStoreSelect}
      />
    </section>
  );
}
