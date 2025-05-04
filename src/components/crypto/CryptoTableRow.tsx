
import React from "react";
import { TableRow, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ArrowUp, ArrowDown } from "lucide-react";
import { formatCurrency, formatLargeNumber } from "@/utils/cryptoFormatters";
import type { CryptoPrice } from "@/services/cryptoPriceService";

interface CryptoTableRowProps {
  crypto: CryptoPrice;
}

export const CryptoTableRow = ({ crypto }: CryptoTableRowProps) => {
  // Format price based on asset type (BTC and ETH in USD)
  const formatPrice = (price: number, symbol: string) => {
    if (symbol === "BTC" || symbol === "ETH") {
      return `US${formatCurrency(price)}`;
    }
    return formatCurrency(price);
  };

  return (
    <TableRow>
      <TableCell>
        <div className="flex items-center gap-2">
          <img 
            src={crypto.logo} 
            alt={`${crypto.name} logo`}
            className="h-6 w-6 object-contain"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = `https://ui-avatars.com/api/?name=${crypto.symbol}&background=random`;
            }}
          />
          <div>
            <div className="font-medium">{crypto.name}</div>
            <div className="text-xs text-muted-foreground">{crypto.symbol}</div>
          </div>
        </div>
      </TableCell>
      <TableCell className="font-medium">
        {formatPrice(crypto.currentPrice, crypto.symbol)}
      </TableCell>
      <TableCell>
        <Badge variant={crypto.priceChangePercentage24h >= 0 ? "default" : "destructive"}>
          {crypto.priceChangePercentage24h >= 0 ? (
            <ArrowUp className="mr-1 h-3 w-3" />
          ) : (
            <ArrowDown className="mr-1 h-3 w-3" />
          )}
          {Math.abs(crypto.priceChangePercentage24h).toFixed(2)}%
        </Badge>
      </TableCell>
      <TableCell className="hidden md:table-cell">
        {formatLargeNumber(crypto.marketCap)}
      </TableCell>
      <TableCell className="hidden lg:table-cell">
        {formatLargeNumber(crypto.volume24h)}
      </TableCell>
    </TableRow>
  );
};
