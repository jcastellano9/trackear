
// Asset options for different investment types
export const cryptoOptions = [
  { value: "BTC", name: "Bitcoin", symbol: "BTC", logo: "https://cryptologos.cc/logos/bitcoin-btc-logo.png?v=026" },
  { value: "ETH", name: "Ethereum", symbol: "ETH", logo: "https://cryptologos.cc/logos/ethereum-eth-logo.png?v=026" },
  { value: "USDT", name: "Tether", symbol: "USDT", logo: "https://cryptologos.cc/logos/tether-usdt-logo.png?v=026" },
  { value: "BNB", name: "Binance Coin", symbol: "BNB", logo: "https://cryptologos.cc/logos/bnb-bnb-logo.png?v=026" },
  { value: "ADA", name: "Cardano", symbol: "ADA", logo: "https://cryptologos.cc/logos/cardano-ada-logo.png?v=026" },
  { value: "SOL", name: "Solana", symbol: "SOL", logo: "https://cryptologos.cc/logos/solana-sol-logo.png?v=026" },
  { value: "DOT", name: "Polkadot", symbol: "DOT", logo: "https://cryptologos.cc/logos/polkadot-new-dot-logo.png?v=026" },
  { value: "USDC", name: "USD Coin", symbol: "USDC", logo: "https://cryptologos.cc/logos/usd-coin-usdc-logo.png?v=026" },
  { value: "DAI", name: "Dai", symbol: "DAI", logo: "https://cryptologos.cc/logos/multi-collateral-dai-dai-logo.png?v=026" },
];

export const cedearsOptions = [
  { value: "AAPL", name: "Apple Inc.", symbol: "AAPL", logo: "https://companieslogo.com/img/orig/AAPL-bf1a4314.png?t=1632523695", ratio: 20 },
  { value: "MSFT", name: "Microsoft", symbol: "MSFT", logo: "https://companieslogo.com/img/orig/MSFT-1384f0.png?t=1632523036", ratio: 10 },
  { value: "AMZN", name: "Amazon", symbol: "AMZN", logo: "https://companieslogo.com/img/orig/AMZN-e9f942e4.png?t=1632523695", ratio: 12 },
  { value: "GOOGL", name: "Alphabet", symbol: "GOOGL", logo: "https://companieslogo.com/img/orig/GOOGL-0ed88f7c.png?t=1633218227", ratio: 15 },
  { value: "META", name: "Meta Platforms", symbol: "META", logo: "https://companieslogo.com/img/orig/META-5599b38e.png?t=1669019645", ratio: 12 },
  { value: "TSLA", name: "Tesla", symbol: "TSLA", logo: "https://companieslogo.com/img/orig/TSLA-6da00fb2.png?t=1633218227", ratio: 15 },
  { value: "KO", name: "Coca-Cola", symbol: "KO", logo: "https://companieslogo.com/img/orig/KO-7fa7a6cc.png?t=1632521665", ratio: 5 },
  { value: "NFLX", name: "Netflix", symbol: "NFLX", logo: "https://companieslogo.com/img/orig/NFLX-0fe98f41.png?t=1633218319", ratio: 12 },
  { value: "NVDA", name: "NVIDIA", symbol: "NVDA", logo: "https://companieslogo.com/img/orig/NVDA-10b91e6d.png?t=1633218240", ratio: 20 },
  { value: "AAL", name: "American Airlines Gp", symbol: "AAL", ratio: 2 },
  { value: "ABBV", name: "Abbvie Inc", symbol: "ABBV", ratio: 10 },
  { value: "ABEV", name: "Ambev", symbol: "ABEV", ratio: 1 },
  { value: "ABNB", name: "Airbnb Inc", symbol: "ABNB", ratio: 15 },
  { value: "ABT", name: "Abbott Labs", symbol: "ABT", ratio: 4 },
];

// Default favorite cryptocurrencies
export const defaultFavoriteCryptos = [
  { value: "USDT", name: "Tether", symbol: "USDT", logo: "https://cryptologos.cc/logos/tether-usdt-logo.png?v=026" },
  { value: "DAI", name: "Dai", symbol: "DAI", logo: "https://cryptologos.cc/logos/multi-collateral-dai-dai-logo.png?v=026" },
  { value: "USDC", name: "USD Coin", symbol: "USDC", logo: "https://cryptologos.cc/logos/usd-coin-usdc-logo.png?v=026" },
];

// Helper function to get options based on investment type
export const getOptionsByType = (type: string) => {
  switch (type) {
    case "cripto":
      return cryptoOptions;
    case "cedear":
    case "cedears":
      return cedearsOptions;
    default:
      return [];
  }
};

// Helper function to find an asset by its value in any category
export const findAssetByValue = (value: string) => {
  return [...cryptoOptions, ...cedearsOptions].find(option => option.value === value);
};
