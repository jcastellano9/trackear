
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer } from "@/components/ui/chart";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type InvestmentData = {
  date: string;
  invested: number;
  currentValue: number;
};

export function InvestmentChart() {
  const [chartData, setChartData] = useState<InvestmentData[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeframe, setTimeframe] = useState<'1m' | '3m' | '6m' | '1y' | 'all'>('3m');
  const [assetType, setAssetType] = useState<'all' | 'crypto' | 'cedears'>('all');

  useEffect(() => {
    // Simulated fetch - in real app this would come from API
    setTimeout(() => {
      // Generate sample data
      const today = new Date();
      const data: InvestmentData[] = [];
      
      const totalDays = timeframe === '1m' ? 30 : 
                         timeframe === '3m' ? 90 : 
                         timeframe === '6m' ? 180 : 
                         timeframe === '1y' ? 365 : 400;

      let investedAmount = 3200;  // Initial investment
      let currentValue = 3200;
      
      // Adjust values based on asset type
      if (assetType === 'crypto') {
        investedAmount = 2500;
        currentValue = 2700;
      } else if (assetType === 'cedears') {
        investedAmount = 1800;
        currentValue = 1950;
      }
      
      for (let i = totalDays; i >= 0; i -= 10) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        
        // Add random fluctuation to current value (more realistic market behavior)
        // Plus gradual investment growth for invested amount
        if (i < totalDays) {
          // Occasional extra investment
          if (i % 60 === 0) {
            investedAmount += 150;
          }
          
          // Random market fluctuation with different volatility based on asset type
          let volatility = 0.05;
          if (assetType === 'crypto') {
            volatility = 0.08; // Crypto is more volatile
          } else if (assetType === 'cedears') {
            volatility = 0.03; // CEDEARs less volatile
          }
          
          const change = (Math.random() - 0.45) * volatility; // Slightly biased towards growth
          currentValue = currentValue * (1 + change);
        }
        
        data.push({
          date: date.toLocaleDateString('es-AR'),
          invested: Number(investedAmount.toFixed(2)),
          currentValue: Number(currentValue.toFixed(2))
        });
      }
      
      setChartData(data);
      setLoading(false);
    }, 1000);
  }, [timeframe, assetType]);

  // Custom tooltip component for the chart
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card border rounded p-2 shadow-sm">
          <p className="text-xs font-medium">{label}</p>
          <p className="text-xs text-primary">
            Invertido: ${payload[0].value.toLocaleString('es-AR')}
          </p>
          <p className="text-xs" style={{color: payload[1].color}}>
            Valor actual: ${payload[1].value.toLocaleString('es-AR')}
          </p>
          <p className="text-xs font-medium mt-1">
            {payload[1].value > payload[0].value ? (
              <span className="text-finance-positive">+${(payload[1].value - payload[0].value).toLocaleString('es-AR')}</span>
            ) : (
              <span className="text-finance-negative">-${(payload[0].value - payload[1].value).toLocaleString('es-AR')}</span>
            )}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Rendimiento de inversiones</CardTitle>
        <CardDescription>Evolución del capital invertido vs. valor actual</CardDescription>
        <div className="flex flex-col sm:flex-row gap-4">
          <Tabs 
            value={timeframe} 
            onValueChange={(v) => setTimeframe(v as any)} 
            className="w-full max-w-xs"
          >
            <TabsList className="grid grid-cols-5 w-full">
              <TabsTrigger value="1m">1M</TabsTrigger>
              <TabsTrigger value="3m">3M</TabsTrigger>
              <TabsTrigger value="6m">6M</TabsTrigger>
              <TabsTrigger value="1y">1A</TabsTrigger>
              <TabsTrigger value="all">Todo</TabsTrigger>
            </TabsList>
          </Tabs>
          
          <Tabs 
            value={assetType} 
            onValueChange={(v) => setAssetType(v as any)} 
            className="w-full max-w-xs"
          >
            <TabsList className="grid grid-cols-3 w-full">
              <TabsTrigger value="all">Todos</TabsTrigger>
              <TabsTrigger value="crypto">Crypto</TabsTrigger>
              <TabsTrigger value="cedears">CEDEARs</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="h-[300px] w-full flex items-center justify-center">
            <p className="text-muted-foreground">Cargando datos...</p>
          </div>
        ) : (
          <div className="h-[300px] w-full">
            <ChartContainer
              config={{
                primary: { color: "#9b87f5" },
                secondary: { color: "#ea384c" },
              }}
            >
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={chartData}
                  margin={{ top: 10, right: 30, left: 0, bottom: 10 }}
                >
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                  <XAxis 
                    dataKey="date" 
                    tick={{ fontSize: 12 }}
                    tickFormatter={(value) => {
                      const date = new Date(value.split('/').reverse().join('-'));
                      return `${date.getDate()}/${date.getMonth() + 1}`;
                    }}
                  />
                  <YAxis 
                    tick={{ fontSize: 12 }}
                    tickFormatter={(value) => `$${(value).toLocaleString('es-AR')}`}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Line
                    type="monotone"
                    name="Capital invertido"
                    dataKey="invested"
                    stroke="var(--color-primary)"
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 5 }}
                  />
                  <Line
                    type="monotone"
                    name="Valor actual"
                    dataKey="currentValue"
                    stroke={chartData[0].invested <= chartData[chartData.length - 1].currentValue ? 
                      "#4ade80" : "var(--color-secondary)"}
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 5 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
