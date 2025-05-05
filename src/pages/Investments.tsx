
import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { InvestmentsOverview } from "@/components/InvestmentsOverview";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { InvestmentChart } from "@/components/InvestmentChart";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { toast } from "sonner";

const Investments = () => {
  const [activeTab, setActiveTab] = useState("portfolio");
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  
  const handleRefresh = () => {
    setRefreshTrigger(prev => prev + 1);
    toast.success("Actualizando datos...");
  };
  
  return (
    <AppLayout 
      title="Mi Cartera"
      description="Gestiona y analiza tus inversiones en un solo lugar"
    >
      <div className="flex justify-between items-center mb-4">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="portfolio">Mi Cartera</TabsTrigger>
            <TabsTrigger value="performance">Rendimiento</TabsTrigger>
          </TabsList>
        </Tabs>
        
        <Button 
          variant="outline" 
          size="sm"
          onClick={handleRefresh} 
          className="flex items-center gap-2"
        >
          <RefreshCw className="h-4 w-4" /> 
          Actualizar
        </Button>
      </div>
      
      <div className="space-y-6">
        <TabsContent value="portfolio">
          <InvestmentsOverview key={`investments-${refreshTrigger}`} />
        </TabsContent>
        
        <TabsContent value="performance">
          <div className="space-y-6">
            <div className="rounded-lg p-6 bg-card text-card-foreground">
              <h2 className="text-xl font-bold mb-4">Rendimiento de inversiones</h2>
              <div className="h-[400px]">
                <InvestmentChart key={`chart-${refreshTrigger}`} />
              </div>
            </div>
          </div>
        </TabsContent>
      </div>
    </AppLayout>
  );
};

export default Investments;
