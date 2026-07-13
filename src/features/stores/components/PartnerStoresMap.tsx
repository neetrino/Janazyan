'use client';

import 'leaflet/dist/leaflet.css';

import { useEffect, useRef, useState } from 'react';
import { CAROUSEL_MOBILE_BREAKPOINT_PX } from '../carousel-constants';
import type {
  DivIcon,
  Map as LeafletMap,
  Marker as LeafletMarker,
} from 'leaflet';
import {
  MAP_DEFAULT_CENTER,
  MAP_DEFAULT_ZOOM,
  MAP_DEFAULT_ZOOM_MOBILE,
  MAP_HEIGHT_MOBILE_PX,
  MAP_HEIGHT_PX,
  MAP_MARKER_SIZE_ACTIVE_MOBILE_PX,
  MAP_MARKER_SIZE_ACTIVE_PX,
  MAP_MARKER_SIZE_INACTIVE_MOBILE_PX,
  MAP_MARKER_SIZE_INACTIVE_PX,
  MAP_SELECTED_ZOOM,
  MAP_SELECTED_ZOOM_MOBILE,
  MAP_TILE_MAX_ZOOM,
  MAP_TILE_URL,
} from '../constants';
import { resolvePartnerStoreMapPositions } from '../map-marker-positions';
import type { PartnerStore, StoreSelectHandler } from '../types';
import { getDirectionsUrl } from '../get-directions-url';
import { useStoresMobileViewport } from '../use-stores-mobile-viewport';

type PartnerStoresMapProps = {
  stores: PartnerStore[];
  selectedStoreId: string | null;
  /** Increments on each explicit "View on map" action to re-focus the same store. */
  mapFocusRequest?: number;
  onStoreSelect: StoreSelectHandler;
  ariaLabel: string;
  getDirectionsLabel: string;
  minHeightPx?: number;
};

type LeafletModule = typeof import('leaflet');

/** Leaflet flyTo throws when the map container has no layout size yet. */
function focusMapOnCoordinates(
  map: LeafletMap,
  latLng: [number, number],
  zoom: number,
): void {
  map.invalidateSize();
  map.stop();

  const { x, y } = map.getSize();
  if (x <= 0 || y <= 0) {
    map.setView(latLng, zoom, { animate: false });
    return;
  }

  const current = map.getCenter();
  const samePoint =
    Math.abs(current.lat - latLng[0]) < 0.00001 &&
    Math.abs(current.lng - latLng[1]) < 0.00001 &&
    Math.abs(map.getZoom() - zoom) < 0.01;

  if (samePoint) {
    map.panTo(latLng, { animate: true, duration: 0.25 });
    return;
  }

  map.flyTo(latLng, zoom, { duration: 0.75 });
}

function createMarkerIcon(
  L: LeafletModule,
  isSelected: boolean,
  compact: boolean,
): DivIcon {
  const size = compact
    ? isSelected
      ? MAP_MARKER_SIZE_ACTIVE_MOBILE_PX
      : MAP_MARKER_SIZE_INACTIVE_MOBILE_PX
    : isSelected
      ? MAP_MARKER_SIZE_ACTIVE_PX
      : MAP_MARKER_SIZE_INACTIVE_PX;

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
  mapFocusRequest = 0,
  onStoreSelect,
  ariaLabel,
  getDirectionsLabel,
  minHeightPx = MAP_HEIGHT_PX,
}: PartnerStoresMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<LeafletMap | null>(null);
  const markersRef = useRef<Map<string, LeafletMarker>>(new Map());
  const leafletRef = useRef<LeafletModule | null>(null);
  const [mapReady, setMapReady] = useState(false);
  const isMobile = useStoresMobileViewport();
  const selectedZoom = isMobile ? MAP_SELECTED_ZOOM_MOBILE : MAP_SELECTED_ZOOM;
  const resolvedMinHeightPx =
    minHeightPx === MAP_HEIGHT_PX && isMobile ? MAP_HEIGHT_MOBILE_PX : minHeightPx;
  const mapClassName = isMobile
    ? 'partner-stores-map partner-stores-map--mobile h-full w-full'
    : 'partner-stores-map h-full w-full min-h-[320px] rounded-2xl';

  const onStoreSelectRef = useRef(onStoreSelect);
  onStoreSelectRef.current = onStoreSelect;

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

      const initialZoom =
        typeof window !== 'undefined' &&
        window.matchMedia(`(max-width: ${CAROUSEL_MOBILE_BREAKPOINT_PX - 1}px)`)
          .matches
          ? MAP_DEFAULT_ZOOM_MOBILE
          : MAP_DEFAULT_ZOOM;

      const map = L.map(containerRef.current, {
        center: [MAP_DEFAULT_CENTER.lat, MAP_DEFAULT_CENTER.lng],
        zoom: initialZoom,
        scrollWheelZoom: true,
        attributionControl: false,
      });

      L.tileLayer(MAP_TILE_URL, {
        attribution: '',
        maxZoom: MAP_TILE_MAX_ZOOM,
      }).addTo(map);

      mapRef.current = map;
      map.invalidateSize();
      requestAnimationFrame(() => {
        if (cancelled || mapRef.current !== map) {
          return;
        }
        map.invalidateSize();
        setMapReady(true);
      });
    });

    return () => {
      cancelled = true;
      markersRef.current.clear();
      mapRef.current?.remove();
      mapRef.current = null;
      leafletRef.current = null;
      setMapReady(false);
    };
  }, []);

  useEffect(() => {
    if (!mapReady) {
      return;
    }

    const map = mapRef.current;
    const L = leafletRef.current;
    if (!map || !L) {
      return;
    }

    const positions = resolvePartnerStoreMapPositions(stores);

    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current.clear();

    stores.forEach((store) => {
      const coordinates = positions.get(store.id);
      if (!coordinates) {
        return;
      }

      const isSelected = store.id === selectedStoreId;
      const marker = L.marker([coordinates.lat, coordinates.lng], {
        icon: createMarkerIcon(L, isSelected, isMobile),
        zIndexOffset: isSelected ? 1000 : 0,
      });

      marker.bindPopup(
        `<div class="partner-store-popup">
          <p class="partner-store-popup-name">${store.name}</p>
          <p class="partner-store-popup-address">${store.address}</p>
          <a class="partner-store-popup-link" href="${getDirectionsUrl(coordinates.lat, coordinates.lng)}" target="_blank" rel="noopener noreferrer">${getDirectionsLabel}</a>
        </div>`,
      );

      marker.on('click', () => {
        onStoreSelectRef.current(store.id);
      });

      marker.addTo(map);
      markersRef.current.set(store.id, marker);
    });

    if (!selectedStoreId) {
      return;
    }

    const selectedPosition = positions.get(selectedStoreId);
    if (!selectedPosition) {
      return;
    }

    focusMapOnCoordinates(
      map,
      [selectedPosition.lat, selectedPosition.lng],
      selectedZoom,
    );

    const selectedMarker = markersRef.current.get(selectedStoreId);
    selectedMarker?.openPopup();
  }, [
    stores,
    selectedStoreId,
    getDirectionsLabel,
    isMobile,
    mapReady,
    mapFocusRequest,
    selectedZoom,
  ]);

  return (
    <div
      ref={containerRef}
      className={mapClassName}
      style={{ minHeight: resolvedMinHeightPx }}
      role="region"
      aria-label={ariaLabel}
    />
  );
}
