
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowDown, ArrowUp, CheckCircle2, XCircle } from "lucide-react";
import { formatCurrency } from "@/utils/formatUtils";

export function InstallmentsVsCash() {
  const [cashPrice, setCashPrice] = useState<number | ''>('');
  const [totalInstallmentsPrice, setTotalInstallmentsPrice] = useState<number | ''>('');
  const [monthlyInflation, setMonthlyInflation] = useState<number>(6); // 6% default
  const [installments, setInstallments] = useState<number>(12); // 12 cuotas default
  const [fciRate, setFciRate] = useState<number>(5.5); // 5.5% default
  const [fixedTermRate, setFixedTermRate] = useState<number>(4.5); // 4.5% default
  const [results, setResults] = useState<any>(null);

  const calculateResults = () => {
    if (!cashPrice || !totalInstallmentsPrice || !installments || !monthlyInflation) return;

    // Calcular recargo
    const surchargeAmount = Number(totalInstallmentsPrice) - Number(cashPrice);
    const surchargePercentage = (surchargeAmount / Number(cashPrice)) * 100;
    
    // Calcular cuota mensual sin ajustar
    const monthlyInstallment = Number(totalInstallmentsPrice) / installments;
    
    // Calcular cuotas ajustadas por inflación
    let totalAdjusted = 0;
    const installmentDetails = [];
    
    for (let i = 0; i < installments; i++) {
      const adjustmentFactor = Math.pow(1 - monthlyInflation / 100, i + 1);
      const adjustedInstallment = monthlyInstallment * adjustmentFactor;
      totalAdjusted += adjustedInstallment;
      
      installmentDetails.push({
        month: i + 1,
        nominal: monthlyInstallment,
        adjusted: adjustedInstallment,
        adjustmentFactor
      });
    }
    
    // Simular inversión en FCI
    let fciInvestment = Number(cashPrice);
    let fciWithdrawal = Number(cashPrice);
    const monthlyFciRate = fciRate / 100;
    
    // Con retiros mensuales para pagar cuotas
    for (let i = 0; i < installments; i++) {
      fciInvestment = (fciInvestment - monthlyInstallment) * (1 + monthlyFciRate);
    }
    
    // Sin retiros (inversión total)
    fciWithdrawal = fciWithdrawal * Math.pow(1 + monthlyFciRate, installments);
    
    // Simular inversión en Plazo Fijo
    let fixedTermInvestment = Number(cashPrice);
    let fixedTermWithdrawal = Number(cashPrice);
    const monthlyFixedTermRate = fixedTermRate / 100;
    
    // Con retiros mensuales para pagar cuotas
    for (let i = 0; i < installments; i++) {
      fixedTermInvestment = (fixedTermInvestment - monthlyInstallment) * (1 + monthlyFixedTermRate);
    }
    
    // Sin retiros (inversión total)
    fixedTermWithdrawal = fixedTermWithdrawal * Math.pow(1 + monthlyFixedTermRate, installments);
    
    // Determinar recomendación
    const shouldPayInInstallments = totalAdjusted < Number(cashPrice);
    
    setResults({
      surchargeAmount,
      surchargePercentage,
      monthlyInstallment,
      totalAdjusted,
      installmentDetails,
      shouldPayInInstallments,
      savingsAmount: Number(cashPrice) - totalAdjusted,
      savingsPercentage: ((Number(cashPrice) - totalAdjusted) / Number(cashPrice)) * 100,
      fciInvestment,
      fciWithdrawal,
      fixedTermInvestment,
      fixedTermWithdrawal
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Calculadora: Cuotas vs Contado</CardTitle>
          <CardDescription>
            Analiza si conviene pagar en cuotas o al contado considerando la inflación
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="cash-price">Precio de contado</Label>
                <Input
                  id="cash-price"
                  type="number"
                  placeholder="Ej: 100000"
                  value={cashPrice}
                  onChange={(e) => setCashPrice(e.target.value ? Number(e.target.value) : '')}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="installments-price">Precio total en cuotas</Label>
                <Input
                  id="installments-price"
                  type="number"
                  placeholder="Ej: 120000"
                  value={totalInstallmentsPrice}
                  onChange={(e) => setTotalInstallmentsPrice(e.target.value ? Number(e.target.value) : '')}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="monthly-inflation">Inflación mensual estimada (%)</Label>
                <Input
                  id="monthly-inflation"
                  type="number"
                  placeholder="Ej: 6"
                  value={monthlyInflation}
                  onChange={(e) => setMonthlyInflation(Number(e.target.value))}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="installments-qty">Cantidad de cuotas</Label>
                <Input
                  id="installments-qty"
                  type="number"
                  placeholder="Ej: 12"
                  value={installments}
                  onChange={(e) => setInstallments(Number(e.target.value))}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="fci-rate">Rendimiento mensual FCI (%)</Label>
                <Input
                  id="fci-rate"
                  type="number"
                  step="0.1"
                  placeholder="Ej: 5.5"
                  value={fciRate}
                  onChange={(e) => setFciRate(Number(e.target.value))}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="fixed-term-rate">Rendimiento mensual Plazo Fijo (%)</Label>
                <Input
                  id="fixed-term-rate"
                  type="number"
                  step="0.1"
                  placeholder="Ej: 4.5"
                  value={fixedTermRate}
                  onChange={(e) => setFixedTermRate(Number(e.target.value))}
                />
              </div>
            </div>
            
            <div className="flex justify-center mt-6">
              <Button 
                onClick={calculateResults}
                disabled={!cashPrice || !totalInstallmentsPrice || !installments || !monthlyInflation}
              >
                Calcular
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {results && (
        <>
          <Card>
            <CardHeader>
              <CardTitle>Resultado del análisis</CardTitle>
              <CardDescription>
                Comparativa entre pago en cuotas y al contado
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="border rounded-lg p-4">
                    <h3 className="text-lg font-medium mb-4">Análisis de la financiación</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Precio de contado:</span>
                        <span className="font-medium">{formatCurrency(cashPrice as number, 'ARS')}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Precio total en cuotas:</span>
                        <span className="font-medium">{formatCurrency(totalInstallmentsPrice as number, 'ARS')}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Recargo nominal:</span>
                        <span className="font-medium">{formatCurrency(results.surchargeAmount, 'ARS')} ({results.surchargePercentage.toFixed(2)}%)</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Cuota mensual:</span>
                        <span className="font-medium">{formatCurrency(results.monthlyInstallment, 'ARS')}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Total ajustado por inflación:</span>
                        <span className="font-bold">{formatCurrency(results.totalAdjusted, 'ARS')}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="border rounded-lg p-4 bg-muted/10">
                    <h3 className="text-lg font-medium mb-4">Recomendación</h3>
                    <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
                      {results.shouldPayInInstallments ? (
                        <>
                          <div className="text-green-500 bg-green-100 dark:bg-green-900/30 rounded-full p-4">
                            <CheckCircle2 size={48} />
                          </div>
                          <h4 className="text-xl font-bold text-green-600 dark:text-green-400">
                            ¡Conviene pagar en CUOTAS!
                          </h4>
                          <p className="text-muted-foreground">
                            Ahorrarás aproximadamente {formatCurrency(results.savingsAmount, 'ARS')} ({results.savingsPercentage.toFixed(2)}%)
                          </p>
                        </>
                      ) : (
                        <>
                          <div className="text-red-500 bg-red-100 dark:bg-red-900/30 rounded-full p-4">
                            <XCircle size={48} />
                          </div>
                          <h4 className="text-xl font-bold text-red-600 dark:text-red-400">
                            Conviene pagar al CONTADO
                          </h4>
                          <p className="text-muted-foreground">
                            Pagarías {formatCurrency(Math.abs(results.savingsAmount), 'ARS')} más en cuotas ({Math.abs(results.savingsPercentage).toFixed(2)}%)
                          </p>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="border rounded-lg p-4">
                  <h3 className="text-lg font-medium mb-4">Simulación de inversiones alternativas</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <h4 className="font-medium">FCI ({fciRate}% mensual)</h4>
                      <div className="space-y-1">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Con retiros para pagar cuotas:</span>
                          <span className="font-medium">{formatCurrency(results.fciInvestment, 'ARS')}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Sin retiros (total):</span>
                          <span className="font-medium">{formatCurrency(results.fciWithdrawal, 'ARS')}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <h4 className="font-medium">Plazo Fijo ({fixedTermRate}% mensual)</h4>
                      <div className="space-y-1">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Con retiros para pagar cuotas:</span>
                          <span className="font-medium">{formatCurrency(results.fixedTermInvestment, 'ARS')}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Sin retiros (total):</span>
                          <span className="font-medium">{formatCurrency(results.fixedTermWithdrawal, 'ARS')}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="border rounded-lg p-4 overflow-x-auto">
                  <h3 className="text-lg font-medium mb-4">Detalle de cuotas ajustadas por inflación</h3>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Cuota</TableHead>
                        <TableHead>Valor nominal</TableHead>
                        <TableHead>Valor ajustado</TableHead>
                        <TableHead>Diferencia</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {results.installmentDetails.map((detail: any) => (
                        <TableRow key={detail.month}>
                          <TableCell>{detail.month}</TableCell>
                          <TableCell>{formatCurrency(detail.nominal, 'ARS')}</TableCell>
                          <TableCell>{formatCurrency(detail.adjusted, 'ARS')}</TableCell>
                          <TableCell className="flex items-center">
                            {detail.adjusted < detail.nominal ? (
                              <ArrowDown className="mr-1 h-4 w-4 text-green-500" />
                            ) : (
                              <ArrowUp className="mr-1 h-4 w-4 text-red-500" />
                            )}
                            {formatCurrency(Math.abs(detail.nominal - detail.adjusted), 'ARS')}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
