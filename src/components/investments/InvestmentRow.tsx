
import React from "react";
import { TableRow, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, ArrowUpRight, ArrowDownRight, Heart, Bitcoin } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { formatCurrency } from "@/utils/formatUtils";
import { findAssetByValue } from "@/utils/investmentOptions";
import { InvestmentType } from "@/lib/supabase";

interface InvestmentRowProps {
  investment: InvestmentType;
  displayCurrency: "USD" | "ARS";
  portfolioTotal: number;
  cclRate: number;
  onEdit: (investment: InvestmentType) => void;
  onDelete: (id: string) => void;
  showRatio?: boolean;
}

export const InvestmentRow = ({
  investment,
  displayCurrency,
  portfolioTotal,
  cclRate,
  onEdit,
  onDelete,
  showRatio = false,
}: InvestmentRowProps) => {
  // Convert currency based on display preference
  const convertCurrency = (value: number, originalCurrency: "USD" | "ARS") => {
    if (displayCurrency === originalCurrency) return value;
    
    // Convert from USD to ARS
    if (originalCurrency === "USD" && displayCurrency === "ARS") {
      return value * cclRate;
    }
    
    // Convert from ARS to USD
    if (originalCurrency === "ARS" && displayCurrency === "USD") {
      return value / cclRate;
    }
    
    return value;
  };
  
  // Format currency with the appropriate symbol
  const formatDisplayCurrency = (value: number, originalCurrency: "USD" | "ARS") => {
    const convertedValue = convertCurrency(value, originalCurrency);
    return formatCurrency(convertedValue, displayCurrency);
  };

  // Calculate allocation percentage
  const allocation = (investment.total_value || 0) / portfolioTotal * 100;

  return (
    <TableRow key={investment.id} className="hover:bg-muted/30">
      <TableCell className="text-center">
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <Heart className="h-4 w-4 text-muted-foreground" />
        </Button>
      </TableCell>
      <TableCell className="font-medium">
        <div className="flex items-center gap-2">
          {investment.symbol ? (
            <img 
              src={findAssetByValue(investment.symbol)?.logo || `https://ui-avatars.com/api/?name=${investment.symbol}&background=random`} 
              alt={investment.symbol}
              className="h-6 w-6 rounded-sm object-contain"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = `https://ui-avatars.com/api/?name=${investment.symbol}&background=random`;
              }}
            />
          ) : (
            <div className="h-6 w-6 rounded-sm bg-muted flex items-center justify-center">
              {investment.tipo === "cripto" ? 
                <Bitcoin className="h-4 w-4" /> : 
                <span className="text-xs font-bold">C</span>
              }
            </div>
          )}
          {investment.symbol || "---"}
        </div>
      </TableCell>
      <TableCell>{investment.activo}</TableCell>
      <TableCell className="text-right font-medium">
        {formatDisplayCurrency(investment.current_price || 0, investment.moneda)}
      </TableCell>
      <TableCell className="text-right">
        <div className={`flex items-center justify-end gap-1 ${
          (investment.price_change_absolute || 0) > 0 
            ? "text-green-500" 
            : (investment.price_change_absolute || 0) < 0 
              ? "text-red-500" 
              : ""
        }`}>
          {(investment.price_change_absolute || 0) > 0 ? "+" : ""}
          {formatDisplayCurrency(investment.price_change_absolute || 0, investment.moneda)}
        </div>
      </TableCell>
      <TableCell className="text-right">
        <div className={`flex items-center justify-end gap-1 ${
          (investment.price_change_percent || 0) > 0 
            ? "text-green-500" 
            : (investment.price_change_percent || 0) < 0 
              ? "text-red-500" 
              : ""
        }`}>
          {(investment.price_change_percent || 0) > 0 ? (
            <ArrowUpRight className="h-4 w-4" />
          ) : (investment.price_change_percent || 0) < 0 ? (
            <ArrowDownRight className="h-4 w-4" />
          ) : null}
          <span>{(investment.price_change_percent || 0).toFixed(2)}%</span>
        </div>
      </TableCell>
      {showRatio && (
        <TableCell className="text-center">
          {investment.ratio ? (
            <Badge variant="outline">{investment.ratio}:1</Badge>
          ) : (
            <span className="text-muted-foreground">-</span>
          )}
        </TableCell>
      )}
      <TableCell className="text-right">{investment.cantidad.toFixed(2)}</TableCell>
      <TableCell className="text-right">
        {formatDisplayCurrency(investment.ppc || investment.precio_compra, investment.moneda)}
      </TableCell>
      <TableCell className="text-right font-medium">
        {formatDisplayCurrency(investment.total_value || 0, investment.moneda)}
      </TableCell>
      <TableCell className="text-right">
        <div className="flex flex-col gap-1">
          <span>{allocation.toFixed(2)}%</span>
          <Progress value={allocation} className="h-1.5" />
        </div>
      </TableCell>
      <TableCell>
        <div className="flex justify-end gap-1">
          <Button variant="ghost" size="icon" onClick={() => onEdit(investment)}>
            <Edit className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="text-red-500" onClick={() => onDelete(investment.id)}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
};
