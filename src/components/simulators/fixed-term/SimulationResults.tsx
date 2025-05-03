
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { motion } from "framer-motion";

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
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.5 }}
                whileHover={{ scale: 1.03 }}
                className="p-4 border border-white/5 bg-white/5 rounded-lg"
              >
                <p className="text-sm text-muted-foreground">Monto final</p>
                <p className="text-2xl font-bold">$ {Math.round(results.finalAmount).toLocaleString('es-AR')}</p>
              </motion.div>
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                whileHover={{ scale: 1.03 }}
                className="p-4 border border-white/5 bg-white/5 rounded-lg"
              >
                <p className="text-sm text-muted-foreground">Ganancia</p>
                <p className="text-2xl font-bold text-finance-positive">$ {Math.round(results.profit).toLocaleString('es-AR')}</p>
              </motion.div>
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                whileHover={{ scale: 1.03 }}
                className="p-4 border border-white/5 bg-white/5 rounded-lg"
              >
                <p className="text-sm text-muted-foreground">Rendimiento</p>
                <motion.p
                  initial={{ scale: 1 }}
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity, repeatType: "loop" }}
                  className="text-2xl font-bold text-finance-positive"
                >
                  {results.profitPercentage.toFixed(2)}%
                </motion.p>
              </motion.div>
            </div>
            
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.7 }}
              className="h-[300px] w-full"
            >
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={results.monthlyData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <defs>
                    <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.2}/>
                    </linearGradient>
                  </defs>
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
                  <Tooltip 
                    formatter={(value) => [`$${Number(value).toLocaleString('es-AR')}`, 'Monto']} 
                    contentStyle={{ backgroundColor: 'rgba(30, 41, 59, 0.9)', border: '1px solid rgba(255,255,255,0.1)' }}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="amount" 
                    name="Monto acumulado" 
                    stroke="#3b82f6" 
                    activeDot={{ r: 8, fill: '#60a5fa', stroke: '#3b82f6', strokeWidth: 2 }} 
                    strokeWidth={3}
                    fill="url(#colorAmount)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </motion.div>
          </motion.div>
        ) : (
          <div className="flex flex-col items-center justify-center h-[350px] text-center">
            <motion.p 
              initial={{ opacity: 0.5 }}
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-muted-foreground"
            >
              Ingresa los datos para ver los resultados
            </motion.p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
