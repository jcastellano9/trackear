import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChartContainer } from "@/components/ui/chart";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";

type InvestmentData = {
  date: string;
  invested: number;
  currentValue: number;
};

export function InvestmentChart() {
  const [chartData, setChartData] = useState<InvestmentData[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasData, setHasData] = useState(false);
  const [timeframe, setTimeframe] = useState<'1m' | '3m' | '6m' | '1y' | 'all'>('3m');
  const [assetType, setAssetType] = useState<'all' | 'crypto' | 'cedears'>('all');

  useEffect(() => {
    // Simulated fetch - in real app this would come from API
    setTimeout(() => {
      // Check if user has investments (mock for now)
      const userHasInvestments = false; // This would come from a database check
      
      if (userHasInvestments) {
        // Generate sample data based on the image
        const today = new Date();
        const data: InvestmentData[] = [];
        
        const totalDays = timeframe === '1m' ? 30 : 
                           timeframe === '3m' ? 90 : 
                           timeframe === '6m' ? 180 : 
                           timeframe === '1y' ? 365 : 90; // Default to 3m

        // Starting values that match the image
        let investedAmount = 3200;
        let currentValue = 3200;
        
        // Adjust values based on asset type
        if (assetType === 'crypto') {
          currentValue = 3300;  // Slightly better performance
        } else if (assetType === 'cedears') {
          currentValue = 3100;  // Slightly worse performance
        }
        
        // Generate data points that visually match the image pattern
        for (let i = totalDays; i >= 0; i -= Math.floor(totalDays/20)) {
          const date = new Date(today);
          date.setDate(date.getDate() - i);
          
          // Simulate investment and value changes to match the image pattern
          if (i < totalDays) {
            // Add growth pattern similar to the image
            if (i < totalDays * 0.8 && i > totalDays * 0.6) {
              // Dip in the middle
              currentValue = currentValue * 0.995;
            } else if (i < totalDays * 0.3) {
              // Growth toward the end
              currentValue = currentValue * 1.015;
            }
          }
          
          data.push({
            date: date.toLocaleDateString('es-AR'),
            invested: Number(investedAmount.toFixed(2)),
            currentValue: Number(currentValue.toFixed(2))
          });
        }
        
        setChartData(data);
        setHasData(true);
      } else {
        // No investments, set empty data
        setChartData([]);
        setHasData(false);
      }
      
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
              <span className="text-green-500">+${(payload[1].value - payload[0].value).toLocaleString('es-AR')}</span>
            ) : (
              <span className="text-red-500">-${(payload[0].value - payload[1].value).toLocaleString('es-AR')}</span>
            )}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-4">
        <Tabs 
          value={timeframe} 
          onValueChange={(v) => setTimeframe(v as any)} 
          className="w-full max-w-[300px]"
        >
          <TabsList className="grid grid-cols-5 w-full">
            <TabsTrigger value="1m" className="px-2 py-1 text-xs">1M</TabsTrigger>
            <TabsTrigger value="3m" className="px-2 py-1 text-xs">3M</TabsTrigger>
            <TabsTrigger value="6m" className="px-2 py-1 text-xs">6M</TabsTrigger>
            <TabsTrigger value="1y" className="px-2 py-1 text-xs">1A</TabsTrigger>
            <TabsTrigger value="all" className="px-2 py-1 text-xs">Todo</TabsTrigger>
          </TabsList>
        </Tabs>
        
        <Tabs 
          value={assetType} 
          onValueChange={(v) => setAssetType(v as any)} 
          className="w-full max-w-[240px]"
        >
          <TabsList className="grid grid-cols-3 w-full">
            <TabsTrigger value="all" className="px-2 py-1 text-xs">Todos</TabsTrigger>
            <TabsTrigger value="crypto" className="px-2 py-1 text-xs">Crypto</TabsTrigger>
            <TabsTrigger value="cedears" className="px-2 py-1 text-xs">CEDEARs</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {loading ? (
        <div className="h-[250px] w-full flex items-center justify-center">
          <p className="text-muted-foreground">Cargando datos...</p>
        </div>
      ) : !hasData ? (
        <div className="h-[250px] w-full flex flex-col items-center justify-center text-muted-foreground border-2 border-dashed border-muted rounded-lg p-6">
          <p>No hay datos de inversiones disponibles</p>
          <p className="text-xs mt-2">Agregue inversiones para visualizar el rendimiento</p>
        </div>
      ) : (
        <div className="h-[250px] w-full">
          <ChartContainer
            config={{
              primary: { color: "#f87171" }, // Red line for invested amount
              secondary: { color: "#818cf8" }, // Blue line for current value
            }}
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={chartData}
                margin={{ top: 5, right: 20, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis 
                  dataKey="date" 
                  tick={{ fontSize: 10 }}
                  tickFormatter={(value) => {
                    const date = new Date(value.split('/').reverse().join('-'));
                    return `${date.getDate()}/${date.getMonth() + 1}`;
                  }}
                />
                <YAxis 
                  tick={{ fontSize: 10 }}
                  tickFormatter={(value) => `$${(value).toLocaleString('es-AR')}`}
                  domain={['dataMin - 100', 'dataMax + 100']}
                  width={60}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: '10px' }} />
                <Line
                  type="monotone"
                  name="Capital invertido"
                  dataKey="invested"
                  stroke="#f87171"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 4 }}
                />
                <Line
                  type="monotone"
                  name="Valor actual"
                  dataKey="currentValue"
                  stroke="#818cf8"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
      )}
    </div>
  );
}
