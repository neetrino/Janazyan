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

export type StoresTranslation = {
  subtitle: string;
  title: string;
  description: string;
  map: {
    title: string;
    hint: string;
    ariaLabel: string;
    loading: string;
  };
  listTitle: string;
  getDirections: string;
  viewOnMap: string;
  cantFind: {
    title: string;
    description: string;
    contactUs: string;
  };
};
