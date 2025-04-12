
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
