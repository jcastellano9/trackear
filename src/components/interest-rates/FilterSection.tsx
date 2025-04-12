
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, RefreshCw } from "lucide-react";

type FilterSectionProps = {
  currencyFilter: "ARS" | "CRYPTO";
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  typeFilter: string;
  setTypeFilter: (value: string) => void;
  currencySubFilter?: string;
  setCurrencySubFilter?: (value: string) => void;
  isLoading: boolean;
  onRefresh: () => void;
  availableCurrencies?: string[];
};

export function FilterSection({
  currencyFilter,
  searchTerm,
  setSearchTerm,
  typeFilter,
  setTypeFilter,
  currencySubFilter = "all",
  setCurrencySubFilter,
  isLoading,
  onRefresh,
  availableCurrencies = []
}: FilterSectionProps) {
  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-semibold">
            {currencyFilter === "ARS" 
              ? "Comparador de Rendimientos en Pesos" 
              : "Comparador de Rendimientos en Crypto"}
          </h2>
          <p className="text-muted-foreground">
            {currencyFilter === "ARS" 
              ? "Compará tasas de interés en pesos de diferentes entidades financieras" 
              : "Compará rendimientos de staking y ahorro en criptomonedas"}
          </p>
        </div>
        
        <div className="w-full md:w-auto flex items-center gap-2">
          <div className="relative w-full md:w-auto">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar proveedor..."
              className="pl-8 w-full dark:bg-zinc-900"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <button 
            onClick={onRefresh} 
            className="p-2 rounded-md hover:bg-secondary transition-colors"
            aria-label="Actualizar datos"
          >
            <RefreshCw className={`h-5 w-5 ${isLoading ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>
      
      {currencyFilter === "CRYPTO" && setCurrencySubFilter && (
        <div className="flex flex-wrap gap-2">
          <Badge 
            variant={currencySubFilter === "all" ? "default" : "outline"}
            className="cursor-pointer"
            onClick={() => setCurrencySubFilter("all")}
          >
            Todas las crypto
          </Badge>
          {availableCurrencies.map(currency => (
            <Badge 
              key={currency}
              variant={currencySubFilter === currency ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => setCurrencySubFilter(currency)}
            >
              {currency}
            </Badge>
          ))}
        </div>
      )}
      
      <div className="flex flex-wrap gap-2">
        <Badge 
          variant={typeFilter === "all" ? "default" : "outline"} 
          className="cursor-pointer"
          onClick={() => setTypeFilter("all")}
        >
          Todos los tipos
        </Badge>
        <Badge 
          variant={typeFilter === "wallet" ? "default" : "outline"} 
          className="cursor-pointer"
          onClick={() => setTypeFilter("wallet")}
        >
          {currencyFilter === "ARS" ? "Billeteras" : "Plataformas"}
        </Badge>
        {currencyFilter === "ARS" && (
          <>
            <Badge 
              variant={typeFilter === "fixed" ? "default" : "outline"} 
              className="cursor-pointer"
              onClick={() => setTypeFilter("fixed")}
            >
              Plazos Fijos
            </Badge>
            <Badge 
              variant={typeFilter === "bank" ? "default" : "outline"} 
              className="cursor-pointer"
              onClick={() => setTypeFilter("bank")}
            >
              Bancos
            </Badge>
            <Badge 
              variant={typeFilter === "fund" ? "default" : "outline"} 
              className="cursor-pointer"
              onClick={() => setTypeFilter("fund")}
            >
              Fondos
            </Badge>
          </>
        )}
      </div>
    </div>
  );
}
