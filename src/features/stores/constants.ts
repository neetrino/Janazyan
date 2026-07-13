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

/** OpenStreetMap raster tiles — attribution shown via page chrome, not Leaflet bar. */
export const MAP_TILE_URL = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
export const MAP_TILE_MAX_ZOOM = 19;

/** Below this width the store list stacks above the map (Tailwind `lg`). */
export const STORES_MAP_SCROLL_BREAKPOINT_PX = 1023;

/** Leaflet divIcon sizes — inactive markers stay compact; active stays prominent. */
export const MAP_MARKER_SIZE_INACTIVE_PX = 16;
export const MAP_MARKER_SIZE_ACTIVE_PX = 36;
export const MAP_MARKER_SIZE_INACTIVE_MOBILE_PX = 14;
export const MAP_MARKER_SIZE_ACTIVE_MOBILE_PX = 30;
