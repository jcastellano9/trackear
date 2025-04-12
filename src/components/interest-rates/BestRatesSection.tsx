
import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp } from "lucide-react";
import { InterestRate } from "@/types/interestRate";
import { formatPercentage, formatCurrency } from "@/utils/formatUtils";

type BestRatesSectionProps = {
  rates: InterestRate[] | undefined;
  isLoading: boolean;
  isError: boolean;
  currencyFilter: "ARS" | "CRYPTO";
  getBestRateByCurrency: (currency: string) => InterestRate | null;
};

export function BestRatesSection({ 
  rates, 
  isLoading, 
  isError, 
  currencyFilter,
  getBestRateByCurrency
}: BestRatesSectionProps) {
  // Get relevant currencies based on filter
  const relevantCurrencies = currencyFilter === "ARS" 
    ? ["ARS"] 
    : ["USDT", "DAI", "USDC", "USD"];

  return (
    <Card className="dark:bg-zinc-900 border-zinc-800">
      <CardHeader className="pb-2">
        <CardTitle>Mejores Rendimientos</CardTitle>
        <CardDescription>
          {currencyFilter === "ARS" 
            ? "Las mejores opciones en pesos" 
            : "Las mejores opciones por cada criptomoneda"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5].map(i => (
              <Skeleton key={i} className="h-36 w-full" />
            ))}
          </div>
        ) : isError ? (
          <div className="text-center py-6 text-destructive">
            Error al cargar datos. Intente nuevamente.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {relevantCurrencies.map(currency => {
              const bestRate = getBestRateByCurrency(currency);
              if (!bestRate) return null;
              
              return (
                <div key={currency} className="bg-zinc-800/50 p-4 rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <Badge>{currency}</Badge>
                    <div className="text-2xl font-bold flex items-center gap-1">
                      {formatPercentage(bestRate.annualRate)}
                      <TrendingUp className="h-4 w-4 text-green-500" />
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {bestRate.logo && (
                      <img 
                        src={bestRate.logo} 
                        alt={bestRate.provider} 
                        className="h-6 w-6 object-contain rounded-full" 
                      />
                    )}
                    <div className="text-lg font-semibold">{bestRate.provider}</div>
                  </div>
                  <div className="text-sm text-zinc-400">
                    {bestRate.type === "wallet" ? (currencyFilter === "ARS" ? "Billetera Virtual" : "Plataforma Crypto") : ""}
                    {bestRate.type === "fixed" ? "Plazo Fijo" : ""}
                    {bestRate.type === "bank" ? "Cuenta Bancaria" : ""}
                    {bestRate.type === "fund" ? "Fondo de Inversión" : ""}
                  </div>
                  <div className="text-sm mt-2">
                    {bestRate.minAmount 
                      ? `Mínimo: ${formatCurrency(bestRate.minAmount, bestRate.currency)}`
                      : "Sin monto mínimo"}
                  </div>
                  <div className="text-sm">
                    {bestRate.term
                      ? `Plazo: ${bestRate.term} días`
                      : "Disponibilidad inmediata"}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
