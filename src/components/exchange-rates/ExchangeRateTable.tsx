
import React from "react";
import { Badge } from "@/components/ui/badge";
import { ArrowUp, ArrowDown } from "lucide-react";
import { ExchangeRate } from "@/types/exchangeRate";
import { formatExchangeRateValue, formatPercentage } from "@/utils/exchangeRateUtils";
import { Skeleton } from "@/components/ui/skeleton";

interface ExchangeRateTableProps {
  data: ExchangeRate[];
  loading: boolean;
  lastUpdated: Date;
}

export const ExchangeRateTable: React.FC<ExchangeRateTableProps> = ({ 
  data, 
  loading,
  lastUpdated 
}) => {
  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div className="flex justify-between py-3 border-b" key={i}>
            <Skeleton className="h-10 w-40" />
            <div className="space-y-2">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-5 w-24" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="grid grid-cols-4 text-sm font-medium border-b pb-2">
        <div>Tipo</div>
        <div>Compra</div>
        <div>Venta</div>
        <div className="text-right">Variación</div>
      </div>
      
      {data.map((rate, index) => (
        <div key={index} className="grid grid-cols-4 py-4 border-b items-center">
          <div className="flex items-center gap-2">
            <img 
              src={rate.logo || 'https://via.placeholder.com/24?text=?'} 
              alt={rate.name}
              className="h-6 w-6 object-contain"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = "https://via.placeholder.com/24?text=?";
              }}
            />
            <div>
              <div className="font-medium">{rate.name}</div>
              {rate.reference && <span className="text-xs text-muted-foreground">Referencia</span>}
            </div>
          </div>
          <div className="font-medium">
            {formatExchangeRateValue(rate.buy)}
          </div>
          <div className="font-medium">
            {formatExchangeRateValue(rate.sell)}
          </div>
          <div className="flex justify-end">
            {!rate.reference && (
              <Badge 
                variant={rate.change >= 0 ? "default" : "destructive"} 
                className="inline-flex items-center"
              >
                {rate.change >= 0 ? 
                  <ArrowUp className="h-3 w-3 mr-0.5" /> : 
                  <ArrowDown className="h-3 w-3 mr-0.5" />
                }
                {formatPercentage(rate.change)}
              </Badge>
            )}
          </div>
        </div>
      ))}
      
      <div className="text-xs text-muted-foreground text-right pt-2">
        Última actualización: {lastUpdated.toLocaleTimeString('es-AR')}
      </div>
    </div>
  );
};
