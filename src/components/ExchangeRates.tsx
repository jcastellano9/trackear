
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowDown, ArrowUp, RefreshCw } from "lucide-react";

type ExchangeRate = {
  name: string;
  code: string;
  logo?: string;
  buy: number;
  sell: number;
  variation: number;
  lastUpdated: string;
};

// Mock exchange rate data with logos
const MOCK_RATES: ExchangeRate[] = [
  {
    name: "Dólar Oficial",
    code: "USD",
    logo: "https://cdn-icons-png.flaticon.com/512/197/197484.png",
    buy: 975.5,
    sell: 1015.5,
    variation: 0.25,
    lastUpdated: "2025-04-08T12:30:00Z",
  },
  {
    name: "Dólar Blue",
    code: "USD",
    logo: "https://cdn-icons-png.flaticon.com/512/197/197484.png",
    buy: 1285,
    sell: 1305,
    variation: -0.5,
    lastUpdated: "2025-04-08T12:35:00Z",
  },
  {
    name: "Dólar MEP",
    code: "USD",
    logo: "https://cdn-icons-png.flaticon.com/512/197/197484.png",
    buy: 1230,
    sell: 1250,
    variation: 0.75,
    lastUpdated: "2025-04-08T12:00:00Z",
  },
  {
    name: "Dólar CCL",
    code: "USD",
    logo: "https://cdn-icons-png.flaticon.com/512/197/197484.png",
    buy: 1245,
    sell: 1265,
    variation: 1.2,
    lastUpdated: "2025-04-08T11:45:00Z",
  },
  {
    name: "Euro",
    code: "EUR",
    logo: "https://cdn-icons-png.flaticon.com/512/197/197615.png",
    buy: 1050,
    sell: 1100,
    variation: 0.3,
    lastUpdated: "2025-04-08T12:15:00Z",
  },
];

// Mock crypto rates with logos
const MOCK_CRYPTO: ExchangeRate[] = [
  {
    name: "USDT",
    code: "USDT",
    logo: "https://cryptologos.cc/logos/tether-usdt-logo.png",
    buy: 1275,
    sell: 1295,
    variation: 0.15,
    lastUpdated: "2025-04-08T12:40:00Z",
  },
  {
    name: "DAI",
    code: "DAI",
    logo: "https://cryptologos.cc/logos/multi-collateral-dai-dai-logo.png",
    buy: 1270,
    sell: 1290,
    variation: 0.1,
    lastUpdated: "2025-04-08T12:42:00Z",
  },
  {
    name: "USDC",
    code: "USDC",
    logo: "https://cryptologos.cc/logos/usd-coin-usdc-logo.png",
    buy: 1265,
    sell: 1285,
    variation: -0.2,
    lastUpdated: "2025-04-08T12:45:00Z",
  },
];

export function ExchangeRates() {
  const [rates, setRates] = useState<ExchangeRate[]>([]);
  const [cryptoRates, setCryptoRates] = useState<ExchangeRate[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("fiat");

  useEffect(() => {
    // Simulate API call
    const fetchData = () => {
      setTimeout(() => {
        setRates(MOCK_RATES);
        setCryptoRates(MOCK_CRYPTO);
        setLoading(false);
      }, 1500);
    };

    fetchData();
  }, []);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
      maximumFractionDigits: 2,
    }).format(value);
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("es-AR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => {
      // Simulate updated data
      setRates([...MOCK_RATES]);
      setCryptoRates([...MOCK_CRYPTO]);
      setLoading(false);
    }, 1000);
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Cotizaciones</CardTitle>
            <CardDescription>Valores de referencia en ARS</CardDescription>
          </div>
          <button 
            onClick={handleRefresh} 
            className="p-2 rounded-full hover:bg-secondary transition-colors"
            aria-label="Refresh exchange rates"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="fiat" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="fiat">Monedas</TabsTrigger>
            <TabsTrigger value="crypto">Cripto</TabsTrigger>
          </TabsList>
          
          <TabsContent value="fiat" className="m-0">
            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex justify-between py-2">
                    <Skeleton className="h-5 w-24" />
                    <div className="flex gap-4">
                      <Skeleton className="h-5 w-20" />
                      <Skeleton className="h-5 w-20" />
                      <Skeleton className="h-5 w-16" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-1">
                <div className="grid grid-cols-4 gap-4 pb-2 text-sm font-medium text-muted-foreground">
                  <div>Tipo</div>
                  <div className="text-right">Compra</div>
                  <div className="text-right">Venta</div>
                  <div className="text-right">Var.</div>
                </div>
                <div className="divide-y">
                  {rates.map((rate) => (
                    <div key={rate.name} className="grid grid-cols-4 gap-4 py-3 text-sm">
                      <div className="font-medium flex items-center gap-2">
                        {rate.logo && (
                          <img 
                            src={rate.logo} 
                            alt={`${rate.name} logo`} 
                            className="h-5 w-5 object-contain" 
                          />
                        )}
                        {rate.name}
                      </div>
                      <div className="text-right">{formatCurrency(rate.buy)}</div>
                      <div className="text-right">{formatCurrency(rate.sell)}</div>
                      <div className="text-right flex items-center justify-end gap-1">
                        {rate.variation > 0 ? (
                          <ArrowUp className="h-3 w-3 text-finance-positive" />
                        ) : rate.variation < 0 ? (
                          <ArrowDown className="h-3 w-3 text-finance-negative" />
                        ) : null}
                        <span className={rate.variation > 0 ? "text-finance-positive" : rate.variation < 0 ? "text-finance-negative" : ""}>
                          {Math.abs(rate.variation)}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="pt-2 text-xs text-muted-foreground text-right">
                  Actualizado a las {loading ? "..." : formatTime(rates[0].lastUpdated)}
                </div>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="crypto" className="m-0">
            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex justify-between py-2">
                    <Skeleton className="h-5 w-24" />
                    <div className="flex gap-4">
                      <Skeleton className="h-5 w-20" />
                      <Skeleton className="h-5 w-20" />
                      <Skeleton className="h-5 w-16" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-1">
                <div className="grid grid-cols-4 gap-4 pb-2 text-sm font-medium text-muted-foreground">
                  <div>Tipo</div>
                  <div className="text-right">Compra</div>
                  <div className="text-right">Venta</div>
                  <div className="text-right">Var.</div>
                </div>
                <div className="divide-y">
                  {cryptoRates.map((rate) => (
                    <div key={rate.name} className="grid grid-cols-4 gap-4 py-3 text-sm">
                      <div className="font-medium flex items-center gap-2">
                        {rate.logo && (
                          <img 
                            src={rate.logo} 
                            alt={`${rate.name} logo`} 
                            className="h-5 w-5 object-contain" 
                          />
                        )}
                        {rate.name}
                      </div>
                      <div className="text-right">{formatCurrency(rate.buy)}</div>
                      <div className="text-right">{formatCurrency(rate.sell)}</div>
                      <div className="text-right flex items-center justify-end gap-1">
                        {rate.variation > 0 ? (
                          <ArrowUp className="h-3 w-3 text-finance-positive" />
                        ) : rate.variation < 0 ? (
                          <ArrowDown className="h-3 w-3 text-finance-negative" />
                        ) : null}
                        <span className={rate.variation > 0 ? "text-finance-positive" : rate.variation < 0 ? "text-finance-negative" : ""}>
                          {Math.abs(rate.variation)}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="pt-2 text-xs text-muted-foreground text-right">
                  Actualizado a las {loading ? "..." : formatTime(cryptoRates[0].lastUpdated)}
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
