'use client';

import { useState, useEffect } from 'react';
import { getStoredCurrency, initializeCurrencyRates, type CurrencyCode } from '../../lib/currency';

/**
 * Hook for managing currency state
 * @returns Current currency code
 */
export function useCurrency() {
  const [currency, setCurrency] = useState<CurrencyCode>(() => getStoredCurrency());
  const [, setRatesRefreshTick] = useState(0);

  useEffect(() => {
    const handleCurrencyUpdate = () => {
      setCurrency(getStoredCurrency());
    };

    const handleCurrencyRatesUpdate = () => {
      void initializeCurrencyRates(true).finally(() => {
        setCurrency(getStoredCurrency());
        setRatesRefreshTick((value) => value + 1);
      });
    };

    window.addEventListener('currency-updated', handleCurrencyUpdate);
    window.addEventListener('currency-rates-updated', handleCurrencyRatesUpdate);

    void initializeCurrencyRates().then(() => {
      setRatesRefreshTick((value) => value + 1);
    });

    return () => {
      window.removeEventListener('currency-updated', handleCurrencyUpdate);
      window.removeEventListener('currency-rates-updated', handleCurrencyRatesUpdate);
    };
  }, []);

  return currency;
}




