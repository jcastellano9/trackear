
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowDown, ArrowUp, RefreshCw, Search } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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

// Wallet logos
const walletLogos = {
  Lemon: "https://assets.website-files.com/6364e65656ab107e465325d2/636b2cecd8971b169cf89aa0_isotipo-lemon-cash.svg",
  Buenbit: "https://www.datocms-assets.com/45680/1673553925-buenbit-icon.svg",
  Ripio: "https://ripio.com/wp-content/uploads/2020/09/logo-brand.svg",
  Belo: "https://belo.app/static/img/logo-belo.svg",
  LetsBit: "https://uploads-ssl.webflow.com/6095a18d3567f0fda20dd67c/62bd61e2a50d6d0cbc240eb0_isologotipo-sin-fondo.svg",
  SatoshiTango: "https://satoshitango.com/static/cms-landing/assets/images/logo.svg"
};

// Crypto logos
const cryptoLogos = {
  USD: "https://cryptologos.cc/logos/usd-coin-usdc-logo.png?v=029",
  USDT: "https://cryptologos.cc/logos/tether-usdt-logo.png?v=029",
  DAI: "https://cryptologos.cc/logos/multi-collateral-dai-dai-logo.png?v=029",
  USDC: "https://cryptologos.cc/logos/usd-coin-usdc-logo.png?v=029"
};

// Updated sample data with more realistic rates
const MOCK_WALLETS: VirtualWallet[] = [
  {
    name: "Lemon",
    logo: walletLogos.Lemon,
    usdRate: { buy: 1290, sell: 1315 },
    usdtRate: { buy: 1285, sell: 1310 },
    daiRate: { buy: 1280, sell: 1305 },
    usdcRate: { buy: 1282, sell: 1307 },
    lastUpdated: "2025-04-08T12:30:00Z",
  },
  {
    name: "Buenbit",
    logo: walletLogos.Buenbit,
    usdRate: { buy: 1292, sell: 1318 },
    usdtRate: { buy: 1287, sell: 1312 },
    daiRate: { buy: 1283, sell: 1308 },
    usdcRate: { buy: 1285, sell: 1310 },
    lastUpdated: "2025-04-08T12:32:00Z",
  },
  {
    name: "Ripio",
    logo: walletLogos.Ripio,
    usdRate: { buy: 1288, sell: 1314 },
    usdtRate: { buy: 1283, sell: 1309 },
    daiRate: { buy: 1279, sell: 1304 },
    usdcRate: { buy: 1281, sell: 1306 },
    lastUpdated: "2025-04-08T12:35:00Z",
  },
  {
    name: "Belo",
    logo: walletLogos.Belo,
    usdRate: { buy: 1295, sell: 1320 },
    usdtRate: { buy: 1290, sell: 1315 },
    daiRate: { buy: 1285, sell: 1310 },
    usdcRate: { buy: 1287, sell: 1312 },
    lastUpdated: "2025-04-08T12:33:00Z",
  },
  {
    name: "Let'sBit",
    logo: walletLogos.LetsBit,
    usdRate: { buy: 1291, sell: 1316 },
    usdtRate: { buy: 1286, sell: 1311 },
    daiRate: { buy: 1281, sell: 1306 },
    usdcRate: { buy: 1284, sell: 1309 },
    lastUpdated: "2025-04-08T12:31:00Z",
  },
  {
    name: "Satoshi Tango",
    logo: walletLogos.SatoshiTango,
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
  // For example: return fetch('https://api.example.com/wallets').then(res => res.json())
  
  // Simulate API latency
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Return mock data for now
  return MOCK_WALLETS;
};

export function ExchangeRatesComparison() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("monedas");
  
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
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="monedas">Monedas</TabsTrigger>
          <TabsTrigger value="cripto">Cripto</TabsTrigger>
        </TabsList>

        <TabsContent value="monedas">
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
                            <div className="flex-shrink-0 w-6 h-6 overflow-hidden">
                              <img 
                                src={getBestBuyRate('usdRate')?.logo} 
                                alt={getBestBuyRate('usdRate')?.name || "Logo"} 
                                className="h-6 w-6 object-contain" 
                              />
                            </div>
                          )}
                          <div className="font-medium">{getBestBuyRate('usdRate')?.name || "N/A"}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-semibold text-green-500">
                            $ {getBestBuyRate('usdRate') ? getBestBuyRate('usdRate')?.usdRate.buy.toLocaleString('es-AR') : "N/A"}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between p-3 rounded-md bg-muted/50">
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground">Mejor para vender</span>
                          {getBestSellRate('usdRate')?.logo && (
                            <div className="flex-shrink-0 w-6 h-6 overflow-hidden">
                              <img 
                                src={getBestSellRate('usdRate')?.logo} 
                                alt={getBestSellRate('usdRate')?.name || "Logo"} 
                                className="h-6 w-6 object-contain" 
                              />
                            </div>
                          )}
                          <div className="font-medium">{getBestSellRate('usdRate')?.name || "N/A"}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-semibold text-red-500">
                            $ {getBestSellRate('usdRate') ? getBestSellRate('usdRate')?.usdRate.sell.toLocaleString('es-AR') : "N/A"}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
          
          <Card className="mt-6">
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
                <div className="min-w-[600px]">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 font-medium">Proveedor</th>
                        <th className="text-center py-3 font-medium" colSpan={2}>USD</th>
                      </tr>
                      <tr className="border-b text-sm text-muted-foreground">
                        <th className="text-left py-2"></th>
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
                                <div className="flex-shrink-0 w-8 h-8 overflow-hidden flex items-center justify-center">
                                  <img 
                                    src={wallet.logo} 
                                    alt={`${wallet.name} logo`} 
                                    className="h-8 w-8 object-contain" 
                                  />
                                </div>
                              )}
                              <div>
                                <div className="font-medium">{wallet.name}</div>
                                <div className="text-xs text-muted-foreground">
                                  actualizado {formatTime(wallet.lastUpdated)}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="text-center py-4 px-2">$ {wallet.usdRate.buy.toLocaleString('es-AR')}</td>
                          <td className="text-center py-4 px-2">$ {wallet.usdRate.sell.toLocaleString('es-AR')}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="cripto">
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
                          <div className="flex items-center gap-1">
                            {getBestBuyRate('usdtRate')?.logo && (
                              <div className="flex-shrink-0 w-6 h-6 overflow-hidden">
                                <img 
                                  src={getBestBuyRate('usdtRate')?.logo} 
                                  alt={getBestBuyRate('usdtRate')?.name || "Logo"} 
                                  className="h-6 w-6 object-contain" 
                                />
                              </div>
                            )}
                            <div className="font-medium">{getBestBuyRate('usdtRate')?.name || "N/A"}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-semibold text-green-500">
                            $ {getBestBuyRate('usdtRate') ? getBestBuyRate('usdtRate')?.usdtRate?.buy.toLocaleString('es-AR') : "N/A"}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between p-3 rounded-md bg-muted/50">
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground">Mejor para vender</span>
                          <div className="flex items-center gap-1">
                            {getBestSellRate('usdtRate')?.logo && (
                              <div className="flex-shrink-0 w-6 h-6 overflow-hidden">
                                <img 
                                  src={getBestSellRate('usdtRate')?.logo} 
                                  alt={getBestSellRate('usdtRate')?.name || "Logo"} 
                                  className="h-6 w-6 object-contain" 
                                />
                              </div>
                            )}
                            <div className="font-medium">{getBestSellRate('usdtRate')?.name || "N/A"}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-semibold text-red-500">
                            $ {getBestSellRate('usdtRate') ? getBestSellRate('usdtRate')?.usdtRate?.sell.toLocaleString('es-AR') : "N/A"}
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
                          <div className="flex items-center gap-1">
                            {getBestBuyRate('daiRate')?.logo && (
                              <div className="flex-shrink-0 w-6 h-6 overflow-hidden">
                                <img 
                                  src={getBestBuyRate('daiRate')?.logo} 
                                  alt={getBestBuyRate('daiRate')?.name || "Logo"} 
                                  className="h-6 w-6 object-contain" 
                                />
                              </div>
                            )}
                            <div className="font-medium">{getBestBuyRate('daiRate')?.name || "N/A"}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-semibold text-green-500">
                            $ {getBestBuyRate('daiRate') ? getBestBuyRate('daiRate')?.daiRate?.buy.toLocaleString('es-AR') : "N/A"}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between p-3 rounded-md bg-muted/50">
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground">Mejor para vender</span>
                          <div className="flex items-center gap-1">
                            {getBestSellRate('daiRate')?.logo && (
                              <div className="flex-shrink-0 w-6 h-6 overflow-hidden">
                                <img 
                                  src={getBestSellRate('daiRate')?.logo} 
                                  alt={getBestSellRate('daiRate')?.name || "Logo"} 
                                  className="h-6 w-6 object-contain" 
                                />
                              </div>
                            )}
                            <div className="font-medium">{getBestSellRate('daiRate')?.name || "N/A"}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-semibold text-red-500">
                            $ {getBestSellRate('daiRate') ? getBestSellRate('daiRate')?.daiRate?.sell.toLocaleString('es-AR') : "N/A"}
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
                          <div className="flex items-center gap-1">
                            {getBestBuyRate('usdcRate')?.logo && (
                              <div className="flex-shrink-0 w-6 h-6 overflow-hidden">
                                <img 
                                  src={getBestBuyRate('usdcRate')?.logo} 
                                  alt={getBestBuyRate('usdcRate')?.name || "Logo"} 
                                  className="h-6 w-6 object-contain" 
                                />
                              </div>
                            )}
                            <div className="font-medium">{getBestBuyRate('usdcRate')?.name || "N/A"}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-semibold text-green-500">
                            $ {getBestBuyRate('usdcRate') ? getBestBuyRate('usdcRate')?.usdcRate?.buy.toLocaleString('es-AR') : "N/A"}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between p-3 rounded-md bg-muted/50">
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground">Mejor para vender</span>
                          <div className="flex items-center gap-1">
                            {getBestSellRate('usdcRate')?.logo && (
                              <div className="flex-shrink-0 w-6 h-6 overflow-hidden">
                                <img 
                                  src={getBestSellRate('usdcRate')?.logo} 
                                  alt={getBestSellRate('usdcRate')?.name || "Logo"} 
                                  className="h-6 w-6 object-contain" 
                                />
                              </div>
                            )}
                            <div className="font-medium">{getBestSellRate('usdcRate')?.name || "N/A"}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-semibold text-red-500">
                            $ {getBestSellRate('usdcRate') ? getBestSellRate('usdcRate')?.usdcRate?.sell.toLocaleString('es-AR') : "N/A"}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
          
          <Card className="mt-6">
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
                      </tr>
                    </thead>
                    <tbody>
                      {filteredWallets.map((wallet) => (
                        <tr key={wallet.name} className="border-b hover:bg-muted/50">
                          <td className="py-4">
                            <div className="flex items-center gap-2">
                              {wallet.logo && (
                                <div className="flex-shrink-0 w-8 h-8 overflow-hidden flex items-center justify-center">
                                  <img 
                                    src={wallet.logo} 
                                    alt={`${wallet.name} logo`} 
                                    className="h-8 w-8 object-contain" 
                                  />
                                </div>
                              )}
                              <div>
                                <div className="font-medium">{wallet.name}</div>
                                <div className="text-xs text-muted-foreground">
                                  actualizado {formatTime(wallet.lastUpdated)}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="text-center py-4 px-2">
                            $ {wallet.usdtRate ? wallet.usdtRate.buy.toLocaleString('es-AR') : "-"}
                          </td>
                          <td className="text-center py-4 px-2">
                            $ {wallet.usdtRate ? wallet.usdtRate.sell.toLocaleString('es-AR') : "-"}
                          </td>
                          <td className="text-center py-4 px-2">
                            $ {wallet.daiRate ? wallet.daiRate.buy.toLocaleString('es-AR') : "-"}
                          </td>
                          <td className="text-center py-4 px-2">
                            $ {wallet.daiRate ? wallet.daiRate.sell.toLocaleString('es-AR') : "-"}
                          </td>
                          <td className="text-center py-4 px-2">
                            $ {wallet.usdcRate ? wallet.usdcRate.buy.toLocaleString('es-AR') : "-"}
                          </td>
                          <td className="text-center py-4 px-2">
                            $ {wallet.usdcRate ? wallet.usdcRate.sell.toLocaleString('es-AR') : "-"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <div className="text-sm text-muted-foreground flex items-center justify-between">
        <div>
          Datos actualizados de cotizaciones oficiales
        </div>
        <div>
          Última actualización: {wallets?.length ? formatTime(wallets[0].lastUpdated) : "..."}
        </div>
      </div>
    </div>
  );
}
