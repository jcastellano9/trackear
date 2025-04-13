
import React from "react";
import { Badge } from "@/components/ui/badge";
import { ArrowUp, ArrowDown, DollarSign, CreditCard, Building, Briefcase, Users, Bitcoin } from "lucide-react";
import { ExchangeRate } from "@/types/exchangeRate";
import { formatExchangeRateValue, formatPercentage } from "@/utils/exchangeRateUtils";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";

interface ExchangeRateTableProps {
  data: ExchangeRate[];
  loading: boolean;
  lastUpdated: Date;
}

// Helper function to get the appropriate icon for each rate type
const getRateIcon = (rateName: string) => {
  const iconClassName = "h-5 w-5 text-muted-foreground";
  
  switch(rateName.toLowerCase()) {
    case "oficial":
      return <DollarSign className={iconClassName} />;
    case "blue":
      return <DollarSign className={`${iconClassName} text-blue-500`} />;
    case "bolsa":
      return <Briefcase className={iconClassName} />;
    case "contado con liquidación":
      return <Building className={iconClassName} />;
    case "mayorista":
      return <Users className={iconClassName} />;
    case "cripto":
      return <Bitcoin className={iconClassName} />;
    case "tarjeta":
      return <CreditCard className={iconClassName} />;
    default:
      return <DollarSign className={iconClassName} />;
  }
};

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
        <div>Tipo</div>
        <div>Compra</div>
        <div>Venta</div>
        <div className="text-right">Variación</div>
      </div>
      
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="space-y-1"
      >
        {data.map((rate, index) => (
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
                      target.src = "https://via.placeholder.com/24?text=?";
                    }}
                  />
                ) : (
                  getRateIcon(rate.name)
                )}
              </div>
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
                  className={`inline-flex items-center ${rate.change >= 0 ? 'bg-green-500/20 text-green-500 hover:bg-green-500/30' : 'bg-red-500/20 text-red-500 hover:bg-red-500/30'}`}
                >
                  {rate.change >= 0 ? 
                    <ArrowUp className="h-3 w-3 mr-0.5" /> : 
                    <ArrowDown className="h-3 w-3 mr-0.5" />
                  }
                  {formatPercentage(rate.change)}
                </Badge>
              )}
            </div>
          </motion.div>
        ))}
      </motion.div>
      
      <div className="text-xs text-muted-foreground text-right pt-2">
        Última actualización: {lastUpdated.toLocaleTimeString('es-AR')}
      </div>
    </div>
  );
};
