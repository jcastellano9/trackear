
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { formatCurrency } from "@/utils/formatUtils";
import { InvestmentType } from "@/lib/supabase";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";

interface InvestmentSummaryTableProps {
  investments: InvestmentType[];
}

export function InvestmentSummaryTable({ investments }: InvestmentSummaryTableProps) {
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
    const initialValue = items.reduce((sum, item) => sum + (item.precio_compra * item.cantidad), 0);
    
    // In a real app, we would calculate the current value based on market prices
    // For now, we'll use a mock calculation (random +/- 20%)
    const currentValue = items.reduce((sum, item) => {
      const priceChange = item.precio_compra * (1 + (Math.random() * 0.4 - 0.2));
      return sum + (priceChange * item.cantidad);
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
      mainCurrency: items[0]?.moneda || "USD", // Use the first item's currency as reference
    };
  });
  
  return (
    <Card className="overflow-hidden">
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
              <TableCell className="text-right">{formatCurrency(item.initialValue, item.mainCurrency)}</TableCell>
              <TableCell className="text-right">{formatCurrency(item.currentValue, item.mainCurrency)}</TableCell>
              <TableCell className="text-right">
                <div className={`flex items-center justify-end ${item.netReturn >= 0 ? "text-green-500" : "text-red-500"}`}>
                  {item.netReturn >= 0 ? (
                    <ArrowUpRight className="h-4 w-4 mr-1" />
                  ) : (
                    <ArrowDownRight className="h-4 w-4 mr-1" />
                  )}
                  {formatCurrency(item.netReturn, item.mainCurrency)}
                </div>
              </TableCell>
              <TableCell className={`text-right ${item.netReturn >= 0 ? "text-green-500" : "text-red-500"}`}>
                {item.percentReturn.toFixed(2)}%
              </TableCell>
            </TableRow>
          ))}
          {summary.length > 1 && (
            <TableRow className="font-bold bg-muted/50">
              <TableCell>Total</TableCell>
              <TableCell>{investments.length}</TableCell>
              <TableCell className="text-right">
                {formatCurrency(
                  summary.reduce((sum, item) => sum + item.initialValue, 0),
                  "USD"
                )}
              </TableCell>
              <TableCell className="text-right">
                {formatCurrency(
                  summary.reduce((sum, item) => sum + item.currentValue, 0),
                  "USD"
                )}
              </TableCell>
              <TableCell className="text-right">
                <div className={`flex items-center justify-end ${
                  summary.reduce((sum, item) => sum + item.netReturn, 0) >= 0 
                  ? "text-green-500" 
                  : "text-red-500"
                }`}>
                  {summary.reduce((sum, item) => sum + item.netReturn, 0) >= 0 ? (
                    <ArrowUpRight className="h-4 w-4 mr-1" />
                  ) : (
                    <ArrowDownRight className="h-4 w-4 mr-1" />
                  )}
                  {formatCurrency(
                    summary.reduce((sum, item) => sum + item.netReturn, 0),
                    "USD"
                  )}
                </div>
              </TableCell>
              <TableCell className={`text-right ${
                summary.reduce((sum, item) => sum + item.netReturn, 0) >= 0 
                ? "text-green-500" 
                : "text-red-500"
              }`}>
                {(summary.reduce((sum, item) => sum + item.netReturn, 0) / 
                 summary.reduce((sum, item) => sum + item.initialValue, 0) * 100).toFixed(2)}%
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </Card>
  );
}
