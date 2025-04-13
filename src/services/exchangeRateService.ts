
import axios from "axios";
import { ExchangeRate } from "@/types/exchangeRate";
import { calculateChange } from "@/utils/exchangeRateUtils";

export const fetchDollarRates = async (): Promise<ExchangeRate[]> => {
  try {
    // Try to fetch from dolarapi
    const response = await fetch('https://dolarapi.com/v1/dolares');
    if (response.ok) {
      const dollarData = await response.json();
      const formattedData = dollarData.map((item: any) => ({
        name: item.nombre,
        buy: item.compra,
        sell: item.venta,
        change: calculateChange(item.venta, 975), // Calculate change from official
        reference: item.nombre === "Oficial",
        logo: "https://cdn.jsdelivr.net/gh/Yesenia-AriasC/imagenes@main/dolar.png"
      }));
      return formattedData;
    }
    throw new Error("Unable to fetch from dolarapi");
  } catch (error) {
    console.error("Error fetching dollar data:", error);
    // Fallback to mock data
    const dollarData: ExchangeRate[] = [
      { name: "Oficial", buy: 1036.5, sell: 1096.5, change: 0, reference: true, logo: "https://cdn.jsdelivr.net/gh/Yesenia-AriasC/imagenes@main/dolar.png" },
      { name: "Blue", buy: 1335, sell: 1355, change: 23.6, logo: "https://cdn.jsdelivr.net/gh/Yesenia-AriasC/imagenes@main/dolar.png" },
      { name: "MEP", buy: 1364.1, sell: 1363.8, change: 24.4, logo: "https://cdn.jsdelivr.net/gh/Yesenia-AriasC/imagenes@main/dolar.png" },
      { name: "Contado con liquidación", buy: 1357.2, sell: 1359.6, change: 24.0, logo: "https://cdn.jsdelivr.net/gh/Yesenia-AriasC/imagenes@main/dolar.png" },
      { name: "Mayorista", buy: 1074.5, sell: 1077.5, change: -1.7, logo: "https://cdn.jsdelivr.net/gh/Yesenia-AriasC/imagenes@main/dolar.png" },
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
          buy: response.data['bitcoin'].ars - 500000, 
          sell: response.data['bitcoin'].ars, 
          change: response.data['bitcoin'].usd_24h_change || 2.4,
          logo: "https://cryptologos.cc/logos/bitcoin-btc-logo.png"
        },
        { 
          name: "ETH", 
          buy: response.data['ethereum'].ars - 30000, 
          sell: response.data['ethereum'].ars, 
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
      { name: "BTC", buy: 60250000, sell: 60850000, change: 2.4, logo: "https://cryptologos.cc/logos/bitcoin-btc-logo.png" },
      { name: "ETH", buy: 2980000, sell: 3020000, change: 1.8, logo: "https://cryptologos.cc/logos/ethereum-eth-logo.png" },
    ];
    return cryptoData;
  }
};
