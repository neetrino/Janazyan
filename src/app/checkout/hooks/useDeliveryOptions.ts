'use client';

import { useEffect, useState } from 'react';
import { fetchDeliveryOptionsCached } from '@/lib/delivery/fetch-delivery-options-cached';
import type { DeliveryOptionsPublic } from '@/lib/delivery/delivery-settings.types';

export function useDeliveryOptions() {
  const [options, setOptions] = useState<DeliveryOptionsPublic | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    const loadOptions = async () => {
      try {
        const data = await fetchDeliveryOptionsCached();
        if (active) {
          setOptions(data);
        }
      } catch {
        if (active) {
          setOptions(null);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    void loadOptions();

    return () => {
      active = false;
    };
  }, []);

  return { options, loading };
}
