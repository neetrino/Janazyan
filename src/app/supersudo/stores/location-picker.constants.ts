/** Approximate SW/NE bounds so the picker stays focused on Armenia. */
export const ARMENIA_MAP_BOUNDS = {
  southWest: { lat: 38.75, lng: 43.35 },
  northEast: { lat: 41.35, lng: 46.75 },
} as const;

/** Country-level overview when opening the picker without a pin. */
export const LOCATION_PICKER_COUNTRY_ZOOM = 8;

/** Street-level zoom once a pin is placed or editing an existing point. */
export const LOCATION_PICKER_PIN_ZOOM = 15;

export const LOCATION_PICKER_MARKER_SIZE_PX = 28;
