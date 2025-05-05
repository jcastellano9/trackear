
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { ExchangeRate } from "@/types/exchangeRate";
import { ExchangeRateTable } from "@/components/exchange-rates/ExchangeRateTable";
import axios from "axios";

export function ExchangeRatesComparison() {
  const [data, setData] = useState<ExchangeRate[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [bestBuy, setBestBuy] = useState<{rate: number, provider: string, logo?: string} | null>(null);
  const [bestSell, setBestSell] = useState<{rate: number, provider: string, logo?: string} | null>(null);
  const [lowestSpread, setLowestSpread] = useState<{spread: number, provider: string, logo?: string} | null>(null);

  useEffect(() => {
    fetchDollarRates();
  }, []);

  const calculateBestRates = (rates: ExchangeRate[]) => {
    if (!rates || !rates.length) return;
    
    // Find best buy (highest buy rate)
    const bestBuyRate = rates.reduce((best, current) => 
      current.buy > best.buy ? current : best
    );
    
    // Find best sell (lowest sell rate)
    const bestSellRate = rates.reduce((best, current) => 
      current.sell < best.sell ? current : best
    );
    
    // Find lowest spread
    const lowestSpreadRate = rates.reduce((best, current) => {
      const currentSpread = current.sell - current.buy;
      const bestSpread = best.sell - best.buy;
      return currentSpread < bestSpread ? current : best;
    });
    
    setBestBuy({
      rate: bestBuyRate.buy,
      provider: bestBuyRate.name,
      logo: bestBuyRate.logo
    });
    
    setBestSell({
      rate: bestSellRate.sell,
      provider: bestSellRate.name,
      logo: bestSellRate.logo
    });
    
    setLowestSpread({
      spread: lowestSpreadRate.sell - lowestSpreadRate.buy,
      provider: lowestSpreadRate.name,
      logo: lowestSpreadRate.logo
    });
  };

  const fetchDollarRates = async () => {
    setLoading(true);
    try {
      // Try to fetch from comparadolar.ar API
      const response = await axios.get('https://api.comparadolar.ar/quotes');
      
      if (response.status === 200) {
        const dollarData: ExchangeRate[] = response.data.map((item: any) => ({
          name: item.name,
          buy: item.buy,
          sell: item.sell,
          change: item.change || 0,
          reference: item.name.toLowerCase() === "oficial",
          logo: item.logo || `https://ui-avatars.com/api/?name=${item.name}&background=random`
        }));
        
        setData(dollarData);
        calculateBestRates(dollarData);
      } else {
        throw new Error("Unable to fetch from comparadolar API");
      }
    } catch (error) {
      console.error("Error fetching dollar data:", error);
      // Fallback to mock data
      const dollarData: ExchangeRate[] = [
        { name: "Oficial", buy: 1036.5, sell: 1096.5, change: 0, reference: true, logo: "https://plus.ar/favicon.ico" },
        { name: "Blue", buy: 1335, sell: 1355, change: 0.5, logo: "https://brubank.com/favicon.ico" },
        { name: "Cocos", buy: 1357.2, sell: 1359.6, change: 0.3, logo: "https://cocos.capital/favicon.ico" },
        { name: "Plus", buy: 1347.2, sell: 1349.6, change: 0.2, logo: "https://assets.plus.ar/res/android-chrome-192x192.png" },
        { name: "Prex", buy: 1344.1, sell: 1351.5, change: 0.1, logo: "https://www.prexcard.com/media/olwn5nqn/logo-prex-simple.svg" },
      ];
      setData(dollarData);
      calculateBestRates(dollarData);
      toast.error("Error al cargar cotizaciones. Mostrando datos de respaldo.");
    } finally {
      setLastUpdated(new Date());
      setLoading(false);
    }
  };

  const refreshData = () => {
    fetchDollarRates();
    toast.success("Cotizaciones actualizadas");
  };

  return (
    <div className="space-y-6">
      {/* Best rates highlight section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {bestBuy && (
          <Card className="bg-primary-900 text-white">
            <CardHeader className="pb-2">
              <CardDescription className="text-white/70">Mejor precio de compra</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                {bestBuy.logo && (
                  <img 
                    src={bestBuy.logo} 
                    alt={bestBuy.provider}
                    className="h-10 w-10 rounded-full bg-white p-1"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = `https://ui-avatars.com/api/?name=${bestBuy.provider}&background=random`;
                    }}
                  />
                )}
                <div>
                  {/* Add null check before using toFixed() */}
                  <div className="text-xl font-bold">${typeof bestBuy.rate === 'number' ? bestBuy.rate.toFixed(2) : '-'}</div>
                  <div className="text-sm text-white/70">{bestBuy.provider}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
        
        {bestSell && (
          <Card className="bg-primary-900 text-white">
            <CardHeader className="pb-2">
              <CardDescription className="text-white/70">Mejor precio de venta</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                {bestSell.logo && (
                  <img 
                    src={bestSell.logo} 
                    alt={bestSell.provider}
                    className="h-10 w-10 rounded-full bg-white p-1"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = `https://ui-avatars.com/api/?name=${bestSell.provider}&background=random`;
                    }}
                  />
                )}
                <div>
                  {/* Add null check before using toFixed() */}
                  <div className="text-xl font-bold">${typeof bestSell.rate === 'number' ? bestSell.rate.toFixed(2) : '-'}</div>
                  <div className="text-sm text-white/70">{bestSell.provider}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
        
        {lowestSpread && (
          <Card className="bg-primary-900 text-white">
            <CardHeader className="pb-2">
              <CardDescription className="text-white/70">Menor spread</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                {lowestSpread.logo && (
                  <img 
                    src={lowestSpread.logo} 
                    alt={lowestSpread.provider}
                    className="h-10 w-10 rounded-full bg-white p-1"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = `https://ui-avatars.com/api/?name=${lowestSpread.provider}&background=random`;
                    }}
                  />
                )}
                <div>
                  {/* Add null check before using toFixed() */}
                  <div className="text-xl font-bold">${typeof lowestSpread.spread === 'number' ? lowestSpread.spread.toFixed(2) : '-'}</div>
                  <div className="text-sm text-white/70">{lowestSpread.provider}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Comparación de Cotizaciones</CardTitle>
          <CardDescription>
            Visualiza y compara distintos tipos de cambio en el mercado argentino
          </CardDescription>
          <div className="flex justify-end items-center mt-2">
            <button 
              onClick={refreshData} 
              className="p-2 rounded-md hover:bg-muted transition-colors"
              disabled={loading}
            >
              <RefreshCw className={`h-5 w-5 ${loading ? "animate-spin" : ""}`} />
            </button>
          </div>
        </CardHeader>
        <CardContent>
          <ExchangeRateTable 
            data={data} 
            loading={loading} 
            lastUpdated={lastUpdated} 
          />
        </CardContent>
      </Card>
    </div>
  );
}
