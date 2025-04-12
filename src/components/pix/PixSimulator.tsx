
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { PixWallet } from "@/types/pixWallet";
import { calculateFinalAmount, getBestWallet } from "@/services/pixService";
import { formatCurrency } from "@/utils/formatUtils";

interface PixSimulatorProps {
  pixWallets: PixWallet[] | undefined;
  isLoading: boolean;
  isError: boolean;
  amount: number;
  setAmount: (amount: number) => void;
}

// Helper component for the Label
const Label = ({ htmlFor, children }: { htmlFor: string, children: React.ReactNode }) => (
  <label 
    htmlFor={htmlFor} 
    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
  >
    {children}
  </label>
);

export function PixSimulator({ pixWallets, isLoading, isError, amount, setAmount }: PixSimulatorProps) {
  const bestWallet = getBestWallet(pixWallets || [], amount);

  return (
    <Card className="dark:bg-zinc-900 border-zinc-800">
      <CardHeader className="pb-2">
        <CardTitle>Simulador de Envío</CardTitle>
        <CardDescription>
          Calculá cuánto recibirá en BRL tu destinatario en Brasil
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div>
            <Label htmlFor="amount">Monto a enviar (ARS)</Label>
            <Input
              id="amount"
              type="number"
              min="500"
              max="500000"
              value={amount}
              onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
              className="mt-1 dark:bg-zinc-950"
            />
          </div>
          
          {isLoading ? (
            <Skeleton className="h-36 w-full" />
          ) : isError ? (
            <div className="text-center py-6 text-destructive">
              Error al cargar datos. Intente nuevamente.
            </div>
          ) : bestWallet ? (
            <div className="bg-zinc-800/50 p-4 rounded-lg">
              <div className="text-sm text-muted-foreground mb-1">
                Mejor opción para {formatCurrency(amount, "ARS")}
              </div>
              <div className="flex justify-between items-center mb-3">
                <div className="flex items-center gap-2">
                  {bestWallet.logo && (
                    <img 
                      src={bestWallet.logo} 
                      alt={bestWallet.name || "Logo"} 
                      className="h-8 w-8 object-contain" 
                    />
                  )}
                  <div className="text-xl font-semibold">{bestWallet.name}</div>
                </div>
                <Badge className="bg-green-600 hover:bg-green-700">Recomendado</Badge>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <div className="text-sm text-muted-foreground">Tipo de cambio</div>
                  <div className="font-medium">1 ARS = {bestWallet.exchangeRate.toFixed(2)} BRL</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Comisión</div>
                  <div className="font-medium">{bestWallet.fee.toFixed(2)}%</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Monto que recibirá</div>
                  <div className="font-bold text-lg text-green-500">
                    {formatCurrency(calculateFinalAmount(bestWallet, amount), "BRL")}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-6 text-muted-foreground">
              No hay proveedores disponibles para este monto.
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
