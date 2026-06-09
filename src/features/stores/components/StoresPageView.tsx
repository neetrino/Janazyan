'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Button } from '@shop/ui';
import { ProductsHeroShell } from '../../../components/products/ProductsHeroShell';
import { useTranslation } from '../../../lib/i18n-client';
import { normalizePartnerStoreCoordinates } from '../coordinates';
import { getStoredLanguage } from '../../../lib/language';
import { fetchPartnerStores } from '../fetch-partner-stores';
import { loadStoresPageCopy } from '../load-stores-page-copy';
import { MAP_HEIGHT_PX } from '../constants';
import { scrollPartnerMapIntoView } from '../scroll-to-map';
import { PartnerStoresCarousel } from './PartnerStoresCarousel';
import type { PartnerStore, StoreSelectHandler, StoresTranslation } from '../types';

import 'leaflet/dist/leaflet.css';

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

function usePartnerStoresContent() {
  const [copy, setCopy] = useState<StoresTranslation | null>(null);
  const [stores, setStores] = useState<PartnerStore[]>([]);

  useEffect(() => {
    const load = async () => {
      const lang = getStoredLanguage();
      setCopy(loadStoresPageCopy(lang));
      const loadedStores = await fetchPartnerStores(lang);
      setStores(loadedStores);
    };

    void load();
    const onLanguageUpdated = () => {
      void load();
    };
    window.addEventListener('language-updated', onLanguageUpdated);
    return () => window.removeEventListener('language-updated', onLanguageUpdated);
  }, []);

  return { copy, stores };
}

/**
 * Our Stores page — partner locations with interactive map.
 */
export function StoresPageView() {
  const { t } = useTranslation();
  const { copy, stores } = usePartnerStoresContent();
  const [selectedStoreId, setSelectedStoreId] = useState<string | null>(null);
  const [mapFocusRequest, setMapFocusRequest] = useState(0);
  const mapSectionRef = useRef<HTMLDivElement>(null);

  const handleStoreSelect = useCallback<StoreSelectHandler>((storeId, options) => {
    setSelectedStoreId(storeId);
    if (options?.scrollToMap) {
      scrollPartnerMapIntoView(mapSectionRef.current);
      setMapFocusRequest((count) => count + 1);
    }
  }, []);

  const resolvedSelectedStoreId =
    selectedStoreId ??
    stores.find((store) => normalizePartnerStoreCoordinates(store.lat, store.lng) !== null)?.id ??
    null;

  if (!copy) {
    return (
      <ProductsHeroShell
        sectionAriaLabel="Our stores"
        catalog={
          <div className="flex min-h-[50vh] items-center justify-center text-gray-500">
            {t('stores.map.loading')}
          </div>
        }
      />
    );
  }

  return (
    <ProductsHeroShell
      sectionAriaLabel="Our stores"
      catalog={
        <>
          <section className="py-8 md:py-12">
            <div className="mx-auto max-w-7xl">
              <div className="mx-auto max-w-3xl text-center">
                <p className="text-sm font-semibold uppercase tracking-wider text-[#7CB342] md:text-base">
                  {copy.subtitle}
                </p>
                <h1 className="mt-3 text-4xl font-bold leading-tight text-gray-900 md:text-5xl">
                  {copy.title}
                </h1>
                <p className="mt-4 text-base leading-relaxed text-gray-600 md:text-lg">
                  {copy.description}
                </p>
              </div>
            </div>
          </section>

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
                        getDirectionsLabel={copy.getDirections}
                        viewOnMapLabel={copy.viewOnMap}
                        onSelect={handleStoreSelect}
                        ariaLabel={copy.listTitle}
                      />
                    </div>
                  </div>
                </div>

                <div ref={mapSectionRef} className="scroll-mt-28 lg:col-span-3">
                  <div className="partner-stores-map-section lg:sticky lg:top-28">
                    <h2 className="mb-4 text-2xl font-bold text-gray-900">{copy.map.title}</h2>
                    <div className="overflow-hidden rounded-2xl border border-gray-200 shadow-lg">
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
          </section>

          <section className="border-t border-gray-100 py-14 md:py-16">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="text-2xl font-bold text-gray-900 md:text-3xl">
                {copy.cantFind.title}
              </h2>
              <p className="mt-3 text-gray-600">{copy.cantFind.description}</p>
              <Link href="/contact" className="mt-6 inline-block">
                <Button variant="primary" size="lg">
                  {copy.cantFind.contactUs}
                </Button>
              </Link>
            </div>
          </section>
        </>
      }
    />
  );
}
