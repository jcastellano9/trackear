
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { RefreshCw, Search, ExternalLink, TrendingUp } from "lucide-react";

// Define types for our interest rates data
type InterestRate = {
  provider: string;
  logo?: string;
  type: "wallet" | "fixed" | "bank" | "fund";
  annualRate: number;
  minAmount?: number;
  maxAmount?: number;
  term?: number; // days
  currency: "ARS" | "USD" | "USDT" | "DAI" | "USDC";
  features: string[];
  lastUpdated: string;
};

// Mock data for interest rates
const MOCK_INTEREST_RATES: InterestRate[] = [
  {
    provider: "Mercado Pago",
    type: "wallet",
    annualRate: 59.5,
    currency: "ARS",
    features: ["Inversión automática", "Retiro inmediato", "Sin monto mínimo"],
    lastUpdated: "2025-04-08T12:30:00Z",
  },
  {
    provider: "Ualá",
    type: "wallet",
    annualRate: 58.2,
    currency: "ARS",
    features: ["Inversión automática", "Retiro inmediato", "Sin monto mínimo"],
    lastUpdated: "2025-04-08T12:32:00Z",
  },
  {
    provider: "Naranja X",
    type: "wallet",
    annualRate: 57.8,
    currency: "ARS",
    features: ["Inversión automática", "Retiro inmediato", "Sin monto mínimo"],
    lastUpdated: "2025-04-08T12:33:00Z",
  },
  {
    provider: "Personal Pay",
    type: "wallet",
    annualRate: 56.5,
    currency: "ARS",
    features: ["Inversión automática", "Retiro inmediato", "Sin monto mínimo"],
    lastUpdated: "2025-04-08T12:34:00Z",
  },
  {
    provider: "Banco Galicia",
    type: "fixed",
    annualRate: 62.5,
    minAmount: 10000,
    term: 30,
    currency: "ARS",
    features: ["Plazo fijo tradicional", "Tasa fija", "30 días mínimo"],
    lastUpdated: "2025-04-08T12:35:00Z",
  },
  {
    provider: "Banco Santander",
    type: "fixed",
    annualRate: 62.2,
    minAmount: 10000,
    term: 30,
    currency: "ARS",
    features: ["Plazo fijo tradicional", "Tasa fija", "30 días mínimo"],
    lastUpdated: "2025-04-08T12:36:00Z",
  },
  {
    provider: "Banco Nación",
    type: "fixed",
    annualRate: 61.8,
    minAmount: 10000,
    term: 30,
    currency: "ARS",
    features: ["Plazo fijo tradicional", "Tasa fija", "30 días mínimo"],
    lastUpdated: "2025-04-08T12:37:00Z",
  },
  {
    provider: "Banco BBVA",
    type: "fixed",
    annualRate: 61.5,
    minAmount: 10000,
    term: 30,
    currency: "ARS",
    features: ["Plazo fijo tradicional", "Tasa fija", "30 días mínimo"],
    lastUpdated: "2025-04-08T12:38:00Z",
  },
  {
    provider: "Lemon",
    type: "wallet",
    annualRate: 5.2,
    currency: "USDT",
    features: ["Staking", "Retiro en cualquier momento", "Sin monto mínimo"],
    lastUpdated: "2025-04-08T12:39:00Z",
  },
  {
    provider: "Buenbit",
    type: "wallet",
    annualRate: 5.0,
    currency: "DAI",
    features: ["Staking", "Retiro en cualquier momento", "Sin monto mínimo"],
    lastUpdated: "2025-04-08T12:40:00Z",
  },
  {
    provider: "Ripio",
    type: "wallet",
    annualRate: 4.8,
    currency: "USDC",
    features: ["Staking", "Retiro en cualquier momento", "Sin monto mínimo"],
    lastUpdated: "2025-04-08T12:41:00Z",
  },
  {
    provider: "Belo",
    type: "wallet",
    annualRate: 4.5,
    currency: "USDT",
    features: ["Staking", "Retiro en cualquier momento", "Sin monto mínimo"],
    lastUpdated: "2025-04-08T12:42:00Z",
  },
];

// Function to fetch interest rates
const fetchInterestRates = async () => {
  // In a real app, this would be an API call
  // For example: return fetch('https://api.comparatasas.ar/rates').then(res => res.json())
  
  // Simulate API latency
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Return mock data
  return MOCK_INTEREST_RATES;
};

export function InterestRatesComparison() {
  const [searchTerm, setSearchTerm] = useState("");
  const [currencyFilter, setCurrencyFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  
  // Use react-query to fetch data
  const { data: rates, isLoading, isError, refetch } = useQuery({
    queryKey: ['interestRates'],
    queryFn: fetchInterestRates,
  });
  
  // Format percentage
  const formatPercentage = (value: number) => {
    return `${value.toFixed(2)}%`;
  };
  
  // Format last updated time
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("es-AR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };
  
  // Format currency
  const formatCurrency = (value: number, currency: string) => {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: currency === "ARS" ? "ARS" : "USD",
      maximumFractionDigits: 2,
    }).format(value);
  };
  
  // Apply filters
  const filteredRates = rates?.filter(rate => {
    // Apply search filter
    const matchesSearch = rate.provider.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Apply currency filter
    const matchesCurrency = currencyFilter === "all" || rate.currency === currencyFilter;
    
    // Apply type filter
    const matchesType = typeFilter === "all" || rate.type === typeFilter;
    
    return matchesSearch && matchesCurrency && matchesType;
  }) || [];
  
  // Group rates by currency
  const ratesByCurrency = filteredRates.reduce((acc, rate) => {
    if (!acc[rate.currency]) {
      acc[rate.currency] = [];
    }
    acc[rate.currency].push(rate);
    return acc;
  }, {} as Record<string, InterestRate[]>);
  
  // Find best rate by currency
  const getBestRateByCurrency = (currency: string) => {
    const currencyRates = rates?.filter(rate => rate.currency === currency) || [];
    if (currencyRates.length === 0) return null;
    
    return currencyRates.reduce((best, current) => {
      return current.annualRate > best.annualRate ? current : best;
    }, currencyRates[0]);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-semibold">Comparador de Rendimientos</h2>
          <p className="text-muted-foreground">
            Compará tasas de interés de diferentes entidades financieras
          </p>
        </div>
        
        <div className="w-full md:w-auto flex items-center gap-2">
          <div className="relative w-full md:w-auto">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar proveedor..."
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
          variant={currencyFilter === "all" ? "default" : "outline"} 
          className="cursor-pointer"
          onClick={() => setCurrencyFilter("all")}
        >
          Todas las monedas
        </Badge>
        <Badge 
          variant={currencyFilter === "ARS" ? "default" : "outline"} 
          className="cursor-pointer"
          onClick={() => setCurrencyFilter("ARS")}
        >
          ARS
        </Badge>
        <Badge 
          variant={currencyFilter === "USD" ? "default" : "outline"} 
          className="cursor-pointer"
          onClick={() => setCurrencyFilter("USD")}
        >
          USD
        </Badge>
        <Badge 
          variant={currencyFilter === "USDT" ? "default" : "outline"} 
          className="cursor-pointer"
          onClick={() => setCurrencyFilter("USDT")}
        >
          USDT
        </Badge>
        <Badge 
          variant={currencyFilter === "DAI" ? "default" : "outline"} 
          className="cursor-pointer"
          onClick={() => setCurrencyFilter("DAI")}
        >
          DAI
        </Badge>
        <Badge 
          variant={currencyFilter === "USDC" ? "default" : "outline"} 
          className="cursor-pointer"
          onClick={() => setCurrencyFilter("USDC")}
        >
          USDC
        </Badge>
      </div>
      
      <div className="flex flex-wrap gap-2">
        <Badge 
          variant={typeFilter === "all" ? "default" : "outline"} 
          className="cursor-pointer"
          onClick={() => setTypeFilter("all")}
        >
          Todos los tipos
        </Badge>
        <Badge 
          variant={typeFilter === "wallet" ? "default" : "outline"} 
          className="cursor-pointer"
          onClick={() => setTypeFilter("wallet")}
        >
          Billeteras
        </Badge>
        <Badge 
          variant={typeFilter === "fixed" ? "default" : "outline"} 
          className="cursor-pointer"
          onClick={() => setTypeFilter("fixed")}
        >
          Plazos Fijos
        </Badge>
        <Badge 
          variant={typeFilter === "bank" ? "default" : "outline"} 
          className="cursor-pointer"
          onClick={() => setTypeFilter("bank")}
        >
          Bancos
        </Badge>
        <Badge 
          variant={typeFilter === "fund" ? "default" : "outline"} 
          className="cursor-pointer"
          onClick={() => setTypeFilter("fund")}
        >
          Fondos
        </Badge>
      </div>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Mejores Rendimientos</CardTitle>
          <CardDescription>
            Lo más conveniente por moneda
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5].map(i => (
                <Skeleton key={i} className="h-36 w-full" />
              ))}
            </div>
          ) : isError ? (
            <div className="text-center py-6 text-destructive">
              Error al cargar datos. Intente nuevamente.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {["ARS", "USD", "USDT", "DAI", "USDC"].map(currency => {
                const bestRate = getBestRateByCurrency(currency);
                if (!bestRate) return null;
                
                return (
                  <div key={currency} className="bg-muted/50 p-4 rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <Badge>{currency}</Badge>
                      <div className="text-2xl font-bold flex items-center gap-1">
                        {formatPercentage(bestRate.annualRate)}
                        <TrendingUp className="h-4 w-4 text-finance-positive" />
                      </div>
                    </div>
                    <div className="text-lg font-semibold">{bestRate.provider}</div>
                    <div className="text-sm text-muted-foreground">
                      {bestRate.type === "wallet" ? "Billetera Virtual" : ""}
                      {bestRate.type === "fixed" ? "Plazo Fijo" : ""}
                      {bestRate.type === "bank" ? "Cuenta Bancaria" : ""}
                      {bestRate.type === "fund" ? "Fondo de Inversión" : ""}
                    </div>
                    <div className="text-sm mt-2">
                      {bestRate.minAmount 
                        ? `Mínimo: ${formatCurrency(bestRate.minAmount, bestRate.currency)}`
                        : "Sin monto mínimo"}
                    </div>
                    <div className="text-sm">
                      {bestRate.term
                        ? `Plazo: ${bestRate.term} días`
                        : "Disponibilidad inmediata"}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
      
      {Object.entries(ratesByCurrency).map(([currency, currencyRates]) => (
        <Card key={currency}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>
                  <span className="flex items-center gap-2">
                    {currency === "ARS" && "Pesos Argentinos"}
                    {currency === "USD" && "Dólares"}
                    {currency === "USDT" && "Tether"}
                    {currency === "DAI" && "DAI"}
                    {currency === "USDC" && "USD Coin"}
                    <Badge>{currency}</Badge>
                  </span>
                </CardTitle>
                <CardDescription>
                  {currencyRates.length} opciones de inversión
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            <div className="min-w-[800px]">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 font-medium">Proveedor</th>
                    <th className="text-left py-3 font-medium">Tipo</th>
                    <th className="text-center py-3 font-medium">Tasa Anual</th>
                    <th className="text-left py-3 font-medium">Monto Mínimo</th>
                    <th className="text-left py-3 font-medium">Plazo</th>
                    <th className="text-left py-3 font-medium">Características</th>
                  </tr>
                </thead>
                <tbody>
                  {currencyRates
                    .sort((a, b) => b.annualRate - a.annualRate)
                    .map((rate) => (
                      <tr key={`${rate.provider}-${rate.type}-${rate.currency}`} className="border-b hover:bg-muted/50">
                        <td className="py-4">
                          <div className="font-medium">{rate.provider}</div>
                          <div className="text-xs text-muted-foreground">
                            actualizado {formatTime(rate.lastUpdated)}
                          </div>
                        </td>
                        <td className="py-4">
                          {rate.type === "wallet" && "Billetera Virtual"}
                          {rate.type === "fixed" && "Plazo Fijo"}
                          {rate.type === "bank" && "Cuenta Bancaria"}
                          {rate.type === "fund" && "Fondo de Inversión"}
                        </td>
                        <td className="text-center py-4 px-2">
                          <div className="font-semibold">{formatPercentage(rate.annualRate)}</div>
                          <div className="text-xs text-muted-foreground">TNA</div>
                        </td>
                        <td className="py-4">
                          {rate.minAmount 
                            ? formatCurrency(rate.minAmount, rate.currency)
                            : "Sin mínimo"}
                        </td>
                        <td className="py-4">
                          {rate.term
                            ? `${rate.term} días`
                            : "Inmediato"}
                        </td>
                        <td className="py-4">
                          <ul className="list-disc list-inside text-sm">
                            {rate.features.map((feature, index) => (
                              <li key={index}>{feature}</li>
                            ))}
                          </ul>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      ))}
      
      <div className="text-sm text-muted-foreground flex items-center justify-between">
        <div>
          Datos obtenidos de <a href="https://comparatasas.ar" target="_blank" rel="noopener noreferrer" className="underline underline-offset-4 inline-flex items-center gap-1">comparatasas.ar <ExternalLink className="h-3 w-3" /></a>
        </div>
        <div>
          Última actualización: {rates?.length ? formatTime(rates[0].lastUpdated) : "..."}
        </div>
      </div>
    </div>
  );
}
