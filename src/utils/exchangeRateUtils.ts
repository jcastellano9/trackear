
import { ExchangeRate } from "@/types/exchangeRate";

export const calculateChange = (current: number, reference: number) => {
  if (!reference) return 0;
  return parseFloat(((current - reference) / reference * 100).toFixed(1));
};

export const formatExchangeRateValue = (value: number) => {
  if (typeof value !== 'number') return '-';
  
  if (value > 1000000) {
    return `$${(value / 1000000).toFixed(2)}M`;
  } else {
    return `$${value.toLocaleString('es-AR')}`;
  }
};

export const formatPercentage = (value: number) => {
  if (typeof value !== 'number') return '-';
  return `${Math.abs(value).toFixed(2)}%`;
};

// Map exchange rate names to their common icons or images
export const getExchangeRateIconPath = (rateName: string): string | null => {
  const name = rateName.toLowerCase();
  
  if (name.includes('oficial')) return '/icons/dolar-oficial.svg';
  if (name.includes('blue')) return '/icons/dolar-blue.svg';
  if (name.includes('bolsa') || name.includes('mep')) return '/icons/dolar-bolsa.svg';
  if (name.includes('contado con liquidación') || name.includes('ccl')) return '/icons/dolar-ccl.svg';
  if (name.includes('mayorista')) return '/icons/dolar-mayorista.svg';
  if (name.includes('cripto')) return '/icons/dolar-cripto.svg';
  if (name.includes('tarjeta')) return '/icons/dolar-tarjeta.svg';
  
  return null;
};
