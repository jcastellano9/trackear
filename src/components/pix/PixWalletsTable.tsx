
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { PixWallet } from "@/types/pixWallet";
import { calculateFinalAmount, getBestWallet } from "@/services/pixService";
import { formatCurrency, formatPercentage, formatTime } from "@/utils/formatUtils";

interface PixWalletsTableProps {
  pixWallets: PixWallet[] | undefined;
  filteredWallets: PixWallet[];
  isLoading: boolean;
  isError: boolean;
  amount: number;
}

export function PixWalletsTable({ 
  pixWallets, 
  filteredWallets, 
  isLoading, 
  isError, 
  amount 
}: PixWalletsTableProps) {
  return (
    <div>
      {isLoading ? (
        <div className="space-y-6">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-24 w-full" />
          ))}
        </div>
      ) : isError ? (
        <div className="text-center py-6 text-destructive">
          Error al cargar datos. Intente nuevamente.
        </div>
      ) : filteredWallets.length === 0 ? (
        <div className="text-center py-6 text-muted-foreground">
          No se encontraron proveedores que coincidan con la búsqueda.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Proveedor</TableHead>
                <TableHead className="text-center">Tipo de Cambio</TableHead>
                <TableHead className="text-center">Comisión</TableHead>
                <TableHead className="text-center">Monto Mínimo</TableHead>
                <TableHead className="text-center">Monto Máximo</TableHead>
                <TableHead className="text-center">Ejemplo</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredWallets
                .sort((a, b) => calculateFinalAmount(b, amount) - calculateFinalAmount(a, amount))
                .map((wallet) => {
                  const isBest = getBestWallet(pixWallets || [], amount)?.name === wallet.name;
                  return (
                    <TableRow 
                      key={wallet.name} 
                      className={isBest ? 'bg-zinc-800/30' : ''}
                    >
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {wallet.logo && (
                            <img 
                              src={wallet.logo} 
                              alt={`${wallet.name} logo`} 
                              className="h-8 w-8 object-contain" 
                            />
                          )}
                          <div>
                            <div className="font-medium flex items-center gap-1">
                              {wallet.name}
                              {isBest && <Badge className="text-xs bg-green-600 hover:bg-green-700">Mejor</Badge>}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              actualizado {formatTime(wallet.lastUpdated)}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="font-medium">1 ARS = {wallet.exchangeRate.toFixed(2)} BRL</div>
                      </TableCell>
                      <TableCell className="text-center">
                        {formatPercentage(wallet.fee)}
                      </TableCell>
                      <TableCell className="text-center">
                        {formatCurrency(wallet.minimumAmount, "ARS")}
                      </TableCell>
                      <TableCell className="text-center">
                        {wallet.maximumAmount 
                          ? formatCurrency(wallet.maximumAmount, "ARS") 
                          : "Sin límite"}
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="font-semibold">
                          {amount >= wallet.minimumAmount && 
                           (!wallet.maximumAmount || amount <= wallet.maximumAmount)
                            ? formatCurrency(calculateFinalAmount(wallet, amount), "BRL")
                            : "No disponible"}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          para {formatCurrency(amount, "ARS")}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
