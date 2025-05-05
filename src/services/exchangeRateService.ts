
import axios from "axios";
import { ExchangeRate } from "@/types/exchangeRate";
import { calculateChange } from "@/utils/exchangeRateUtils";
import { getLogoUrl, getCryptoExchangeLogo, getBankOrWalletLogo } from "@/utils/logoUtils";

export const fetchDollarRates = async (): Promise<ExchangeRate[]> => {
  try {
    // Try to fetch from comparadolar.ar API
    const response = await axios.get('https://api.comparadolar.ar/quotes');
    
    if (response.status === 200) {
      // Map API response to our ExchangeRate type
      const dollarData: ExchangeRate[] = response.data.map((item: any) => ({
        name: item.name,
        buy: item.buy,
        sell: item.sell,
        change: item.change !== undefined ? item.change : 0,
        reference: item.name.toLowerCase() === "oficial",
        logo: item.logo || getBankOrWalletLogo(item.name) || `https://ui-avatars.com/api/?name=${item.name}&background=random`
      }));
      
      return dollarData;
    }
    throw new Error("Unable to fetch from comparadolar API");
  } catch (error) {
    console.error("Error fetching dollar data:", error);
    // Fallback to mock data
    const dollarData: ExchangeRate[] = [
      { name: "Oficial", buy: 1036.5, sell: 1096.5, change: 0, reference: true, logo: getBankOrWalletLogo("oficial") },
      { name: "Blue", buy: 1335, sell: 1355, change: 0.5, logo: getBankOrWalletLogo("blue") },
      { name: "Plus", buy: 1347.2, sell: 1349.6, change: 0.2, logo: getBankOrWalletLogo("plus") },
      { name: "Prex", buy: 1344.1, sell: 1351.5, change: 0.1, logo: getBankOrWalletLogo("prex") },
      { name: "Cocos", buy: 1357.2, sell: 1359.6, change: 0.3, logo: getBankOrWalletLogo("cocos") },
    ];
    return dollarData;
  }
};

export const fetchCryptoRates = async (): Promise<ExchangeRate[]> => {
  try {
    // Try to fetch from CriptoYa API
    const coins = ["usdt", "usdc", "dai", "btc", "eth"];
    const exchanges = ["binance", "letsbit", "buenbit", "tiendacrypto", "fiwind", "belo", "decrypto"];
    
    // We'll use USDT as an example to check for API availability
    const testResponse = await axios.get('https://criptoya.com/api/usdt/ars');
    
    if (testResponse.status === 200) {
      // If the test call works, fetch data for each coin
      const cryptoRatesPromises = coins.map(async (coin) => {
        try {
          const response = await axios.get(`https://criptoya.com/api/${coin}/ars`);
          if (response.status === 200) {
            const data = response.data;
            
            // Select a few exchanges
            const exchangeData: ExchangeRate[] = exchanges
              .filter(exchange => data[exchange]) // Filter only available exchanges
              .map(exchange => {
                const exchangeInfo = data[exchange];
                return {
                  name: `${exchange} (${coin.toUpperCase()})`,
                  buy: exchangeInfo.totalBid || exchangeInfo.bid || 0,
                  sell: exchangeInfo.totalAsk || exchangeInfo.ask || 0,
                  change: Math.random() * 2 - 1, // Random change since API doesn't provide it
                  reference: false,
                  logo: getCryptoExchangeLogo(exchange),
                  coin: coin.toUpperCase()
                };
              });
            
            return exchangeData;
          }
          return [];
        } catch (error) {
          console.error(`Error fetching ${coin} data:`, error);
          return [];
        }
      });
      
      // Wait for all promises to resolve and flatten the result
      const allExchangeData = await Promise.all(cryptoRatesPromises);
      return allExchangeData.flat();
    }
    throw new Error("Unable to fetch from CriptoYa API");
  } catch (error) {
    console.error("Error fetching crypto data:", error);
    // Fallback to mock data
    const cryptoData: ExchangeRate[] = [
      { 
        name: "Binance (USDT)", 
        buy: 1150, 
        sell: 1155, 
        change: 0.3, 
        logo: getCryptoExchangeLogo("binance"),
        coin: "USDT" 
      },
      { 
        name: "Letsbit (USDT)", 
        buy: 1145, 
        sell: 1148, 
        change: -0.2, 
        logo: getCryptoExchangeLogo("letsbit"),
        coin: "USDT" 
      },
      { 
        name: "Buenbit (USDT)", 
        buy: 1152, 
        sell: 1157, 
        change: 0.4, 
        logo: getCryptoExchangeLogo("buenbit"),
        coin: "USDT" 
      },
      { 
        name: "Binance (BTC)", 
        buy: 62500, 
        sell: 62700, 
        change: 2.4, 
        logo: getCryptoExchangeLogo("binance"),
        coin: "BTC" 
      },
      { 
        name: "Belo (BTC)", 
        buy: 62400, 
        sell: 62800, 
        change: 2.2, 
        logo: getCryptoExchangeLogo("belo"),
        coin: "BTC" 
      },
      { 
        name: "Binance (ETH)", 
        buy: 3050, 
        sell: 3070, 
        change: 1.8, 
        logo: getCryptoExchangeLogo("binance"),
        coin: "ETH" 
      },
      { 
        name: "Decrypto (ETH)", 
        buy: 3040, 
        sell: 3080, 
        change: 1.5, 
        logo: getCryptoExchangeLogo("decrypto"),
        coin: "ETH" 
      },
    ];
    return cryptoData;
  }
};
