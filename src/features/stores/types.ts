export type PartnerStoreTranslation = {
  id: string;
  name: string;
  address: string;
  logo: string;
  logoAlt: string;
};

export type PartnerStore = PartnerStoreTranslation & {
  lat: number;
  lng: number;
};

export type StoreSelectOptions = {
  /** Scroll the map section into view (mobile stacked layout). */
  scrollToMap?: boolean;
  /** Open the fullscreen map overlay focused on the selected store. */
  openMapModal?: boolean;
};

export type StoreSelectHandler = (
  storeId: string,
  options?: StoreSelectOptions,
) => void;

export type StoresTranslation = {
  title: string;
  description: string;
  map: {
    title: string;
    hint: string;
    ariaLabel: string;
    loading: string;
  };
  listTitle: string;
  searchPlaceholder: string;
  searchNoResults: string;
  getDirections: string;
  viewOnMap: string;
  closeLabel: string;
  cantFind: {
    title: string;
    description: string;
    contactUs: string;
  };
};

