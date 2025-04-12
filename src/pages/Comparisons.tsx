
import { Navbar } from "@/components/Navbar";
import { ExchangeRatesComparison } from "@/components/ExchangeRatesComparison";
import { InterestRatesComparison } from "@/components/InterestRatesComparison";
import { PixComparison } from "@/components/PixComparison";
import { CryptoWalletComparison } from "@/components/CryptoWalletComparison";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Logo } from "@/components/Logo";

const Comparisons = () => {
  return (
    <div className="min-h-screen flex flex-col bg-black text-white">
      <Navbar />
      <main className="flex-grow">
        <div className="container px-4 py-6 mx-auto space-y-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">Comparaciones</h1>
          <p className="text-zinc-400">
            Compará cotizaciones, tasas y opciones de inversión en un solo lugar
          </p>
          
          <Tabs defaultValue="exchange-rates" className="w-full">
            <TabsList className="grid grid-cols-1 md:grid-cols-4 w-full bg-zinc-900 p-1">
              <TabsTrigger value="exchange-rates" className="data-[state=active]:bg-zinc-800">Cotizaciones</TabsTrigger>
              <TabsTrigger value="crypto-investments" className="data-[state=active]:bg-zinc-800">Crypto Inversiones</TabsTrigger>
              <TabsTrigger value="ars-rates" className="data-[state=active]:bg-zinc-800">Rendimientos ARS</TabsTrigger>
              <TabsTrigger value="pix" className="data-[state=active]:bg-zinc-800">PIX</TabsTrigger>
            </TabsList>
            
            <TabsContent value="exchange-rates" className="mt-6">
              <ExchangeRatesComparison />
            </TabsContent>
            
            <TabsContent value="crypto-investments" className="mt-6">
              <div className="space-y-8">
                <CryptoWalletComparison />
                <InterestRatesComparison currencyFilter="CRYPTO" />
              </div>
            </TabsContent>
            
            <TabsContent value="ars-rates" className="mt-6">
              <InterestRatesComparison currencyFilter="ARS" />
            </TabsContent>
            
            <TabsContent value="pix" className="mt-6">
              <PixComparison />
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <footer className="py-6 border-t border-zinc-800">
        <div className="container mx-auto px-4 text-center text-sm text-zinc-500">
          © 2025 <Logo size="sm" withText={true} className="inline-flex mx-1" /> - Universidad Siglo 21 - Trabajo Final de Grado en Ingeniería de Software
        </div>
      </footer>
    </div>
  );
}

export default Comparisons;
