
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ExternalLink } from "lucide-react";
import { InterestRate } from "@/types/interestRate";
import { fetchInterestRates, getBestRateByCurrency } from "@/services/interestRatesService";
import { formatTime } from "@/utils/formatUtils";
import { FilterSection } from "./interest-rates/FilterSection";
import { BestRatesSection } from "./interest-rates/BestRatesSection";
import { ARSRatesTable } from "./interest-rates/ARSRatesTable";
import { CryptoRatesTable } from "./interest-rates/CryptoRatesTable";

type InterestRatesComparisonProps = {
  currencyFilter?: "ARS" | "CRYPTO";
};

export function InterestRatesComparison({ currencyFilter = "ARS" }: InterestRatesComparisonProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  
  // Use react-query to fetch data
  const { data: rates, isLoading, isError, refetch } = useQuery({
    queryKey: ['interestRates'],
    queryFn: fetchInterestRates,
  });
  
  // Filter rates based on currency type (ARS or CRYPTO)
  const filteredByCurrencyType = rates?.filter(rate => {
    if (currencyFilter === "ARS") {
      return rate.currency === "ARS";
    } else {
      return rate.currency !== "ARS"; // All crypto currencies
    }
  }) || [];
  
  // Apply additional filters (search and type)
  const filteredRates = filteredByCurrencyType.filter(rate => {
    // Apply search filter
    const matchesSearch = rate.provider.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Apply type filter
    const matchesType = typeFilter === "all" || rate.type === typeFilter;
    
    return matchesSearch && matchesType;
  });
  
  // Group rates by currency (only relevant for CRYPTO filter)
  const ratesByCurrency = filteredRates.reduce((acc, rate) => {
    if (!acc[rate.currency]) {
      acc[rate.currency] = [];
    }
    acc[rate.currency].push(rate);
    return acc;
  }, {} as Record<string, InterestRate[]>);

  // Function to get the best rate for a currency
  const getBestRateForCurrency = (currency: string) => {
    return getBestRateByCurrency(rates || [], currency);
  };

  // Handle refresh
  const handleRefresh = () => {
    refetch();
  };

  return (
    <div className="space-y-6">
      <FilterSection 
        currencyFilter={currencyFilter}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        typeFilter={typeFilter}
        setTypeFilter={setTypeFilter}
        isLoading={isLoading}
        onRefresh={handleRefresh}
      />
      
      <BestRatesSection 
        rates={rates}
        isLoading={isLoading}
        isError={isError}
        currencyFilter={currencyFilter}
        getBestRateByCurrency={getBestRateForCurrency}
      />
      
      {currencyFilter === "ARS" ? (
        // ARS View - Show all providers in one table
        <ARSRatesTable rates={filteredRates} />
      ) : (
        // CRYPTO View - Group by currency
        <CryptoRatesTable currencyRates={Object.entries(ratesByCurrency)} />
      )}
      
      <div className="text-sm text-zinc-500 flex items-center justify-between">
        <div>
          Datos obtenidos de <a href="https://comparatasas.ar" target="_blank" rel="noopener noreferrer" className="underline underline-offset-4 inline-flex items-center gap-1">comparatasas.ar <ExternalLink className="h-3 w-3" /></a>
        </div>
        <div>
          Última actualización: {rates?.length ? formatTime(rates[0].lastUpdated) : "..."}
        </div>
      </div>
    </div>
  );
}
