'use client';

import dynamic from 'next/dynamic';
import { Search } from 'lucide-react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { normalizePartnerStoreCoordinates } from '../coordinates';
import { STOREFRONT_TABLET_DOWN_CLASS } from '../../../lib/layout/storefront-layout.constants';
import { getStoredLanguage } from '../../../lib/language';
import { fetchPartnerStores } from '../fetch-partner-stores';
import { filterPartnerStores } from '../filter-partner-stores';
import { STORES_PAGE_MAP_HEIGHT_PX } from '../constants';
import { scrollPartnerMapIntoView } from '../scroll-to-map';
import {
  STORES_PAGE_SEARCH_ICON_CLASS,
  STORES_PAGE_SEARCH_INPUT_CLASS,
  STORES_PAGE_SEARCH_WRAPPER_CLASS,
} from '../stores-page-search.constants';
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
 * Interactive stores block — partner stores directory + map.
 */
export function StoresPageInteractive({ copy, stores: initialStores }: StoresPageInteractiveProps) {
  const stores = usePartnerStoresOnLanguageChange(initialStores);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStoreId, setSelectedStoreId] = useState<string | null>(null);
  const [mapFocusRequest, setMapFocusRequest] = useState(0);
  const [mapModalOpen, setMapModalOpen] = useState(false);
  const mapSectionRef = useRef<HTMLDivElement>(null);

  const filteredStores = useMemo(
    () => filterPartnerStores(stores, searchQuery),
    [searchQuery, stores],
  );

  const handleStoreSelect = useCallback<StoreSelectHandler>((storeId, options) => {
    setSelectedStoreId(storeId);
    setMapFocusRequest((count) => count + 1);
    if (options?.openMapModal) {
      setMapModalOpen(true);
      return;
    }
    if (options?.scrollToMap) {
      scrollPartnerMapIntoView(mapSectionRef.current);
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
    filteredStores.find((store) => normalizePartnerStoreCoordinates(store.lat, store.lng) !== null)?.id ??
    stores.find((store) => normalizePartnerStoreCoordinates(store.lat, store.lng) !== null)?.id ??
    null;

  return (
    <section className="pb-10 md:pb-16">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(320px,0.42fr)_minmax(0,1fr)] lg:gap-8">
          <div className="relative z-10">
            <div className="partner-stores-directory-shell lg:sticky lg:top-28">
              <div className="partner-stores-directory-shell__header flex items-center justify-end">
                <label className={STORES_PAGE_SEARCH_WRAPPER_CLASS}>
                  <Search className={STORES_PAGE_SEARCH_ICON_CLASS} aria-hidden="true" />
                  <input
                    type="search"
                    value={searchQuery}
                    onChange={(event) => setSearchQuery(event.target.value)}
                    placeholder={copy.searchPlaceholder}
                    className={STORES_PAGE_SEARCH_INPUT_CLASS}
                    aria-label={copy.searchPlaceholder}
                  />
                </label>
              </div>
              {filteredStores.length === 0 ? (
                <p className="px-5 pb-5 text-sm text-gray-600">{copy.searchNoResults}</p>
              ) : (
                <PartnerStoresDirectory
                  stores={filteredStores}
                  selectedStoreId={resolvedSelectedStoreId}
                  viewOnMapLabel={copy.viewOnMap}
                  onSelect={handleStoreSelect}
                  ariaLabel={copy.title}
                />
              )}
            </div>
          </div>

          <div ref={mapSectionRef} className="scroll-mt-28">
            <div className="partner-stores-map-section lg:sticky lg:top-28">
              <div className="partner-stores-map-section__header">
                <p className={`partner-stores-map-section__subtitle ${STOREFRONT_TABLET_DOWN_CLASS}`}>
                  {copy.map.hint}
                </p>
              </div>
              <div className="partner-stores-map-shell">
                <PartnerStoresMap
                  stores={filteredStores}
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
        stores={filteredStores}
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
