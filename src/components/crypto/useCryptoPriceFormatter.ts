
import { useMemo } from 'react';

export const useCryptoPriceFormatter = () => {
  const formatPrice = useMemo(() => (price: number, coinName?: string) => {
    if (coinName === "BTC" || coinName === "ETH") {
      return `US$${price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }
    return `$${price.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }, []);

  return { formatPrice };
};
