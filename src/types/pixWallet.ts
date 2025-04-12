
export type PixWallet = {
  name: string;
  logo?: string;
  exchangeRate: number;
  fee: number;
  processingTime: string;
  minimumAmount: number;
  maximumAmount?: number;
  features: string[];
  lastUpdated: string;
};
