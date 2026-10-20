import { DELIVERY_DEFAULT_PRICE_AMD } from './delivery-settings.constants';
import type {
  DeliveryNameTranslation,
  DeliverySettings,
  DeliveryZone,
} from './delivery-settings.types';

const FIXED_REGION_PRICE = {
  type: 'fixed' as const,
  price: DELIVERY_DEFAULT_PRICE_AMD,
};

function translatedName(hy: string, en: string, ru: string): DeliveryNameTranslation[] {
  return [
    { locale: 'hy', text: hy },
    { locale: 'en', text: en },
    { locale: 'ru', text: ru },
  ];
}

function regionZone(slug: string, hy: string, en: string, ru: string): DeliveryZone {
  return {
    id: `zone-${slug}`,
    name: en,
    names: translatedName(hy, en, ru),
    slug,
    pricing: FIXED_REGION_PRICE,
    extraFields: [],
  };
}

/** Yerevan first, then the ten marzes in Armenian alphabetical order. */
const ARMENIA_ZONES: DeliveryZone[] = [
  regionZone('yerevan', 'Երևան', 'Yerevan', 'Ереван'),
  regionZone('aragatsotn', 'Արագածոտն', 'Aragatsotn', 'Арагацотн'),
  regionZone('ararat', 'Արարատ', 'Ararat', 'Арарат'),
  regionZone('armavir', 'Արմավիր', 'Armavir', 'Армавир'),
  regionZone('gegharkunik', 'Գեղարքունիք', 'Gegharkunik', 'Гегаркуник'),
  regionZone('lori', 'Լոռի', 'Lori', 'Лори'),
  regionZone('kotayk', 'Կոտայք', 'Kotayk', 'Котайк'),
  regionZone('shirak', 'Շիրակ', 'Shirak', 'Ширак'),
  regionZone('syunik', 'Սյունիք', 'Syunik', 'Сюник'),
  regionZone('vayots-dzor', 'Վայոց ձոր', 'Vayots Dzor', 'Вайоц Дзор'),
  regionZone('tavush', 'Տավուշ', 'Tavush', 'Тавуш'),
];

export const DEFAULT_DELIVERY_SETTINGS: DeliverySettings = {
  version: 2,
  countries: [
    {
      id: 'country-armenia',
      name: 'Armenia',
      names: translatedName('Հայաստան', 'Armenia', 'Армения'),
      zones: ARMENIA_ZONES,
    },
  ],
};
