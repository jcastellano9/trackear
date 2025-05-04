
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { RefreshCw, ArrowUpRight, ArrowDownRight, SlidersHorizontal } from "lucide-react";
import { toast } from "sonner";
import { fetchCryptoRates } from "@/services/exchangeRateService";
import { ExchangeRate } from "@/types/exchangeRate";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function CryptoPrices() {
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
      setCryptoRates(data);
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

  const refreshData = () => {
    fetchCryptoData();
    toast.success("Actualizando precios de criptomonedas...");
  };

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

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <CardTitle className="text-xl">Precios de Criptomonedas</CardTitle>
          <CardDescription>
            {lastUpdated
              ? `Última actualización: ${lastUpdated.toLocaleTimeString('es-AR')}`
              : "Cargando datos de mercado..."
            }
          </CardDescription>
        </div>
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <SlidersHorizontal className="h-4 w-4" />
                Filtros
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Ordenar por</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => setSortBy("buy")}>
                Mejor precio de compra
                {sortBy === "buy" && " ✓"}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy("sell")}>
                Mejor precio de venta
                {sortBy === "sell" && " ✓"}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy("spread")}>
                Menor spread
                {sortBy === "spread" && " ✓"}
              </DropdownMenuItem>
              
              <DropdownMenuLabel>Criptomoneda</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => setSelectedCoin(null)}>
                Todas
                {selectedCoin === null && " ✓"}
              </DropdownMenuItem>
              {availableCoins.map(coin => (
                <DropdownMenuItem key={coin} onClick={() => setSelectedCoin(coin)}>
                  {coin}
                  {selectedCoin === coin && " ✓"}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={refreshData}
            disabled={loading}
          >
            <RefreshCw
              className={`h-4 w-4 ${loading ? "animate-spin" : ""}`}
            />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Exchange</TableHead>
                <TableHead>Moneda</TableHead>
                <TableHead className="text-right">Compra</TableHead>
                <TableHead className="text-right">Venta</TableHead>
                <TableHead className="text-right">Spread</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                Array(5).fill(0).map((_, index) => (
                  <TableRow key={index}>
                    <TableCell><Skeleton className="h-6 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-16" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-20" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-20" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-16" /></TableCell>
                  </TableRow>
                ))
              ) : sortedRates.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    No hay datos disponibles
                  </TableCell>
                </TableRow>
              ) : (
                sortedRates.map((rate, index) => {
                  const spread = calculateSpread(rate.buy, rate.sell);
                  const spreadPercentage = calculateSpreadPercentage(rate.buy, rate.sell);
                  
                  // Extract exchange name from format "Exchange (COIN)"
                  const exchangeName = rate.name.split(" (")[0];
                  const coinName = rate.coin || rate.name.split(" (")[1]?.replace(")", "") || "";
                  
                  return (
                    <TableRow key={index}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <div className="bg-white/10 p-1 rounded-full flex items-center justify-center">
                            <img 
                              src={rate.logo} 
                              alt={exchangeName}
                              className="h-6 w-6 object-contain"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.src = `https://ui-avatars.com/api/?name=${exchangeName}&background=random`;
                              }}
                            />
                          </div>
                          {exchangeName}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{coinName}</Badge>
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        ${rate.buy.toLocaleString('es-AR')}
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        ${rate.sell.toLocaleString('es-AR')}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1 text-muted-foreground">
                          <span>${spread.toFixed(2)}</span>
                          <span className="text-xs">({spreadPercentage.toFixed(2)}%)</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
