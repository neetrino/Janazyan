'use client';

import { useMemo } from 'react';
import { useTranslation } from '../../lib/i18n-client';
import {
  CATEGORY_POSTER_CONFIG,
  WHY_CARD_CONFIG,
  type CategoryPosterConfig,
  type WhyCardConfig,
} from './constants';

export type CategoryPosterText = {
  title: [string, string];
  tag: string;
  caption: string;
};

export type WhyCardText = {
  index: string;
  titleA: string;
  titleB: string;
  description: string;
};

export function useCategoryPosterText(id: string): CategoryPosterText {
  const { t } = useTranslation();
  const base = `home.categories.${id}`;
  return {
    title: [t(`${base}.titleLine1`), t(`${base}.titleLine2`)],
    tag: t(`${base}.tag`),
    caption: t(`${base}.caption`),
  };
}

export function useWhyCardText(cardKey: WhyCardConfig['cardKey']): WhyCardText {
  const { t } = useTranslation();
  const base = `home.whyChooseUs.cards.${cardKey}`;
  return {
    index: t(`${base}.index`),
    titleA: t(`${base}.titleA`),
    titleB: t(`${base}.titleB`),
    description: t(`${base}.description`),
  };
}

export function useHomeCategoryPosters(): Array<
  CategoryPosterConfig & CategoryPosterText
> {
  const { t, lang } = useTranslation();

  return useMemo(
    () =>
      CATEGORY_POSTER_CONFIG.map((config) => {
        const base = `home.categories.${config.id}`;
        return {
          ...config,
          title: [t(`${base}.titleLine1`), t(`${base}.titleLine2`)],
          tag: t(`${base}.tag`),
          caption: t(`${base}.caption`),
        };
      }),
    [lang, t],
  );
}

export function useHomeWhyCards(): Array<WhyCardConfig & WhyCardText> {
  const { t, lang } = useTranslation();

  return useMemo(
    () =>
      WHY_CARD_CONFIG.map((config) => {
        const base = `home.whyChooseUs.cards.${config.cardKey}`;
        return {
          ...config,
          index: t(`${base}.index`),
          titleA: t(`${base}.titleA`),
          titleB: t(`${base}.titleB`),
          description: t(`${base}.description`),
        };
      }),
    [lang, t],
  );
}
