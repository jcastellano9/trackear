
import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { ArrowUp, ArrowDown, RefreshCw } from "lucide-react";

interface ExchangeRate {
  name: string;
  buy: number;
  sell: number;
  change: number;
  reference?: boolean;
}

export function ExchangeRates() {
  const [data, setData] = useState<ExchangeRate[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'dollar' | 'crypto'>('dollar');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      
      setTimeout(() => {
        if (activeTab === 'dollar') {
          const dollarData: ExchangeRate[] = [
            { name: "Oficial", buy: 1036.5, sell: 1096.5, change: 0, reference: true },
            { name: "Blue", buy: 1335, sell: 1355, change: 23.6 },
            { name: "Bolsa", buy: 1364.1, sell: 1363.8, change: 24.4 },
            { name: "Contado con liquidación", buy: 1357.2, sell: 1359.6, change: 24.0 },
            { name: "Mayorista", buy: 1074.5, sell: 1077.5, change: -1.7 },
          ];
          setData(dollarData);
        } else {
          const cryptoData: ExchangeRate[] = [
            { name: "USDT", buy: 1150, sell: 1155, change: 0.3 },
            { name: "USDC", buy: 1145, sell: 1148, change: -0.2 },
            { name: "DAI", buy: 1152, sell: 1157, change: 0.4 },
            { name: "BTC", buy: 60250000, sell: 60850000, change: 2.4 },
            { name: "ETH", buy: 2980000, sell: 3020000, change: 1.8 },
          ];
          setData(cryptoData);
        }
        setLoading(false);
      }, 1000);
    };

    fetchData();
  }, [activeTab]);

  const formatCurrency = (value: number) => {
    if (value > 1000000) {
      return `$${(value / 1000000).toFixed(2)}M`;
    } else {
      return `$${value.toLocaleString('es-AR')}`;
    }
  };

  return (
    <div>
      <div className="mb-4 flex justify-between items-center">
        <Tabs 
          value={activeTab} 
          onValueChange={(v) => setActiveTab(v as 'dollar' | 'crypto')} 
          className="w-[200px]"
        >
          <TabsList className="grid grid-cols-2 w-full">
            <TabsTrigger value="dollar">Dólar</TabsTrigger>
            <TabsTrigger value="crypto">Crypto</TabsTrigger>
          </TabsList>
        </Tabs>
        
        <div className="flex items-center text-xs text-muted-foreground">
          <RefreshCw className="h-3 w-3 mr-1" />
          <span>10:43:03</span>
        </div>
      </div>
      
      {loading ? (
        <div className="space-y-2">
          {[...Array(5)].map((_, i) => (
            <div className="flex justify-between py-2" key={i}>
              <Skeleton className="h-5 w-24" />
              <div className="flex gap-4">
                <Skeleton className="h-5 w-16" />
                <Skeleton className="h-5 w-16" />
                <Skeleton className="h-5 w-16" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div>
          <div className="grid grid-cols-4 text-xs text-muted-foreground py-2 border-b">
            <div>Tipo</div>
            <div className="text-right">Compra</div>
            <div className="text-right">Venta</div>
            <div className="text-right">Brecha</div>
          </div>
          
          {data.map((rate, index) => (
            <div key={index} className="grid grid-cols-4 py-3 border-b text-sm items-center">
              <div className="flex items-center gap-1.5">
                {activeTab === 'dollar' && (
                  <img 
                    src={`https://cdn.jsdelivr.net/gh/Yesenia-AriasC/imagenes@main/dolar.png`} 
                    alt={rate.name}
                    className="h-4 w-4 object-contain"
                  />
                )}
                {rate.name}
              </div>
              <div className="text-right">{formatCurrency(rate.buy)}</div>
              <div className="text-right">{formatCurrency(rate.sell)}</div>
              <div className="text-right">
                {rate.reference ? (
                  <span className="text-xs text-muted-foreground">Referencia</span>
                ) : (
                  <Badge 
                    variant={rate.change >= 0 ? "default" : "destructive"} 
                    className="inline-flex items-center px-1.5 py-0.5 text-xs"
                  >
                    {rate.change >= 0 ? 
                      <ArrowUp className="h-3 w-3 mr-0.5" /> : 
                      <ArrowDown className="h-3 w-3 mr-0.5" />
                    }
                    {Math.abs(rate.change)}%
                  </Badge>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
