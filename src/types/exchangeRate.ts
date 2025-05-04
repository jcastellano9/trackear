
export type ExchangeRate = {
  name: string;
  buy: number;
  sell: number;
  change: number;
  reference?: boolean;
  logo?: string;
  coin?: string; // Added for crypto filtering
};
