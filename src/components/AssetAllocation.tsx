
import { useState, useEffect } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

// Default data for when no investments are present
const EMPTY_DATA = [
  { name: "Sin inversiones", value: 1, color: "#e5e7eb" }
];

export function AssetAllocation() {
  const [data, setData] = useState<typeof EMPTY_DATA>([]);
  const [loading, setLoading] = useState(true);
  const [hasData, setHasData] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);
  
  // Function to fetch allocation data
  const fetchData = async () => {
    setLoading(true);
    try {
      // In a real app, we'd fetch the asset allocation data from an API or database
      const { supabase } = await import('@/lib/supabase');
      const { useSession } = await import('@supabase/auth-helpers-react');
      const session = useSession();
      
      if (!session?.user?.id) {
        setData(EMPTY_DATA);
        setHasData(false);
        return;
      }
      
      // Check if the user has any investments
      const { count, error } = await supabase
        .from('investments')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', session.user.id);
        
      const userHasInvestments = count !== null && count > 0;
      
      if (userHasInvestments) {
        // If we have investments, we'd calculate allocation here
        // For now, we'll use the empty data
        setData(EMPTY_DATA); 
        setHasData(false);
      } else {
        setData(EMPTY_DATA);
        setHasData(false);
      }
    } catch (error) {
      console.error("Error fetching asset allocation:", error);
      setData(EMPTY_DATA);
      setHasData(false);
    } finally {
      setLoading(false);
    }
  };

  // Handle refresh button click
  const handleRefresh = () => {
    fetchData();
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length && hasData) {
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
    if (!hasData) {
      return (
        <div className="flex justify-center mt-4">
          <span className="text-sm text-muted-foreground">No hay datos de inversiones para mostrar</span>
        </div>
      );
    }
    
    const { payload } = props;
    
    return (
      <ul className="flex justify-center gap-6 mt-4">
        {payload.map((entry: any, index: number) => (
          <li key={`item-${index}`} className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }} />
            <span className="text-sm">{entry.name}: {entry.value}%</span>
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div>
      <div className="flex justify-end mb-4">
        <Button variant="outline" size="sm" onClick={handleRefresh} disabled={loading}>
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
          Actualizar
        </Button>
      </div>
      
      {loading ? (
        <div className="flex flex-col items-center space-y-4 pt-4">
          <Skeleton className="h-[180px] w-[180px] rounded-full" />
          <div className="space-y-2 w-full">
            <Skeleton className="h-4 w-2/3 mx-auto" />
            <Skeleton className="h-4 w-1/2 mx-auto" />
          </div>
        </div>
      ) : (
        <div className="relative h-[250px]">
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
                stroke="#f3f4f6"
                strokeWidth={hasData ? 2 : 0}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              {hasData && <Tooltip content={<CustomTooltip />} />}
              <Legend content={renderLegend} />
            </PieChart>
          </ResponsiveContainer>
          {!hasData && (
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center text-muted-foreground">
              <p>No hay inversiones cargadas</p>
              <p className="text-xs mt-1">Agregue inversiones para visualizar la distribución</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
