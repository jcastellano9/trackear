
import { AppLayout } from "@/components/layout/AppLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { InterestRatesComparison } from "@/components/InterestRatesComparison";
import { PixComparison } from "@/components/PixComparison";
import { ScrollArea } from "@/components/ui/scroll-area";

const Opportunities = () => {
  return (
    <AppLayout 
      title="Oportunidades" 
      description="Evalúa dónde invertir tus pesos argentinos hoy"
    >
      <Tabs defaultValue="interest-rates">
        <ScrollArea className="w-full whitespace-nowrap">
          <TabsList className="mb-4 w-max">
            <TabsTrigger value="interest-rates">Plazos Fijos y Billeteras</TabsTrigger>
            <TabsTrigger value="pix-payment">Pagar con PIX</TabsTrigger>
          </TabsList>
        </ScrollArea>
        
        <TabsContent value="interest-rates" className="space-y-6">
          <InterestRatesComparison />
        </TabsContent>
        
        <TabsContent value="pix-payment" className="space-y-6">
          <PixComparison />
        </TabsContent>
      </Tabs>
    </AppLayout>
  );
};

export default Opportunities;
