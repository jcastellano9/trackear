
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { ExchangeRate } from "@/types/exchangeRate";

interface ExchangeRateTableProps {
  data: ExchangeRate[];
  loading: boolean;
  lastUpdated: Date;
}

export function ExchangeRateTable({ data, loading, lastUpdated }: ExchangeRateTableProps) {
  const formatCurrency = (amount: number | undefined) => {
    if (amount === undefined || isNaN(amount)) return "-";
    return `$${amount.toLocaleString('es-AR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };
  
  const formatPercentage = (value: number | undefined) => {
    if (value === undefined || isNaN(value)) return "0.00%";
    return `${Math.abs(value).toFixed(2)}%`;
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Tipo</TableHead>
            <TableHead className="text-right">Compra</TableHead>
            <TableHead className="text-right">Venta</TableHead>
            <TableHead className="text-right">Spread</TableHead>
            <TableHead className="text-right">Var. 24h</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            Array(4).fill(0).map((_, index) => (
              <TableRow key={index}>
                <TableCell><Skeleton className="h-6 w-24" /></TableCell>
                <TableCell><Skeleton className="h-6 w-20" /></TableCell>
                <TableCell><Skeleton className="h-6 w-20" /></TableCell>
                <TableCell><Skeleton className="h-6 w-20" /></TableCell>
                <TableCell><Skeleton className="h-6 w-20" /></TableCell>
              </TableRow>
            ))
          ) : data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                No hay cotizaciones disponibles
              </TableCell>
            </TableRow>
          ) : (
            data.map((rate, index) => {
              const spread = (rate.sell || 0) - (rate.buy || 0);
              const spreadPercentage = rate.buy ? (spread / rate.buy) * 100 : 0;
              
              return (
                <TableRow key={index} className={rate.reference ? "bg-muted/30" : ""}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <div className="bg-white/10 p-1 rounded-full flex items-center justify-center">
                        <img 
                          src={rate.logo} 
                          alt={rate.name}
                          className="h-6 w-6 object-contain"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = `https://ui-avatars.com/api/?name=${rate.name}&background=random`;
                          }}
                        />
                      </div>
                      <div>
                        <div>{rate.name}</div>
                        {rate.reference && (
                          <div className="text-xs text-muted-foreground">Referencia oficial</div>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    {formatCurrency(rate.buy)}
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    {formatCurrency(rate.sell)}
                  </TableCell>
                  <TableCell className="text-right text-muted-foreground">
                    {formatCurrency(spread)} ({spreadPercentage.toFixed(2)}%)
                  </TableCell>
                  <TableCell className="text-right">
                    <div className={`flex items-center justify-end gap-1 ${
                      (rate.change || 0) > 0 
                        ? "text-green-500" 
                        : (rate.change || 0) < 0 
                          ? "text-red-500" 
                          : "text-muted-foreground"
                    }`}>
                      {(rate.change || 0) > 0 ? (
                        <ArrowUpRight className="h-4 w-4" />
                      ) : (rate.change || 0) < 0 ? (
                        <ArrowDownRight className="h-4 w-4" />
                      ) : null}
                      <span>{formatPercentage(rate.change)}</span>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </div>
  );
}
