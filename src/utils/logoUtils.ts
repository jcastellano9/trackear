
/**
 * Utility functions for working with asset logos
 */

// Base URL for icons.com.ar API
const ICONS_BASE_URL = "https://icons.com.ar";

/**
 * Gets the logo URL for a ticker symbol
 * @param symbol The ticker symbol (e.g., AAPL, GOOGL)
 * @param type The type of asset ("cedear" or "cripto")
 * @returns URL for the logo image
 */
export const getLogoUrl = (symbol: string | null | undefined, type: "cripto" | "cedear" | string): string => {
  if (!symbol) return generateFallbackLogo(symbol || "?");
  
  // Normalize the symbol (remove spaces, uppercase)
  const normalizedSymbol = symbol.trim().toUpperCase();
  
  // For CEDEARs, use icons.com.ar API
  if (type === "cedear") {
    return `${ICONS_BASE_URL}/logos/${normalizedSymbol}.png`;
  }
  
  // For crypto, use cryptologos.cc
  if (type === "cripto") {
    // Special handling for specific cryptos
    if (normalizedSymbol === "BTC") return "https://cryptologos.cc/logos/bitcoin-btc-logo.png";
    if (normalizedSymbol === "ETH") return "https://cryptologos.cc/logos/ethereum-eth-logo.png";
    if (normalizedSymbol === "USDT") return "https://cryptologos.cc/logos/tether-usdt-logo.png";
    if (normalizedSymbol === "USDC") return "https://cryptologos.cc/logos/usd-coin-usdc-logo.png";
    if (normalizedSymbol === "DAI") return "https://cryptologos.cc/logos/multi-collateral-dai-dai-logo.png";
    if (normalizedSymbol === "BNB") return "https://cryptologos.cc/logos/bnb-bnb-logo.png";
    if (normalizedSymbol === "SOL") return "https://cryptologos.cc/logos/solana-sol-logo.png";
    if (normalizedSymbol === "ADA") return "https://cryptologos.cc/logos/cardano-ada-logo.png";
    if (normalizedSymbol === "DOT") return "https://cryptologos.cc/logos/polkadot-new-dot-logo.png";
    if (normalizedSymbol === "MATIC") return "https://cryptologos.cc/logos/polygon-matic-logo.png";
    
    // Try general format if not in the special cases
    return `https://cryptologos.cc/logos/${normalizedSymbol.toLowerCase()}-${normalizedSymbol.toLowerCase()}-logo.png`;
  }
  
  // Fallback for unknown types
  return generateFallbackLogo(normalizedSymbol);
};

/**
 * Generates a fallback logo using UI Avatars
 * @param text Text to use for the avatar
 * @returns URL for a generated avatar
 */
export const generateFallbackLogo = (text: string): string => {
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(text)}&background=random&bold=true&size=128`;
};

/**
 * Gets the URL for a bank or wallet logo
 * @param name Name of the bank or wallet
 * @returns URL for the logo
 */
export const getBankOrWalletLogo = (name: string): string => {
  // Normalize the name (lowercase, trim)
  const normalizedName = name.trim().toLowerCase();
  
  // Map of common wallets and exchanges to their logos
  const walletLogoMap: Record<string, string> = {
    'binance': 'https://cryptologos.cc/logos/binance-coin-bnb-logo.png',
    'buenbit': 'https://play-lh.googleusercontent.com/2Rc-l3M-xNHrw9Ix43Z9-99ntLYBFZO6O8gYBHQXQyuR1QxPfFRUnp9n-oRR3ioFwQ',
    'letsbit': 'https://play-lh.googleusercontent.com/WQDQpVJa28N_UpNHGBxqgUUm2bDqfCtz7lkbR2IaL3MFbkCEZKOCmpXOXMcxD6dOUas',
    'belo': 'https://play-lh.googleusercontent.com/RoAXmMNHCURBW8FtDzx7Ex1_oKQRdO71-A8Jyz6uxA6K9wuLMc41PsHPDyJpxxRRXg',
    'ripio': 'https://play-lh.googleusercontent.com/FudHuxG1Fnrpn21RxooK1XneYMgzAmi7Qb8Uds8cW-bCn1GC4hkMOVgRgDjQXZDM70w',
    'lemon': 'https://play-lh.googleusercontent.com/Vd4W8OxV1z6VP0xTZxLrVyh5CfQN5pM8GUwDI8zBn5NYmj6w3Ao_V_6a0FHRcCsg0cw',
    'fiwind': 'https://fiwind.io/favicon/android-chrome-192x192.png',
    'satoshitango': 'https://play-lh.googleusercontent.com/72NVZ6HZnf91C3okaC2Xl7npHDj6PpuKGZlrWfLv3qJPg_4m-n4pR_nrOGiQGpQ8rA',
    'cocos': 'https://play-lh.googleusercontent.com/ncVWLzjteijpbpmdBnfF51q2ydLUTmqfZesOgYWDIsXdwQV5iZ3hIkzQQoGbpp8kLQ',
    'tiendacrypto': 'https://www.tiendacrypto.com/wp-content/uploads/2022/05/Logo-tienda-crypto-iso.svg',
    'decrypto': 'https://play-lh.googleusercontent.com/OEppvDUvwTMOQ21PoTC3dJ6LUQ0OvgnZC9B_JZ-xnCXa9hULoBUCf3A-Sj-2pLCwPOvE',
    'lemoncash': 'https://play-lh.googleusercontent.com/Vd4W8OxV1z6VP0xTZxLrVyh5CfQN5pM8GUwDI8zBn5NYmj6w3Ao_V_6a0FHRcCsg0cw',
    'plus': 'https://assets.plus.ar/res/android-chrome-192x192.png',
    'prex': 'https://www.prexcard.com/media/olwn5nqn/logo-prex-simple.svg',
    'brubank': 'https://brubank.com/favicon.ico',
    'uala': 'https://uala.com.ar/uala.ico',
    'mercadopago': 'https://http2.mlstatic.com/frontend-assets/mp-web-navigation/app-favicon-1.png',
    'galicia': 'https://www.bancogalicia.com/content/dam/public-site/assets/images/logo-banco-galicia.svg',
    'provincia': 'https://www.bancoprovincia.com.ar/CDN/themes/theme_provincia/images/logo.png',
    'nacion': 'https://www.bna.com.ar/Images/Logo_BNA.png',
    'bbva': 'https://www.bbva.com.ar/etc/designs/bbva/favicon.ico',
    'santander': 'https://www.santander.com.ar/banco/wcm/connect/443e7a8b-a7a7-4e0e-aaf9-882d73cd6a3b/logo-santander-nav.svg',
    'oficial': 'https://cdn.jsdelivr.net/gh/Yesenia-AriasC/imagenes@main/dolar.png',
    'blue': 'https://cdn.jsdelivr.net/gh/Yesenia-AriasC/imagenes@main/dolar-blue.png',
  };

  // Check if we have a custom logo mapping for this wallet
  if (walletLogoMap[normalizedName]) {
    return walletLogoMap[normalizedName];
  }

  // Try the icons.com.ar API for banks and wallets
  return `${ICONS_BASE_URL}/logos/bancos-y-billeteras/${normalizedName}.png`;
};

/**
 * Gets the URL for a crypto exchange logo
 * @param exchange Name of the exchange
 * @returns URL for the exchange logo
 */
export const getCryptoExchangeLogo = (exchange: string): string => {
  // Try to get from CriptoYa format
  return `https://criptoya.com/img/${exchange.toLowerCase()}.webp`;
};

/**
 * Gets the appropriate logo for any financial entity
 * @param name Name of the entity
 * @param type Type of entity (optional)
 * @returns Best matching logo URL
 */
export const getFinancialEntityLogo = (name: string, type?: string): string => {
  const normalizedName = name.toLowerCase().trim();
  
  if (type === 'cripto' || normalizedName.includes('coin') || 
      ['btc', 'eth', 'usdt', 'usdc', 'dai'].includes(normalizedName)) {
    return getLogoUrl(normalizedName, 'cripto');
  }
  
  if (type === 'cedear' || normalizedName.includes('ticker')) {
    return getLogoUrl(normalizedName, 'cedear');
  }
  
  // Try as a wallet/bank
  return getBankOrWalletLogo(normalizedName);
};
