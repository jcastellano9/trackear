
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { ExchangeRate } from "@/types/exchangeRate";
import { fetchDollarRates, fetchCryptoRates } from "@/services/exchangeRateService";
import { ExchangeRateTable } from "@/components/exchange-rates/ExchangeRateTable";

export function ExchangeRatesComparison() {
  const [data, setData] = useState<ExchangeRate[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'dollar' | 'crypto'>('dollar');
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      
      if (activeTab === 'dollar') {
        const dollarData = await fetchDollarRates();
        setData(dollarData);
      } else {
        const cryptoData = await fetchCryptoRates();
        setData(cryptoData);
      }
      
      setLastUpdated(new Date());
      setLoading(false);
    };

    fetchData();
  }, [activeTab]);

  const refreshData = () => {
    setLoading(true);
    if (activeTab === 'dollar') {
      fetchDollarRates().then((dollarData) => {
        setData(dollarData);
        setLastUpdated(new Date());
        setLoading(false);
        toast.success("Cotizaciones de dólar actualizadas");
      });
    } else {
      fetchCryptoRates().then((cryptoData) => {
        setData(cryptoData);
        setLastUpdated(new Date());
        setLoading(false);
        toast.success("Cotizaciones de crypto actualizadas");
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Comparación de Cotizaciones</CardTitle>
        <CardDescription>
          Visualiza y compara distintos tipos de cambio en el mercado argentino
        </CardDescription>
        <div className="flex justify-between items-center mt-2">
          <Tabs 
            value={activeTab} 
            onValueChange={(v) => setActiveTab(v as 'dollar' | 'crypto')} 
            className="w-[260px]"
          >
            <TabsList className="grid grid-cols-2 w-full">
              <TabsTrigger value="dollar">Dólar</TabsTrigger>
              <TabsTrigger value="crypto">Stablecoins</TabsTrigger>
            </TabsList>
          </Tabs>
          
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
  );
}
