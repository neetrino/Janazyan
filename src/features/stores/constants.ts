/** Shared storefront logo when a partner store has no uploaded photo. */
export const PARTNER_STORE_DEFAULT_LOGO = '/mage_shop.svg';

/** True when the storefront image is an uploaded photo, not the default mark. */
export function isCustomPartnerStoreImage(logo: string): boolean {
  return logo.length > 0 && logo !== PARTNER_STORE_DEFAULT_LOGO;
}

/** Default map center — Yerevan. */
export const MAP_DEFAULT_CENTER = {
  lat: 40.1772,
  lng: 44.5126,
} as const;

export const MAP_DEFAULT_ZOOM = 12;
export const MAP_SELECTED_ZOOM = 15;
export const MAP_DEFAULT_ZOOM_MOBILE = 11;
export const MAP_SELECTED_ZOOM_MOBILE = 13;

export const MAP_HEIGHT_PX = 480;
export const MAP_HEIGHT_MOBILE_PX = 320;
export const STORES_PAGE_MAP_HEIGHT_PX = 640;
export const MAP_MODAL_MAP_MIN_HEIGHT_PX = 560;
export const MAP_MODAL_MAP_MIN_HEIGHT_MOBILE_PX = 420;
export const MAP_MODAL_Z_INDEX = 9999;

const YANDEX_MAP_TILE_LANG: Record<string, string> = {
  hy: 'hy_AM',
  ru: 'ru_RU',
  en: 'en_US',
};

/**
 * Yandex roadmap tiles in Web Mercator so they align with Leaflet.
 * `{x}`, `{y}`, and `{z}` are filled by Leaflet.
 */
export function buildYandexMapTileUrl(locale: string): string {
  const lang = YANDEX_MAP_TILE_LANG[locale] ?? YANDEX_MAP_TILE_LANG.hy;
  return `https://core-renderer-tiles.maps.yandex.net/tiles?l=map&x={x}&y={y}&z={z}&scale=1&lang=${lang}&projection=web_mercator`;
}

export const MAP_TILE_MAX_ZOOM = 19;

/** Below this width the store list stacks above the map (Tailwind `lg`). */
export const STORES_MAP_SCROLL_BREAKPOINT_PX = 1023;

/** Leaflet divIcon sizes — inactive markers stay compact; active stays prominent. */
export const MAP_MARKER_SIZE_INACTIVE_PX = 12;
export const MAP_MARKER_SIZE_ACTIVE_PX = 24;
export const MAP_MARKER_SIZE_INACTIVE_MOBILE_PX = 10;
export const MAP_MARKER_SIZE_ACTIVE_MOBILE_PX = 20;
