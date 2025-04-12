
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ExternalLink } from "lucide-react";
import { InterestRate } from "@/types/interestRate";
import { 
  fetchInterestRates, 
  getBestRateByCurrency, 
  filterRatesByCurrencyType, 
  getNotableCryptocurrencies 
} from "@/services/interestRatesService";
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
  const [currencySubFilter, setCurrencySubFilter] = useState<string>("all");
  
  // Use react-query to fetch data
  const { data: rates, isLoading, isError, refetch } = useQuery({
    queryKey: ['interestRates'],
    queryFn: fetchInterestRates,
  });
  
  // Filter rates based on currency type (ARS or CRYPTO)
  const filteredByCurrencyType = filterRatesByCurrencyType(rates || [], currencyFilter);
  
  // Apply additional filters (search, type, and currency)
  const filteredRates = filteredByCurrencyType.filter(rate => {
    // Apply search filter
    const matchesSearch = rate.provider.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Apply type filter
    const matchesType = typeFilter === "all" || rate.type === typeFilter;
    
    // Apply currency subfilter (only for CRYPTO)
    const matchesCurrency = currencyFilter === "ARS" || 
                           currencySubFilter === "all" || 
                           rate.currency === currencySubFilter;
    
    return matchesSearch && matchesType && matchesCurrency;
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

  // Get notable cryptocurrencies for displaying
  const notableCryptocurrencies = getNotableCryptocurrencies();

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
        currencySubFilter={currencySubFilter}
        setCurrencySubFilter={setCurrencySubFilter}
        isLoading={isLoading}
        onRefresh={handleRefresh}
        availableCurrencies={Object.keys(ratesByCurrency)}
      />
      
      <BestRatesSection 
        rates={rates}
        isLoading={isLoading}
        isError={isError}
        currencyFilter={currencyFilter}
        getBestRateByCurrency={getBestRateForCurrency}
        notableCryptocurrencies={currencyFilter === "CRYPTO" ? notableCryptocurrencies : ["ARS"]}
      />
      
      {currencyFilter === "ARS" ? (
        // ARS View - Show all providers in one table
        <ARSRatesTable rates={filteredRates} />
      ) : (
        // CRYPTO View - Group by currency
        <CryptoRatesTable 
          currencyRates={
            currencySubFilter === "all" 
              ? Object.entries(ratesByCurrency) 
              : Object.entries(ratesByCurrency).filter(([currency]) => currency === currencySubFilter)
          } 
        />
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
