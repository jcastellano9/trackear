
import React from "react";
import { TableRow, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import { getLogoUrl, getCryptoExchangeLogo } from "@/utils/logoUtils";

interface CryptoTableRowProps {
  rate: any;
  formatPrice: (price: number) => string;
}

export const CryptoTableRow = ({ rate, formatPrice }: CryptoTableRowProps) => {
  const spread = rate.sell - rate.buy;
  const spreadPercentage = ((rate.sell - rate.buy) / rate.buy) * 100;
  
  // Extract exchange name from format "Exchange (COIN)"
  const exchangeName = rate.name.split(" (")[0];
  const coinName = rate.coin || rate.name.split(" (")[1]?.replace(")", "") || "";
  
  return (
    <TableRow>
      <TableCell className="font-medium">
        <div className="flex items-center gap-2">
          <div className="bg-white/10 p-1 rounded-full flex items-center justify-center">
            <img 
              src={rate.logo} 
              alt={exchangeName}
              className="h-6 w-6 object-contain"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = `https://ui-avatars.com/api/?name=${exchangeName}&background=random`;
              }}
            />
          </div>
          {exchangeName}
        </div>
      </TableCell>
      <TableCell>
        <Badge variant="outline">{coinName}</Badge>
      </TableCell>
      <TableCell className="text-right font-medium">
        {formatPrice(rate.buy)}
      </TableCell>
      <TableCell className="text-right font-medium">
        {formatPrice(rate.sell)}
      </TableCell>
      <TableCell className="text-right">
        <div className="flex items-center justify-end gap-1 text-muted-foreground">
          <span>{formatPrice(spread)}</span>
          <span className="text-xs">({spreadPercentage.toFixed(2)}%)</span>
        </div>
      </TableCell>
      <TableCell className="text-right">
        <div className={`flex items-center justify-end gap-1 ${
          (rate.change || 0) > 0 
            ? "text-green-500" 
            : (rate.change || 0) < 0 
              ? "text-red-500" 
              : ""
        }`}>
          {(rate.change || 0) > 0 ? (
            <ArrowUpRight className="h-4 w-4" />
          ) : (rate.change || 0) < 0 ? (
            <ArrowDownRight className="h-4 w-4" />
          ) : null}
          <span>{Math.abs(rate.change || 0).toFixed(2)}%</span>
        </div>
      </TableCell>
    </TableRow>
  );
};
