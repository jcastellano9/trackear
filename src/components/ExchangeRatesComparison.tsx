
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowDown, ArrowUp, ExternalLink, RefreshCw, Search } from "lucide-react";

// Define types for our data
type VirtualWallet = {
  name: string;
  logo?: string;
  usdRate: {
    buy: number;
    sell: number;
  };
  daiRate?: {
    buy: number;
    sell: number;
  };
  usdtRate?: {
    buy: number;
    sell: number;
  };
  usdcRate?: {
    buy: number;
    sell: number;
  };
  lastUpdated: string;
};

// Updated sample data with more realistic rates
const MOCK_WALLETS: VirtualWallet[] = [
  {
    name: "Lemon",
    logo: "https://assets.website-files.com/6364e65656ab107e465325d2/636b2cecd8971b169cf89aa0_isotipo-lemon-cash.svg",
    usdRate: { buy: 1290, sell: 1315 },
    usdtRate: { buy: 1285, sell: 1310 },
    daiRate: { buy: 1280, sell: 1305 },
    usdcRate: { buy: 1282, sell: 1307 },
    lastUpdated: "2025-04-08T12:30:00Z",
  },
  {
    name: "Buenbit",
    logo: "https://www.datocms-assets.com/45680/1673553925-buenbit-icon.svg",
    usdRate: { buy: 1292, sell: 1318 },
    usdtRate: { buy: 1287, sell: 1312 },
    daiRate: { buy: 1283, sell: 1308 },
    usdcRate: { buy: 1285, sell: 1310 },
    lastUpdated: "2025-04-08T12:32:00Z",
  },
  {
    name: "Ripio",
    logo: "https://ripio.com/wp-content/uploads/2020/09/logo-brand.svg",
    usdRate: { buy: 1288, sell: 1314 },
    usdtRate: { buy: 1283, sell: 1309 },
    daiRate: { buy: 1279, sell: 1304 },
    usdcRate: { buy: 1281, sell: 1306 },
    lastUpdated: "2025-04-08T12:35:00Z",
  },
  {
    name: "Belo",
    logo: "https://belo.app/static/img/logo-belo.svg",
    usdRate: { buy: 1295, sell: 1320 },
    usdtRate: { buy: 1290, sell: 1315 },
    daiRate: { buy: 1285, sell: 1310 },
    usdcRate: { buy: 1287, sell: 1312 },
    lastUpdated: "2025-04-08T12:33:00Z",
  },
  {
    name: "Let'sBit",
    logo: "https://uploads-ssl.webflow.com/6095a18d3567f0fda20dd67c/62bd61e2a50d6d0cbc240eb0_isologotipo-sin-fondo.svg",
    usdRate: { buy: 1291, sell: 1316 },
    usdtRate: { buy: 1286, sell: 1311 },
    daiRate: { buy: 1281, sell: 1306 },
    usdcRate: { buy: 1284, sell: 1309 },
    lastUpdated: "2025-04-08T12:31:00Z",
  },
  {
    name: "Satoshi Tango",
    logo: "https://satoshitango.com/static/cms-landing/assets/images/logo.svg",
    usdRate: { buy: 1289, sell: 1314 },
    usdtRate: { buy: 1284, sell: 1309 },
    daiRate: { buy: 1280, sell: 1305 },
    usdcRate: { buy: 1282, sell: 1307 },
    lastUpdated: "2025-04-08T12:34:00Z",
  },
];

// Function to fetch exchange rates data
const fetchExchangeRates = async () => {
  // In a real app, this would be replaced with an actual API call
  // For example: return fetch('https://api.dolarify.xyz/wallets').then(res => res.json())
  
  // Simulate API latency
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Return mock data for now
  return MOCK_WALLETS;
};

export function ExchangeRatesComparison() {
  const [searchTerm, setSearchTerm] = useState("");
  
  // Use react-query to fetch and cache data
  const { data: wallets, isLoading, isError, refetch } = useQuery({
    queryKey: ['exchangeRates'],
    queryFn: fetchExchangeRates,
  });

  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
      maximumFractionDigits: 2,
    }).format(value);
  };
  
  // Format last updated time
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("es-AR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };
  
  // Filter wallets based on search term
  const filteredWallets = wallets?.filter(wallet => 
    wallet.name.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  // Find best rates (lowest buy, highest sell)
  const getBestBuyRate = (currencyKey: 'usdRate' | 'usdtRate' | 'daiRate' | 'usdcRate') => {
    if (!wallets?.length) return null;
    
    // Filter to only wallets that have this currency
    const availableWallets = wallets.filter(w => w[currencyKey]);
    if (!availableWallets.length) return null;
    
    // Find wallet with lowest buy rate
    return availableWallets.reduce((best, current) => {
      const currentRate = current[currencyKey]?.buy || 0;
      const bestRate = best[currencyKey]?.buy || 0;
      return currentRate < bestRate ? current : best;
    }, availableWallets[0]);
  };
  
  const getBestSellRate = (currencyKey: 'usdRate' | 'usdtRate' | 'daiRate' | 'usdcRate') => {
    if (!wallets?.length) return null;
    
    // Filter to only wallets that have this currency
    const availableWallets = wallets.filter(w => w[currencyKey]);
    if (!availableWallets.length) return null;
    
    // Find wallet with highest sell rate
    return availableWallets.reduce((best, current) => {
      const currentRate = current[currencyKey]?.sell || 0;
      const bestRate = best[currencyKey]?.sell || 0;
      return currentRate > bestRate ? current : best;
    }, availableWallets[0]);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-semibold">Comparador de Cotizaciones</h2>
          <p className="text-muted-foreground">
            Compará dónde comprar y vender al mejor precio
          </p>
        </div>
        
        <div className="w-full md:w-auto flex items-center gap-2">
          <div className="relative w-full md:w-auto">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar billetera..."
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
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Mejores Cotizaciones</CardTitle>
          <CardDescription>
            Dónde conviene comprar y vender cada moneda
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="space-y-4">
                  <Skeleton className="h-6 w-32" />
                  <div className="space-y-2">
                    <Skeleton className="h-5 w-full" />
                    <Skeleton className="h-5 w-full" />
                  </div>
                </div>
              ))}
            </div>
          ) : isError ? (
            <div className="text-center py-6 text-destructive">
              Error al cargar datos. Intente nuevamente.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* USD Section */}
              <div className="space-y-3">
                <h3 className="font-medium text-lg flex items-center gap-2">
                  <span>Dólar Billete</span>
                  <Badge variant="secondary">USD</Badge>
                </h3>
                <div className="grid grid-cols-1 gap-2">
                  <div className="flex items-center justify-between p-3 rounded-md bg-muted/50">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">Mejor para comprar</span>
                      {getBestBuyRate('usdRate')?.logo && (
                        <img 
                          src={getBestBuyRate('usdRate')?.logo} 
                          alt={getBestBuyRate('usdRate')?.name || "Logo"} 
                          className="h-6 w-6 object-contain" 
                        />
                      )}
                      <div className="font-medium">{getBestBuyRate('usdRate')?.name || "N/A"}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-semibold text-finance-positive">
                        {getBestBuyRate('usdRate') ? formatCurrency(getBestBuyRate('usdRate')?.usdRate.buy || 0) : "N/A"}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-md bg-muted/50">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">Mejor para vender</span>
                      {getBestSellRate('usdRate')?.logo && (
                        <img 
                          src={getBestSellRate('usdRate')?.logo} 
                          alt={getBestSellRate('usdRate')?.name || "Logo"} 
                          className="h-6 w-6 object-contain" 
                        />
                      )}
                      <div className="font-medium">{getBestSellRate('usdRate')?.name || "N/A"}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-semibold text-finance-negative">
                        {getBestSellRate('usdRate') ? formatCurrency(getBestSellRate('usdRate')?.usdRate.sell || 0) : "N/A"}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* USDT Section */}
              <div className="space-y-3">
                <h3 className="font-medium text-lg flex items-center gap-2">
                  <span>Tether</span>
                  <Badge variant="secondary">USDT</Badge>
                </h3>
                <div className="grid grid-cols-1 gap-2">
                  <div className="flex items-center justify-between p-3 rounded-md bg-muted/50">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">Mejor para comprar</span>
                      {getBestBuyRate('usdtRate')?.logo && (
                        <img 
                          src={getBestBuyRate('usdtRate')?.logo} 
                          alt={getBestBuyRate('usdtRate')?.name || "Logo"} 
                          className="h-6 w-6 object-contain" 
                        />
                      )}
                      <div className="font-medium">{getBestBuyRate('usdtRate')?.name || "N/A"}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-semibold text-finance-positive">
                        {getBestBuyRate('usdtRate') ? formatCurrency(getBestBuyRate('usdtRate')?.usdtRate?.buy || 0) : "N/A"}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-md bg-muted/50">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">Mejor para vender</span>
                      {getBestSellRate('usdtRate')?.logo && (
                        <img 
                          src={getBestSellRate('usdtRate')?.logo} 
                          alt={getBestSellRate('usdtRate')?.name || "Logo"} 
                          className="h-6 w-6 object-contain" 
                        />
                      )}
                      <div className="font-medium">{getBestSellRate('usdtRate')?.name || "N/A"}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-semibold text-finance-negative">
                        {getBestSellRate('usdtRate') ? formatCurrency(getBestSellRate('usdtRate')?.usdtRate?.sell || 0) : "N/A"}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* DAI Section */}
              <div className="space-y-3">
                <h3 className="font-medium text-lg flex items-center gap-2">
                  <span>DAI</span>
                  <Badge variant="secondary">DAI</Badge>
                </h3>
                <div className="grid grid-cols-1 gap-2">
                  <div className="flex items-center justify-between p-3 rounded-md bg-muted/50">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">Mejor para comprar</span>
                      {getBestBuyRate('daiRate')?.logo && (
                        <img 
                          src={getBestBuyRate('daiRate')?.logo} 
                          alt={getBestBuyRate('daiRate')?.name || "Logo"} 
                          className="h-6 w-6 object-contain" 
                        />
                      )}
                      <div className="font-medium">{getBestBuyRate('daiRate')?.name || "N/A"}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-semibold text-finance-positive">
                        {getBestBuyRate('daiRate') ? formatCurrency(getBestBuyRate('daiRate')?.daiRate?.buy || 0) : "N/A"}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-md bg-muted/50">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">Mejor para vender</span>
                      {getBestSellRate('daiRate')?.logo && (
                        <img 
                          src={getBestSellRate('daiRate')?.logo} 
                          alt={getBestSellRate('daiRate')?.name || "Logo"} 
                          className="h-6 w-6 object-contain" 
                        />
                      )}
                      <div className="font-medium">{getBestSellRate('daiRate')?.name || "N/A"}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-semibold text-finance-negative">
                        {getBestSellRate('daiRate') ? formatCurrency(getBestSellRate('daiRate')?.daiRate?.sell || 0) : "N/A"}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* USDC Section */}
              <div className="space-y-3">
                <h3 className="font-medium text-lg flex items-center gap-2">
                  <span>USD Coin</span>
                  <Badge variant="secondary">USDC</Badge>
                </h3>
                <div className="grid grid-cols-1 gap-2">
                  <div className="flex items-center justify-between p-3 rounded-md bg-muted/50">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">Mejor para comprar</span>
                      {getBestBuyRate('usdcRate')?.logo && (
                        <img 
                          src={getBestBuyRate('usdcRate')?.logo} 
                          alt={getBestBuyRate('usdcRate')?.name || "Logo"} 
                          className="h-6 w-6 object-contain" 
                        />
                      )}
                      <div className="font-medium">{getBestBuyRate('usdcRate')?.name || "N/A"}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-semibold text-finance-positive">
                        {getBestBuyRate('usdcRate') ? formatCurrency(getBestBuyRate('usdcRate')?.usdcRate?.buy || 0) : "N/A"}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-md bg-muted/50">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">Mejor para vender</span>
                      {getBestSellRate('usdcRate')?.logo && (
                        <img 
                          src={getBestSellRate('usdcRate')?.logo} 
                          alt={getBestSellRate('usdcRate')?.name || "Logo"} 
                          className="h-6 w-6 object-contain" 
                        />
                      )}
                      <div className="font-medium">{getBestSellRate('usdcRate')?.name || "N/A"}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-semibold text-finance-negative">
                        {getBestSellRate('usdcRate') ? formatCurrency(getBestSellRate('usdcRate')?.usdcRate?.sell || 0) : "N/A"}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Todas las Cotizaciones</CardTitle>
          <CardDescription>
            Datos actualizados de las principales billeteras virtuales
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
          ) : filteredWallets.length === 0 ? (
            <div className="text-center py-6 text-muted-foreground">
              No se encontraron billeteras que coincidan con la búsqueda.
            </div>
          ) : (
            <div className="min-w-[800px]">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 font-medium">Proveedor</th>
                    <th className="text-center py-3 font-medium" colSpan={2}>USD</th>
                    <th className="text-center py-3 font-medium" colSpan={2}>USDT</th>
                    <th className="text-center py-3 font-medium" colSpan={2}>DAI</th>
                    <th className="text-center py-3 font-medium" colSpan={2}>USDC</th>
                  </tr>
                  <tr className="border-b text-sm text-muted-foreground">
                    <th className="text-left py-2"></th>
                    <th className="text-center py-2">Compra</th>
                    <th className="text-center py-2">Venta</th>
                    <th className="text-center py-2">Compra</th>
                    <th className="text-center py-2">Venta</th>
                    <th className="text-center py-2">Compra</th>
                    <th className="text-center py-2">Venta</th>
                    <th className="text-center py-2">Compra</th>
                    <th className="text-center py-2">Venta</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredWallets.map((wallet) => (
                    <tr key={wallet.name} className="border-b hover:bg-muted/50">
                      <td className="py-4">
                        <div className="flex items-center gap-2">
                          {wallet.logo && (
                            <img 
                              src={wallet.logo} 
                              alt={`${wallet.name} logo`} 
                              className="h-8 w-8 object-contain" 
                            />
                          )}
                          <div>
                            <div className="font-medium">{wallet.name}</div>
                            <div className="text-xs text-muted-foreground">
                              actualizado {formatTime(wallet.lastUpdated)}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="text-center py-4 px-2">{formatCurrency(wallet.usdRate.buy)}</td>
                      <td className="text-center py-4 px-2">{formatCurrency(wallet.usdRate.sell)}</td>
                      <td className="text-center py-4 px-2">
                        {wallet.usdtRate ? formatCurrency(wallet.usdtRate.buy) : "-"}
                      </td>
                      <td className="text-center py-4 px-2">
                        {wallet.usdtRate ? formatCurrency(wallet.usdtRate.sell) : "-"}
                      </td>
                      <td className="text-center py-4 px-2">
                        {wallet.daiRate ? formatCurrency(wallet.daiRate.buy) : "-"}
                      </td>
                      <td className="text-center py-4 px-2">
                        {wallet.daiRate ? formatCurrency(wallet.daiRate.sell) : "-"}
                      </td>
                      <td className="text-center py-4 px-2">
                        {wallet.usdcRate ? formatCurrency(wallet.usdcRate.buy) : "-"}
                      </td>
                      <td className="text-center py-4 px-2">
                        {wallet.usdcRate ? formatCurrency(wallet.usdcRate.sell) : "-"}
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
          Datos obtenidos de <a href="https://usdc.ar" target="_blank" rel="noopener noreferrer" className="underline underline-offset-4 inline-flex items-center gap-1">usdc.ar <ExternalLink className="h-3 w-3" /></a>
        </div>
        <div>
          Última actualización: {wallets?.length ? formatTime(wallets[0].lastUpdated) : "..."}
        </div>
      </div>
    </div>
  );
}
