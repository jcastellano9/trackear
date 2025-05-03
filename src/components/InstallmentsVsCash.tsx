
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Info } from "lucide-react";
import { toast } from "sonner";

export function InstallmentsVsCash() {
  const [cashPrice, setCashPrice] = useState<number>(100000);
  const [installmentPrice, setInstallmentPrice] = useState<number>(120000);
  const [installments, setInstallments] = useState<number>(12);
  const [inflationRate, setInflationRate] = useState<number>(4);
  const [fixedTermRate, setFixedTermRate] = useState<number>(65);
  const [fciRate, setFciRate] = useState<number>(72);
  const [results, setResults] = useState<any>(null);
  const [includeInflation, setIncludeInflation] = useState<boolean>(true);

  useEffect(() => {
    if (cashPrice > 0 && installmentPrice > 0 && installments > 0) {
      calculateComparison();
    }
  }, [cashPrice, installmentPrice, installments, inflationRate, fixedTermRate, fciRate, includeInflation]);

  const calculateComparison = () => {
    try {
      // Calculate monthly rates
      const monthlyInflation = includeInflation ? inflationRate / 100 : 0;
      const monthlyFixedTermRate = fixedTermRate / 100 / 12;
      const monthlyFciRate = fciRate / 100 / 12;
      
      // Calculate installment details
      const monthlyInstallment = installmentPrice / installments;
      let totalEffectiveInstallments = 0;
      let installmentsWithInflation = [];
      
      // Calculate effective value of each installment considering inflation
      for (let i = 0; i < installments; i++) {
        // Discount by inflation (cumulative each month)
        const inflationFactor = 1 / Math.pow(1 + monthlyInflation, i + 1);
        const effectiveInstallment = monthlyInstallment * inflationFactor;
        totalEffectiveInstallments += effectiveInstallment;
        
        installmentsWithInflation.push({
          month: i + 1,
          nominal: monthlyInstallment,
          effective: effectiveInstallment,
        });
      }
      
      // Calculate fixed term investment
      let fixedTermFinalAmount = cashPrice;
      for (let i = 0; i < installments; i++) {
        fixedTermFinalAmount *= (1 + monthlyFixedTermRate);
      }
      const fixedTermProfit = fixedTermFinalAmount - cashPrice;
      
      // Calculate FCI investment
      let fciFinalAmount = cashPrice;
      for (let i = 0; i < installments; i++) {
        fciFinalAmount *= (1 + monthlyFciRate);
      }
      const fciProfit = fciFinalAmount - cashPrice;
      
      // Calculate nominal surcharge
      const nominalSurcharge = ((installmentPrice / cashPrice) - 1) * 100;
      
      // Final financing calculations
      const effectiveFinancingCost = ((installmentPrice / totalEffectiveInstallments) - 1) * 100;
      
      setResults({
        cashPrice,
        installmentPrice,
        installments,
        monthlyInstallment,
        totalEffectiveInstallments,
        installmentsWithInflation,
        fixedTermFinalAmount,
        fixedTermProfit,
        fciFinalAmount,
        fciProfit,
        nominalSurcharge,
        effectiveFinancingCost,
        bestOption: totalEffectiveInstallments < cashPrice ? "installments" : "cash"
      });
      
    } catch (error) {
      console.error("Error calculating comparison:", error);
      toast.error("Error en el cálculo. Revisa los valores ingresados.");
    }
  };

  return (
    <div className="space-y-6">
      <Card className="glass-card">
        <CardHeader>
          <CardTitle>Simulador Cuotas vs. Contado</CardTitle>
          <CardDescription>
            Analiza si te conviene comprar en cuotas o al contado, considerando inflación y alternativas de inversión
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="cashPrice">Precio de contado ($)</Label>
              <Input
                id="cashPrice"
                type="number"
                value={cashPrice}
                onChange={(e) => setCashPrice(parseFloat(e.target.value) || 0)}
                min={1}
                className="bg-background/40 border-white/10"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="installmentPrice">Precio financiado total ($)</Label>
              <Input
                id="installmentPrice"
                type="number"
                value={installmentPrice}
                onChange={(e) => setInstallmentPrice(parseFloat(e.target.value) || 0)}
                min={1}
                className="bg-background/40 border-white/10"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="installments">Cantidad de cuotas</Label>
              <Input
                id="installments"
                type="number"
                value={installments}
                onChange={(e) => setInstallments(parseInt(e.target.value) || 0)}
                min={1}
                max={60}
                className="bg-background/40 border-white/10"
              />
            </div>
          </div>
          
          <div className="my-4">
            <div className="flex items-center space-x-2 mb-2">
              <Switch
                id="inflation-toggle"
                checked={includeInflation}
                onCheckedChange={setIncludeInflation}
              />
              <Label htmlFor="inflation-toggle">Incluir inflación en el cálculo</Label>
            </div>
          </div>

          {includeInflation && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Label htmlFor="inflationRate">Inflación mensual (%)</Label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="h-4 w-4 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="max-w-xs">Porcentaje estimado de inflación mensual para calcular el valor real de las cuotas futuras.</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <Input
                  id="inflationRate"
                  type="number"
                  value={inflationRate}
                  onChange={(e) => setInflationRate(parseFloat(e.target.value) || 0)}
                  min={0}
                  step={0.5}
                  max={50}
                  className="bg-background/40 border-white/10"
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Label htmlFor="fixedTermRate">Tasa Plazo Fijo (% anual)</Label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="h-4 w-4 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="max-w-xs">TNA disponible en plazo fijo tradicional.</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <Input
                  id="fixedTermRate"
                  type="number"
                  value={fixedTermRate}
                  onChange={(e) => setFixedTermRate(parseFloat(e.target.value) || 0)}
                  min={0}
                  step={0.5}
                  className="bg-background/40 border-white/10"
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Label htmlFor="fciRate">Rendimiento FCI (% anual)</Label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="h-4 w-4 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="max-w-xs">Rendimiento estimado anual de un Fondo Común de Inversión conservador.</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <Input
                  id="fciRate"
                  type="number"
                  value={fciRate}
                  onChange={(e) => setFciRate(parseFloat(e.target.value) || 0)}
                  min={0}
                  step={0.5}
                  className="bg-background/40 border-white/10"
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {results && (
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Resultados de la simulación</CardTitle>
            <CardDescription>
              Análisis comparativo entre pago en cuotas vs. contado
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">Resumen de la compra</h3>
                <Table>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">Precio de contado</TableCell>
                      <TableCell className="text-right">${results.cashPrice.toLocaleString('es-AR')}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Precio financiado total</TableCell>
                      <TableCell className="text-right">${results.installmentPrice.toLocaleString('es-AR')}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">
                        <div className="flex items-center space-x-2">
                          <span>Recargo nominal</span>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Info className="h-4 w-4 text-muted-foreground" />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p className="max-w-xs">Diferencia porcentual entre precio de contado y precio en cuotas.</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">{results.nominalSurcharge.toFixed(2)}%</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Cantidad de cuotas</TableCell>
                      <TableCell className="text-right">{results.installments}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Valor de cada cuota</TableCell>
                      <TableCell className="text-right">${results.monthlyInstallment.toLocaleString('es-AR', {maximumFractionDigits: 2})}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4">Análisis financiero</h3>
                <Table>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">
                        <div className="flex items-center space-x-2">
                          <span>Valor actualizado de las cuotas</span>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Info className="h-4 w-4 text-muted-foreground" />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p className="max-w-xs">Valor presente de todas las cuotas ajustadas por inflación.</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">${results.totalEffectiveInstallments.toLocaleString('es-AR', {maximumFractionDigits: 2})}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">
                        <div className="flex items-center space-x-2">
                          <span>Costo efectivo de financiación</span>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Info className="h-4 w-4 text-muted-foreground" />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p className="max-w-xs">Tasa real considerando el efecto de la inflación sobre las cuotas futuras.</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">{results.effectiveFinancingCost.toFixed(2)}%</TableCell>
                    </TableRow>
                    {includeInflation && (
                      <>
                        <TableRow>
                          <TableCell className="font-medium">Rendimiento de Plazo Fijo</TableCell>
                          <TableCell className="text-right">${results.fixedTermProfit.toLocaleString('es-AR', {maximumFractionDigits: 2})}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">Rendimiento de FCI</TableCell>
                          <TableCell className="text-right">${results.fciProfit.toLocaleString('es-AR', {maximumFractionDigits: 2})}</TableCell>
                        </TableRow>
                      </>
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
            
            <div className={`p-4 rounded-md border text-center ${results.bestOption === 'installments' ? 'border-green-500/30 bg-green-500/10' : 'border-blue-500/30 bg-blue-500/10'}`}>
              <h3 className="text-xl font-bold mb-2">
                {results.bestOption === 'installments' 
                  ? '¡Te conviene comprar en cuotas!' 
                  : '¡Te conviene pagar al contado!'}
              </h3>
              <p>
                {results.bestOption === 'installments'
                  ? `El valor actualizado de las cuotas (${results.totalEffectiveInstallments.toLocaleString('es-AR', {maximumFractionDigits: 2})}) es menor que el precio de contado (${results.cashPrice.toLocaleString('es-AR')}).`
                  : `Pagando al contado e invirtiendo la diferencia podrías obtener un mejor resultado financiero.`
                }
              </p>
            </div>
            
            <Alert variant="warning" className="mt-4">
              <AlertDescription className="text-center">
                Los valores estimados pueden variar dependiendo del contexto inflacionario argentino.
                Tomar decisiones financieras siempre implica un margen de incertidumbre.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
