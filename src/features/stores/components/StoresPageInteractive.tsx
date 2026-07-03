'use client';

import dynamic from 'next/dynamic';
import { useCallback, useEffect, useRef, useState } from 'react';
import { MIRAGE_PAGE_SUBHEADING_CLASS } from '../../../components/home/mirage-heading-styles';
import { normalizePartnerStoreCoordinates } from '../coordinates';
import { STOREFRONT_TABLET_DOWN_CLASS } from '../../../lib/layout/storefront-layout.constants';
import { getStoredLanguage } from '../../../lib/language';
import { fetchPartnerStores } from '../fetch-partner-stores';
import { STORES_PAGE_MAP_HEIGHT_PX } from '../constants';
import { scrollPartnerMapIntoView } from '../scroll-to-map';
import { PartnerStoresDirectory } from './PartnerStoresDirectory';
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
        style={{ minHeight: STORES_PAGE_MAP_HEIGHT_PX }}
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
 * Interactive stores block — scalable directory + map only (header/footer rendered on server).
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
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(320px,0.42fr)_minmax(0,1fr)] lg:gap-8">
          <div className="relative z-10">
            <div className="partner-stores-directory-shell lg:sticky lg:top-28">
              <div className="partner-stores-directory-shell__header">
                <h2 className={MIRAGE_PAGE_SUBHEADING_CLASS}>
                  {copy.listTitle}
                </h2>
                <p className="partner-stores-directory-shell__subtitle">{copy.map.hint}</p>
              </div>
              <PartnerStoresDirectory
                stores={stores}
                selectedStoreId={resolvedSelectedStoreId}
                viewOnMapLabel={copy.viewOnMap}
                onSelect={handleStoreSelect}
                ariaLabel={copy.listTitle}
              />
            </div>
          </div>

          <div ref={mapSectionRef} className="scroll-mt-28">
            <div className="partner-stores-map-section lg:sticky lg:top-28">
              <div className="partner-stores-map-section__header">
                <h2 className={MIRAGE_PAGE_SUBHEADING_CLASS}>
                  {copy.map.title}
                </h2>
                <p className={`partner-stores-map-section__subtitle ${STOREFRONT_TABLET_DOWN_CLASS}`}>{copy.map.hint}</p>
              </div>
              <div className="partner-stores-map-shell">
                <PartnerStoresMap
                  stores={stores}
                  selectedStoreId={resolvedSelectedStoreId}
                  mapFocusRequest={mapFocusRequest}
                  onStoreSelect={handleStoreSelect}
                  ariaLabel={copy.map.ariaLabel}
                  getDirectionsLabel={copy.getDirections}
                  minHeightPx={STORES_PAGE_MAP_HEIGHT_PX}
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
