import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SimulationWarning } from "@/components/SimulationWarning";
import { FixedTermSimulator } from "@/components/FixedTermSimulator";
import { WalletSimulator } from "@/components/WalletSimulator";
import { Wallet, Landmark } from "lucide-react";

export function SimulationTool() {
  return (
    <div className="space-y-6">
      <SimulationWarning />

      <Tabs defaultValue="fixed-term">
        <TabsList className="grid grid-cols-2 w-full max-w-md mx-auto">
          <TabsTrigger value="fixed-term" className="flex items-center gap-2">
            <Landmark className="h-4 w-4" />
            Plazo Fijo
          </TabsTrigger>
          <TabsTrigger value="wallet" className="flex items-center gap-2">
            <Wallet className="h-4 w-4" />
            Billetera Virtual
          </TabsTrigger>
        </TabsList>

        <TabsContent value="fixed-term" className="mt-6">
          <FixedTermSimulator />
        </TabsContent>

        <TabsContent value="wallet" className="mt-6">
          <WalletSimulator />
        </TabsContent>
      </Tabs>
    </div>
  );
}
