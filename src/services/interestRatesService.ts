
import { InterestRate } from "@/types/interestRate";
import { MOCK_INTEREST_RATES } from "@/data/mockInterestRates";

// Function to fetch interest rates
export const fetchInterestRates = async (): Promise<InterestRate[]> => {
  // In a real app, this would be an API call
  // For example: return fetch('https://api.comparatasas.ar/rates').then(res => res.json())
  
  // Simulate API latency
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Return mock data
  return MOCK_INTEREST_RATES;
};

// Find best rate by currency
export const getBestRateByCurrency = (rates: InterestRate[], currency: string): InterestRate | null => {
  const currencyRates = rates?.filter(rate => rate.currency === currency) || [];
  if (currencyRates.length === 0) return null;
  
  return currencyRates.reduce((best, current) => {
    return current.annualRate > best.annualRate ? current : best;
  }, currencyRates[0]);
};

// Get all available currencies
export const getAvailableCurrencies = (rates: InterestRate[]): string[] => {
  if (!rates || rates.length === 0) return [];
  
  const currencies = new Set<string>();
  rates.forEach(rate => currencies.add(rate.currency));
  
  return Array.from(currencies);
};

// Filter rates by currency type (ARS, USD or CRYPTO)
export const filterRatesByCurrencyType = (rates: InterestRate[], currencyType: "ARS" | "CRYPTO"): InterestRate[] => {
  if (!rates) return [];
  
  return rates.filter(rate => {
    if (currencyType === "ARS") {
      return rate.currency === "ARS";
    } else {
      return rate.currency !== "ARS"; // All crypto currencies and USD
    }
  });
};

// Get notable cryptocurrencies for displaying separately
export const getNotableCryptocurrencies = (): string[] => {
  return ["BTC", "ETH", "USDT", "USDC", "DAI", "SOL", "BNB", "DOT", "ADA", "TRX", "AVAX"];
};
