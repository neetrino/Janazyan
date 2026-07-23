'use client';

import 'leaflet/dist/leaflet.css';

import { useEffect, useRef, useState } from 'react';
import type {
  DivIcon,
  Map as LeafletMap,
  Marker as LeafletMarker,
} from 'leaflet';
import {
  MAP_DEFAULT_CENTER,
  MAP_TILE_MAX_ZOOM,
  MAP_TILE_URL,
} from '@/features/stores/constants';
import {
  ARMENIA_MAP_BOUNDS,
  LOCATION_PICKER_COUNTRY_ZOOM,
  LOCATION_PICKER_MARKER_SIZE_PX,
  LOCATION_PICKER_PIN_ZOOM,
} from './location-picker.constants';

type PartnerStoreLocationPickerMapProps = {
  lat: number | null;
  lng: number | null;
  onChange: (coordinates: { lat: number; lng: number }) => void;
  ariaLabel: string;
};

type LeafletModule = typeof import('leaflet');

function createPickerMarkerIcon(L: LeafletModule): DivIcon {
  const size = LOCATION_PICKER_MARKER_SIZE_PX;
  return L.divIcon({
    className: '',
    html: `<span class="partner-store-marker partner-store-marker--selected"><span class="partner-store-marker-dot"></span></span>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size],
  });
}

/**
 * Clickable Armenia-focused map with a single draggable pin for admin store coordinates.
 */
export function PartnerStoreLocationPickerMap({
  lat,
  lng,
  onChange,
  ariaLabel,
}: PartnerStoreLocationPickerMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<LeafletMap | null>(null);
  const markerRef = useRef<LeafletMarker | null>(null);
  const leafletRef = useRef<LeafletModule | null>(null);
  const onChangeRef = useRef(onChange);
  const [mapReady, setMapReady] = useState(false);

  onChangeRef.current = onChange;

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

      const hasPin = lat !== null && lng !== null;
      const center: [number, number] = hasPin
        ? [lat, lng]
        : [MAP_DEFAULT_CENTER.lat, MAP_DEFAULT_CENTER.lng];
      const zoom = hasPin ? LOCATION_PICKER_PIN_ZOOM : LOCATION_PICKER_COUNTRY_ZOOM;

      const map = L.map(containerRef.current, {
        center,
        zoom,
        maxBounds: [
          [ARMENIA_MAP_BOUNDS.southWest.lat, ARMENIA_MAP_BOUNDS.southWest.lng],
          [ARMENIA_MAP_BOUNDS.northEast.lat, ARMENIA_MAP_BOUNDS.northEast.lng],
        ],
        maxBoundsViscosity: 1,
        scrollWheelZoom: true,
        attributionControl: false,
      });

      L.tileLayer(MAP_TILE_URL, {
        attribution: '',
        maxZoom: MAP_TILE_MAX_ZOOM,
      }).addTo(map);

      map.on('click', (event) => {
        onChangeRef.current({ lat: event.latlng.lat, lng: event.latlng.lng });
      });

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
      markerRef.current?.remove();
      markerRef.current = null;
      mapRef.current?.remove();
      mapRef.current = null;
      leafletRef.current = null;
      setMapReady(false);
    };
    // Initial center/zoom only — pin sync happens in the effect below.
    // eslint-disable-next-line react-hooks/exhaustive-deps -- mount once
  }, []);

  useEffect(() => {
    if (!mapReady) {
      return;
    }

    const map = mapRef.current;
    const L = leafletRef.current;
    if (!map || !L || lat === null || lng === null) {
      return;
    }

    if (!markerRef.current) {
      const marker = L.marker([lat, lng], {
        icon: createPickerMarkerIcon(L),
        draggable: true,
        zIndexOffset: 1000,
      });
      marker.on('dragend', () => {
        const position = marker.getLatLng();
        onChangeRef.current({ lat: position.lat, lng: position.lng });
      });
      marker.addTo(map);
      markerRef.current = marker;
      map.setView([lat, lng], Math.max(map.getZoom(), LOCATION_PICKER_PIN_ZOOM));
      return;
    }

    const current = markerRef.current.getLatLng();
    if (Math.abs(current.lat - lat) > 0.00001 || Math.abs(current.lng - lng) > 0.00001) {
      markerRef.current.setLatLng([lat, lng]);
    }
  }, [lat, lng, mapReady]);

  return (
    <div
      ref={containerRef}
      className="partner-stores-map h-full min-h-[420px] w-full rounded-b-2xl"
      role="region"
      aria-label={ariaLabel}
    />
  );
}
