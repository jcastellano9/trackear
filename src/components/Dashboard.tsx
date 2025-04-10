
import { AssetAllocation } from "./AssetAllocation";
import { InvestmentSummary } from "./InvestmentSummary";
import { ExchangeRates } from "./ExchangeRates";
import { InvestmentChart } from "./InvestmentChart";

export function Dashboard() {
  return (
    <div className="container px-4 py-6 mx-auto space-y-8">
      <h1 className="text-3xl font-bold">Bienvenido a TrackeArBit</h1>
      <p className="text-muted-foreground">
        Centraliza y gestiona todas tus inversiones en un solo lugar
      </p>
      
      <div className="my-6">
        <InvestmentSummary />
      </div>
      
      <div className="mt-8 space-y-6">
        <InvestmentChart />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <AssetAllocation />
        <ExchangeRates />
      </div>
    </div>
  );
}
