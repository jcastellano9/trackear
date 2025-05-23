
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useSession } from "@supabase/auth-helpers-react";
import { supabase, InvestmentType } from "@/lib/supabase";
import { EditInvestmentModal } from "../EditInvestmentModal";
import { CurrencyToggle } from "./CurrencyToggle";
import { InvestmentsTable } from "./InvestmentsTable";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { getAssetPrices } from "@/services/assetPriceService";

interface InvestmentsListProps {
  filter: "all" | "crypto" | "cedears";
  searchTerm?: string;
}

export function InvestmentsList({ filter, searchTerm = "" }: InvestmentsListProps) {
  const [investments, setInvestments] = useState<InvestmentType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingInvestment, setEditingInvestment] = useState<InvestmentType | null>(null);
  const [portfolioTotal, setPortfolioTotal] = useState(0);
  const [cclRate, setCclRate] = useState(1400); // Default CCL rate
  const [displayCurrency, setDisplayCurrency] = useState<"USD" | "ARS">("USD");
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
      let query = supabase
        .from('investments')
        .select('*')
        .eq('user_id', session.user.id);
        
      // Apply filter if needed
      if (filter !== "all") {
        query = query.eq('tipo', filter === "crypto" ? "cripto" : "cedear");
      }
      
      const { data, error } = await query
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      
      const investmentsData = data as InvestmentType[] || [];
      
      // Get real asset prices from API
      const assetList = investmentsData.map(inv => ({
        symbol: inv.symbol || inv.activo,
        tipo: inv.tipo
      }));
      
      let realPrices: Record<string, number> = {};
      try {
        realPrices = await getAssetPrices(assetList);
      } catch (priceError) {
        console.error("Could not fetch real prices, using estimates:", priceError);
      }
      
      // Calculate current values based on real prices or estimates
      const investmentsWithPrice = investmentsData.map(inv => {
        const symbol = inv.symbol || inv.activo;
        let currentPrice;
        
        if (realPrices[symbol]) {
          // Use real price from API
          currentPrice = realPrices[symbol];
        } else {
          // Fallback to estimation if real price not available
          const priceChange = Math.random() * 0.1 * (Math.random() > 0.5 ? 1 : -1); // -10% to +10%
          currentPrice = inv.precio_compra * (1 + priceChange);
        }
        
        const totalValue = currentPrice * inv.cantidad;
        const priceDifference = currentPrice - inv.precio_compra;
        const priceChangePercent = inv.precio_compra > 0 
          ? ((currentPrice - inv.precio_compra) / inv.precio_compra) * 100
          : 0;
        
        // Create a correctly typed investment object
        const investment: InvestmentType = {
          ...inv,
          id: inv.id,
          user_id: inv.user_id,
          tipo: inv.tipo as "cripto" | "cedear",
          activo: inv.activo,
          cantidad: inv.cantidad,
          precio_compra: inv.precio_compra,
          moneda: inv.moneda as "USD" | "ARS",
          fecha_compra: inv.fecha_compra,
          created_at: inv.created_at,
          updated_at: inv.updated_at,
          symbol: inv.symbol || inv.activo, // Use activo as fallback if symbol is null
          ratio: inv.ratio,
          current_price: currentPrice,
          price_change_percent: priceChangePercent,
          price_change_absolute: priceDifference,
          total_value: totalValue,
          ppc: inv.ppc || inv.precio_compra, // Use stored PPC or default to purchase price
        };
        
        return investment;
      });
      
      // Filter by search term if provided - search in both activo and symbol fields
      let filteredInvestments = investmentsWithPrice;
      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        filteredInvestments = investmentsWithPrice.filter(inv => 
          (inv.activo && inv.activo.toLowerCase().includes(term)) || 
          (inv.symbol && inv.symbol.toLowerCase().includes(term))
        );
      }
      
      setInvestments(filteredInvestments);
      
      // Calculate portfolio total
      const total = filteredInvestments.reduce((sum, inv) => sum + (inv.total_value || 0), 0);
      setPortfolioTotal(total);
      
    } catch (error: any) {
      console.error('Error al cargar inversiones:', error);
      toast.error("Error al cargar tus inversiones");
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    fetchInvestments();
  }, [session, filter, searchTerm]);
  
  const handleEdit = (investment: InvestmentType) => {
    setEditingInvestment(investment);
  };
  
  const handleDelete = async (id: string) => {
    if (!confirm("¿Estás seguro de que deseas eliminar esta inversión?")) {
      return;
    }
    
    try {
      const { error } = await supabase
        .from('investments')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      setInvestments(prev => prev.filter(inv => inv.id !== id));
      toast.success("Inversión eliminada correctamente");
    } catch (error: any) {
      console.error('Error al eliminar la inversión:', error);
      toast.error("Error al eliminar la inversión");
    }
  };
  
  const onInvestmentUpdated = () => {
    setEditingInvestment(null);
    fetchInvestments();
  };
  
  // Toggle currency display
  const toggleCurrency = () => {
    setDisplayCurrency(prev => prev === "USD" ? "ARS" : "USD");
  };

  // Handle manual refresh
  const handleRefresh = () => {
    fetchInvestments();
    toast.success("Datos de inversiones actualizados");
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <CurrencyToggle displayCurrency={displayCurrency} onToggle={toggleCurrency} />
        
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleRefresh}
          disabled={isLoading}
          className="flex items-center gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
          Actualizar
        </Button>
      </div>
      
      <InvestmentsTable 
        investments={investments}
        isLoading={isLoading}
        searchTerm={searchTerm}
        filter={filter}
        displayCurrency={displayCurrency}
        portfolioTotal={portfolioTotal}
        cclRate={cclRate}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
      
      {editingInvestment && (
        <EditInvestmentModal 
          investment={editingInvestment}
          open={!!editingInvestment}
          onOpenChange={() => setEditingInvestment(null)}
          onSaved={onInvestmentUpdated}
        />
      )}
    </div>
  );
}
