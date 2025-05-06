
import React from "react";
import { Button } from "@/components/ui/button";
import { SlidersHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

interface CryptoFiltersProps {
  availableCoins: string[];
  selectedCoin: string | null;
  sortBy: "buy" | "sell" | "spread";
  onCoinSelect: (coin: string | null) => void;
  onSortChange: (sort: "buy" | "sell" | "spread") => void;
}

export const CryptoFilters = ({
  availableCoins,
  selectedCoin,
  sortBy,
  onCoinSelect,
  onSortChange
}: CryptoFiltersProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-2">
          <SlidersHorizontal className="h-4 w-4" />
          Filtros
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Ordenar por</DropdownMenuLabel>
        <DropdownMenuItem onClick={() => onSortChange("buy")}>
          Mejor precio de compra
          {sortBy === "buy" && " ✓"}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onSortChange("sell")}>
          Mejor precio de venta
          {sortBy === "sell" && " ✓"}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onSortChange("spread")}>
          Menor spread
          {sortBy === "spread" && " ✓"}
        </DropdownMenuItem>
        
        <DropdownMenuLabel>Criptomoneda</DropdownMenuLabel>
        <DropdownMenuItem onClick={() => onCoinSelect(null)}>
          Todas
          {selectedCoin === null && " ✓"}
        </DropdownMenuItem>
        {availableCoins.map(coin => (
          <DropdownMenuItem key={coin} onClick={() => onCoinSelect(coin)}>
            {coin}
            {selectedCoin === coin && " ✓"}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
