import { useCurrency as useSharedCurrency } from '../../../components/hooks/useCurrency';

export function useCurrency() {
  const currency = useSharedCurrency();

  return {
    currency,
  };
}




