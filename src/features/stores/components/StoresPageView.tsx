'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import { Button } from '@shop/ui';
import { useTranslation } from '../../../lib/i18n-client';
import { getStoredLanguage } from '../../../lib/language';
import { fetchPartnerStores } from '../fetch-partner-stores';
import { loadStoresPageCopy } from '../load-stores-page-copy';
import { MAP_HEIGHT_PX } from '../constants';
import { PartnerStoresCarousel } from './PartnerStoresCarousel';
import type { PartnerStore, StoresTranslation } from '../types';

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

  const handleStoreSelect = useCallback((storeId: string) => {
    setSelectedStoreId(storeId);
  }, []);

  useEffect(() => {
    if (stores.length > 0 && !selectedStoreId) {
      setSelectedStoreId(stores[0].id);
    }
  }, [stores, selectedStoreId]);

  if (!copy) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center text-gray-500">
        {t('stores.map.loading')}
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <section className="py-12 md:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
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

      <section className="pb-16 md:pb-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-5 lg:gap-10">
            <div className="lg:col-span-2">
              <div className="overflow-visible lg:sticky lg:top-28">
                <h2 className="text-2xl font-bold text-gray-900">{copy.listTitle}</h2>
                <p className="mt-2 text-sm text-gray-500">{copy.map.hint}</p>
                <div className="mt-6 overflow-visible">
                  <PartnerStoresCarousel
                    stores={stores}
                    selectedStoreId={selectedStoreId}
                    getDirectionsLabel={copy.getDirections}
                    viewOnMapLabel={copy.viewOnMap}
                    onSelect={handleStoreSelect}
                    ariaLabel={copy.listTitle}
                  />
                </div>
              </div>
            </div>

            <div className="lg:col-span-3">
              <div className="lg:sticky lg:top-28">
                <h2 className="mb-4 text-2xl font-bold text-gray-900">{copy.map.title}</h2>
                <div className="overflow-hidden rounded-2xl border border-gray-200 shadow-lg">
                  <PartnerStoresMap
                    stores={stores}
                    selectedStoreId={selectedStoreId}
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

      <section className="border-t border-gray-100 bg-gray-50 py-14 md:py-16">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
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
    </div>
  );
}
