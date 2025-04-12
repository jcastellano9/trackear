
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
  notableCryptocurrencies?: string[];
};

export function BestRatesSection({ 
  rates, 
  isLoading, 
  isError, 
  currencyFilter,
  getBestRateByCurrency,
  notableCryptocurrencies = []
}: BestRatesSectionProps) {
  // Get relevant currencies based on filter
  const relevantCurrencies = currencyFilter === "ARS" 
    ? ["ARS"] 
    : notableCryptocurrencies.length > 0 
      ? notableCryptocurrencies 
      : ["USDT", "DAI", "USDC", "USD", "BTC", "ETH"];

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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
              <Skeleton key={i} className="h-36 w-full" />
            ))}
          </div>
        ) : isError ? (
          <div className="text-center py-6 text-destructive">
            Error al cargar datos. Intente nuevamente.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {relevantCurrencies.map(currency => {
              const bestRate = getBestRateByCurrency(currency);
              if (!bestRate) return null;
              
              let logoUrl = bestRate.logo;
              if (!logoUrl) {
                // Default logos based on currency
                if (currency === "BTC") logoUrl = "https://cryptologos.cc/logos/bitcoin-btc-logo.png";
                else if (currency === "ETH") logoUrl = "https://cryptologos.cc/logos/ethereum-eth-logo.png";
                else if (currency === "USDT") logoUrl = "https://cryptologos.cc/logos/tether-usdt-logo.png";
                else if (currency === "DAI") logoUrl = "https://cryptologos.cc/logos/multi-collateral-dai-dai-logo.png";
                else if (currency === "USDC") logoUrl = "https://cryptologos.cc/logos/usd-coin-usdc-logo.png";
                else if (currency === "SOL") logoUrl = "https://cryptologos.cc/logos/solana-sol-logo.png";
                else if (currency === "BNB") logoUrl = "https://cryptologos.cc/logos/bnb-bnb-logo.png";
                else if (currency === "DOT") logoUrl = "https://cryptologos.cc/logos/polkadot-new-dot-logo.png";
                else if (currency === "ADA") logoUrl = "https://cryptologos.cc/logos/cardano-ada-logo.png";
                else if (currency === "TRX") logoUrl = "https://cryptologos.cc/logos/tron-trx-logo.png";
                else if (currency === "AVAX") logoUrl = "https://cryptologos.cc/logos/avalanche-avax-logo.png";
              }
              
              let currencyName = "";
              if (currency === "ARS") currencyName = "Pesos Argentinos";
              else if (currency === "BTC") currencyName = "Bitcoin";
              else if (currency === "ETH") currencyName = "Ethereum";
              else if (currency === "USDT") currencyName = "Tether";
              else if (currency === "DAI") currencyName = "DAI";
              else if (currency === "USDC") currencyName = "USD Coin";
              else if (currency === "SOL") currencyName = "Solana";
              else if (currency === "BNB") currencyName = "BNB";
              else if (currency === "DOT") currencyName = "Polkadot";
              else if (currency === "ADA") currencyName = "Cardano";
              else if (currency === "TRX") currencyName = "Tron";
              else if (currency === "AVAX") currencyName = "Avalanche";
              else currencyName = currency;
              
              return (
                <div key={currency} className="bg-zinc-800/50 p-4 rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <Badge variant="secondary">{currency}</Badge>
                    <div className="text-2xl font-bold flex items-center gap-1">
                      {formatPercentage(bestRate.annualRate)}
                      <TrendingUp className="h-4 w-4 text-green-500" />
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {logoUrl && (
                      <img 
                        src={logoUrl} 
                        alt={currencyName} 
                        className="h-6 w-6 object-contain rounded-full" 
                      />
                    )}
                    <div className="text-sm">{currencyName}</div>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    {bestRate.logo && (
                      <img 
                        src={bestRate.logo} 
                        alt={bestRate.provider} 
                        className="h-6 w-6 object-contain rounded-full" 
                      />
                    )}
                    <div className="text-lg font-semibold">{bestRate.provider}</div>
                  </div>
                  <div className="text-sm text-zinc-400 mt-1">
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
