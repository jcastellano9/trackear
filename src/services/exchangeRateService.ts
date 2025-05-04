
import axios from "axios";
import { ExchangeRate } from "@/types/exchangeRate";
import { calculateChange } from "@/utils/exchangeRateUtils";

export const fetchDollarRates = async (): Promise<ExchangeRate[]> => {
  try {
    // Try to fetch from dolarapi
    const response = await fetch('https://dolarapi.com/v1/dolares');
    if (response.ok) {
      const dollarData = await response.json();
      
      // Filter out "Bolsa" and "Mayorista" rates as requested
      const filteredData = dollarData.filter((item: any) => 
        !item.nombre.toLowerCase().includes('bolsa') && !item.nombre.toLowerCase().includes('mayorista'));
      
      // For CCL rename "Contado con liquidación" to "CCL"
      const formattedData = filteredData.map((item: any) => ({
        name: item.nombre === "Contado con liquidación" ? "CCL" : item.nombre,
        buy: item.compra,
        sell: item.venta,
        change: item.variacion !== undefined ? item.variacion : calculateChange(item.venta, item.venta * 0.95), // Use API-provided change or estimate
        reference: item.nombre === "Oficial",
        logo: "https://cdn.jsdelivr.net/gh/Yesenia-AriasC/imagenes@main/dolar.png"
      }));
      
      return formattedData;
    }
    throw new Error("Unable to fetch from dolarapi");
  } catch (error) {
    console.error("Error fetching dollar data:", error);
    // Fallback to mock data - filtered and renamed as requested
    const dollarData: ExchangeRate[] = [
      { name: "Oficial", buy: 1036.5, sell: 1096.5, change: 0, reference: true, logo: "https://cdn.jsdelivr.net/gh/Yesenia-AriasC/imagenes@main/dolar.png" },
      { name: "Blue", buy: 1335, sell: 1355, change: 23.6, logo: "https://cdn.jsdelivr.net/gh/Yesenia-AriasC/imagenes@main/dolar.png" },
      { name: "CCL", buy: 1357.2, sell: 1359.6, change: 24.0, logo: "https://cdn.jsdelivr.net/gh/Yesenia-AriasC/imagenes@main/dolar.png" },
      { name: "Tarjeta", buy: 1753.6, sell: 1863.6, change: 5.2, logo: "https://cdn.jsdelivr.net/gh/Yesenia-AriasC/imagenes@main/dolar.png" },
    ];
    return dollarData;
  }
};

export const fetchCryptoRates = async (): Promise<ExchangeRate[]> => {
  try {
    // Try to fetch from CoinGecko
    const response = await axios.get('https://api.coingecko.com/api/v3/simple/price', {
      params: {
        ids: 'bitcoin,ethereum,tether,usd-coin,dai',
        vs_currencies: 'usd,ars',
        include_24hr_change: 'true'
      }
    });
    
    if (response.status === 200) {
      const cryptoData: ExchangeRate[] = [
        { 
          name: "USDT", 
          buy: response.data['tether'].ars - 5, 
          sell: response.data['tether'].ars, 
          change: response.data['tether'].usd_24h_change || 0.3,
          logo: "https://cryptologos.cc/logos/tether-usdt-logo.png"
        },
        { 
          name: "USDC", 
          buy: response.data['usd-coin'].ars - 3, 
          sell: response.data['usd-coin'].ars, 
          change: response.data['usd-coin'].usd_24h_change || -0.2,
          logo: "https://cryptologos.cc/logos/usd-coin-usdc-logo.png"
        },
        { 
          name: "DAI", 
          buy: response.data['dai'].ars - 5, 
          sell: response.data['dai'].ars, 
          change: response.data['dai'].usd_24h_change || 0.4,
          logo: "https://cryptologos.cc/logos/multi-collateral-dai-dai-logo.png"
        },
        { 
          name: "BTC", 
          // For BTC and ETH, we'll store the USD price directly
          buy: response.data['bitcoin'].usd, 
          sell: response.data['bitcoin'].usd,
          change: response.data['bitcoin'].usd_24h_change || 2.4,
          logo: "https://cryptologos.cc/logos/bitcoin-btc-logo.png"
        },
        { 
          name: "ETH", 
          // For BTC and ETH, we'll store the USD price directly
          buy: response.data['ethereum'].usd, 
          sell: response.data['ethereum'].usd, 
          change: response.data['ethereum'].usd_24h_change || 1.8,
          logo: "https://cryptologos.cc/logos/ethereum-eth-logo.png"
        },
      ];
      return cryptoData;
    }
    throw new Error("Unable to fetch from CoinGecko");
  } catch (error) {
    console.error("Error fetching crypto data:", error);
    // Fallback to mock data
    const cryptoData: ExchangeRate[] = [
      { name: "USDT", buy: 1150, sell: 1155, change: 0.3, logo: "https://cryptologos.cc/logos/tether-usdt-logo.png" },
      { name: "USDC", buy: 1145, sell: 1148, change: -0.2, logo: "https://cryptologos.cc/logos/usd-coin-usdc-logo.png" },
      { name: "DAI", buy: 1152, sell: 1157, change: 0.4, logo: "https://cryptologos.cc/logos/multi-collateral-dai-dai-logo.png" },
      { name: "BTC", buy: 62500, sell: 62500, change: 2.4, logo: "https://cryptologos.cc/logos/bitcoin-btc-logo.png" },
      { name: "ETH", buy: 3050, sell: 3050, change: 1.8, logo: "https://cryptologos.cc/logos/ethereum-eth-logo.png" },
    ];
    return cryptoData;
  }
};
