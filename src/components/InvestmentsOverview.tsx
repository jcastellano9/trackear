
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { InvestmentsList } from "./InvestmentsList";
import { AddInvestmentForm } from "./AddInvestmentForm";
import { PlusCircle } from "lucide-react";
import { Button } from "./ui/button";

export function InvestmentsOverview() {
  const [showAddForm, setShowAddForm] = useState(false);
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold">Resumen de inversiones</h2>
          <p className="text-muted-foreground">Visualiza y gestiona todas tus inversiones</p>
        </div>
        
        <Button onClick={() => setShowAddForm(!showAddForm)} className="w-full md:w-auto">
          <PlusCircle className="mr-2 h-4 w-4" />
          {showAddForm ? "Cancelar" : "Agregar inversión"}
        </Button>
      </div>
      
      {showAddForm && (
        <Card>
          <CardHeader>
            <CardTitle>Nueva inversión</CardTitle>
            <CardDescription>Ingresa los detalles de tu nueva inversión</CardDescription>
          </CardHeader>
          <CardContent>
            <AddInvestmentForm onSuccess={() => setShowAddForm(false)} />
          </CardContent>
        </Card>
      )}
      
      <Tabs defaultValue="all">
        <TabsList className="mb-4">
          <TabsTrigger value="all">Todas</TabsTrigger>
          <TabsTrigger value="crypto">Criptomonedas</TabsTrigger>
          <TabsTrigger value="cedears">CEDEARs</TabsTrigger>
          <TabsTrigger value="fixed">Plazos Fijos</TabsTrigger>
          <TabsTrigger value="wallets">Billeteras</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all">
          <InvestmentsList filter="all" />
        </TabsContent>
        
        <TabsContent value="crypto">
          <InvestmentsList filter="crypto" />
        </TabsContent>
        
        <TabsContent value="cedears">
          <InvestmentsList filter="cedears" />
        </TabsContent>
        
        <TabsContent value="fixed">
          <InvestmentsList filter="fixed" />
        </TabsContent>
        
        <TabsContent value="wallets">
          <InvestmentsList filter="wallets" />
        </TabsContent>
      </Tabs>
    </div>
  );
}
