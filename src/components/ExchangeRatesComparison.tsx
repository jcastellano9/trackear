
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { ArrowUp, ArrowDown, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";

interface ExchangeRate {
  name: string;
  buy: number;
  sell: number;
  change: number;
  reference?: boolean;
  logo?: string;
}

export function ExchangeRatesComparison() {
  const [data, setData] = useState<ExchangeRate[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'dollar' | 'crypto'>('dollar');
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  const fetchDollarData = async () => {
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
        setData(formattedData);
        setLastUpdated(new Date());
        return;
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
      setData(dollarData);
      setLastUpdated(new Date());
    }
  };

  const fetchCryptoData = async () => {
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
        setData(cryptoData);
        setLastUpdated(new Date());
        return;
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
      setData(cryptoData);
      setLastUpdated(new Date());
    }
  };

  const calculateChange = (current: number, reference: number) => {
    if (!reference) return 0;
    return parseFloat(((current - reference) / reference * 100).toFixed(1));
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      
      if (activeTab === 'dollar') {
        await fetchDollarData();
      } else {
        await fetchCryptoData();
      }
      
      setLoading(false);
    };

    fetchData();
  }, [activeTab]);

  const formatCurrency = (value: number) => {
    if (value > 1000000) {
      return `$${(value / 1000000).toFixed(2)}M`;
    } else {
      return `$${value.toLocaleString('es-AR')}`;
    }
  };

  const formatPercentage = (value: number) => {
    return `${Math.abs(value).toFixed(2)}%`;
  };

  const refreshData = () => {
    setLoading(true);
    if (activeTab === 'dollar') {
      fetchDollarData().then(() => {
        setLoading(false);
        toast.success("Cotizaciones de dólar actualizadas");
      });
    } else {
      fetchCryptoData().then(() => {
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
        {loading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div className="flex justify-between py-3 border-b" key={i}>
                <Skeleton className="h-10 w-40" />
                <div className="space-y-2">
                  <Skeleton className="h-5 w-32" />
                  <Skeleton className="h-5 w-24" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            <div className="grid grid-cols-4 text-sm font-medium border-b pb-2">
              <div>Tipo</div>
              <div>Compra</div>
              <div>Venta</div>
              <div className="text-right">Variación</div>
            </div>
            
            {data.map((rate, index) => (
              <div key={index} className="grid grid-cols-4 py-4 border-b items-center">
                <div className="flex items-center gap-2">
                  <img 
                    src={rate.logo || 'https://via.placeholder.com/24?text=?'} 
                    alt={rate.name}
                    className="h-6 w-6 object-contain"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = "https://via.placeholder.com/24?text=?";
                    }}
                  />
                  <div>
                    <div className="font-medium">{rate.name}</div>
                    {rate.reference && <span className="text-xs text-muted-foreground">Referencia</span>}
                  </div>
                </div>
                <div className="font-medium">
                  {formatCurrency(rate.buy)}
                </div>
                <div className="font-medium">
                  {formatCurrency(rate.sell)}
                </div>
                <div className="flex justify-end">
                  {!rate.reference && (
                    <Badge 
                      variant={rate.change >= 0 ? "default" : "destructive"} 
                      className="inline-flex items-center"
                    >
                      {rate.change >= 0 ? 
                        <ArrowUp className="h-3 w-3 mr-0.5" /> : 
                        <ArrowDown className="h-3 w-3 mr-0.5" />
                      }
                      {formatPercentage(rate.change)}
                    </Badge>
                  )}
                </div>
              </div>
            ))}
            
            <div className="text-xs text-muted-foreground text-right pt-2">
              Última actualización: {lastUpdated.toLocaleTimeString('es-AR')}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
