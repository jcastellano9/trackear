import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { InvestmentsList } from "./InvestmentsList";
import { AddInvestmentForm } from "./AddInvestmentForm";
import { InvestmentSummaryTable } from "./InvestmentSummaryTable";
import { PlusCircle, X, Bitcoin, DollarSign, Filter, Database } from "lucide-react";
import { Button } from "./ui/button";
import { ScrollArea } from "./ui/scroll-area";
import { ExportInvestments } from "./ExportInvestments";
import { useSession } from "@supabase/auth-helpers-react";
import { supabase, InvestmentType } from "@/lib/supabase";
import { Input } from "./ui/input";
import { formatCurrency } from "@/utils/formatUtils";
import { Skeleton } from "./ui/skeleton";

export function InvestmentsOverview() {
  const [showAddForm, setShowAddForm] = useState(false);
  const [investments, setInvestments] = useState<InvestmentType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [cclRate, setCclRate] = useState(1400); // Default CCL rate
  const [portfolioStats, setPortfolioStats] = useState({
    totalARS: 0,
    totalUSD: 0,
    totalAssets: 0,
    changePercentage: 0
  });
  const session = useSession();
  
  // Fetch CCL rate
  useEffect(() => {
    const fetchCCLRate = async () => {
      try {
        const response = await fetch('https://dolarapi.com/v1/dolares/contadoconliqui');
        if (response.ok) {
          const data = await response.json();
          if (data && data.venta) {
            setCclRate(data.venta);
          }
        }
      } catch (error) {
        console.error('Error fetching CCL rate:', error);
        // Keep default rate if fetch fails
      }
    };
    
    fetchCCLRate();
  }, []);
  
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
      
      const investmentsData = data as InvestmentType[] || [];
      setInvestments(investmentsData);
      
      // Calculate portfolio stats
      let totalARS = 0;
      let totalUSD = 0;
      const uniqueAssets = new Set();
      
      investmentsData.forEach(inv => {
        // Track unique assets
        uniqueAssets.add(inv.symbol || inv.activo);
        
        // Calculate current value (mock for demo purposes)
        const priceChange = Math.random() * 0.1 * (Math.random() > 0.5 ? 1 : -1); // -10% to +10%
        const currentPrice = inv.precio_compra * (1 + priceChange);
        const totalValue = currentPrice * inv.cantidad;
        
        // Add to appropriate currency total and convert as needed
        if (inv.moneda === "ARS") {
          totalARS += totalValue;
          totalUSD += totalValue / cclRate;
        } else {
          totalUSD += totalValue;
          totalARS += totalValue * cclRate;
        }
      });
      
      setPortfolioStats({
        totalARS,
        totalUSD,
        totalAssets: uniqueAssets.size,
        changePercentage: (Math.random() * 2 - 1) // Random number between -1% and +1%
      });
      
    } catch (error: any) {
      console.error('Error al cargar inversiones:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    fetchInvestments();
  }, [session, cclRate]);
  
  const handleAddSuccess = () => {
    setShowAddForm(false);
    fetchInvestments();
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold text-foreground">Mi Cartera de inversiones</h2>
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
      
      {/* Portfolio Stats based on the reference image */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-primary-900 text-white">
          <CardHeader className="pb-2">
            <CardDescription className="text-white/70">Portfolio ARS</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-10 w-3/4 bg-white/10" />
            ) : (
              <>
                <div className="text-3xl font-bold">${portfolioStats.totalARS.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                <div className={`text-sm flex items-center mt-1 ${portfolioStats.changePercentage >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {portfolioStats.changePercentage >= 0 ? '+' : ''}{portfolioStats.changePercentage.toFixed(2)}% variación
                </div>
              </>
            )}
          </CardContent>
        </Card>
        
        <Card className="bg-primary-900 text-white">
          <CardHeader className="pb-2">
            <CardDescription className="text-white/70">Portfolio USD</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-10 w-3/4 bg-white/10" />
            ) : (
              <>
                <div className="text-3xl font-bold">${portfolioStats.totalUSD.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                <div className={`text-sm flex items-center mt-1 ${portfolioStats.changePercentage >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {portfolioStats.changePercentage >= 0 ? '+' : ''}{portfolioStats.changePercentage.toFixed(2)}% variación
                </div>
              </>
            )}
          </CardContent>
        </Card>
        
        <Card className="bg-primary-900 text-white">
          <CardHeader className="pb-2">
            <CardDescription className="text-white/70">Activos</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-10 w-3/4 bg-white/10" />
            ) : (
              <>
                <div className="text-3xl font-bold">{portfolioStats.totalAssets}</div>
                <div className="text-sm mt-1">Cantidad de activos únicos</div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
      
      {/* Summary table moved here, right below the cards */}
      {!isLoading && investments.length > 0 && (
        <InvestmentSummaryTable investments={investments} cclRate={cclRate} />
      )}
      
      {showAddForm && (
        <Card>
          <CardHeader>
            <CardTitle className="text-foreground">Nueva inversión</CardTitle>
            <CardDescription>Ingresa los detalles de tu nueva inversión</CardDescription>
          </CardHeader>
          <CardContent>
            <AddInvestmentForm onSuccess={handleAddSuccess} />
          </CardContent>
        </Card>
      )}
      
      <Tabs defaultValue="all">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
          <ScrollArea className="w-full md:w-auto whitespace-nowrap">
            <TabsList>
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
          
          <div className="flex items-center mt-4 md:mt-0 gap-2">
            <div className="relative w-[250px]">
              <Input 
                placeholder="Buscar por ticker o nombre..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 absolute left-2.5 top-2.5 text-muted-foreground" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
              </svg>
            </div>
            <Button variant="outline" size="sm" className="gap-2">
              <Filter className="h-4 w-4" />
              Filtrar
            </Button>
          </div>
        </div>
        
        <TabsContent value="all">
          <InvestmentsList filter="all" searchTerm={searchTerm} />
        </TabsContent>
        
        <TabsContent value="crypto">
          <InvestmentsList filter="crypto" searchTerm={searchTerm} />
        </TabsContent>
        
        <TabsContent value="cedears">
          <InvestmentsList filter="cedears" searchTerm={searchTerm} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
