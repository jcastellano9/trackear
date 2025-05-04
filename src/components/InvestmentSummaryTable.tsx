
import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/utils/formatUtils";
import { InvestmentType } from "@/lib/supabase";
import { ArrowUpRight, ArrowDownRight, DollarSign } from "lucide-react";

interface InvestmentSummaryTableProps {
  investments: InvestmentType[];
  cclRate: number;
}

export function InvestmentSummaryTable({ investments, cclRate }: InvestmentSummaryTableProps) {
  const [displayCurrency, setDisplayCurrency] = useState<"USD" | "ARS">("USD");
  
  // Toggle currency display
  const toggleCurrency = () => {
    setDisplayCurrency(prev => prev === "USD" ? "ARS" : "USD");
  };

  // Convert currency based on display preference
  const convertCurrency = (value: number, originalCurrency: "USD" | "ARS") => {
    if (displayCurrency === originalCurrency) return value;
    
    // Convert from USD to ARS
    if (originalCurrency === "USD" && displayCurrency === "ARS") {
      return value * cclRate;
    }
    
    // Convert from ARS to USD
    if (originalCurrency === "ARS" && displayCurrency === "USD") {
      return value / cclRate;
    }
    
    return value;
  };
  
  // Group investments by type
  const grouped = investments.reduce((acc, investment) => {
    const type = investment.tipo;
    if (!acc[type]) {
      acc[type] = [];
    }
    acc[type].push(investment);
    return acc;
  }, {} as Record<string, InvestmentType[]>);
  
  // Calculate totals for each type
  const summary = Object.entries(grouped).map(([type, items]) => {
    const initialValueByOriginalCurrency = items.reduce((acc, item) => {
      const currency = item.moneda as "USD" | "ARS";
      if (!acc[currency]) acc[currency] = 0;
      acc[currency] += item.precio_compra * item.cantidad;
      return acc;
    }, {} as Record<"USD" | "ARS", number>);
    
    // Calculate initial value in the display currency
    const initialValue = Object.entries(initialValueByOriginalCurrency).reduce((total, [currency, value]) => {
      return total + convertCurrency(value, currency as "USD" | "ARS");
    }, 0);
    
    // In a real app, we would calculate the current value based on market prices
    // For now, we'll use a mock calculation (random +/- 20%)
    const currentValueByOriginalCurrency = items.reduce((acc, item) => {
      const currency = item.moneda as "USD" | "ARS";
      if (!acc[currency]) acc[currency] = 0;
      
      const priceChange = item.precio_compra * (1 + (Math.random() * 0.4 - 0.2));
      acc[currency] += priceChange * item.cantidad;
      
      return acc;
    }, {} as Record<"USD" | "ARS", number>);
    
    // Calculate current value in the display currency
    const currentValue = Object.entries(currentValueByOriginalCurrency).reduce((total, [currency, value]) => {
      return total + convertCurrency(value, currency as "USD" | "ARS");
    }, 0);
    
    const netReturn = currentValue - initialValue;
    const percentReturn = (netReturn / initialValue) * 100;
    
    return {
      type,
      count: items.length,
      totalQuantity: items.reduce((sum, item) => sum + item.cantidad, 0),
      initialValue,
      currentValue,
      netReturn,
      percentReturn,
    };
  });
  
  // Calculate overall totals
  const totalInitialValue = summary.reduce((sum, item) => sum + item.initialValue, 0);
  const totalCurrentValue = summary.reduce((sum, item) => sum + item.currentValue, 0);
  const totalNetReturn = totalCurrentValue - totalInitialValue;
  const totalPercentReturn = totalInitialValue > 0 ? (totalNetReturn / totalInitialValue * 100) : 0;
  
  return (
    <Card className="overflow-hidden">
      <div className="p-4 flex justify-between items-center">
        <h3 className="text-lg font-medium">Resumen de inversiones</h3>
        <Button onClick={toggleCurrency} variant="outline" size="sm" className="flex items-center gap-1">
          <DollarSign className="h-3.5 w-3.5" />
          Mostrar en {displayCurrency === "USD" ? "ARS" : "USD"}
        </Button>
      </div>
      
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Tipo de Activo</TableHead>
            <TableHead>Cantidad de Activos</TableHead>
            <TableHead className="text-right">Valor Inicial</TableHead>
            <TableHead className="text-right">Valor Actual</TableHead>
            <TableHead className="text-right">Rendimiento</TableHead>
            <TableHead className="text-right">%</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {summary.map((item) => (
            <TableRow key={item.type}>
              <TableCell className="font-medium">
                {item.type === "cripto" ? "Criptomonedas" : "CEDEARs"}
              </TableCell>
              <TableCell>{item.count} ({item.totalQuantity.toFixed(2)})</TableCell>
              <TableCell className="text-right">{formatCurrency(item.initialValue, displayCurrency)}</TableCell>
              <TableCell className="text-right">{formatCurrency(item.currentValue, displayCurrency)}</TableCell>
              <TableCell className="text-right">
                <div className={`flex items-center justify-end ${item.netReturn >= 0 ? "text-green-500" : "text-red-500"}`}>
                  {item.netReturn >= 0 ? (
                    <ArrowUpRight className="h-4 w-4 mr-1" />
                  ) : (
                    <ArrowDownRight className="h-4 w-4 mr-1" />
                  )}
                  {formatCurrency(item.netReturn, displayCurrency)}
                </div>
              </TableCell>
              <TableCell className={`text-right ${item.netReturn >= 0 ? "text-green-500" : "text-red-500"}`}>
                {item.percentReturn.toFixed(2)}%
              </TableCell>
            </TableRow>
          ))}
          {summary.length > 0 && (
            <TableRow className="font-bold bg-muted/50">
              <TableCell>Total</TableCell>
              <TableCell>{investments.length}</TableCell>
              <TableCell className="text-right">
                {formatCurrency(totalInitialValue, displayCurrency)}
              </TableCell>
              <TableCell className="text-right">
                {formatCurrency(totalCurrentValue, displayCurrency)}
              </TableCell>
              <TableCell className="text-right">
                <div className={`flex items-center justify-end ${
                  totalNetReturn >= 0 
                  ? "text-green-500" 
                  : "text-red-500"
                }`}>
                  {totalNetReturn >= 0 ? (
                    <ArrowUpRight className="h-4 w-4 mr-1" />
                  ) : (
                    <ArrowDownRight className="h-4 w-4 mr-1" />
                  )}
                  {formatCurrency(totalNetReturn, displayCurrency)}
                </div>
              </TableCell>
              <TableCell className={`text-right ${
                totalNetReturn >= 0 
                ? "text-green-500" 
                : "text-red-500"
              }`}>
                {totalPercentReturn.toFixed(2)}%
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </Card>
  );
}
