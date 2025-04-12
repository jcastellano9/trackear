
export type InterestRateType = "wallet" | "fixed" | "bank" | "fund";
export type InterestRateCurrency = "ARS" | "USD" | "USDT" | "DAI" | "USDC";

export type InterestRate = {
  provider: string;
  logo?: string;
  type: InterestRateType;
  annualRate: number;
  minAmount?: number;
  maxAmount?: number;
  term?: number; // days
  currency: InterestRateCurrency;
  features: string[];
  lastUpdated: string;
};
