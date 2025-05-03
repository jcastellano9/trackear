
import { AppLayout } from "@/components/layout/AppLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ExchangeRates } from "@/components/ExchangeRates";
import { CryptoPrices } from "@/components/CryptoPrices";
import { CryptoWalletComparison } from "@/components/CryptoWalletComparison";
import { PixComparison } from "@/components/PixComparison";
import { InterestRatesComparison } from "@/components/InterestRatesComparison";
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
            <TabsTrigger value="exchange-rates">Dólar</TabsTrigger>
            <TabsTrigger value="crypto-performance">Cripto</TabsTrigger>
            <TabsTrigger value="crypto-yield">Rendimientos Cripto</TabsTrigger>
            <TabsTrigger value="interest-rates">Comparador de Tasas</TabsTrigger>
            <TabsTrigger value="pix">PIX</TabsTrigger>
          </TabsList>
        </ScrollArea>
        
        <TabsContent value="exchange-rates" className="space-y-6">
          <ExchangeRates />
        </TabsContent>
        
        <TabsContent value="crypto-performance" className="space-y-6">
          <CryptoPrices />
        </TabsContent>
        
        <TabsContent value="crypto-yield" className="space-y-6">
          <CryptoWalletComparison />
        </TabsContent>
        
        <TabsContent value="interest-rates" className="space-y-6">
          <InterestRatesComparison />
        </TabsContent>
        
        <TabsContent value="pix" className="space-y-6">
          <PixComparison />
        </TabsContent>
      </Tabs>
    </AppLayout>
  );
};

export default Analysis;
