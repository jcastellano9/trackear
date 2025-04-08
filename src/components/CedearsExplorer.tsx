
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { RefreshCw, Search, ExternalLink, TrendingUp, TrendingDown } from "lucide-react";

// Define types for CEDEARS data
type Cedear = {
  symbol: string;
  name: string;
  sector: string;
  price: number;
  change: number;
  changePercent: number;
  ratio: number;
  volume: number;
  currency: string;
  market: string;
  lastUpdated: string;
};

// Mock data for CEDEARs
const MOCK_CEDEARS: Cedear[] = [
  {
    symbol: "AAPL",
    name: "Apple Inc.",
    sector: "Tecnología",
    price: 23500,
    change: 480,
    changePercent: 2.1,
    ratio: 10,
    volume: 123456,
    currency: "ARS",
    market: "BYMA",
    lastUpdated: "2025-04-08T12:30:00Z",
  },
  {
    symbol: "MSFT",
    name: "Microsoft Corporation",
    sector: "Tecnología",
    price: 25600,
    change: 320,
    changePercent: 1.3,
    ratio: 10,
    volume: 98765,
    currency: "ARS",
    market: "BYMA",
    lastUpdated: "2025-04-08T12:31:00Z",
  },
  {
    symbol: "AMZN",
    name: "Amazon.com Inc.",
    sector: "Consumo Discrecional",
    price: 27800,
    change: -150,
    changePercent: -0.5,
    ratio: 12,
    volume: 78954,
    currency: "ARS",
    market: "BYMA",
    lastUpdated: "2025-04-08T12:32:00Z",
  },
  {
    symbol: "GOOGL",
    name: "Alphabet Inc.",
    sector: "Comunicaciones",
    price: 18700,
    change: 230,
    changePercent: 1.2,
    ratio: 15,
    volume: 45678,
    currency: "ARS",
    market: "BYMA",
    lastUpdated: "2025-04-08T12:33:00Z",
  },
  {
    symbol: "META",
    name: "Meta Platforms Inc.",
    sector: "Comunicaciones",
    price: 32500,
    change: 780,
    changePercent: 2.5,
    ratio: 8,
    volume: 34567,
    currency: "ARS",
    market: "BYMA",
    lastUpdated: "2025-04-08T12:34:00Z",
  },
  {
    symbol: "TSLA",
    name: "Tesla Inc.",
    sector: "Consumo Discrecional",
    price: 19800,
    change: -420,
    changePercent: -2.1,
    ratio: 15,
    volume: 56789,
    currency: "ARS",
    market: "BYMA",
    lastUpdated: "2025-04-08T12:35:00Z",
  },
  {
    symbol: "JPM",
    name: "JPMorgan Chase & Co.",
    sector: "Financiero",
    price: 15600,
    change: 110,
    changePercent: 0.7,
    ratio: 5,
    volume: 23456,
    currency: "ARS",
    market: "BYMA",
    lastUpdated: "2025-04-08T12:36:00Z",
  },
  {
    symbol: "WMT",
    name: "Walmart Inc.",
    sector: "Consumo Básico",
    price: 12300,
    change: -90,
    changePercent: -0.7,
    ratio: 5,
    volume: 12345,
    currency: "ARS",
    market: "BYMA",
    lastUpdated: "2025-04-08T12:37:00Z",
  },
  {
    symbol: "DIS",
    name: "The Walt Disney Company",
    sector: "Comunicaciones",
    price: 14500,
    change: 250,
    changePercent: 1.8,
    ratio: 4,
    volume: 34567,
    currency: "ARS",
    market: "BYMA",
    lastUpdated: "2025-04-08T12:38:00Z",
  },
  {
    symbol: "KO",
    name: "The Coca-Cola Company",
    sector: "Consumo Básico",
    price: 9800,
    change: 120,
    changePercent: 1.2,
    ratio: 5,
    volume: 23456,
    currency: "ARS",
    market: "BYMA",
    lastUpdated: "2025-04-08T12:39:00Z",
  },
  {
    symbol: "PFE",
    name: "Pfizer Inc.",
    sector: "Salud",
    price: 7500,
    change: -30,
    changePercent: -0.4,
    ratio: 3,
    volume: 45678,
    currency: "ARS",
    market: "BYMA",
    lastUpdated: "2025-04-08T12:40:00Z",
  },
  {
    symbol: "NFLX",
    name: "Netflix Inc.",
    sector: "Comunicaciones",
    price: 42300,
    change: 980,
    changePercent: 2.4,
    ratio: 12,
    volume: 12345,
    currency: "ARS",
    market: "BYMA",
    lastUpdated: "2025-04-08T12:41:00Z",
  },
];

// Function to fetch CEDEARs data
const fetchCedears = async () => {
  // In a real app, this would be an API call
  // For example: return fetch('https://api.cedears.ar/cedears').then(res => res.json())
  
  // Simulate API latency
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Return mock data
  return MOCK_CEDEARS;
};

export function CedearsExplorer() {
  const [searchTerm, setSearchTerm] = useState("");
  const [sectorFilter, setSectorFilter] = useState<string>("all");
  
  // Use react-query to fetch data
  const { data: cedears, isLoading, isError, refetch } = useQuery({
    queryKey: ['cedears'],
    queryFn: fetchCedears,
  });
  
  // Format currency
  const formatCurrency = (value: number, currency: string) => {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: currency,
      maximumFractionDigits: 2,
    }).format(value);
  };
  
  // Format percentage
  const formatPercentage = (value: number) => {
    return `${value > 0 ? "+" : ""}${value.toFixed(2)}%`;
  };
  
  // Format large numbers
  const formatNumber = (value: number) => {
    return new Intl.NumberFormat("es-AR").format(value);
  };
  
  // Format time
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("es-AR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };
  
  // Get all unique sectors
  const sectors = cedears 
    ? [...new Set(cedears.map(cedear => cedear.sector))]
    : [];
  
  // Apply filters
  const filteredCedears = cedears?.filter(cedear => {
    // Apply search filter (symbol or name)
    const matchesSearch = 
      cedear.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cedear.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Apply sector filter
    const matchesSector = sectorFilter === "all" || cedear.sector === sectorFilter;
    
    return matchesSearch && matchesSector;
  }) || [];
  
  // Get top gainers and losers
  const topGainers = [...(cedears || [])]
    .sort((a, b) => b.changePercent - a.changePercent)
    .slice(0, 3);
    
  const topLosers = [...(cedears || [])]
    .sort((a, b) => a.changePercent - b.changePercent)
    .slice(0, 3);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-semibold">Explorador de CEDEARs</h2>
          <p className="text-muted-foreground">
            Analiza y compara acciones argentinas de empresas extranjeras
          </p>
        </div>
        
        <div className="w-full md:w-auto flex items-center gap-2">
          <div className="relative w-full md:w-auto">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar por símbolo o nombre..."
              className="pl-8 w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <button 
            onClick={() => refetch()} 
            className="p-2 rounded-md hover:bg-secondary transition-colors"
            aria-label="Actualizar cotizaciones"
          >
            <RefreshCw className={`h-5 w-5 ${isLoading ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>
      
      <div className="flex flex-wrap gap-2">
        <Badge 
          variant={sectorFilter === "all" ? "default" : "outline"} 
          className="cursor-pointer"
          onClick={() => setSectorFilter("all")}
        >
          Todos los sectores
        </Badge>
        {sectors.map(sector => (
          <Badge 
            key={sector}
            variant={sectorFilter === sector ? "default" : "outline"} 
            className="cursor-pointer"
            onClick={() => setSectorFilter(sector)}
          >
            {sector}
          </Badge>
        ))}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-finance-positive" />
              Mayores Subas
            </CardTitle>
            <CardDescription>
              CEDEARs con mejor rendimiento del día
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map(i => (
                  <Skeleton key={i} className="h-14 w-full" />
                ))}
              </div>
            ) : isError ? (
              <div className="text-center py-4 text-destructive">
                Error al cargar datos
              </div>
            ) : (
              <div className="space-y-2">
                {topGainers.map(cedear => (
                  <div key={cedear.symbol} className="flex items-center justify-between p-3 rounded-md hover:bg-muted/50">
                    <div>
                      <div className="font-medium flex items-center gap-2">
                        {cedear.symbol}
                        <Badge variant="outline" className="text-xs">{cedear.ratio}:1</Badge>
                      </div>
                      <div className="text-sm text-muted-foreground">{cedear.name}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">{formatCurrency(cedear.price, cedear.currency)}</div>
                      <div className="text-sm text-finance-positive flex items-center justify-end gap-1">
                        <TrendingUp className="h-3 w-3" />
                        {formatPercentage(cedear.changePercent)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2">
              <TrendingDown className="h-5 w-5 text-finance-negative" />
              Mayores Bajas
            </CardTitle>
            <CardDescription>
              CEDEARs con peor rendimiento del día
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map(i => (
                  <Skeleton key={i} className="h-14 w-full" />
                ))}
              </div>
            ) : isError ? (
              <div className="text-center py-4 text-destructive">
                Error al cargar datos
              </div>
            ) : (
              <div className="space-y-2">
                {topLosers.map(cedear => (
                  <div key={cedear.symbol} className="flex items-center justify-between p-3 rounded-md hover:bg-muted/50">
                    <div>
                      <div className="font-medium flex items-center gap-2">
                        {cedear.symbol}
                        <Badge variant="outline" className="text-xs">{cedear.ratio}:1</Badge>
                      </div>
                      <div className="text-sm text-muted-foreground">{cedear.name}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">{formatCurrency(cedear.price, cedear.currency)}</div>
                      <div className="text-sm text-finance-negative flex items-center justify-end gap-1">
                        <TrendingDown className="h-3 w-3" />
                        {formatPercentage(cedear.changePercent)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Listado de CEDEARs</CardTitle>
          <CardDescription>
            {filteredCedears.length} CEDEARs disponibles para invertir
          </CardDescription>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          {isLoading ? (
            <div className="space-y-6">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-24 w-full" />
              ))}
            </div>
          ) : isError ? (
            <div className="text-center py-6 text-destructive">
              Error al cargar datos. Intente nuevamente.
            </div>
          ) : filteredCedears.length === 0 ? (
            <div className="text-center py-6 text-muted-foreground">
              No se encontraron CEDEARs que coincidan con la búsqueda.
            </div>
          ) : (
            <div className="min-w-[800px]">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 font-medium">Símbolo</th>
                    <th className="text-left py-3 font-medium">Nombre</th>
                    <th className="text-left py-3 font-medium">Sector</th>
                    <th className="text-right py-3 font-medium">Precio</th>
                    <th className="text-right py-3 font-medium">Variación</th>
                    <th className="text-center py-3 font-medium">Ratio</th>
                    <th className="text-right py-3 font-medium">Volumen</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCedears.map((cedear) => (
                    <tr key={cedear.symbol} className="border-b hover:bg-muted/50">
                      <td className="py-4 font-medium">{cedear.symbol}</td>
                      <td className="py-4">
                        <div>{cedear.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {cedear.market}
                        </div>
                      </td>
                      <td className="py-4">{cedear.sector}</td>
                      <td className="py-4 text-right font-medium">
                        {formatCurrency(cedear.price, cedear.currency)}
                      </td>
                      <td className="py-4 text-right">
                        <div className={`flex items-center justify-end gap-1 ${
                          cedear.change > 0 
                            ? "text-finance-positive" 
                            : cedear.change < 0 
                              ? "text-finance-negative" 
                              : ""
                        }`}>
                          {cedear.change > 0 ? (
                            <TrendingUp className="h-4 w-4" />
                          ) : cedear.change < 0 ? (
                            <TrendingDown className="h-4 w-4" />
                          ) : null}
                          <span>{formatPercentage(cedear.changePercent)}</span>
                        </div>
                        <div className="text-xs text-muted-foreground text-right">
                          {cedear.change > 0 ? "+" : ""}
                          {formatCurrency(cedear.change, cedear.currency)}
                        </div>
                      </td>
                      <td className="py-4 text-center">
                        <Badge variant="outline">{cedear.ratio}:1</Badge>
                      </td>
                      <td className="py-4 text-right">
                        {formatNumber(cedear.volume)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
      
      <div className="text-sm text-muted-foreground flex items-center justify-between">
        <div>
          Datos obtenidos de <a href="https://cedears.ar" target="_blank" rel="noopener noreferrer" className="underline underline-offset-4 inline-flex items-center gap-1">cedears.ar <ExternalLink className="h-3 w-3" /></a>
        </div>
        <div>
          Última actualización: {cedears?.length ? formatTime(cedears[0].lastUpdated) : "..."}
        </div>
      </div>
    </div>
  );
}
