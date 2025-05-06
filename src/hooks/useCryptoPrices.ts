
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { fetchCryptoRates } from "@/services/exchangeRateService";
import { ExchangeRate } from "@/types/exchangeRate";
import { getCryptoExchangeLogo, getLogoUrl } from "@/utils/logoUtils";

export function useCryptoPrices() {
  const [cryptoRates, setCryptoRates] = useState<ExchangeRate[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [selectedCoin, setSelectedCoin] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<"buy" | "sell" | "spread">("buy");
  
  const availableCoins = Array.from(new Set(cryptoRates.map(rate => rate.coin))).sort();

  const fetchCryptoData = async () => {
    try {
      setLoading(true);
      const data = await fetchCryptoRates();
      
      // Enhance data with better logos
      const enhancedData = data.map(rate => {
        // Extract exchange name from format "Exchange (COIN)"
        const exchangeName = rate.name.split(" (")[0];
        const coinSymbol = rate.coin || rate.name.split(" (")[1]?.replace(")", "") || "";
        
        return {
          ...rate,
          // Try to get exchange logo first, then fallback to crypto logo if needed
          logo: getCryptoExchangeLogo(exchangeName) || getLogoUrl(coinSymbol, "cripto")
        };
      });
      
      setCryptoRates(enhancedData);
      setLastUpdated(new Date());
    } catch (error) {
      console.error("Error in component while fetching crypto data:", error);
      toast.error("Error al cargar los datos de criptomonedas");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCryptoData();
    
    // Refresh every 5 minutes
    const interval = setInterval(() => {
      fetchCryptoData();
    }, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  const calculateSpread = (buy: number, sell: number) => {
    return sell - buy;
  };
  
  const calculateSpreadPercentage = (buy: number, sell: number) => {
    return ((sell - buy) / buy) * 100;
  };
  
  // Filter and sort the data
  const filteredRates = selectedCoin 
    ? cryptoRates.filter(rate => rate.coin === selectedCoin)
    : cryptoRates;
    
  const sortedRates = [...filteredRates].sort((a, b) => {
    if (sortBy === "buy") return b.buy - a.buy;
    if (sortBy === "sell") return a.sell - b.sell;
    // Sort by spread percentage
    return calculateSpreadPercentage(a.buy, a.sell) - calculateSpreadPercentage(b.buy, b.sell);
  });

  const refreshData = () => {
    fetchCryptoData();
    toast.success("Actualizando precios de criptomonedas...");
  };

  return {
    cryptoRates: sortedRates,
    loading,
    lastUpdated,
    selectedCoin,
    setSelectedCoin,
    sortBy,
    setSortBy,
    availableCoins,
    refreshData,
    calculateSpread,
    calculateSpreadPercentage
  };
}
