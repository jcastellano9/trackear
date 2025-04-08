
import { useState, useEffect } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

// Mock data to simulate asset allocation
const MOCK_DATA = [
  { name: "Cripto", value: 45, color: "#3b82f6" },
  { name: "CEDEARs", value: 30, color: "#8b5cf6" },
  { name: "Plazo Fijo", value: 15, color: "#10b981" },
  { name: "Efectivo", value: 10, color: "#f59e0b" },
];

export function AssetAllocation() {
  const [data, setData] = useState<typeof MOCK_DATA>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    const fetchData = () => {
      setTimeout(() => {
        setData(MOCK_DATA);
        setLoading(false);
      }, 1000);
    };

    fetchData();
  }, []);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-popover border rounded-md shadow-md p-2 text-sm">
          <p className="font-medium">{`${payload[0].name}: ${payload[0].value}%`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle>Distribución de Activos</CardTitle>
        <CardDescription>Composición actual de tu portafolio</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex flex-col items-center space-y-4 pt-4">
            <Skeleton className="h-[180px] w-[180px] rounded-full" />
            <div className="space-y-2 w-full">
              <Skeleton className="h-4 w-2/3 mx-auto" />
              <Skeleton className="h-4 w-1/2 mx-auto" />
            </div>
          </div>
        ) : (
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  labelLine={false}
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
