
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { walletsOptions } from "@/utils/investmentOptions";
import { Slider } from "@/components/ui/slider";
import { toast } from "sonner";

export function WalletSimulator() {
  const [amount, setAmount] = useState<number>(100000);
  const [months, setMonths] = useState<number>(12);
  const [results, setResults] = useState<any[]>([]);

  // Calculate results whenever inputs change
  useEffect(() => {
    calculateReturns();
  }, [amount, months]);

  const calculateReturns = () => {
    if (!amount || amount <= 0) {
      toast.error("Ingresa un monto válido mayor a cero");
      return;
    }

    const calculatedResults = walletsOptions.map(wallet => {
      const monthlyRate = wallet.rate / 100 / 12;
      let finalAmount = amount;
      
      for (let i = 0; i < months; i++) {
        finalAmount += finalAmount * monthlyRate;
      }
      
      const profit = finalAmount - amount;
      const yearlyRate = Math.pow(1 + monthlyRate, 12) - 1;
      
      return {
        name: wallet.name,
        logo: wallet.logo,
        initialAmount: amount,
        finalAmount,
        profit,
        yearlyRate: yearlyRate * 100,
        effectiveRate: wallet.rate,
        months
      };
    });
    
    // Sort by profit (highest first)
    calculatedResults.sort((a, b) => b.profit - a.profit);
    setResults(calculatedResults);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Simulador de Rendimiento de Billeteras Virtuales</CardTitle>
          <CardDescription>
            Calcula cuánto generarían distintas billeteras virtuales según su tasa y plazo
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="amount">Monto a invertir (ARS)</Label>
              <Input
                id="amount"
                type="number"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                min="1000"
                step="1000"
              />
              <p className="text-xs text-muted-foreground">
                Monto mínimo recomendado: $1.000
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="months">Plazo (meses): {months}</Label>
              <Slider
                id="months"
                min={1}
                max={36}
                step={1}
                value={[months]}
                onValueChange={(value) => setMonths(value[0])}
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>1 mes</span>
                <span>12 meses</span>
                <span>36 meses</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Resultados de la simulación</CardTitle>
          <CardDescription>
            Comparativa de rendimientos entre distintas billeteras virtuales
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Billetera</TableHead>
                <TableHead>TNA</TableHead>
                <TableHead>Rendimiento</TableHead>
                <TableHead className="text-right">Monto final</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {results.map((result, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <img 
                        src={result.logo} 
                        alt={result.name} 
                        className="h-6 w-6 object-contain"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = "https://via.placeholder.com/24?text=?";
                        }}
                      />
                      <div className="font-medium">{result.name}</div>
                    </div>
                  </TableCell>
                  <TableCell>{result.effectiveRate.toFixed(1)}%</TableCell>
                  <TableCell className="font-medium text-finance-positive">
                    +${result.profit.toLocaleString('es-AR', {maximumFractionDigits: 0})}
                    <div className="text-xs text-muted-foreground">
                      (+{(result.profit / result.initialAmount * 100).toFixed(2)}%)
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    ${result.finalAmount.toLocaleString('es-AR', {maximumFractionDigits: 0})}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <div className="mt-4 text-xs text-muted-foreground">
            <p>* Los cálculos son estimativos y pueden variar según las políticas de cada billetera.</p>
            <p>* Las tasas utilizadas son aproximadas y pueden cambiar sin previo aviso.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
