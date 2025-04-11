
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

interface SimulationResultsProps {
  results: {
    initialAmount: number;
    finalAmount: number;
    profit: number;
    profitPercentage: number;
    monthlyData: Array<{ month: number; amount: number }>;
    months: number;
    termDays: number;
    rate: number;
  } | null;
}

export function SimulationResults({ results }: SimulationResultsProps) {
  return (
    <Card className="lg:col-span-2 glass-card">
      <CardHeader>
        <CardTitle>Resultados de la simulación</CardTitle>
        <CardDescription>
          {results 
            ? `Plazo fijo de $${results.initialAmount.toLocaleString('es-AR')} a ${results.termDays} días con tasa del ${results.rate}% anual` 
            : "Completa los datos y haz clic en Calcular para ver los resultados"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {results ? (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 border border-white/5 bg-white/5 rounded-lg">
                <p className="text-sm text-muted-foreground">Monto final</p>
                <p className="text-2xl font-bold">$ {Math.round(results.finalAmount).toLocaleString('es-AR')}</p>
              </div>
              <div className="p-4 border border-white/5 bg-white/5 rounded-lg">
                <p className="text-sm text-muted-foreground">Ganancia</p>
                <p className="text-2xl font-bold text-finance-positive">$ {Math.round(results.profit).toLocaleString('es-AR')}</p>
              </div>
              <div className="p-4 border border-white/5 bg-white/5 rounded-lg">
                <p className="text-sm text-muted-foreground">Rendimiento</p>
                <p className="text-2xl font-bold text-finance-positive">
                  {results.profitPercentage.toFixed(2)}%
                </p>
              </div>
            </div>
            
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={results.monthlyData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis 
                    dataKey="month" 
                    label={{ value: 'Meses', position: 'insideBottomRight', offset: -10 }}
                    stroke="rgba(255,255,255,0.5)"
                  />
                  <YAxis 
                    label={{ value: 'Monto (ARS)', angle: -90, position: 'insideLeft' }}
                    tickFormatter={(value) => `$${(value/1000).toFixed(0)}k`}
                    stroke="rgba(255,255,255,0.5)"
                  />
                  <Tooltip formatter={(value) => [`$${Number(value).toLocaleString('es-AR')}`, 'Monto']} />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="amount" 
                    name="Monto acumulado" 
                    stroke="#3b82f6" 
                    activeDot={{ r: 8 }} 
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-[350px] text-center">
            <p className="text-muted-foreground">Ingresa los datos y haz clic en Calcular para ver los resultados</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
