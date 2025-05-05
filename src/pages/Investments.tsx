
import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { InvestmentsOverview } from "@/components/InvestmentsOverview";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { InvestmentChart } from "@/components/InvestmentChart";

const Investments = () => {
  const [activeTab, setActiveTab] = useState("portfolio");
  
  return (
    <AppLayout 
      title="Mi Cartera"
      description="Gestiona y analiza tus inversiones en un solo lugar"
    >
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="mb-4">
          <TabsTrigger value="portfolio">Mi Cartera</TabsTrigger>
          <TabsTrigger value="performance">Rendimiento</TabsTrigger>
        </TabsList>
        
        <TabsContent value="portfolio">
          <InvestmentsOverview />
        </TabsContent>
        
        <TabsContent value="performance">
          <div className="space-y-6">
            <div className="rounded-lg p-6 bg-card text-card-foreground">
              <h2 className="text-xl font-bold mb-4">Rendimiento de inversiones</h2>
              <div className="h-[400px]">
                <InvestmentChart />
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </AppLayout>
  );
};

export default Investments;
