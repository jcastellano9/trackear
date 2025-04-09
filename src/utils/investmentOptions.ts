
// Asset options for different investment types
export const cryptoOptions = [
  { value: "BTC", name: "Bitcoin", logo: "https://cryptologos.cc/logos/bitcoin-btc-logo.png" },
  { value: "ETH", name: "Ethereum", logo: "https://cryptologos.cc/logos/ethereum-eth-logo.png" },
  { value: "USDT", name: "Tether", logo: "https://cryptologos.cc/logos/tether-usdt-logo.png" },
  { value: "BNB", name: "Binance Coin", logo: "https://cryptologos.cc/logos/bnb-bnb-logo.png" },
  { value: "ADA", name: "Cardano", logo: "https://cryptologos.cc/logos/cardano-ada-logo.png" },
  { value: "SOL", name: "Solana", logo: "https://cryptologos.cc/logos/solana-sol-logo.png" },
  { value: "DOT", name: "Polkadot", logo: "https://cryptologos.cc/logos/polkadot-new-dot-logo.png" },
];

export const cedearsOptions = [
  { value: "AAPL", name: "Apple Inc.", logo: "https://companieslogo.com/img/orig/AAPL-bf1a4314.png" },
  { value: "MSFT", name: "Microsoft", logo: "https://companieslogo.com/img/orig/MSFT-1384f0.png" },
  { value: "AMZN", name: "Amazon", logo: "https://companieslogo.com/img/orig/AMZN-e9f942e4.png" },
  { value: "GOOGL", name: "Alphabet", logo: "https://companieslogo.com/img/orig/GOOGL-0ed88f7c.png" },
  { value: "META", name: "Meta Platforms", logo: "https://companieslogo.com/img/orig/META-5599b38e.png" },
  { value: "TSLA", name: "Tesla", logo: "https://companieslogo.com/img/orig/TSLA-6da00fb2.png" },
  { value: "KO", name: "Coca-Cola", logo: "https://companieslogo.com/img/orig/KO-7fa7a6cc.png" },
];

export const walletsOptions = [
  { value: "MP", name: "Mercado Pago", logo: "https://logodownload.org/wp-content/uploads/2019/06/mercado-pago-logo-1.png" },
  { value: "UALA", name: "Ualá", logo: "https://logos-marcas.com/wp-content/uploads/2021/03/Uala-Logo.png" },
  { value: "NAR", name: "Naranja X", logo: "https://www.redusers.com/noticias/wp-content/uploads/2020/07/naranjax_logo.png" },
  { value: "BRU", name: "Brubank", logo: "https://play-lh.googleusercontent.com/exoS4C9cm_GQD-RFKG2LNK0_-KQYtnJNcHCTc-qEKYPRDHVUz0abUnNNHWmTjh2Hh4Pk" },
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
