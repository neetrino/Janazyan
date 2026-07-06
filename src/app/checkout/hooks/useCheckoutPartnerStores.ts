'use client';

import { useEffect, useState } from 'react';
import { fetchPartnerStores } from '@/features/stores/fetch-partner-stores';
import type { PartnerStore } from '@/features/stores/types';
import { getStoredLanguage } from '../../../lib/language';

export function useCheckoutPartnerStores() {
  const [stores, setStores] = useState<PartnerStore[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const loadStores = async () => {
      setLoading(true);
      try {
        const lang = getStoredLanguage();
        const nextStores = await fetchPartnerStores(lang);
        if (!cancelled) {
          setStores(nextStores);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    void loadStores();

    const onLanguageUpdated = () => {
      void loadStores();
    };

    window.addEventListener('language-updated', onLanguageUpdated);
    return () => {
      cancelled = true;
      window.removeEventListener('language-updated', onLanguageUpdated);
    };
  }, []);

  return { stores, loading };
}
