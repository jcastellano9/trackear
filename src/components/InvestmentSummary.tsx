
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, DollarSign, BarChart2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

type SummaryData = {
  totalInvested: number;
  currentValue: number;
  percentageChange: number;
  profitLoss: number;
  currency: string;
};

export function InvestmentSummary() {
  const [data, setData] = useState<SummaryData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    const fetchData = () => {
      setTimeout(() => {
        // Mock data
        setData({
          totalInvested: 5000,
          currentValue: 6250,
          percentageChange: 25,
          profitLoss: 1250,
          currency: "USD",
        });
        setLoading(false);
      }, 1200);
    };

    fetchData();
  }, []);

  const formatCurrency = (value: number, currency: string) => {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency,
      maximumFractionDigits: 2,
    }).format(value);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div className="space-y-1">
            <CardTitle className="text-sm font-medium">Total Invertido</CardTitle>
            <CardDescription>Monto original invertido</CardDescription>
          </div>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          {loading ? (
            <Skeleton className="h-8 w-3/4" />
          ) : (
            <div className="text-2xl font-bold">
              {data && formatCurrency(data.totalInvested, data.currency)}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div className="space-y-1">
            <CardTitle className="text-sm font-medium">Valor Actual</CardTitle>
            <CardDescription>Valoración a precio de mercado</CardDescription>
          </div>
          <BarChart2 className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          {loading ? (
            <Skeleton className="h-8 w-3/4" />
          ) : (
            <div className="text-2xl font-bold">
              {data && formatCurrency(data.currentValue, data.currency)}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div className="space-y-1">
            <CardTitle className="text-sm font-medium">Ganancia/Pérdida</CardTitle>
            <CardDescription>Resultado neto acumulado</CardDescription>
          </div>
          {loading ? (
            <Skeleton className="h-4 w-4 rounded-full" />
          ) : data && data.percentageChange >= 0 ? (
            <TrendingUp className="h-4 w-4 text-finance-positive" />
          ) : (
            <TrendingDown className="h-4 w-4 text-finance-negative" />
          )}
        </CardHeader>
        <CardContent>
          {loading ? (
            <Skeleton className="h-8 w-3/4" />
          ) : (
            <div className="text-2xl font-bold">
              {data && (
                <span className={data.percentageChange >= 0 ? "text-finance-positive" : "text-finance-negative"}>
                  {formatCurrency(data.profitLoss, data.currency)}
                </span>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div className="space-y-1">
            <CardTitle className="text-sm font-medium">Rendimiento</CardTitle>
            <CardDescription>Porcentaje de retorno</CardDescription>
          </div>
          {loading ? (
            <Skeleton className="h-4 w-4 rounded-full" />
          ) : data && data.percentageChange >= 0 ? (
            <TrendingUp className="h-4 w-4 text-finance-positive" />
          ) : (
            <TrendingDown className="h-4 w-4 text-finance-negative" />
          )}
        </CardHeader>
        <CardContent>
          {loading ? (
            <Skeleton className="h-8 w-3/4" />
          ) : (
            <div className="text-2xl font-bold">
              {data && (
                <span className={data.percentageChange >= 0 ? "text-finance-positive" : "text-finance-negative"}>
                  {data.percentageChange >= 0 ? "+" : ""}
                  {data.percentageChange}%
                </span>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
