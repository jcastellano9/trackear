
import { useState, useEffect } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { Skeleton } from "@/components/ui/skeleton";

// Default data for when no investments are present
const EMPTY_DATA = [
  { name: "Cripto", value: 0, color: "#3b82f6" },
  { name: "CEDEARs", value: 0, color: "#f97316" },
];

export function AssetAllocation() {
  const [data, setData] = useState<typeof EMPTY_DATA>([]);
  const [loading, setLoading] = useState(true);
  const [hasData, setHasData] = useState(false);

  useEffect(() => {
    // Simulate API call to fetch actual investment data
    const fetchData = async () => {
      try {
        // In a real app, we'd fetch the asset allocation data from an API or database
        // For now, we're setting it to empty data to simulate no investments
        setData(EMPTY_DATA);
        setHasData(false); // No real data
      } catch (error) {
        console.error("Error fetching asset allocation:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-popover border rounded-md shadow-md p-3 text-sm">
          <p className="font-medium">{`${payload[0].name}: ${payload[0].value}%`}</p>
          <p className="text-xs text-muted-foreground mt-1">{`Monto: $${(payload[0].value * 100).toLocaleString()}`}</p>
        </div>
      );
    }
    return null;
  };

  const renderLegend = (props: any) => {
    const { payload } = props;
    
    return (
      <ul className="flex justify-center gap-6 mt-4">
        {payload.map((entry: any, index: number) => (
          <li key={`item-${index}`} className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }} />
            <span className="text-sm">{entry.value === 0 ? `${entry.name}: 0%` : entry.value}</span>
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div>
      {loading ? (
        <div className="flex flex-col items-center space-y-4 pt-4">
          <Skeleton className="h-[180px] w-[180px] rounded-full" />
          <div className="space-y-2 w-full">
            <Skeleton className="h-4 w-2/3 mx-auto" />
            <Skeleton className="h-4 w-1/2 mx-auto" />
          </div>
        </div>
      ) : !hasData ? (
        <div className="h-[250px] flex flex-col items-center justify-center text-muted-foreground">
          <p className="text-center">No hay inversiones cargadas</p>
          <p className="text-xs text-center mt-1">Agregue inversiones para visualizar la distribución</p>
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
                outerRadius={90}
                paddingAngle={4}
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                labelLine={false}
                strokeWidth={2}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend content={renderLegend} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
