
import { ExchangeRate } from "@/types/exchangeRate";

export const calculateChange = (current: number, reference: number) => {
  if (!reference) return 0;
  return parseFloat(((current - reference) / reference * 100).toFixed(1));
};

export const formatExchangeRateValue = (value: number) => {
  if (value > 1000000) {
    return `$${(value / 1000000).toFixed(2)}M`;
  } else {
    return `$${value.toLocaleString('es-AR')}`;
  }
};

export const formatPercentage = (value: number) => {
  return `${Math.abs(value).toFixed(2)}%`;
};
