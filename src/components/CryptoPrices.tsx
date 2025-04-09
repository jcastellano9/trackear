
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowUp, ArrowDown, Plus, X, RefreshCw } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Default crypto logos
const cryptoLogos = {
  USDT: "https://cryptologos.cc/logos/tether-usdt-logo.png",
  DAI: "https://cryptologos.cc/logos/multi-collateral-dai-dai-logo.png",
  USDC: "https://cryptologos.cc/logos/usd-coin-usdc-logo.png",
  BTC: "https://cryptologos.cc/logos/bitcoin-btc-logo.png",
  ETH: "https://cryptologos.cc/logos/ethereum-eth-logo.png",
  SOL: "https://cryptologos.cc/logos/solana-sol-logo.png",
  ADA: "https://cryptologos.cc/logos/cardano-ada-logo.png",
  DOT: "https://cryptologos.cc/logos/polkadot-new-dot-logo.png",
};

const defaultCryptos = [
  { 
    name: "Tether", 
    symbol: "USDT", 
    price: 950, 
    change24h: 0.5,
    logo: cryptoLogos.USDT
  },
  { 
    name: "Dai", 
    symbol: "DAI", 
    price: 970, 
    change24h: -0.2,
    logo: cryptoLogos.DAI
  },
  { 
    name: "USD Coin", 
    symbol: "USDC", 
    price: 960, 
    change24h: 0.8,
    logo: cryptoLogos.USDC
  }
];

const availableCryptos = [
  { 
    name: "Bitcoin", 
    symbol: "BTC", 
    price: 34500, 
    change24h: 2.3,
    logo: cryptoLogos.BTC
  },
  { 
    name: "Ethereum", 
    symbol: "ETH", 
    price: 1850, 
    change24h: 1.5,
    logo: cryptoLogos.ETH
  },
  { 
    name: "Solana", 
    symbol: "SOL", 
    price: 141, 
    change24h: 3.2,
    logo: cryptoLogos.SOL
  },
  { 
    name: "Cardano", 
    symbol: "ADA", 
    price: 0.45, 
    change24h: -1.2,
    logo: cryptoLogos.ADA
  },
  { 
    name: "Polkadot", 
    symbol: "DOT", 
    price: 5.8, 
    change24h: 0.7,
    logo: cryptoLogos.DOT
  }
];

export function CryptoPrices() {
  const [cryptos, setCryptos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("list");
  
  useEffect(() => {
    // Simulate API call
    const fetchData = () => {
      setTimeout(() => {
        // In a real app, this would come from an API
        const storedCryptos = localStorage.getItem("cryptoPrices");
        if (storedCryptos) {
          setCryptos(JSON.parse(storedCryptos));
        } else {
          setCryptos(defaultCryptos);
          localStorage.setItem("cryptoPrices", JSON.stringify(defaultCryptos));
        }
        setLoading(false);
      }, 800);
    };

    fetchData();
  }, []);

  const handleRefresh = () => {
    setLoading(true);
    // Simulate API refresh with slight price changes
    setTimeout(() => {
      const updatedCryptos = cryptos.map(crypto => ({
        ...crypto,
        price: Math.round(crypto.price * (1 + (Math.random() * 0.02 - 0.01))),
        change24h: Number((crypto.change24h + (Math.random() * 0.4 - 0.2)).toFixed(2))
      }));
      
      setCryptos(updatedCryptos);
      localStorage.setItem("cryptoPrices", JSON.stringify(updatedCryptos));
      setLoading(false);
      toast.success("Cotizaciones actualizadas");
    }, 1000);
  };

  const getAvailableCryptos = () => {
    const currentSymbols = cryptos.map(c => c.symbol);
    return availableCryptos.filter(c => !currentSymbols.includes(c.symbol));
  };

  const addCrypto = (crypto: any) => {
    if (cryptos.length >= 5) {
      toast.error("Puedes tener hasta 5 criptomonedas en el listado");
      return;
    }
    
    const updatedCryptos = [...cryptos, crypto];
    setCryptos(updatedCryptos);
    localStorage.setItem("cryptoPrices", JSON.stringify(updatedCryptos));
    toast.success(`${crypto.name} agregada al listado`);
  };

  const removeCrypto = (symbol: string) => {
    const updatedCryptos = cryptos.filter(c => c.symbol !== symbol);
    setCryptos(updatedCryptos);
    localStorage.setItem("cryptoPrices", JSON.stringify(updatedCryptos));
    toast.success("Criptomoneda eliminada del listado");
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Cotizaciones</CardTitle>
            <CardDescription>Valores de referencia en ARS</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Tabs 
              value={activeTab} 
              onValueChange={setActiveTab}
              className="w-[180px]"
            >
              <TabsList className="grid grid-cols-2 w-full">
                <TabsTrigger value="list">Monedas</TabsTrigger>
                <TabsTrigger value="crypto">Cripto</TabsTrigger>
              </TabsList>
            </Tabs>
            
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" disabled={cryptos.length >= 5}>
                  <Plus className="h-4 w-4 mr-1" />
                  Agregar
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Agregar criptomoneda al listado</DialogTitle>
                  <DialogDescription>
                    Puedes agregar hasta 5 criptomonedas a tu lista
                  </DialogDescription>
                </DialogHeader>
                
                <div className="grid grid-cols-1 gap-2 max-h-[300px] overflow-y-auto py-2">
                  {getAvailableCryptos().map((crypto) => (
                    <div key={crypto.symbol} className="flex items-center justify-between p-2 border rounded-md">
                      <div className="flex items-center gap-2">
                        <div className="flex-shrink-0 w-8 h-8 bg-background rounded-full overflow-hidden border flex items-center justify-center">
                          {crypto.logo ? (
                            <img src={crypto.logo} alt={crypto.name} className="h-6 w-6 object-contain" />
                          ) : (
                            <span className="text-xs font-bold">{crypto.symbol.substring(0, 2)}</span>
                          )}
                        </div>
                        <div>
                          <p className="font-medium">{crypto.name}</p>
                          <p className="text-xs text-muted-foreground">{crypto.symbol}</p>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" onClick={() => addCrypto(crypto)}>
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}

                  {getAvailableCryptos().length === 0 && (
                    <p className="text-center text-muted-foreground p-4">
                      No hay más criptomonedas disponibles para agregar
                    </p>
                  )}
                </div>
                
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="outline">Cerrar</Button>
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={handleRefresh} 
              disabled={loading}
              className="text-muted-foreground"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <TabsContent value="list" className="mt-0">
          {loading ? (
            <div className="space-y-2 animate-pulse">
              {[1, 2, 3].map((_, i) => (
                <div key={i} className="h-14 bg-muted rounded-md" />
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              <div className="grid grid-cols-1 gap-4">
                <div className="grid grid-cols-3 text-sm text-muted-foreground px-2 py-1">
                  <div>Tipo</div>
                  <div className="text-center">Compra</div>
                  <div className="text-center">Venta</div>
                </div>
                
                {cryptos.map((crypto) => (
                  <div key={crypto.symbol} className="flex items-center justify-between p-2 border rounded-md">
                    <div className="flex items-center gap-2">
                      <div className="flex-shrink-0 w-10 h-10 bg-background rounded-full overflow-hidden border flex items-center justify-center">
                        {crypto.logo ? (
                          <img src={crypto.logo} alt={crypto.name} className="h-8 w-8 object-contain" />
                        ) : (
                          <span className="text-xs font-bold">{crypto.symbol.substring(0, 2)}</span>
                        )}
                      </div>
                      <div>
                        <p className="font-medium">{crypto.symbol}</p>
                      </div>
                    </div>
                    <div className="text-center font-medium">
                      $ {(crypto.price - 25).toLocaleString('es-AR')}
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="text-right font-medium">
                        $ {crypto.price.toLocaleString('es-AR')}
                      </div>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="text-muted-foreground hover:text-destructive" 
                        onClick={() => removeCrypto(crypto.symbol)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
                
                {cryptos.length === 0 && (
                  <div className="text-center p-4 text-muted-foreground">
                    <p>No hay monedas en el listado</p>
                    <p className="text-sm">Agrega algunas para ver su cotización aquí</p>
                  </div>
                )}
              </div>
            </div>
          )}
          
          <div className="mt-4 text-right text-xs text-muted-foreground">
            Actualizado a las {new Date().toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })}
          </div>
        </TabsContent>
        
        <TabsContent value="crypto" className="mt-0">
          {loading ? (
            <div className="space-y-2 animate-pulse">
              {[1, 2, 3].map((_, i) => (
                <div key={i} className="h-14 bg-muted rounded-md" />
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              <div className="grid grid-cols-1 gap-4">
                <div className="grid grid-cols-4 text-sm text-muted-foreground px-2 py-1">
                  <div>Tipo</div>
                  <div className="text-center">Precio</div>
                  <div className="text-center">Var. 24h</div>
                  <div></div>
                </div>
                
                {cryptos.map((crypto) => (
                  <div key={crypto.symbol} className="flex items-center justify-between p-2 border rounded-md">
                    <div className="flex items-center gap-2">
                      <div className="flex-shrink-0 w-10 h-10 bg-background rounded-full overflow-hidden border flex items-center justify-center">
                        {crypto.logo ? (
                          <img src={crypto.logo} alt={crypto.name} className="h-8 w-8 object-contain" />
                        ) : (
                          <span className="text-xs font-bold">{crypto.symbol.substring(0, 2)}</span>
                        )}
                      </div>
                      <div>
                        <p className="font-medium">{crypto.name}</p>
                        <p className="text-xs text-muted-foreground">{crypto.symbol}</p>
                      </div>
                    </div>
                    <div className="text-center font-medium">
                      $ {crypto.price.toLocaleString('es-AR')}
                    </div>
                    <div className="text-center">
                      <Badge variant={crypto.change24h >= 0 ? "default" : "destructive"} className="flex items-center">
                        {crypto.change24h >= 0 ? 
                          <ArrowUp className="mr-1 h-3 w-3" /> : 
                          <ArrowDown className="mr-1 h-3 w-3" />}
                        {Math.abs(crypto.change24h).toFixed(2)}%
                      </Badge>
                    </div>
                    <div>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="text-muted-foreground hover:text-destructive"
                        onClick={() => removeCrypto(crypto.symbol)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
                
                {cryptos.length === 0 && (
                  <div className="text-center p-4 text-muted-foreground">
                    <p>No hay criptomonedas en el listado</p>
                    <p className="text-sm">Agrega algunas para ver su cotización aquí</p>
                  </div>
                )}
              </div>
            </div>
          )}
          
          <div className="mt-4 text-right text-xs text-muted-foreground">
            Actualizado a las {new Date().toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })}
          </div>
        </TabsContent>
      </CardContent>
    </Card>
  );
}
