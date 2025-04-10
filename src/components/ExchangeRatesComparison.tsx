
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { ChartContainer } from "@/components/ui/chart";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";

export function ExchangeRatesComparison() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [comparisonType, setComparisonType] = useState<'dollar' | 'crypto'>('dollar');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Instead of a mock timeout, let's try to fetch real data
        if (comparisonType === 'dollar') {
          try {
            const response = await fetch('https://dolarapi.com/v1/dolares');
            if (response.ok) {
              const dollarData = await response.json();
              const formattedData = dollarData.map((item: any) => ({
                name: item.nombre,
                value: item.venta,
                logo: "https://cdn.jsdelivr.net/gh/Yesenia-AriasC/imagenes@main/dolar.png",
                color: getColorForCurrency(item.nombre)
              }));
              setData(formattedData);
            } else {
              // Fallback to mock data if API fails
              fallbackToDollarMockData();
            }
          } catch (error) {
            console.error("Error fetching dollar data:", error);
            fallbackToDollarMockData();
          }
        } else {
          try {
            // Try to fetch real crypto data
            const cryptoData = [
              {
                name: "Bitcoin",
                value: 60850000,
                logo: "https://cryptologos.cc/logos/bitcoin-btc-logo.png",
                color: "#F7931A"
              },
              {
                name: "Ethereum",
                value: 3020000,
                logo: "https://cryptologos.cc/logos/ethereum-eth-logo.png",
                color: "#627EEA"
              },
              {
                name: "USDT",
                value: 1150,
                logo: "https://cryptologos.cc/logos/tether-usdt-logo.png",
                color: "#26A17B"
              },
              {
                name: "USDC",
                value: 1145,
                logo: "https://cryptologos.cc/logos/usd-coin-usdc-logo.png",
                color: "#2775CA"
              },
              {
                name: "DAI",
                value: 1155,
                logo: "https://cryptologos.cc/logos/multi-collateral-dai-dai-logo.png",
                color: "#F5AC37"
              }
            ];
            setData(cryptoData);
          } catch (error) {
            console.error("Error fetching crypto data:", error);
            fallbackToCryptoMockData();
          }
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching comparison data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, [comparisonType]);

  const fallbackToDollarMockData = () => {
    const dollarData = [
      {
        name: "Oficial",
        value: 975,
        logo: "https://cdn.jsdelivr.net/gh/Yesenia-AriasC/imagenes@main/dolar.png",
        color: "#4CAF50"
      },
      {
        name: "Blue",
        value: 1180,
        logo: "https://cdn.jsdelivr.net/gh/Yesenia-AriasC/imagenes@main/dolar.png",
        color: "#2196F3"
      },
      {
        name: "MEP",
        value: 1140,
        logo: "https://cdn.jsdelivr.net/gh/Yesenia-AriasC/imagenes@main/dolar.png",
        color: "#FFC107"
      },
      {
        name: "CCL",
        value: 1195,
        logo: "https://cdn.jsdelivr.net/gh/Yesenia-AriasC/imagenes@main/dolar.png",
        color: "#9C27B0"
      },
      {
        name: "Tarjeta",
        value: 1560,
        logo: "https://cdn.jsdelivr.net/gh/Yesenia-AriasC/imagenes@main/dolar.png",
        color: "#FF5722"
      }
    ];
    setData(dollarData);
  };

  const fallbackToCryptoMockData = () => {
    const cryptoData = [
      {
        name: "Bitcoin",
        value: 60850000,
        logo: "https://cryptologos.cc/logos/bitcoin-btc-logo.png",
        color: "#F7931A"
      },
      {
        name: "Ethereum",
        value: 3020000,
        logo: "https://cryptologos.cc/logos/ethereum-eth-logo.png",
        color: "#627EEA"
      },
      {
        name: "USDT",
        value: 1150,
        logo: "https://cryptologos.cc/logos/tether-usdt-logo.png",
        color: "#26A17B"
      },
      {
        name: "USDC",
        value: 1145,
        logo: "https://cryptologos.cc/logos/usd-coin-usdc-logo.png",
        color: "#2775CA"
      },
      {
        name: "DAI",
        value: 1155,
        logo: "https://cryptologos.cc/logos/multi-collateral-dai-dai-logo.png",
        color: "#F5AC37"
      }
    ];
    setData(cryptoData);
  };

  const getColorForCurrency = (name: string) => {
    const colorMap: Record<string, string> = {
      "Oficial": "#4CAF50",
      "Blue": "#2196F3",
      "MEP": "#FFC107", 
      "CCL": "#9C27B0",
      "Tarjeta": "#FF5722",
      "Mayorista": "#795548"
    };
    
    return colorMap[name] || "#607D8B"; // Default color if not found
  };

  const formatYAxis = (value: number) => {
    if (comparisonType === 'crypto') {
      if (value > 1000000) {
        return `${(value / 1000000).toFixed(1)}M`;
      } else if (value > 1000) {
        return `${(value / 1000).toFixed(1)}K`;
      }
    }
    return value.toLocaleString('es-AR');
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white border rounded p-2 shadow-sm">
          <div className="flex items-center gap-2 mb-1">
            <img 
              src={payload[0].payload.logo} 
              alt={label} 
              className="h-5 w-5 object-contain" 
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = "https://via.placeholder.com/20?text=?";
              }}
            />
            <p className="font-medium">{label}</p>
          </div>
          <p className="text-sm">
            ${payload[0].value.toLocaleString('es-AR')}
          </p>
        </div>
      );
    }
    return null;
  };

  // Define chart config
  const chartConfig = {
    dollar: {
      label: "Dólar",
      theme: {
        light: "var(--primary)",
        dark: "var(--primary)",
      },
    },
    crypto: {
      label: "Crypto",
      theme: {
        light: "var(--primary)",
        dark: "var(--primary)",
      },
    },
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Comparación de Cotizaciones</CardTitle>
        <CardDescription>
          Visualiza y compara distintos tipos de cambio en el mercado argentino
        </CardDescription>
        <Tabs 
          value={comparisonType} 
          onValueChange={(value) => setComparisonType(value as 'dollar' | 'crypto')} 
          className="w-full max-w-xs"
        >
          <TabsList className="grid grid-cols-2 w-full">
            <TabsTrigger value="dollar">Dólar</TabsTrigger>
            <TabsTrigger value="crypto">Stablecoins</TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>
      <CardContent>
        <div className="h-[350px] w-full">
          {loading ? (
            <div className="flex flex-col space-y-3">
              <Skeleton className="h-[350px] w-full" />
            </div>
          ) : (
            <ChartContainer config={chartConfig}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={data}
                  margin={{ top: 20, right: 30, left: 20, bottom: 70 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.2} />
                  <XAxis 
                    dataKey="name" 
                    tick={{ fontSize: 12 }}
                    interval={0}
                    tickMargin={10}
                  />
                  <YAxis 
                    tickFormatter={formatYAxis}
                    tick={{ fontSize: 12 }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar 
                    dataKey="value" 
                    fill="var(--primary)" 
                    radius={[4, 4, 0, 0]}
                    barSize={60}
                  />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
