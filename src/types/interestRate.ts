
export type InterestRateType = "wallet" | "fixed" | "bank" | "fund";
export type InterestRateCurrency = "ARS" | "USD" | "USDT" | "DAI" | "USDC" | "BTC" | "ETH" | "SOL" | "BNB" | "AVAX" | "DOT" | "ADA" | "TRX";

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

// New interface for wallet comparison data
export interface CryptoWalletComparison {
  crypto: {
    name: string;
    symbol: string;
    logo: string;
  };
  rates: {
    [provider: string]: number | null;
  };
}
