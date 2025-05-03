
import { AppLayout } from "@/components/layout/AppLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FixedTermSimulator } from "@/components/simulators/FixedTermSimulator";
import { WalletSimulator } from "@/components/simulators/WalletSimulator";
import { CryptoSimulator } from "@/components/simulators/CryptoSimulator";
import { InstallmentsVsCash } from "@/components/InstallmentsVsCash";
import { ScrollArea } from "@/components/ui/scroll-area";

const Simulation = () => {
  return (
    <AppLayout 
      title="Simulador" 
      description="Herramientas para simular escenarios financieros"
    >
      <Tabs defaultValue="fixed-term">
        <ScrollArea className="w-full whitespace-nowrap">
          <TabsList className="mb-4 w-max">
            <TabsTrigger value="fixed-term">Plazo Fijo</TabsTrigger>
            <TabsTrigger value="wallet">Billetera Virtual</TabsTrigger>
            <TabsTrigger value="crypto">Simulador Cripto</TabsTrigger>
            <TabsTrigger value="installments">Cuotas vs Contado</TabsTrigger>
          </TabsList>
        </ScrollArea>
        
        <TabsContent value="fixed-term" className="space-y-6">
          <FixedTermSimulator />
        </TabsContent>
        
        <TabsContent value="wallet" className="space-y-6">
          <WalletSimulator />
        </TabsContent>
        
        <TabsContent value="crypto" className="space-y-6">
          <CryptoSimulator />
        </TabsContent>
        
        <TabsContent value="installments" className="space-y-6">
          <InstallmentsVsCash />
        </TabsContent>
      </Tabs>
    </AppLayout>
  );
};

export default Simulation;
