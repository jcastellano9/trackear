
import axios from "axios";
import { toast } from "sonner";

export type CryptoPrice = {
  id: string;
  name: string;
  symbol: string;
  currentPrice: number;
  priceChange24h: number;
  priceChangePercentage24h: number;
  marketCap: number;
  volume24h: number;
  logo: string;
};

export const fetchCryptoPrices = async (): Promise<CryptoPrice[]> => {
  try {
    // Try to use CoinGecko API
    const response = await axios.get('https://api.coingecko.com/api/v3/coins/markets', {
      params: {
        vs_currency: 'usd',
        ids: 'bitcoin,ethereum,binancecoin,cardano,solana,ripple,polkadot,avalanche-2,cosmos,near',
        order: 'market_cap_desc',
        per_page: 10,
        page: 1,
        sparkline: false,
        price_change_percentage: '24h'
      }
    });
    
    if (response.status === 200) {
      return response.data.map((coin: any) => ({
        id: coin.id,
        name: coin.name,
        symbol: coin.symbol.toUpperCase(),
        currentPrice: coin.current_price,
        priceChange24h: coin.price_change_24h,
        priceChangePercentage24h: coin.price_change_percentage_24h,
        marketCap: coin.market_cap,
        volume24h: coin.total_volume,
        logo: coin.image
      }));
    }

    throw new Error("Could not fetch data from CoinGecko");
  } catch (error) {
    console.error("Error fetching crypto data:", error);
    
    // Fallback to mock data
    return [
      {
        id: "bitcoin",
        name: "Bitcoin",
        symbol: "BTC",
        currentPrice: 64250,
        priceChange24h: 850,
        priceChangePercentage24h: 1.35,
        marketCap: 1265000000000,
        volume24h: 32500000000,
        logo: "https://assets.coingecko.com/coins/images/1/large/bitcoin.png"
      },
      {
        id: "ethereum",
        name: "Ethereum",
        symbol: "ETH",
        currentPrice: 3120,
        priceChange24h: -75,
        priceChangePercentage24h: -2.35,
        marketCap: 375000000000,
        volume24h: 18500000000,
        logo: "https://assets.coingecko.com/coins/images/279/large/ethereum.png"
      },
      {
        id: "binancecoin",
        name: "Binance Coin",
        symbol: "BNB",
        currentPrice: 570,
        priceChange24h: 15,
        priceChangePercentage24h: 2.7,
        marketCap: 87500000000,
        volume24h: 2800000000,
        logo: "https://assets.coingecko.com/coins/images/825/large/bnb-icon2_2x.png"
      },
      {
        id: "cardano",
        name: "Cardano",
        symbol: "ADA",
        currentPrice: 0.45,
        priceChange24h: 0.02,
        priceChangePercentage24h: 4.65,
        marketCap: 16000000000,
        volume24h: 850000000,
        logo: "https://assets.coingecko.com/coins/images/975/large/cardano.png"
      },
      {
        id: "solana",
        name: "Solana",
        symbol: "SOL",
        currentPrice: 143,
        priceChange24h: 7.5,
        priceChangePercentage24h: 5.53,
        marketCap: 62000000000,
        volume24h: 3900000000,
        logo: "https://assets.coingecko.com/coins/images/4128/large/solana.png"
      },
      {
        id: "ripple",
        name: "XRP",
        symbol: "XRP",
        currentPrice: 0.53,
        priceChange24h: -0.015,
        priceChangePercentage24h: -2.75,
        marketCap: 28500000000,
        volume24h: 1250000000,
        logo: "https://assets.coingecko.com/coins/images/44/large/xrp-symbol-white-128.png"
      }
    ];
  }
};
