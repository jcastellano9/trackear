
import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { ArrowUp, ArrowDown, RefreshCw, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import axios from "axios";

interface ExchangeRate {
  name: string;
  buy: number;
  sell: number;
  change: number;
  reference?: boolean;
  logo?: string;
}

export function ExchangeRates() {
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
        const formattedData = dollarData
          .filter((item: any) => {
            // Filter out Dólar Bolsa and Dólar Mayorista
            return item.nombre !== "Bolsa" && item.nombre !== "Mayorista";
          })
          .map((item: any) => ({
            name: item.nombre === "Contado con liquidación" ? "CCL" : item.nombre,
            buy: item.compra,
            sell: item.venta,
            change: calculateChange(item.venta, 975), // Calculate change from official
            reference: item.nombre === "Oficial",
            logo: "https://cdn.jsdelivr.net/gh/Yesenia-AriasC/imagenes@main/dolar.png"
          }));
        
        // Sort by exchange rate
        formattedData.sort((a, b) => a.sell - b.sell);
        
        setData(formattedData);
        setLastUpdated(new Date());
        return;
      }
      throw new Error("Unable to fetch from dolarapi");
    } catch (error) {
      console.error("Error fetching dollar data:", error);
      // Fallback to mock data - already filtered and renamed
      const dollarData: ExchangeRate[] = [
        { name: "Oficial", buy: 1036.5, sell: 1096.5, change: 0, reference: true, logo: "https://cdn.jsdelivr.net/gh/Yesenia-AriasC/imagenes@main/dolar.png" },
        { name: "Blue", buy: 1335, sell: 1355, change: 23.6, logo: "https://cdn.jsdelivr.net/gh/Yesenia-AriasC/imagenes@main/dolar.png" },
        { name: "CCL", buy: 1357.2, sell: 1359.6, change: 24.0, logo: "https://cdn.jsdelivr.net/gh/Yesenia-AriasC/imagenes@main/dolar.png" },
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
    
    // Refresh every 5 minutes
    const interval = setInterval(() => {
      fetchData();
    }, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, [activeTab]);

  const formatCurrency = (value: number) => {
    if (value > 1000000) {
      return `$${(value / 1000000).toFixed(2)}M`;
    } else {
      return `$${value.toLocaleString('es-AR')}`;
    }
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

  const formatPercentage = (value: number) => {
    return value.toFixed(2);
  };

  return (
    <div>
      <div className="mb-4 flex justify-between items-center">
        <Tabs 
          value={activeTab} 
          onValueChange={(v) => setActiveTab(v as 'dollar' | 'crypto')} 
          className="w-[200px]"
        >
          <TabsList className="grid grid-cols-2 w-full">
            <TabsTrigger value="dollar">Dólar</TabsTrigger>
            <TabsTrigger value="crypto">Crypto</TabsTrigger>
          </TabsList>
        </Tabs>
        
        <div className="flex items-center gap-4">
          <Link to="/analysis" className="flex items-center text-xs text-primary hover:underline">
            Ver más <ExternalLink className="h-3.5 w-3.5 ml-1" />
          </Link>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span>{lastUpdated.toLocaleTimeString('es-AR')}</span>
            <RefreshCw 
              className={`h-3.5 w-3.5 cursor-pointer ${loading ? "animate-spin" : ""}`} 
              onClick={refreshData}
            />
          </div>
        </div>
      </div>
      
      {loading ? (
        <div className="space-y-2">
          {[...Array(5)].map((_, i) => (
            <div className="flex justify-between py-2" key={i}>
              <Skeleton className="h-5 w-24" />
              <div className="flex gap-4">
                <Skeleton className="h-5 w-16" />
                <Skeleton className="h-5 w-16" />
                <Skeleton className="h-5 w-16" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div>
          <div className="grid grid-cols-3 text-xs text-muted-foreground py-2 border-b">
            <div>Tipo</div>
            <div>Compra</div>
            <div>Venta</div>
          </div>
          
          {activeTab === 'crypto' && (
            <div className="text-sm font-medium pt-2 pb-1">Criptomonedas</div>
          )}
          
          {data.map((rate, index) => (
            <div key={index} className="grid grid-cols-3 py-3 border-b text-sm items-center">
              <div className="flex items-center gap-1.5">
                <img 
                  src={rate.logo || 'https://via.placeholder.com/24?text=?'} 
                  alt={rate.name}
                  className="h-4 w-4 object-contain"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "https://via.placeholder.com/20?text=?";
                  }}
                />
                <span>{rate.name}</span>
              </div>
              <div>{formatCurrency(rate.buy)}</div>
              <div className="flex items-center justify-between">
                <span>{formatCurrency(rate.sell)}</span>
                {!rate.reference && (
                  <Badge 
                    variant={rate.change >= 0 ? "default" : "destructive"} 
                    className="inline-flex items-center px-1.5 py-0.5 text-xs"
                  >
                    {rate.change >= 0 ? 
                      <ArrowUp className="h-3 w-3 mr-0.5" /> : 
                      <ArrowDown className="h-3 w-3 mr-0.5" />
                    }
                    {formatPercentage(Math.abs(rate.change))}%
                  </Badge>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
