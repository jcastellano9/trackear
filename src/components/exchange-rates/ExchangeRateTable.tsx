
import React from "react";
import { Badge } from "@/components/ui/badge";
import { ArrowUp, ArrowDown, DollarSign } from "lucide-react";
import { ExchangeRate } from "@/types/exchangeRate";
import { formatExchangeRateValue, formatPercentage } from "@/utils/exchangeRateUtils";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

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
  
  // Check if data is empty
  if (!data || data.length === 0) {
    return (
      <div className="text-center py-8 border rounded-md">
        <p className="text-muted-foreground">No hay datos disponibles</p>
      </div>
    );
  }

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } }
  };

  return (
    <div className="space-y-2">
      <div className="grid grid-cols-4 text-sm font-medium border-b pb-2">
        <div>Proveedor</div>
        <div>Compra</div>
        <div>Venta</div>
        <div className="text-right">Spread</div>
      </div>
      
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="space-y-1"
      >
        {data
          .sort((a, b) => b.buy - a.buy) // Sort by buy price desc
          .map((rate, index) => {
            // Add null check here
            const buy = typeof rate.buy === 'number' ? rate.buy : 0;
            const sell = typeof rate.sell === 'number' ? rate.sell : 0;
            const spread = sell - buy;
            const spreadPercentage = buy > 0 ? (spread / buy) * 100 : 0;
            
            return (
              <motion.div 
                key={index} 
                variants={item}
                className="grid grid-cols-4 py-4 border-b items-center bg-white/5 rounded-lg hover:bg-white/10 transition-colors p-2"
              >
                <div className="flex items-center gap-2">
                  <div className="bg-white/10 p-2 rounded-full flex items-center justify-center">
                    {rate.logo ? (
                      <img 
                        src={rate.logo} 
                        alt={rate.name}
                        className="h-6 w-6 object-contain"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = `https://ui-avatars.com/api/?name=${rate.name}&background=random`;
                        }}
                      />
                    ) : (
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                    )}
                  </div>
                  <div>
                    <div className="font-medium">{rate.name}</div>
                    {rate.reference && <span className="text-xs text-muted-foreground">Referencia</span>}
                  </div>
                </div>
                <div className="font-medium">
                  ${formatExchangeRateValue(buy)}
                </div>
                <div className="font-medium">
                  ${formatExchangeRateValue(sell)}
                </div>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex justify-end">
                        <Badge 
                          variant="outline" 
                          className="inline-flex items-center"
                        >
                          ${spread.toFixed(2)}
                        </Badge>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{spreadPercentage.toFixed(2)}%</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </motion.div>
            );
        })}
      </motion.div>
      
      <div className="text-xs text-muted-foreground text-right pt-2">
        Última actualización: {lastUpdated ? lastUpdated.toLocaleTimeString('es-AR') : new Date().toLocaleTimeString('es-AR')}
      </div>
    </div>
  );
};
