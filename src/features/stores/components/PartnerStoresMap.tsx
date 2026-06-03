'use client';

import { useEffect, useRef } from 'react';
import type {
  DivIcon,
  Map as LeafletMap,
  Marker as LeafletMarker,
} from 'leaflet';
import {
  MAP_DEFAULT_CENTER,
  MAP_DEFAULT_ZOOM,
  MAP_HEIGHT_PX,
  MAP_SELECTED_ZOOM,
} from '../constants';
import type { PartnerStore } from '../types';
import { getDirectionsUrl } from '../get-directions-url';

type PartnerStoresMapProps = {
  stores: PartnerStore[];
  selectedStoreId: string | null;
  onStoreSelect: (storeId: string) => void;
  ariaLabel: string;
  getDirectionsLabel: string;
};

type LeafletModule = typeof import('leaflet');

function createMarkerIcon(
  L: LeafletModule,
  isSelected: boolean,
): DivIcon {
  const size = isSelected ? 36 : 28;

  return L.divIcon({
    className: '',
    html: `<span class="partner-store-marker${isSelected ? ' partner-store-marker--selected' : ''}"><span class="partner-store-marker-dot"></span></span>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size],
    popupAnchor: [0, -size],
  });
}

/**
 * Interactive OpenStreetMap view with partner store markers.
 */
export function PartnerStoresMap({
  stores,
  selectedStoreId,
  onStoreSelect,
  ariaLabel,
  getDirectionsLabel,
}: PartnerStoresMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<LeafletMap | null>(null);
  const markersRef = useRef<Map<string, LeafletMarker>>(new Map());
  const leafletRef = useRef<LeafletModule | null>(null);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) {
      return undefined;
    }

    let cancelled = false;

    void import('leaflet').then((L) => {
      if (cancelled || !containerRef.current) {
        return;
      }

      leafletRef.current = L;

      const map = L.map(containerRef.current, {
        center: [MAP_DEFAULT_CENTER.lat, MAP_DEFAULT_CENTER.lng],
        zoom: MAP_DEFAULT_ZOOM,
        scrollWheelZoom: true,
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
        maxZoom: 19,
      }).addTo(map);

      mapRef.current = map;
    });

    return () => {
      cancelled = true;
      markersRef.current.clear();
      mapRef.current?.remove();
      mapRef.current = null;
      leafletRef.current = null;
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    const L = leafletRef.current;
    if (!map || !L) {
      return;
    }

    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current.clear();

    stores.forEach((store) => {
      const isSelected = store.id === selectedStoreId;
      const marker = L.marker([store.lat, store.lng], {
        icon: createMarkerIcon(L, isSelected),
      });

      marker.bindPopup(
        `<div class="partner-store-popup">
          <p class="partner-store-popup-name">${store.name}</p>
          <p class="partner-store-popup-address">${store.address}</p>
          <a class="partner-store-popup-link" href="${getDirectionsUrl(store.lat, store.lng)}" target="_blank" rel="noopener noreferrer">${getDirectionsLabel}</a>
        </div>`,
      );

      marker.on('click', () => {
        onStoreSelect(store.id);
      });

      marker.addTo(map);
      markersRef.current.set(store.id, marker);
    });
  }, [stores, selectedStoreId, onStoreSelect, getDirectionsLabel]);

  useEffect(() => {
    const map = mapRef.current;
    const L = leafletRef.current;
    if (!map || !L || !selectedStoreId) {
      return;
    }

    const selectedStore = stores.find((store) => store.id === selectedStoreId);
    if (!selectedStore) {
      return;
    }

    map.flyTo([selectedStore.lat, selectedStore.lng], MAP_SELECTED_ZOOM, {
      duration: 0.8,
    });

    const marker = markersRef.current.get(selectedStoreId);
    marker?.openPopup();
  }, [selectedStoreId, stores]);

  return (
    <div
      ref={containerRef}
      className="partner-stores-map h-full w-full min-h-[320px] rounded-2xl"
      style={{ minHeight: MAP_HEIGHT_PX }}
      role="region"
      aria-label={ariaLabel}
    />
  );
}
