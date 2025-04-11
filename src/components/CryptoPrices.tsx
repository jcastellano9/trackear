
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowUp, ArrowDown, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";

type CryptoPrice = {
  id: string;
  name: string;
  symbol: string;
  currentPrice: number;
  priceChange24h: number;
  priceChangePercentage24h: number;
  marketCap: number;
  volume24h: number;
  logo: string;
};

export function CryptoPrices() {
  const [cryptos, setCryptos] = useState<CryptoPrice[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchCryptoData = async () => {
    try {
      // Try to use CoinGecko API
      const response = await axios.get('https://api.coingecko.com/api/v3/coins/markets', {
        params: {
          vs_currency: 'usd',
          ids: 'bitcoin,ethereum,binancecoin,cardano,solana,ripple,polkadot,avalanche-2,cosmos,near',
          order: 'market_cap_desc',
          per_page: 10,
          page: 1,
          sparkline: false,
          price_change_percentage: '24h'
        }
      });
      
      if (response.status === 200) {
        const data = response.data.map((coin: any) => ({
          id: coin.id,
          name: coin.name,
          symbol: coin.symbol.toUpperCase(),
          currentPrice: coin.current_price,
          priceChange24h: coin.price_change_24h,
          priceChangePercentage24h: coin.price_change_percentage_24h,
          marketCap: coin.market_cap,
          volume24h: coin.total_volume,
          logo: coin.image
        }));
        
        setCryptos(data);
        setLastUpdated(new Date());
        return;
      }

      throw new Error("Could not fetch data from CoinGecko");
    } catch (error) {
      console.error("Error fetching crypto data:", error);
      
      // Fallback to mock data
      const mockData: CryptoPrice[] = [
        {
          id: "bitcoin",
          name: "Bitcoin",
          symbol: "BTC",
          currentPrice: 64250,
          priceChange24h: 850,
          priceChangePercentage24h: 1.35,
          marketCap: 1265000000000,
          volume24h: 32500000000,
          logo: "https://assets.coingecko.com/coins/images/1/large/bitcoin.png"
        },
        {
          id: "ethereum",
          name: "Ethereum",
          symbol: "ETH",
          currentPrice: 3120,
          priceChange24h: -75,
          priceChangePercentage24h: -2.35,
          marketCap: 375000000000,
          volume24h: 18500000000,
          logo: "https://assets.coingecko.com/coins/images/279/large/ethereum.png"
        },
        {
          id: "binancecoin",
          name: "Binance Coin",
          symbol: "BNB",
          currentPrice: 570,
          priceChange24h: 15,
          priceChangePercentage24h: 2.7,
          marketCap: 87500000000,
          volume24h: 2800000000,
          logo: "https://assets.coingecko.com/coins/images/825/large/bnb-icon2_2x.png"
        },
        {
          id: "cardano",
          name: "Cardano",
          symbol: "ADA",
          currentPrice: 0.45,
          priceChange24h: 0.02,
          priceChangePercentage24h: 4.65,
          marketCap: 16000000000,
          volume24h: 850000000,
          logo: "https://assets.coingecko.com/coins/images/975/large/cardano.png"
        },
        {
          id: "solana",
          name: "Solana",
          symbol: "SOL",
          currentPrice: 143,
          priceChange24h: 7.5,
          priceChangePercentage24h: 5.53,
          marketCap: 62000000000,
          volume24h: 3900000000,
          logo: "https://assets.coingecko.com/coins/images/4128/large/solana.png"
        },
        {
          id: "ripple",
          name: "XRP",
          symbol: "XRP",
          currentPrice: 0.53,
          priceChange24h: -0.015,
          priceChangePercentage24h: -2.75,
          marketCap: 28500000000,
          volume24h: 1250000000,
          logo: "https://assets.coingecko.com/coins/images/44/large/xrp-symbol-white-128.png"
        }
      ];
      
      setCryptos(mockData);
      setLastUpdated(new Date());
      toast.error("Fallback to mock data: Rate limit or network issue");
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
    setLoading(true);
    fetchCryptoData();
    toast.success("Actualizando precios de criptomonedas...");
  };

  const formatLargeNumber = (num: number) => {
    if (num >= 1000000000) {
      return `$${(num / 1000000000).toFixed(1)}B`;
    } else if (num >= 1000000) {
      return `$${(num / 1000000).toFixed(1)}M`;
    } else if (num >= 1000) {
      return `$${(num / 1000).toFixed(1)}K`;
    }
    return `$${num.toFixed(2)}`;
  };

  const formatCurrency = (num: number) => {
    if (num >= 1000) {
      return `$${num.toLocaleString('es-AR')}`;
    } else if (num >= 1) {
      return `$${num.toFixed(2)}`;
    } else {
      return `$${num.toFixed(num < 0.01 ? 4 : 2)}`;
    }
  };

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
        <RefreshCw
          className={`h-4 w-4 cursor-pointer text-muted-foreground ${loading ? "animate-spin" : ""}`}
          onClick={refreshData}
        />
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Precio</TableHead>
                <TableHead>24h %</TableHead>
                <TableHead className="hidden md:table-cell">Cap. de Mercado</TableHead>
                <TableHead className="hidden lg:table-cell">Volumen (24h)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                Array(6).fill(0).map((_, i) => (
                  <TableRow key={`skeleton-${i}`}>
                    <TableCell><Skeleton className="h-6 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-16" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-16" /></TableCell>
                    <TableCell className="hidden md:table-cell"><Skeleton className="h-6 w-24" /></TableCell>
                    <TableCell className="hidden lg:table-cell"><Skeleton className="h-6 w-24" /></TableCell>
                  </TableRow>
                ))
              ) : (
                cryptos.map((crypto) => (
                  <TableRow key={crypto.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <img 
                          src={crypto.logo} 
                          alt={`${crypto.name} logo`}
                          className="h-6 w-6 object-contain"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = `https://ui-avatars.com/api/?name=${crypto.symbol}&background=random`;
                          }}
                        />
                        <div>
                          <div className="font-medium">{crypto.name}</div>
                          <div className="text-xs text-muted-foreground">{crypto.symbol}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">
                      {formatCurrency(crypto.currentPrice)}
                    </TableCell>
                    <TableCell>
                      <Badge variant={crypto.priceChangePercentage24h >= 0 ? "default" : "destructive"}>
                        {crypto.priceChangePercentage24h >= 0 ? (
                          <ArrowUp className="mr-1 h-3 w-3" />
                        ) : (
                          <ArrowDown className="mr-1 h-3 w-3" />
                        )}
                        {Math.abs(crypto.priceChangePercentage24h).toFixed(2)}%
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {formatLargeNumber(crypto.marketCap)}
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      {formatLargeNumber(crypto.volume24h)}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
