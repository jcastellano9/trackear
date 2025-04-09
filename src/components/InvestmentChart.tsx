
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";

// Mock data to simulate investment performance
const MOCK_INVESTMENTS = [
  {
    id: "btc",
    name: "Bitcoin",
    symbol: "BTC",
    color: "#F7931A",
    history: [
      { date: "2023-09-01", value: 862.5 },
      { date: "2023-10-01", value: 875 },
      { date: "2023-11-01", value: 890 },
      { date: "2023-12-01", value: 900 },
      { date: "2024-01-01", value: 910 },
      { date: "2024-02-01", value: 915 },
      { date: "2024-03-01", value: 925 },
      { date: "2024-04-01", value: 935 },
    ]
  },
  {
    id: "eth",
    name: "Ethereum",
    symbol: "ETH",
    color: "#627EEA",
    history: [
      { date: "2023-09-01", value: 720.5 },
      { date: "2023-10-01", value: 735 },
      { date: "2023-11-01", value: 750 },
      { date: "2023-12-01", value: 780 },
      { date: "2024-01-01", value: 800 },
      { date: "2024-02-01", value: 810 },
      { date: "2024-03-01", value: 830 },
      { date: "2024-04-01", value: 850 },
    ]
  },
  {
    id: "sol",
    name: "Solana",
    symbol: "SOL",
    color: "#00FFA3",
    history: [
      { date: "2023-09-01", value: 420.5 },
      { date: "2023-10-01", value: 450 },
      { date: "2023-11-01", value: 490 },
      { date: "2023-12-01", value: 510 },
      { date: "2024-01-01", value: 550 },
      { date: "2024-02-01", value: 580 },
      { date: "2024-03-01", value: 620 },
      { date: "2024-04-01", value: 680 },
    ]
  },
  {
    id: "aapl",
    name: "Apple",
    symbol: "AAPL",
    color: "#A2AAAD",
    history: [
      { date: "2023-09-01", value: 500 },
      { date: "2023-10-01", value: 520 },
      { date: "2023-11-01", value: 525 },
      { date: "2023-12-01", value: 540 },
      { date: "2024-01-01", value: 560 },
      { date: "2024-02-01", value: 580 },
      { date: "2024-03-01", value: 600 },
      { date: "2024-04-01", value: 620 },
    ]
  }
];

export function InvestmentChart() {
  const [selectedAssets, setSelectedAssets] = useState<string[]>([]);
  const [chartData, setChartData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    setLoading(true);
    setTimeout(() => {
      // Default to showing all investments
      setSelectedAssets(MOCK_INVESTMENTS.map(inv => inv.id));
      setLoading(false);
    }, 800);
  }, []);

  useEffect(() => {
    if (selectedAssets.length === 0) {
      setChartData([]);
      return;
    }

    const allDates = new Set<string>();
    MOCK_INVESTMENTS.forEach(inv => {
      if (selectedAssets.includes(inv.id)) {
        inv.history.forEach(item => allDates.add(item.date));
      }
    });
    
    const sortedDates = Array.from(allDates).sort();
    
    const mergedData = sortedDates.map(date => {
      const dataPoint: any = { date };
      
      MOCK_INVESTMENTS.forEach(inv => {
        if (selectedAssets.includes(inv.id)) {
          const historyItem = inv.history.find(item => item.date === date);
          if (historyItem) {
            dataPoint[inv.id] = historyItem.value;
          }
        }
      });
      
      return dataPoint;
    });
    
    setChartData(mergedData);
  }, [selectedAssets]);

  const handleAssetChange = (value: string) => {
    if (value === "all") {
      setSelectedAssets(MOCK_INVESTMENTS.map(inv => inv.id));
    } else {
      setSelectedAssets([value]);
    }
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getMonth() + 1}/${date.getFullYear().toString().slice(2)}`;
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <CardTitle>Rendimiento de inversiones</CardTitle>
            <CardDescription>Evolución del valor de tus activos</CardDescription>
          </div>
          
          <Select value={selectedAssets.length > 1 ? "all" : selectedAssets[0] || ""} onValueChange={handleAssetChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Seleccionar activo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas las inversiones</SelectItem>
              {MOCK_INVESTMENTS.map((inv) => (
                <SelectItem key={inv.id} value={inv.id}>{inv.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="h-[350px] flex items-center justify-center">
            <div className="animate-pulse text-muted-foreground">Cargando gráfico...</div>
          </div>
        ) : (
          <div className="h-[350px] w-full">
            <ChartContainer
              config={{
                "btc": { color: "#F7931A" },
                "eth": { color: "#627EEA" },
                "sol": { color: "#00FFA3" },
                "aapl": { color: "#A2AAAD" }
              }}
            >
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={chartData}
                  margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 20,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis 
                    dataKey="date" 
                    tickFormatter={formatDate}
                    stroke="var(--muted-foreground)"
                  />
                  <YAxis stroke="var(--muted-foreground)" />
                  <Tooltip content={<ChartTooltipContent />} />
                  <Legend />
                  {MOCK_INVESTMENTS.filter(inv => selectedAssets.includes(inv.id)).map((inv) => (
                    <Line
                      key={inv.id}
                      type="monotone"
                      dataKey={inv.id}
                      name={inv.name}
                      stroke={`var(--color-${inv.id})`}
                      activeDot={{ r: 8 }}
                    />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
