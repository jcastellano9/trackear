
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { walletsOptions } from "@/utils/investmentOptions";

export function WalletSimulator() {
  const [amount, setAmount] = useState<number>(50000);
  const [months, setMonths] = useState<number>(6);
  const [wallet, setWallet] = useState<string>("MP");
  const [results, setResults] = useState<any>(null);
  
  const wallets = [
    { id: "MP", name: "Mercado Pago", rate: 95, logo: "https://logodownload.org/wp-content/uploads/2019/06/mercado-pago-logo-1.png" },
    { id: "UALA", name: "Ualá", rate: 97, logo: "https://play-lh.googleusercontent.com/Av_0YMJmES8v_vvbHZ27umL1o5mlUh7FQhuH2tGrO36gI6TXQ4DI6PJtgjHCzCkQQA=w240-h480-rw" },
    { id: "NAR", name: "Naranja X", rate: 96, logo: "https://www.redusers.com/noticias/wp-content/uploads/2020/07/naranjax_logo.png" },
    { id: "BRU", name: "Brubank", rate: 98, logo: "https://play-lh.googleusercontent.com/exoS4C9cm_GQD-RFKG2LNK0_-KQYtnJNcHCTc-qEKYPRDHVUz0abUnNNHWmTjh2Hh4Pk" },
  ];

  const getWalletRate = (id: string) => {
    const found = wallets.find(w => w.id === id);
    return found ? found.rate : 95;
  };

  const handleWalletChange = (value: string) => {
    setWallet(value);
  };

  const calculate = () => {
    if (amount <= 0) {
      toast.error("El monto debe ser mayor a 0");
      return;
    }

    if (months <= 0) {
      toast.error("El plazo debe ser mayor a 0");
      return;
    }

    const rate = getWalletRate(wallet);
    
    // Calculate daily interest rate (assuming 365 days in a year)
    const dailyRate = rate / 365 / 100;
    
    // Calculate final amount day by day
    let finalAmount = amount;
    const dailyData = [];
    const monthlyData = [{ month: 0, amount: finalAmount }];
    
    // For the chart we'll use monthly data points
    const daysPerMonth = 30;
    const totalDays = months * daysPerMonth;
    
    for (let day = 1; day <= totalDays; day++) {
      finalAmount = finalAmount * (1 + dailyRate);
      
      if (day % daysPerMonth === 0) {
        const currentMonth = day / daysPerMonth;
        monthlyData.push({ 
          month: currentMonth, 
          amount: Math.round(finalAmount) 
        });
      }
    }
    
    const profit = finalAmount - amount;
    const profitPercentage = (profit / amount) * 100;
    
    setResults({
      initialAmount: amount,
      finalAmount,
      profit,
      profitPercentage,
      monthlyData,
      months,
      rate,
      wallet: wallets.find(w => w.id === wallet)
    });
    
    toast.success("Simulación calculada con éxito");
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <Card className="lg:col-span-1">
        <CardHeader>
          <CardTitle>Parámetros de Simulación</CardTitle>
          <CardDescription>Simula el rendimiento de tu dinero en una billetera virtual</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="wallet">Billetera</Label>
            <Select value={wallet} onValueChange={handleWalletChange}>
              <SelectTrigger id="wallet">
                <SelectValue placeholder="Selecciona una billetera" />
              </SelectTrigger>
              <SelectContent>
                {wallets.map((w) => (
                  <SelectItem key={w.id} value={w.id}>
                    <div className="flex items-center gap-2">
                      <img src={w.logo} alt={w.name} className="h-4 w-4 object-contain" />
                      <span>{w.name} ({w.rate}% TNA)</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="amount">Monto inicial (ARS)</Label>
            <Input
              id="amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              min={1000}
              step={1000}
            />
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="months">Tiempo (meses): {months}</Label>
            </div>
            <Slider
              id="months"
              value={[months]}
              onValueChange={(value) => setMonths(value[0])}
              min={1}
              max={36}
              step={1}
            />
          </div>
          
          <Button onClick={calculate} className="w-full mt-4">Calcular</Button>
        </CardContent>
      </Card>
      
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Resultados de la simulación</CardTitle>
          <CardDescription>
            {results 
              ? `Rendimiento en ${results.wallet?.name} durante ${results.months} meses con tasa del ${results.rate}% anual` 
              : "Completa los datos y haz clic en Calcular para ver los resultados"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {results ? (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 border rounded-lg">
                  <p className="text-sm text-muted-foreground">Monto final</p>
                  <p className="text-2xl font-bold">$ {Math.round(results.finalAmount).toLocaleString('es-AR')}</p>
                </div>
                <div className="p-4 border rounded-lg">
                  <p className="text-sm text-muted-foreground">Ganancia</p>
                  <p className="text-2xl font-bold">$ {Math.round(results.profit).toLocaleString('es-AR')}</p>
                </div>
                <div className="p-4 border rounded-lg">
                  <p className="text-sm text-muted-foreground">Rendimiento</p>
                  <p className="text-2xl font-bold">
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
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="month" 
                      label={{ value: 'Meses', position: 'insideBottomRight', offset: -10 }} 
                    />
                    <YAxis 
                      label={{ value: 'Monto (ARS)', angle: -90, position: 'insideLeft' }}
                      tickFormatter={(value) => `$${(value/1000).toFixed(0)}k`}
                    />
                    <Tooltip formatter={(value) => [`$${Number(value).toLocaleString('es-AR')}`, 'Monto']} />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="amount" 
                      name="Monto acumulado" 
                      stroke="#8b5cf6" 
                      activeDot={{ r: 8 }} 
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-muted/50 p-4 rounded-lg text-sm">
                <p className="font-medium mb-2">Importante:</p>
                <p>A diferencia de un plazo fijo, en las billeteras virtuales puedes retirar tu dinero en cualquier momento sin perder los intereses ya generados.</p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-[350px] text-center">
              <p className="text-muted-foreground">Ingresa los datos y haz clic en Calcular para ver los resultados</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
