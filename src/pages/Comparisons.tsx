
import { Navbar } from "@/components/Navbar";
import { ExchangeRatesComparison } from "@/components/ExchangeRatesComparison";
import { InterestRatesComparison } from "@/components/InterestRatesComparison";
import { PixComparison } from "@/components/PixComparison";
import { CedearsExplorer } from "@/components/CedearsExplorer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Comparisons = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-grow">
        <div className="container px-4 py-6 mx-auto space-y-8">
          <h1 className="text-3xl font-bold">Comparaciones</h1>
          <p className="text-muted-foreground">
            Compará cotizaciones, tasas y opciones de inversión en un solo lugar
          </p>
          
          <Tabs defaultValue="exchange-rates">
            <TabsList className="grid grid-cols-2 md:grid-cols-4 w-full">
              <TabsTrigger value="exchange-rates">Cotizaciones</TabsTrigger>
              <TabsTrigger value="interest-rates">Rendimientos</TabsTrigger>
              <TabsTrigger value="pix">PIX</TabsTrigger>
              <TabsTrigger value="cedears">CEDEARs</TabsTrigger>
            </TabsList>
            
            <TabsContent value="exchange-rates" className="mt-6">
              <ExchangeRatesComparison />
            </TabsContent>
            
            <TabsContent value="interest-rates" className="mt-6">
              <InterestRatesComparison />
            </TabsContent>
            
            <TabsContent value="pix" className="mt-6">
              <PixComparison />
            </TabsContent>
            
            <TabsContent value="cedears" className="mt-6">
              <CedearsExplorer />
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <footer className="py-6 border-t">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          © 2025 TrackeArBit 2.0 - Universidad Siglo 21 - Trabajo Final de Grado en Ingeniería de Software
        </div>
      </footer>
    </div>
  );
};

export default Comparisons;
