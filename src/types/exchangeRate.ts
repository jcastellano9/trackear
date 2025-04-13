
export interface ExchangeRate {
  name: string;
  buy: number;
  sell: number;
  change: number;
  reference?: boolean;
  logo?: string;
}
