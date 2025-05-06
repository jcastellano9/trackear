
import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChartContainer } from "@/components/ui/chart";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

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

  // Fetch investment data or check if user has investments
  useEffect(() => {
    const fetchInvestmentData = async () => {
      setLoading(true);
      try {
        // Check if user has investments from the database
        const { supabase } = await import('@/lib/supabase');
        const { useSession } = await import('@supabase/auth-helpers-react');
        const session = useSession();
        
        if (!session?.user?.id) {
          setHasData(false);
          setChartData([]);
          setLoading(false);
          return;
        }
        
        // Check if the user has any investments
        const { count, error } = await supabase
          .from('investments')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', session.user.id);
          
        const userHasInvestments = count !== null && count > 0;
        
        if (userHasInvestments) {
          // For now, generate empty starting data to show structure but with zero values
          generateEmptyChartData();
          setHasData(false); // Set to false until real data is loaded
        } else {
          setHasData(false);
          setChartData([]);
        }
      } catch (error) {
        console.error("Error checking for investments:", error);
        setHasData(false);
        setChartData([]);
      } finally {
        setLoading(false);
      }
    };
    
    const generateEmptyChartData = () => {
      // Generate empty data structure with zero values
      const today = new Date();
      const data: InvestmentData[] = [];
      
      const totalDays = timeframe === '1m' ? 30 : 
                       timeframe === '3m' ? 90 : 
                       timeframe === '6m' ? 180 : 
                       timeframe === '1y' ? 365 : 90;
      
      // Starting with zero values
      for (let i = totalDays; i >= 0; i -= Math.floor(totalDays/20)) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        
        data.push({
          date: date.toLocaleDateString('es-AR'),
          invested: 0,
          currentValue: 0
        });
      }
      
      setChartData(data);
    };

    fetchInvestmentData();
  }, [timeframe, assetType]);

  // Refresh the chart data
  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  // Custom tooltip component for the chart
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length && hasData) {
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
      <div className="flex flex-wrap justify-between gap-2 mb-4">
        <div className="flex flex-wrap gap-2">
          {/* First Tabs component for timeframe selection */}
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
          
          {/* Second Tabs component for asset type selection */}
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
        
        <Button variant="outline" size="sm" onClick={handleRefresh} disabled={loading}>
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
          Actualizar
        </Button>
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
