
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CryptoFilters } from "./crypto/CryptoFilters";
import { CryptoTable } from "./crypto/CryptoTable";
import { useCryptoPrices } from "@/hooks/useCryptoPrices";

export function CryptoPrices() {
  const {
    cryptoRates,
    loading,
    lastUpdated,
    selectedCoin,
    setSelectedCoin,
    sortBy,
    setSortBy,
    availableCoins,
    refreshData
  } = useCryptoPrices();

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <CardTitle className="text-xl">Precios de Criptomonedas</CardTitle>
          <CardDescription>
            {lastUpdated
              ? `Última actualización: ${lastUpdated.toLocaleTimeString('es-AR')}`
              : "Cargando datos de mercado..."
            }
          </CardDescription>
        </div>
        <div className="flex items-center gap-2">
          <CryptoFilters
            availableCoins={availableCoins}
            selectedCoin={selectedCoin}
            sortBy={sortBy}
            onCoinSelect={setSelectedCoin}
            onSortChange={setSortBy}
          />
          
          <Button
            variant="ghost"
            size="icon"
            onClick={refreshData}
            disabled={loading}
          >
            <RefreshCw
              className={`h-4 w-4 ${loading ? "animate-spin" : ""}`}
            />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <CryptoTable rates={cryptoRates} loading={loading} />
      </CardContent>
    </Card>
  );
}
