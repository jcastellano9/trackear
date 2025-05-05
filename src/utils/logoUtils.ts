
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
  
  // For crypto, try to use a crypto logo API
  if (type === "cripto") {
    return `https://cryptologos.cc/logos/${normalizedSymbol}-logo.png`;
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
  return `${ICONS_BASE_URL}/logos/bancos-y-billeteras/${name.toLowerCase()}.png`;
};
