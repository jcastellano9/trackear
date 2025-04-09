
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

export function FixedTermSimulator() {
  const [amount, setAmount] = useState<number>(100000);
  const [months, setMonths] = useState<number>(12);
  const [rate, setRate] = useState<number>(118);
  const [bank, setBank] = useState<string>("nacion");
  const [results, setResults] = useState<any>(null);
  
  const banks = [
    { id: "nacion", name: "Banco Nación", rate: 118, logo: "https://www.bancoprovincia.com.ar/CDN/Get/logo_BP_og" },
    { id: "provincia", name: "Banco Provincia", rate: 115, logo: "https://www.bancoprovincia.com.ar/CDN/Get/logo_BP_og" },
    { id: "galicia", name: "Banco Galicia", rate: 112, logo: "https://www.bancogalicia.com/contentsite/etc.clientlibs/settings/wcm/designs/bancogalicia/clientlib-all/resources/images/og-images/logo-corporativo.png" },
    { id: "santander", name: "Banco Santander", rate: 110, logo: "https://www.santander.com.ar/banco/wcm/connect/e0c86350-9cdb-43fa-93ad-fde61d7ecf26/imagen_og_tag_Santander.jpg?MOD=AJPERES&CACHEID=ROOTWORKSPACE-e0c86350-9cdb-43fa-93ad-fde61d7ecf26-nA6QU9." },
    { id: "bbva", name: "BBVA", rate: 108, logo: "https://www.bbva.com.ar/content/dam/public-web/bbva/ar/images/logos/logo_bbva_600x315.png" },
  ];

  const handleBankChange = (value: string) => {
    setBank(value);
    const selectedBank = banks.find(b => b.id === value);
    if (selectedBank) {
      setRate(selectedBank.rate);
    }
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

    // Calculate monthly interest rate
    const monthlyRate = rate / 12 / 100;
    
    // Calculate final amount
    let finalAmount = amount;
    const monthlyData = [{ month: 0, amount: finalAmount }];
    
    for (let i = 1; i <= months; i++) {
      finalAmount = finalAmount * (1 + monthlyRate);
      monthlyData.push({ month: i, amount: Math.round(finalAmount) });
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
      rate
    });
    
    toast.success("Simulación calculada con éxito");
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <Card className="lg:col-span-1">
        <CardHeader>
          <CardTitle>Parámetros de Simulación</CardTitle>
          <CardDescription>Ingresa los datos para simular tu plazo fijo</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="bank">Entidad bancaria</Label>
            <Select value={bank} onValueChange={handleBankChange}>
              <SelectTrigger id="bank">
                <SelectValue placeholder="Selecciona un banco" />
              </SelectTrigger>
              <SelectContent>
                {banks.map((bank) => (
                  <SelectItem key={bank.id} value={bank.id}>
                    <div className="flex items-center gap-2">
                      <img src={bank.logo} alt={bank.name} className="h-4 w-4 object-contain" />
                      <span>{bank.name} ({bank.rate}% TNA)</span>
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
              <Label htmlFor="months">Plazo (meses): {months}</Label>
            </div>
            <Slider
              id="months"
              value={[months]}
              onValueChange={(value) => setMonths(value[0])}
              min={1}
              max={60}
              step={1}
            />
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="rate">Tasa anual: {rate}%</Label>
            </div>
            <Slider
              id="rate"
              value={[rate]}
              onValueChange={(value) => setRate(value[0])}
              min={80}
              max={150}
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
              ? `Plazo fijo de $${results.initialAmount.toLocaleString('es-AR')} a ${results.months} meses con tasa del ${results.rate}% anual` 
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
