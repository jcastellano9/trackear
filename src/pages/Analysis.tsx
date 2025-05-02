
import { AppLayout } from "@/components/layout/AppLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ExchangeRates } from "@/components/ExchangeRates";
import { CryptoPrices } from "@/components/CryptoPrices";
import { CryptoWalletComparison } from "@/components/CryptoWalletComparison";
import { CedearsExplorer } from "@/components/CedearsExplorer";
import { ScrollArea } from "@/components/ui/scroll-area";

const Analysis = () => {
  return (
    <AppLayout 
      title="Análisis" 
      description="Monitorea cotizaciones y rendimientos de los mercados financieros"
    >
      <Tabs defaultValue="exchange-rates">
        <ScrollArea className="w-full whitespace-nowrap">
          <TabsList className="mb-4 w-max">
            <TabsTrigger value="exchange-rates">Cotizaciones</TabsTrigger>
            <TabsTrigger value="crypto-performance">Rendimiento Cripto</TabsTrigger>
            <TabsTrigger value="wallet-comparison">Comparador de Wallets</TabsTrigger>
            <TabsTrigger value="cedears">CEDEARs</TabsTrigger>
          </TabsList>
        </ScrollArea>
        
        <TabsContent value="exchange-rates" className="space-y-6">
          <ExchangeRates />
        </TabsContent>
        
        <TabsContent value="crypto-performance" className="space-y-6">
          <CryptoPrices />
        </TabsContent>
        
        <TabsContent value="wallet-comparison" className="space-y-6">
          <CryptoWalletComparison />
        </TabsContent>
        
        <TabsContent value="cedears" className="space-y-6">
          <CedearsExplorer />
        </TabsContent>
      </Tabs>
    </AppLayout>
  );
};

export default Analysis;
