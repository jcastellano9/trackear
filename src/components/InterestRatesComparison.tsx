
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
    logo: "https://www.mercadopago.com/mla/mpchat/images/wpp-logo.png",
    type: "wallet",
    annualRate: 59.5,
    currency: "ARS",
    features: ["Inversión automática", "Retiro inmediato", "Sin monto mínimo"],
    lastUpdated: "2025-04-08T12:30:00Z",
  },
  {
    provider: "Ualá",
    logo: "https://play-lh.googleusercontent.com/LRrXkuVYMM0LI3NQmJLVvltqjd2-PnQRCEGkJ9afAmuWyH-VgpNbJ7gIUgIqQC4z0g=w240-h480-rw",
    type: "wallet",
    annualRate: 58.2,
    currency: "ARS",
    features: ["Inversión automática", "Retiro inmediato", "Sin monto mínimo"],
    lastUpdated: "2025-04-08T12:32:00Z",
  },
  {
    provider: "Naranja X",
    logo: "https://play-lh.googleusercontent.com/XlTSMU5i_IB5rQlE3MKkbZXxqvAuAMIeY66QGD8RQ8QP_uQqScz1Cq8G1Hf_n8gmfYI=s48-rw",
    type: "wallet",
    annualRate: 57.8,
    currency: "ARS",
    features: ["Inversión automática", "Retiro inmediato", "Sin monto mínimo"],
    lastUpdated: "2025-04-08T12:33:00Z",
  },
  {
    provider: "Personal Pay",
    logo: "https://play-lh.googleusercontent.com/GkOkRBcw2ZVc9H-DK2bK6GQVP3AQl5lmGZJNrg0X4RiVCU8YQQWh5XxpkftPE5n2aw=w240-h480-rw",
    type: "wallet",
    annualRate: 56.5,
    currency: "ARS",
    features: ["Inversión automática", "Retiro inmediato", "Sin monto mínimo"],
    lastUpdated: "2025-04-08T12:34:00Z",
  },
  {
    provider: "Banco Galicia",
    logo: "https://www.bancogalicia.com/contentsite/etc.clientlibs/settings/wcm/designs/bancogalicia/clientlib-all/resources/images/og-images/logo-corporativo.png",
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
    logo: "https://www.santander.com.ar/banco/wcm/connect/e0c86350-9cdb-43fa-93ad-fde61d7ecf26/imagen_og_tag_Santander.jpg?MOD=AJPERES&CACHEID=ROOTWORKSPACE-e0c86350-9cdb-43fa-93ad-fde61d7ecf26-nA6QU9.",
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
    logo: "https://www.bna.com.ar/Images/logo_header.png",
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
    logo: "https://www.bbva.com.ar/content/dam/public-web/bbva/ar/images/logos/logo_bbva_600x315.png",
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
    logo: "https://lemon.me/assets/images/lemon-og.png",
    type: "wallet",
    annualRate: 5.2,
    currency: "USDT",
    features: ["Staking", "Retiro en cualquier momento", "Sin monto mínimo"],
    lastUpdated: "2025-04-08T12:39:00Z",
  },
  {
    provider: "Buenbit",
    logo: "https://play-lh.googleusercontent.com/vMjb1AdEpqvBzUe7m8RLw0v5afTO53K7CcFkz9jmHD3AZUJ6FEtS4K_hJ1d6X5dKiA=w240-h480-rw",
    type: "wallet",
    annualRate: 5.0,
    currency: "DAI",
    features: ["Staking", "Retiro en cualquier momento", "Sin monto mínimo"],
    lastUpdated: "2025-04-08T12:40:00Z",
  },
  {
    provider: "Ripio",
    logo: "https://ripio.com/wp-content/uploads/2020/09/logo-brand.svg",
    type: "wallet",
    annualRate: 4.8,
    currency: "USDC",
    features: ["Staking", "Retiro en cualquier momento", "Sin monto mínimo"],
    lastUpdated: "2025-04-08T12:41:00Z",
  },
  {
    provider: "Belo",
    logo: "https://belo.app/static/img/logo-belo.svg",
    type: "wallet",
    annualRate: 4.5,
    currency: "USDT",
    features: ["Staking", "Retiro en cualquier momento", "Sin monto mínimo"],
    lastUpdated: "2025-04-08T12:42:00Z",
  },
  {
    provider: "Binance",
    logo: "https://public.bnbstatic.com/image/cms/blog/20200707/631c823b-886e-4e46-b21f-c3d5f2e9c541.png",
    type: "wallet",
    annualRate: 5.5,
    currency: "USDT",
    features: ["Staking", "Retiro en cualquier momento", "Sin monto mínimo"],
    lastUpdated: "2025-04-08T12:43:00Z",
  },
  {
    provider: "Nexo",
    logo: "https://nexo.io/images/nexo_logo.png",
    type: "wallet",
    annualRate: 6.2,
    currency: "USDC",
    features: ["Staking", "Seguro para tus fondos", "Interés compuesto"],
    lastUpdated: "2025-04-08T12:44:00Z",
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

type InterestRatesComparisonProps = {
  currencyFilter?: "ARS" | "CRYPTO";
};

export function InterestRatesComparison({ currencyFilter = "ARS" }: InterestRatesComparisonProps) {
  const [searchTerm, setSearchTerm] = useState("");
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
  
  // Filter rates based on currency type (ARS or CRYPTO)
  const filteredByCurrencyType = rates?.filter(rate => {
    if (currencyFilter === "ARS") {
      return rate.currency === "ARS";
    } else {
      return rate.currency !== "ARS"; // All crypto currencies
    }
  }) || [];
  
  // Apply additional filters (search and type)
  const filteredRates = filteredByCurrencyType.filter(rate => {
    // Apply search filter
    const matchesSearch = rate.provider.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Apply type filter
    const matchesType = typeFilter === "all" || rate.type === typeFilter;
    
    return matchesSearch && matchesType;
  });
  
  // Group rates by currency (only relevant for CRYPTO filter)
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

  // Get relevant currencies based on filter
  const relevantCurrencies = currencyFilter === "ARS" 
    ? ["ARS"] 
    : ["USDT", "DAI", "USDC", "USD"];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-semibold">
            {currencyFilter === "ARS" 
              ? "Comparador de Rendimientos en Pesos" 
              : "Comparador de Rendimientos en Crypto"}
          </h2>
          <p className="text-muted-foreground">
            {currencyFilter === "ARS" 
              ? "Compará tasas de interés en pesos de diferentes entidades financieras" 
              : "Compará rendimientos de staking y ahorro en criptomonedas"}
          </p>
        </div>
        
        <div className="w-full md:w-auto flex items-center gap-2">
          <div className="relative w-full md:w-auto">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar proveedor..."
              className="pl-8 w-full dark:bg-zinc-900"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <button 
            onClick={() => refetch()} 
            className="p-2 rounded-md hover:bg-secondary transition-colors"
            aria-label="Actualizar datos"
          >
            <RefreshCw className={`h-5 w-5 ${isLoading ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>
      
      {currencyFilter === "CRYPTO" && (
        <div className="flex flex-wrap gap-2">
          <Badge 
            variant={"default"}
            className="cursor-pointer"
          >
            Todas las crypto
          </Badge>
          <Badge 
            variant={"outline"}
            className="cursor-pointer"
          >
            USDT
          </Badge>
          <Badge 
            variant={"outline"}
            className="cursor-pointer"
          >
            DAI
          </Badge>
          <Badge 
            variant={"outline"}
            className="cursor-pointer"
          >
            USDC
          </Badge>
        </div>
      )}
      
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
          {currencyFilter === "ARS" ? "Billeteras" : "Plataformas"}
        </Badge>
        {currencyFilter === "ARS" && (
          <>
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
          </>
        )}
      </div>
      
      <Card className="dark:bg-zinc-900 border-zinc-800">
        <CardHeader className="pb-2">
          <CardTitle>Mejores Rendimientos</CardTitle>
          <CardDescription>
            {currencyFilter === "ARS" 
              ? "Las mejores opciones en pesos" 
              : "Las mejores opciones por cada criptomoneda"}
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
              {relevantCurrencies.map(currency => {
                const bestRate = getBestRateByCurrency(currency);
                if (!bestRate) return null;
                
                return (
                  <div key={currency} className="bg-zinc-800/50 p-4 rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <Badge>{currency}</Badge>
                      <div className="text-2xl font-bold flex items-center gap-1">
                        {formatPercentage(bestRate.annualRate)}
                        <TrendingUp className="h-4 w-4 text-green-500" />
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {bestRate.logo && (
                        <img 
                          src={bestRate.logo} 
                          alt={bestRate.provider} 
                          className="h-6 w-6 object-contain rounded-full" 
                        />
                      )}
                      <div className="text-lg font-semibold">{bestRate.provider}</div>
                    </div>
                    <div className="text-sm text-zinc-400">
                      {bestRate.type === "wallet" ? (currencyFilter === "ARS" ? "Billetera Virtual" : "Plataforma Crypto") : ""}
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
      
      {currencyFilter === "ARS" ? (
        // ARS View - Show all providers in one table
        <Card className="dark:bg-zinc-900 border-zinc-800">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>
                  <span className="flex items-center gap-2">
                    Pesos Argentinos
                    <Badge>ARS</Badge>
                  </span>
                </CardTitle>
                <CardDescription>
                  {filteredRates.length} opciones de inversión
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            <div className="min-w-[800px]">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-zinc-800">
                    <th className="text-left py-3 font-medium">Proveedor</th>
                    <th className="text-left py-3 font-medium">Tipo</th>
                    <th className="text-center py-3 font-medium">Tasa Anual</th>
                    <th className="text-left py-3 font-medium">Monto Mínimo</th>
                    <th className="text-left py-3 font-medium">Plazo</th>
                    <th className="text-left py-3 font-medium">Características</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRates
                    .sort((a, b) => b.annualRate - a.annualRate)
                    .map((rate) => (
                      <tr key={`${rate.provider}-${rate.type}-${rate.currency}`} className="border-b border-zinc-800 hover:bg-zinc-800/50">
                        <td className="py-4">
                          <div className="flex items-center gap-2">
                            {rate.logo && (
                              <img 
                                src={rate.logo} 
                                alt={rate.provider} 
                                className="h-8 w-8 object-contain rounded-full" 
                              />
                            )}
                            <div>
                              <div className="font-medium">{rate.provider}</div>
                              <div className="text-xs text-zinc-400">
                                actualizado {formatTime(rate.lastUpdated)}
                              </div>
                            </div>
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
                          <div className="text-xs text-zinc-400">TNA</div>
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
      ) : (
        // CRYPTO View - Group by currency
        Object.entries(ratesByCurrency).map(([currency, currencyRates]) => (
          <Card key={currency} className="dark:bg-zinc-900 border-zinc-800">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>
                    <span className="flex items-center gap-2">
                      {currency === "USDT" && "Tether"}
                      {currency === "DAI" && "DAI"}
                      {currency === "USDC" && "USD Coin"}
                      {currency === "USD" && "Dólares"}
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
                    <tr className="border-b border-zinc-800">
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
                        <tr key={`${rate.provider}-${rate.type}-${rate.currency}`} className="border-b border-zinc-800 hover:bg-zinc-800/50">
                          <td className="py-4">
                            <div className="flex items-center gap-2">
                              {rate.logo && (
                                <img 
                                  src={rate.logo} 
                                  alt={rate.provider} 
                                  className="h-8 w-8 object-contain rounded-full" 
                                />
                              )}
                              <div>
                                <div className="font-medium">{rate.provider}</div>
                                <div className="text-xs text-zinc-400">
                                  actualizado {formatTime(rate.lastUpdated)}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="py-4">
                            {rate.type === "wallet" && "Plataforma Crypto"}
                          </td>
                          <td className="text-center py-4 px-2">
                            <div className="font-semibold">{formatPercentage(rate.annualRate)}</div>
                            <div className="text-xs text-zinc-400">APY</div>
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
        ))
      )}
      
      <div className="text-sm text-zinc-500 flex items-center justify-between">
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
