
import { AssetAllocation } from "./AssetAllocation";
import { ExchangeRates } from "./ExchangeRates";
import { InvestmentChart } from "./InvestmentChart";

export function Dashboard() {
  return (
    <div className="container px-4 py-6 mx-auto space-y-8">
      <h1 className="text-3xl font-bold">Bienvenido a TrackeArBit</h1>
      <p className="text-muted-foreground">
        Centraliza y gestiona todas tus inversiones en un solo lugar
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
        <div className="border rounded-lg p-6 space-y-2">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-muted-foreground">Total Invertido</p>
              <p className="text-xs text-muted-foreground">Monto original invertido</p>
            </div>
            <span className="text-xl">$</span>
          </div>
          <h2 className="text-2xl font-bold">US$ 5.000,00</h2>
        </div>
        
        <div className="border rounded-lg p-6 space-y-2">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-muted-foreground">Valor Actual</p>
              <p className="text-xs text-muted-foreground">Valoración a precio de mercado</p>
            </div>
            <span className="text-xl">📈</span>
          </div>
          <h2 className="text-2xl font-bold">US$ 6.250,00</h2>
        </div>
        
        <div className="border rounded-lg p-6 space-y-2">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-muted-foreground">Ganancia/Pérdida</p>
              <p className="text-xs text-muted-foreground">Resultado neto acumulado</p>
            </div>
            <span className="text-xl text-green-500">📈</span>
          </div>
          <h2 className="text-2xl font-bold text-green-500">US$ 1.250,00</h2>
        </div>
        
        <div className="border rounded-lg p-6 space-y-2">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-muted-foreground">Rendimiento</p>
              <p className="text-xs text-muted-foreground">Porcentaje de retorno</p>
            </div>
            <span className="text-xl text-green-500">📈</span>
          </div>
          <h2 className="text-2xl font-bold text-green-500">+25%</h2>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="border rounded-lg p-6 space-y-4">
          <div>
            <h2 className="text-xl font-bold">Rendimiento de inversiones</h2>
            <p className="text-sm text-muted-foreground">Evolución del capital invertido vs. valor actual</p>
          </div>
          <div className="h-[250px]">
            <InvestmentChart />
          </div>
        </div>
        
        <div className="border rounded-lg p-6 space-y-4">
          <div>
            <h2 className="text-xl font-bold">Distribución de Activos</h2>
            <p className="text-sm text-muted-foreground">Composición actual de tu portafolio</p>
          </div>
          <AssetAllocation />
        </div>
        
        <div className="border rounded-lg p-6 space-y-4 md:col-span-2">
          <div>
            <h2 className="text-xl font-bold">Cotizaciones</h2>
            <p className="text-sm text-muted-foreground">Última actualización: hace 5 minutos</p>
          </div>
          <ExchangeRates />
        </div>
      </div>
    </div>
  );
}
