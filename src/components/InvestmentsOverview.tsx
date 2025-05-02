
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { InvestmentsList } from "./InvestmentsList";
import { AddInvestmentForm } from "./AddInvestmentForm";
import { InvestmentSummaryTable } from "./InvestmentSummaryTable";
import { PlusCircle, X, Bitcoin, DollarSign, Filter } from "lucide-react";
import { Button } from "./ui/button";
import { ScrollArea } from "./ui/scroll-area";
import { ExportInvestments } from "./ExportInvestments";
import { useSession } from "@supabase/auth-helpers-react";
import { supabase, InvestmentType } from "@/lib/supabase";

export function InvestmentsOverview() {
  const [showAddForm, setShowAddForm] = useState(false);
  const [investments, setInvestments] = useState<InvestmentType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const session = useSession();
  
  const fetchInvestments = async () => {
    if (!session?.user) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('investments')
        .select('*')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      
      setInvestments(data as InvestmentType[] || []);
    } catch (error: any) {
      console.error('Error al cargar inversiones:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    fetchInvestments();
  }, [session]);
  
  const handleAddSuccess = () => {
    setShowAddForm(false);
    fetchInvestments();
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold">Mi Cartera de inversiones</h2>
          <p className="text-muted-foreground">Visualiza y gestiona todas tus inversiones</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-2">
          <ExportInvestments />
          
          <Button onClick={() => setShowAddForm(!showAddForm)} className="ml-2">
            {showAddForm ? <X className="mr-2 h-4 w-4" /> : <PlusCircle className="mr-2 h-4 w-4" />}
            {showAddForm ? "Cancelar" : "Agregar inversión"}
          </Button>
        </div>
      </div>
      
      {!isLoading && investments.length > 0 && (
        <InvestmentSummaryTable investments={investments} />
      )}
      
      {showAddForm && (
        <Card>
          <CardHeader>
            <CardTitle>Nueva inversión</CardTitle>
            <CardDescription>Ingresa los detalles de tu nueva inversión</CardDescription>
          </CardHeader>
          <CardContent>
            <AddInvestmentForm onSuccess={handleAddSuccess} />
          </CardContent>
        </Card>
      )}
      
      <Tabs defaultValue="all">
        <ScrollArea className="w-full whitespace-nowrap">
          <TabsList className="mb-4 w-max">
            <TabsTrigger value="all" className="flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Todas
            </TabsTrigger>
            <TabsTrigger value="crypto" className="flex items-center gap-2">
              <Bitcoin className="h-4 w-4" />
              Criptomonedas
            </TabsTrigger>
            <TabsTrigger value="cedears" className="flex items-center gap-2">
              <span className="flex items-center justify-center w-4 h-4 bg-blue-500 text-white rounded-full text-xs font-bold">C</span>
              CEDEARs
            </TabsTrigger>
          </TabsList>
        </ScrollArea>
        
        <TabsContent value="all">
          <div className="flex justify-end mb-4">
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filtrar
            </Button>
          </div>
          <InvestmentsList filter="all" />
        </TabsContent>
        
        <TabsContent value="crypto">
          <div className="flex justify-end mb-4">
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filtrar
            </Button>
          </div>
          <InvestmentsList filter="crypto" />
        </TabsContent>
        
        <TabsContent value="cedears">
          <div className="flex justify-end mb-4">
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filtrar
            </Button>
          </div>
          <InvestmentsList filter="cedears" />
        </TabsContent>
      </Tabs>
    </div>
  );
}
