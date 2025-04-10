
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SimulationWarning } from "@/components/SimulationWarning";
import { FixedTermSimulator } from "@/components/FixedTermSimulator";
import { WalletSimulator } from "@/components/WalletSimulator";
import { Wallet, Landmark } from "lucide-react";
import { toast } from "sonner";

export function SimulationTool() {
  const [acknowledged, setAcknowledged] = useState(false);

  const handleCancel = () => {
    toast.error("Simulación cancelada");
    // Optionally redirect to another page
  };

  const handleContinue = () => {
    setAcknowledged(true);
    toast.success("Simulación activada");
  };

  return (
    <div className="space-y-6">
      {!acknowledged && (
        <SimulationWarning 
          onCancel={handleCancel} 
          onContinue={handleContinue} 
        />
      )}
      
      {acknowledged && (
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
      )}
    </div>
  );
}
