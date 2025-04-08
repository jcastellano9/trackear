
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUp, ArrowDown, Edit, Trash2 } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";

// Esta sería una llamada a la API en una versión real
const getMockInvestments = (filter: string) => {
  const allInvestments = [
    {
      id: "1",
      type: "crypto",
      name: "Bitcoin",
      symbol: "BTC",
      quantity: 0.05,
      purchasePrice: 29500,
      currentPrice: 34200,
      purchaseDate: "2023-06-15",
      currentValue: 1710,
      purchaseValue: 1475,
      profit: 235,
      profitPercentage: 15.93
    },
    {
      id: "2",
      type: "crypto",
      name: "Ethereum",
      symbol: "ETH",
      quantity: 1.2,
      purchasePrice: 1850,
      currentPrice: 1920,
      purchaseDate: "2023-08-10",
      currentValue: 2304,
      purchaseValue: 2220,
      profit: 84,
      profitPercentage: 3.78
    },
    {
      id: "3",
      type: "cedears",
      name: "Apple Inc.",
      symbol: "AAPL",
      quantity: 5,
      purchasePrice: 172.5,
      currentPrice: 188.7,
      purchaseDate: "2023-05-22",
      currentValue: 943.5,
      purchaseValue: 862.5,
      profit: 81,
      profitPercentage: 9.39
    },
    {
      id: "4",
      type: "fixed",
      name: "Plazo Fijo Banco Provincia",
      symbol: "PF-BAPRO",
      quantity: 1,
      purchasePrice: 100000,
      currentPrice: 109730,
      purchaseDate: "2023-09-01",
      currentValue: 109730,
      purchaseValue: 100000,
      profit: 9730,
      profitPercentage: 9.73
    },
    {
      id: "5",
      type: "wallets",
      name: "Mercado Pago",
      symbol: "MP",
      quantity: 1,
      purchasePrice: 50000,
      currentPrice: 52250,
      purchaseDate: "2023-10-01",
      currentValue: 52250,
      purchaseValue: 50000,
      profit: 2250,
      profitPercentage: 4.5
    }
  ];

  if (filter === "all") return allInvestments;
  return allInvestments.filter(inv => inv.type === filter);
};

type InvestmentsListProps = {
  filter: "all" | "crypto" | "cedears" | "fixed" | "wallets";
};

export function InvestmentsList({ filter }: InvestmentsListProps) {
  const investments = getMockInvestments(filter);
  
  // Calcular totales
  const totalCurrentValue = investments.reduce((sum, inv) => sum + inv.currentValue, 0);
  const totalPurchaseValue = investments.reduce((sum, inv) => sum + inv.purchaseValue, 0);
  const totalProfit = totalCurrentValue - totalPurchaseValue;
  const totalProfitPercentage = (totalProfit / totalPurchaseValue) * 100;
  
  if (investments.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-center text-muted-foreground">No hay inversiones para mostrar en esta categoría.</p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Resumen</CardTitle>
          <CardDescription>Valor total y rendimiento de tus inversiones</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg">
              <p className="text-sm text-muted-foreground">Valor actual</p>
              <p className="text-2xl font-bold">${totalCurrentValue.toLocaleString('es-AR')}</p>
            </div>
            <div className="p-4 border rounded-lg">
              <p className="text-sm text-muted-foreground">Inversión inicial</p>
              <p className="text-2xl font-bold">${totalPurchaseValue.toLocaleString('es-AR')}</p>
            </div>
            <div className="p-4 border rounded-lg">
              <p className="text-sm text-muted-foreground">Rendimiento</p>
              <div className="flex items-center gap-2">
                <p className="text-2xl font-bold">
                  ${totalProfit.toLocaleString('es-AR')}
                </p>
                <Badge variant={totalProfit >= 0 ? "default" : "destructive"} className="flex items-center">
                  {totalProfit >= 0 ? <ArrowUp className="mr-1 h-3 w-3" /> : <ArrowDown className="mr-1 h-3 w-3" />}
                  {Math.abs(totalProfitPercentage).toFixed(2)}%
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Detalle de inversiones</CardTitle>
          <CardDescription>Visualización detallada de cada inversión</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Activo</TableHead>
                <TableHead>Cantidad</TableHead>
                <TableHead>Precio compra</TableHead>
                <TableHead>Precio actual</TableHead>
                <TableHead>Valor actual</TableHead>
                <TableHead>Rendimiento</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {investments.map((investment) => (
                <TableRow key={investment.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{investment.name}</p>
                      <p className="text-xs text-muted-foreground">{investment.symbol}</p>
                    </div>
                  </TableCell>
                  <TableCell>{investment.quantity}</TableCell>
                  <TableCell>${investment.purchasePrice.toLocaleString('es-AR')}</TableCell>
                  <TableCell>${investment.currentPrice.toLocaleString('es-AR')}</TableCell>
                  <TableCell>${investment.currentValue.toLocaleString('es-AR')}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className={investment.profit >= 0 ? "text-green-500" : "text-red-500"}>
                        ${investment.profit.toLocaleString('es-AR')}
                      </span>
                      <Badge variant={investment.profit >= 0 ? "default" : "destructive"} className="flex items-center">
                        {investment.profit >= 0 ? <ArrowUp className="mr-1 h-3 w-3" /> : <ArrowDown className="mr-1 h-3 w-3" />}
                        {Math.abs(investment.profitPercentage).toFixed(2)}%
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="icon">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="icon">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
