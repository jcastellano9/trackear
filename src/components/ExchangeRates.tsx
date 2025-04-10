
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { TrendingUp, TrendingDown, RefreshCw } from "lucide-react";
import { toast } from "sonner";

type ExchangeRate = {
  nombre: string;
  compra: number;
  venta: number;
  fechaActualizacion: string;
  casa: string;
  moneda: string;
  logo?: string; // URL to the logo
  symbol?: string; // Currency symbol
};

export function ExchangeRates() {
  const [exchangeRates, setExchangeRates] = useState<ExchangeRate[]>([]);
  const [cryptoRates, setCryptoRates] = useState<ExchangeRate[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  
  const fetchDolarData = async () => {
    try {
      const response = await fetch('https://dolarapi.com/v1/dolares');
      if (!response.ok) throw new Error('Error al cargar datos de dólar');
      
      const data = await response.json();
      
      // Transform the data to match our ExchangeRate type
      const formattedData: ExchangeRate[] = data.map((item: any) => ({
        nombre: item.nombre,
        compra: item.compra,
        venta: item.venta,
        fechaActualizacion: item.fechaActualizacion,
        casa: item.casa,
        moneda: "USD",
        logo: "https://cdn.jsdelivr.net/gh/Yesenia-AriasC/imagenes@main/dolar.png", // Default USD logo
        symbol: "$"
      }));
      
      setExchangeRates(formattedData);
      setLastUpdated(new Date());
      setLoading(false);
    } catch (error) {
      console.error("Error fetching exchange rates:", error);
      toast.error("No se pudieron cargar los datos de cotizaciones");
      // Load fallback data
      loadFallbackData();
    }
  };
  
  const fetchCryptoData = async () => {
    try {
      // Ideally, we would use a cryptocurrency API here
      // For now, we'll use mock data
      const mockCryptoData: ExchangeRate[] = [
        {
          nombre: "Bitcoin",
          compra: 60850000,
          venta: 62150000,
          fechaActualizacion: new Date().toISOString(),
          casa: "binance",
          moneda: "BTC",
          logo: "https://cryptologos.cc/logos/bitcoin-btc-logo.png",
          symbol: "₿"
        },
        {
          nombre: "Ethereum",
          compra: 3020000,
          venta: 3080000,
          fechaActualizacion: new Date().toISOString(),
          casa: "binance",
          moneda: "ETH",
          logo: "https://cryptologos.cc/logos/ethereum-eth-logo.png",
          symbol: "Ξ"
        },
        {
          nombre: "Tether",
          compra: 1140,
          venta: 1160,
          fechaActualizacion: new Date().toISOString(),
          casa: "binance",
          moneda: "USDT",
          logo: "https://cryptologos.cc/logos/tether-usdt-logo.png",
          symbol: "₮"
        },
        {
          nombre: "USDC",
          compra: 1140,
          venta: 1160,
          fechaActualizacion: new Date().toISOString(),
          casa: "binance",
          moneda: "USDC",
          logo: "https://cryptologos.cc/logos/usd-coin-usdc-logo.png",
          symbol: "₵"
        }
      ];
      
      setCryptoRates(mockCryptoData);
    } catch (error) {
      console.error("Error fetching crypto rates:", error);
      setCryptoRates([]);
    }
  };
  
  const loadFallbackData = () => {
    // Fallback data in case API fails
    const fallbackData: ExchangeRate[] = [
      {
        nombre: "Oficial",
        compra: 935.50,
        venta: 975.50,
        fechaActualizacion: new Date().toISOString(),
        casa: "oficial",
        moneda: "USD",
        logo: "https://cdn.jsdelivr.net/gh/Yesenia-AriasC/imagenes@main/dolar.png",
        symbol: "$"
      },
      {
        nombre: "Blue",
        compra: 1160,
        venta: 1180,
        fechaActualizacion: new Date().toISOString(),
        casa: "blue",
        moneda: "USD",
        logo: "https://cdn.jsdelivr.net/gh/Yesenia-AriasC/imagenes@main/dolar.png",
        symbol: "$"
      },
      {
        nombre: "MEP",
        compra: 1135,
        venta: 1140,
        fechaActualizacion: new Date().toISOString(),
        casa: "bolsa",
        moneda: "USD",
        logo: "https://cdn.jsdelivr.net/gh/Yesenia-AriasC/imagenes@main/dolar.png",
        symbol: "$"
      }
    ];
    
    setExchangeRates(fallbackData);
    setLastUpdated(new Date());
    setLoading(false);
  };
  
  // Fetch data on component mount
  useEffect(() => {
    fetchDolarData();
    fetchCryptoData();
    
    // Refresh every 30 minutes
    const interval = setInterval(() => {
      fetchDolarData();
      fetchCryptoData();
    }, 30 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);
  
  const refreshData = () => {
    setLoading(true);
    fetchDolarData();
    fetchCryptoData();
    toast.success("Actualizando cotizaciones...");
  };
  
  const formatCurrency = (value: number, currency: string = "ARS") => {
    if (value > 10000) {
      return `${(value / 1000).toFixed(1)}K`;
    }
    return value.toLocaleString('es-AR');
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <CardTitle className="text-xl">Cotizaciones</CardTitle>
          <CardDescription>
            {lastUpdated
              ? `Última actualización: ${lastUpdated.toLocaleTimeString('es-AR')}`
              : "Cargando..."
            }
          </CardDescription>
        </div>
        <RefreshCw
          className={`h-4 w-4 cursor-pointer text-muted-foreground ${loading ? "animate-spin" : ""}`}
          onClick={refreshData}
        />
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="dolar">
          <TabsList className="mb-4">
            <TabsTrigger value="dolar">Dólar</TabsTrigger>
            <TabsTrigger value="crypto">Crypto</TabsTrigger>
          </TabsList>
          
          <TabsContent value="dolar">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Compra</TableHead>
                  <TableHead>Venta</TableHead>
                  <TableHead className="hidden md:table-cell">Brecha</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  Array(3).fill(0).map((_, i) => (
                    <TableRow key={`skeleton-${i}`}>
                      <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                      <TableCell><Skeleton className="h-5 w-16" /></TableCell>
                      <TableCell><Skeleton className="h-5 w-16" /></TableCell>
                      <TableCell className="hidden md:table-cell"><Skeleton className="h-5 w-16" /></TableCell>
                    </TableRow>
                  ))
                ) : (
                  exchangeRates.map((rate, index) => {
                    // Calculate spread against official rate
                    const officialRate = exchangeRates.find(r => r.casa === "oficial")?.venta || 0;
                    const spread = officialRate ? ((rate.venta / officialRate) - 1) * 100 : 0;
                    
                    return (
                      <TableRow key={`exchange-${index}`}>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            {rate.logo && (
                              <img src={rate.logo} alt={rate.nombre} className="h-5 w-5 object-contain" />
                            )}
                            {rate.nombre}
                          </div>
                        </TableCell>
                        <TableCell>
                          {rate.compra > 0 ? `${rate.symbol || "$"}${formatCurrency(rate.compra)}` : "-"}
                        </TableCell>
                        <TableCell className="font-medium">
                          {`${rate.symbol || "$"}${formatCurrency(rate.venta)}`}
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          {rate.casa !== "oficial" && officialRate > 0 ? (
                            <Badge variant={spread > 0 ? "default" : "destructive"}>
                              {spread > 0 ? <TrendingUp className="mr-1 h-3 w-3" /> : <TrendingDown className="mr-1 h-3 w-3" />}
                              {Math.abs(spread).toFixed(1)}%
                            </Badge>
                          ) : (
                            <span className="text-muted-foreground text-sm">Referencia</span>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </TabsContent>
          
          <TabsContent value="crypto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Moneda</TableHead>
                  <TableHead>Compra (ARS)</TableHead>
                  <TableHead>Venta (ARS)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  Array(4).fill(0).map((_, i) => (
                    <TableRow key={`crypto-skeleton-${i}`}>
                      <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                      <TableCell><Skeleton className="h-5 w-20" /></TableCell>
                      <TableCell><Skeleton className="h-5 w-20" /></TableCell>
                    </TableRow>
                  ))
                ) : (
                  cryptoRates.map((crypto, index) => (
                    <TableRow key={`crypto-${index}`}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          {crypto.logo && (
                            <img src={crypto.logo} alt={crypto.nombre} className="h-5 w-5 object-contain" />
                          )}
                          <div>
                            <div>{crypto.nombre}</div>
                            <div className="text-xs text-muted-foreground">{crypto.moneda}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        ${formatCurrency(crypto.compra)}
                      </TableCell>
                      <TableCell className="font-medium">
                        ${formatCurrency(crypto.venta)}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
