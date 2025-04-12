
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { fetchCryptoWalletRates } from "@/services/cryptoWalletService";
import type { CryptoWalletComparison as CryptoWalletComparisonType } from "@/types/interestRate";

export function CryptoWalletComparison() {
  const [data, setData] = useState<CryptoWalletComparisonType[]>([]);
  const [providers, setProviders] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const result = await fetchCryptoWalletRates();
      setData(result.cryptos);
      setProviders(result.providers);
      setLastUpdated(new Date());
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Error al cargar los datos. Intente nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  const refreshData = () => {
    fetchData();
    toast.success("Actualizando datos de proveedores...");
  };

  const formatRate = (rate: number | null) => {
    if (rate === null) return "-";
    return `${rate.toFixed(2)}%`;
  };

  const getBestRateClass = (rate: number | null, crypto: string) => {
    if (rate === null) return "";
    
    // Find the best rate for this crypto
    const cryptoData = data.find(c => c.crypto.symbol === crypto);
    if (!cryptoData) return "";
    
    const rates = Object.values(cryptoData.rates).filter(r => r !== null) as number[];
    if (rates.length === 0) return "";
    
    const maxRate = Math.max(...rates);
    
    return rate === maxRate ? "bg-green-500/10 font-bold" : "";
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <CardTitle className="text-xl">Comparador de Wallets</CardTitle>
          <CardDescription>
            Compará las mejores wallets para comprar y hacer staking de criptomonedas
            {lastUpdated && ` · Actualizado: ${lastUpdated.toLocaleTimeString()}`}
          </CardDescription>
        </div>
        <RefreshCw
          className={`h-4 w-4 cursor-pointer text-muted-foreground ${loading ? "animate-spin" : ""}`}
          onClick={refreshData}
        />
      </CardHeader>
      <CardContent className="overflow-x-auto">
        {loading ? (
          <Skeleton className="h-[400px] w-full" />
        ) : (
          <div className="rounded-md border min-w-[800px]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[200px]">Criptomoneda</TableHead>
                  {providers.map(provider => (
                    <TableHead key={provider} className="text-center">
                      <div className="flex flex-col items-center gap-1 py-2">
                        {provider === "Buenbit" && (
                          <img src="https://play-lh.googleusercontent.com/2Rc-l3M-xNHrw9Ix43Z9-99ntLYBFZO6O8gYBHQXQyuR1QxPfFRUnp9n-oRR3ioFwQ" alt="Buenbit" className="h-8 w-8 rounded-full object-contain" />
                        )}
                        {provider === "Lemon" && (
                          <img src="https://play-lh.googleusercontent.com/Vd4W8OxV1z6VP0xTZxLrVyh5CfQN5pM8GUwDI8zBn5NYmj6w3Ao_V_6a0FHRcCsg0cw" alt="Lemon" className="h-8 w-8 rounded-full object-contain" />
                        )}
                        {provider === "Belo" && (
                          <img src="https://play-lh.googleusercontent.com/RoAXmMNHCURBW8FtDzx7Ex1_oKQRdO71-A8Jyz6uxA6K9wuLMc41PsHPDyJpxxRRXg" alt="Belo" className="h-8 w-8 rounded-full object-contain" />
                        )}
                        {provider === "Ripio" && (
                          <img src="https://play-lh.googleusercontent.com/FudHuxG1Fnrpn21RxooK1XneYMgzAmi7Qb8Uds8cW-bCn1GC4hkMOVgRgDjQXZDM70w" alt="Ripio" className="h-8 w-8 rounded-full object-contain" />
                        )}
                        {provider === "Fiwind" && (
                          <img src="https://fiwind.io/favicon/android-chrome-192x192.png" alt="Fiwind" className="h-8 w-8 rounded-full object-contain" />
                        )}
                        {provider === "SatoshiTango" && (
                          <img src="https://play-lh.googleusercontent.com/72NVZ6HZnf91C3okaC2Xl7npHDj6PpuKGZlrWfLv3qJPg_4m-n4pR_nrOGiQGpQ8rA" alt="SatoshiTango" className="h-8 w-8 rounded-full object-contain" />
                        )}
                        {provider === "LB" && (
                          <img src="https://play-lh.googleusercontent.com/WQDQpVJa28N_UpNHGBxqgUUm2bDqfCtz7lkbR2IaL3MFbkCEZKOCmpXOXMcxD6dOUas" alt="Let's Bit" className="h-8 w-8 rounded-full object-contain" />
                        )}
                        <span className="mt-1">{provider}</span>
                      </div>
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.map((item) => (
                  <TableRow key={item.crypto.symbol}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <img 
                          src={item.crypto.logo} 
                          alt={item.crypto.name} 
                          className="h-6 w-6 object-contain"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = `https://ui-avatars.com/api/?name=${item.crypto.symbol}&background=random`;
                          }}
                        />
                        <div>
                          <div className="font-medium">{item.crypto.name}</div>
                          <Badge variant="outline" className="mt-1">{item.crypto.symbol}</Badge>
                        </div>
                      </div>
                    </TableCell>
                    {providers.map(provider => (
                      <TableCell 
                        key={`${item.crypto.symbol}-${provider}`}
                        className={`text-center ${getBestRateClass(item.rates[provider], item.crypto.symbol)}`}
                      >
                        {formatRate(item.rates[provider])}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
