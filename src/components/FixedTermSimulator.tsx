
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { toast } from "sonner";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

interface Bank {
  id: string;
  name: string;
  rate: number;
  logo: string;
}

// Esta función simula la llamada a la API para obtener tasas actualizadas
const fetchBankRates = async (): Promise<Bank[]> => {
  try {
    // En un ambiente real, esta sería la llamada a la API
    // const response = await axios.get('https://comparatasas-gateway.ferminrp.com/v1/finanzas/rendimientos');
    // return response.data.banks;

    // Datos de ejemplo
    return [
      { id: "nacion", name: "Banco Nación", rate: 118, logo: "https://www.bancoprovincia.com.ar/CDN/Get/logo_BP_og" },
      { id: "provincia", name: "Banco Provincia", rate: 115, logo: "https://www.bancoprovincia.com.ar/CDN/Get/logo_BP_og" },
      { id: "galicia", name: "Banco Galicia", rate: 112, logo: "https://www.bancogalicia.com/contentsite/etc.clientlibs/settings/wcm/designs/bancogalicia/clientlib-all/resources/images/og-images/logo-corporativo.png" },
      { id: "santander", name: "Banco Santander", rate: 110, logo: "https://www.santander.com.ar/banco/wcm/connect/e0c86350-9cdb-43fa-93ad-fde61d7ecf26/imagen_og_tag_Santander.jpg?MOD=AJPERES&CACHEID=ROOTWORKSPACE-e0c86350-9cdb-43fa-93ad-fde61d7ecf26-nA6QU9." },
      { id: "bbva", name: "BBVA", rate: 108, logo: "https://www.bbva.com.ar/content/dam/public-web/bbva/ar/images/logos/logo_bbva_600x315.png" },
    ];
  } catch (error) {
    console.error("Error fetching bank rates:", error);
    throw error;
  }
};

const TERM_OPTIONS = [
  { value: 30, label: "30 días" },
  { value: 60, label: "60 días" },
  { value: 90, label: "90 días" },
  { value: 180, label: "180 días" },
  { value: 365, label: "365 días" },
];

export function FixedTermSimulator() {
  const [amount, setAmount] = useState<number>(100000);
  const [termDays, setTermDays] = useState<number>(30);
  const [bank, setBank] = useState<string>("");
  const [results, setResults] = useState<any>(null);
  
  // Consulta para obtener los bancos y sus tasas
  const { data: banks = [], isLoading, error } = useQuery({
    queryKey: ['bankRates'],
    queryFn: fetchBankRates,
  });

  // Obtener la tasa del banco seleccionado
  const selectedBank = banks.find(b => b.id === bank);
  const rate = selectedBank?.rate || 0;

  useEffect(() => {
    // Si hay un error en la carga, mostrar notificación
    if (error) {
      toast.error("No se pudieron cargar las tasas de los bancos");
    }

    // Seleccionar el primer banco por defecto cuando se cargan los datos
    if (banks.length > 0 && !bank) {
      setBank(banks[0].id);
    }
  }, [banks, error, bank]);

  const calculate = () => {
    if (amount <= 0) {
      toast.error("El monto debe ser mayor a 0");
      return;
    }

    if (!bank) {
      toast.error("Selecciona un banco");
      return;
    }

    if (!rate) {
      toast.error("La tasa no es válida");
      return;
    }

    // Convertir días a meses para el cálculo
    const months = termDays / 30;
    
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
      termDays,
      rate
    });
    
    toast.success("Simulación calculada con éxito");
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <Card className="lg:col-span-1 glass-card">
        <CardHeader>
          <CardTitle>Parámetros de Simulación</CardTitle>
          <CardDescription>Ingresa los datos para simular tu plazo fijo</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="bank">Entidad bancaria</Label>
            <Select value={bank} onValueChange={setBank} disabled={isLoading}>
              <SelectTrigger id="bank" className="bg-background/40 border-white/10">
                <SelectValue placeholder={isLoading ? "Cargando bancos..." : "Selecciona un banco"} />
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
              className="bg-background/40 border-white/10"
            />
          </div>
          
          <div className="space-y-2">
            <Label>Plazo</Label>
            <ToggleGroup type="single" value={termDays.toString()} onValueChange={(value) => setTermDays(Number(value))} className="flex flex-wrap justify-between">
              {TERM_OPTIONS.map((option) => (
                <ToggleGroupItem key={option.value} value={option.value.toString()} className="flex-1 min-w-[80px] my-1">
                  {option.label}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label>Tasa anual</Label>
              <span className="text-sm font-medium">{rate}%</span>
            </div>
            <div className="h-2 w-full bg-blue-500/30 rounded-full">
              <div 
                className="h-full bg-blue-500 rounded-full" 
                style={{ width: `${Math.min(rate/150*100, 100)}%` }}
              ></div>
            </div>
            <p className="text-xs text-muted-foreground">*La tasa es proporcionada por el banco seleccionado</p>
          </div>
          
          <Button onClick={calculate} className="w-full mt-4 bg-blue-600 hover:bg-blue-700">Calcular</Button>
        </CardContent>
      </Card>
      
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
    </div>
  );
}
