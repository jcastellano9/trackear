
// Asset options for different investment types
export const cryptoOptions = [
  { value: "BTC", name: "Bitcoin", logo: "https://cryptologos.cc/logos/bitcoin-btc-logo.png?v=026" },
  { value: "ETH", name: "Ethereum", logo: "https://cryptologos.cc/logos/ethereum-eth-logo.png?v=026" },
  { value: "USDT", name: "Tether", logo: "https://cryptologos.cc/logos/tether-usdt-logo.png?v=026" },
  { value: "BNB", name: "Binance Coin", logo: "https://cryptologos.cc/logos/bnb-bnb-logo.png?v=026" },
  { value: "ADA", name: "Cardano", logo: "https://cryptologos.cc/logos/cardano-ada-logo.png?v=026" },
  { value: "SOL", name: "Solana", logo: "https://cryptologos.cc/logos/solana-sol-logo.png?v=026" },
  { value: "DOT", name: "Polkadot", logo: "https://cryptologos.cc/logos/polkadot-new-dot-logo.png?v=026" },
  { value: "USDC", name: "USD Coin", logo: "https://cryptologos.cc/logos/usd-coin-usdc-logo.png?v=026" },
  { value: "DAI", name: "Dai", logo: "https://cryptologos.cc/logos/multi-collateral-dai-dai-logo.png?v=026" },
];

export const cedearsOptions = [
  { value: "AAPL", name: "Apple Inc.", logo: "https://companieslogo.com/img/orig/AAPL-bf1a4314.png?t=1632523695" },
  { value: "MSFT", name: "Microsoft", logo: "https://companieslogo.com/img/orig/MSFT-1384f0.png?t=1632523036" },
  { value: "AMZN", name: "Amazon", logo: "https://companieslogo.com/img/orig/AMZN-e9f942e4.png?t=1632523695" },
  { value: "GOOGL", name: "Alphabet", logo: "https://companieslogo.com/img/orig/GOOGL-0ed88f7c.png?t=1633218227" },
  { value: "META", name: "Meta Platforms", logo: "https://companieslogo.com/img/orig/META-5599b38e.png?t=1669019645" },
  { value: "TSLA", name: "Tesla", logo: "https://companieslogo.com/img/orig/TSLA-6da00fb2.png?t=1633218227" },
  { value: "KO", name: "Coca-Cola", logo: "https://companieslogo.com/img/orig/KO-7fa7a6cc.png?t=1632521665" },
  { value: "NFLX", name: "Netflix", logo: "https://companieslogo.com/img/orig/NFLX-0fe98f41.png?t=1633218319" },
  { value: "NVDA", name: "NVIDIA", logo: "https://companieslogo.com/img/orig/NVDA-10b91e6d.png?t=1633218240" },
];

export const walletsOptions = [
  { value: "MP", name: "Mercado Pago", logo: "https://logodownload.org/wp-content/uploads/2019/06/mercado-pago-logo-1.png" },
  { value: "UALA", name: "Ualá", logo: "https://play-lh.googleusercontent.com/Av_0YMJmES8v_vvbHZ27umL1o5mlUh7FQhuH2tGrO36gI6TXQ4DI6PJtgjHCzCkQQA=w240-h480-rw" },
  { value: "NAR", name: "Naranja X", logo: "https://www.redusers.com/noticias/wp-content/uploads/2020/07/naranjax_logo.png" },
  { value: "BRU", name: "Brubank", logo: "https://play-lh.googleusercontent.com/exoS4C9cm_GQD-RFKG2LNK0_-KQYtnJNcHCTc-qEKYPRDHVUz0abUnNNHWmTjh2Hh4Pk" },
];

// Default favorite cryptocurrencies
export const defaultFavoriteCryptos = [
  { value: "USDT", name: "Tether", logo: "https://cryptologos.cc/logos/tether-usdt-logo.png?v=026" },
  { value: "DAI", name: "Dai", logo: "https://cryptologos.cc/logos/multi-collateral-dai-dai-logo.png?v=026" },
  { value: "USDC", name: "USD Coin", logo: "https://cryptologos.cc/logos/usd-coin-usdc-logo.png?v=026" },
];

// Helper function to get options based on investment type
export const getOptionsByType = (type: string) => {
  switch (type) {
    case "crypto":
      return cryptoOptions;
    case "cedears":
      return cedearsOptions;
    case "wallets":
      return walletsOptions;
    default:
      return [];
  }
};
