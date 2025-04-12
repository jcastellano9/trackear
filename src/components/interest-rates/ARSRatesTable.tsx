
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { InterestRate } from "@/types/interestRate";
import { formatPercentage, formatCurrency, formatTime } from "@/utils/formatUtils";

type ARSRatesTableProps = {
  rates: InterestRate[];
};

export function ARSRatesTable({ rates }: ARSRatesTableProps) {
  const sortedRates = [...rates].sort((a, b) => b.annualRate - a.annualRate);

  return (
    <Card className="dark:bg-zinc-900 border-zinc-800">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>
              <span className="flex items-center gap-2">
                Pesos Argentinos
                <Badge>ARS</Badge>
              </span>
            </CardTitle>
            <CardDescription>
              {rates.length} opciones de inversión
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="overflow-x-auto">
        <div className="min-w-[800px]">
          <table className="w-full">
            <thead>
              <tr className="border-b border-zinc-800">
                <th className="text-left py-3 font-medium">Proveedor</th>
                <th className="text-left py-3 font-medium">Tipo</th>
                <th className="text-center py-3 font-medium">Tasa Anual</th>
                <th className="text-left py-3 font-medium">Monto Mínimo</th>
                <th className="text-left py-3 font-medium">Plazo</th>
                <th className="text-left py-3 font-medium">Características</th>
              </tr>
            </thead>
            <tbody>
              {sortedRates.map((rate) => (
                <tr key={`${rate.provider}-${rate.type}-${rate.currency}`} className="border-b border-zinc-800 hover:bg-zinc-800/50">
                  <td className="py-4">
                    <div className="flex items-center gap-2">
                      {rate.logo && (
                        <img 
                          src={rate.logo} 
                          alt={rate.provider} 
                          className="h-8 w-8 object-contain rounded-full" 
                        />
                      )}
                      <div>
                        <div className="font-medium">{rate.provider}</div>
                        <div className="text-xs text-zinc-400">
                          actualizado {formatTime(rate.lastUpdated)}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4">
                    {rate.type === "wallet" && "Billetera Virtual"}
                    {rate.type === "fixed" && "Plazo Fijo"}
                    {rate.type === "bank" && "Cuenta Bancaria"}
                    {rate.type === "fund" && "Fondo de Inversión"}
                  </td>
                  <td className="text-center py-4 px-2">
                    <div className="font-semibold">{formatPercentage(rate.annualRate)}</div>
                    <div className="text-xs text-zinc-400">TNA</div>
                  </td>
                  <td className="py-4">
                    {rate.minAmount 
                      ? formatCurrency(rate.minAmount, rate.currency)
                      : "Sin mínimo"}
                  </td>
                  <td className="py-4">
                    {rate.term
                      ? `${rate.term} días`
                      : "Inmediato"}
                  </td>
                  <td className="py-4">
                    <ul className="list-disc list-inside text-sm">
                      {rate.features.map((feature, index) => (
                        <li key={index}>{feature}</li>
                      ))}
                    </ul>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
