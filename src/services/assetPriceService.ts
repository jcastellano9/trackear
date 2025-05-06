
import axios from "axios";

interface PriceResponse {
  [symbol: string]: {
    price?: number;
    regularMarketPrice?: number;
    currentPrice?: number;
    usd?: number;
  };
}

/**
 * Fetches real-time crypto prices from CoinGecko API
 * @param symbols Array of crypto symbols (BTC, ETH, etc.)
 * @returns Object with prices mapped to symbols
 */
export const fetchCryptoPrices = async (
  symbols: string[]
): Promise<Record<string, number>> => {
  try {
    // Convert symbols to lowercase and proper format for CoinGecko
    const formattedSymbols = symbols.map((s) => s.toLowerCase()).join(",");
    
    const response = await axios.get(
      `https://api.coingecko.com/api/v3/simple/price?ids=${formattedSymbols}&vs_currencies=usd`
    );
    
    const prices: Record<string, number> = {};
    
    // Map the response to our format
    Object.entries(response.data).forEach(([coin, value]: [string, any]) => {
      const symbol = coin.toUpperCase();
      prices[symbol] = value.usd;
    });
    
    return prices;
  } catch (error) {
    console.error("Error fetching crypto prices:", error);
    return {};
  }
};

/**
 * Fetches real-time stock prices for CEDEARs
 * @param symbols Array of stock symbols (AAPL, MSFT, etc.)
 * @returns Object with prices mapped to symbols
 */
export const fetchStockPrices = async (
  symbols: string[]
): Promise<Record<string, number>> => {
  try {
    // For demo purposes, we'll use Yahoo Finance API (or similar)
    // In a real app, you might need a proper financial data API subscription
    const symbolsString = symbols.join(",");
    
    // Use a proxy or direct API if you have access to a financial data provider
    const response = await axios.get(
      `https://query1.finance.yahoo.com/v7/finance/quote?symbols=${symbolsString}`
    );
    
    const prices: Record<string, number> = {};
    
    if (response.data && response.data.quoteResponse && response.data.quoteResponse.result) {
      response.data.quoteResponse.result.forEach((stock: any) => {
        prices[stock.symbol] = stock.regularMarketPrice || stock.price || 0;
      });
    }
    
    return prices;
  } catch (error) {
    console.error("Error fetching stock prices:", error);
    return {};
  }
};

/**
 * Fallback function for when API calls fail
 * Maps crypto symbols to common IDs used by CoinGecko
 */
export const mapCryptoSymbolToId = (symbol: string): string => {
  const map: Record<string, string> = {
    "BTC": "bitcoin",
    "ETH": "ethereum",
    "ADA": "cardano",
    "SOL": "solana",
    "DOT": "polkadot",
    "USDT": "tether",
    "USDC": "usd-coin",
    "DAI": "dai",
    // Add more mappings as needed
  };
  
  return map[symbol] || symbol.toLowerCase();
};

/**
 * Main function to get asset prices based on type
 */
export const getAssetPrices = async (
  assets: { symbol: string; tipo: "cripto" | "cedear" }[]
): Promise<Record<string, number>> => {
  try {
    // Separate assets by type
    const cryptoSymbols = assets
      .filter(a => a.tipo === "cripto")
      .map(a => mapCryptoSymbolToId(a.symbol));
    
    const stockSymbols = assets
      .filter(a => a.tipo === "cedear")
      .map(a => a.symbol);
    
    // Fetch prices in parallel
    const [cryptoPrices, stockPrices] = await Promise.all([
      cryptoSymbols.length ? fetchCryptoPrices(cryptoSymbols) : {},
      stockSymbols.length ? fetchStockPrices(stockSymbols) : {}
    ]);
    
    // Combine prices
    return { ...cryptoPrices, ...stockPrices };
  } catch (error) {
    console.error("Error getting asset prices:", error);
    return {};
  }
};
