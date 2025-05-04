import { useState, useEffect } from "react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Edit, 
  Trash2, 
  ArrowUpRight, 
  ArrowDownRight, 
  Heart, 
  DollarSign, 
  Bitcoin 
} from "lucide-react";
import { toast } from "sonner";
import { formatCurrency } from "@/utils/formatUtils";
import { EditInvestmentModal } from "./EditInvestmentModal";
import { useSession } from "@supabase/auth-helpers-react";
import { supabase, InvestmentType } from "@/lib/supabase";
import { findAssetByValue } from "@/utils/investmentOptions";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";

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
      
      // Mock the current values for demonstration (in a real app these would come from an API)
      const investmentsWithPrice = (data || []).map(inv => {
        const priceChange = Math.random() * 0.1 * (Math.random() > 0.5 ? 1 : -1); // -10% to +10%
        const currentPrice = inv.precio_compra * (1 + priceChange);
        const totalValue = currentPrice * inv.cantidad;
        const priceDifference = currentPrice - inv.precio_compra;
        
        return {
          ...inv,
          symbol: inv.symbol || "", // Ensure symbol is always a string, even if null/undefined in database
          current_price: currentPrice,
          price_change_percent: priceChange * 100,
          price_change_absolute: priceDifference,
          total_value: totalValue,
          ppc: inv.ppc || inv.precio_compra, // Use stored PPC or default to purchase price
        };
      });
      
      // Filter by search term if provided
      let filteredInvestments = investmentsWithPrice;
      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        filteredInvestments = investmentsWithPrice.filter(inv => 
          (inv.activo && inv.activo.toLowerCase().includes(term)) || 
          (inv.symbol && inv.symbol.toLowerCase().includes(term))
        );
      }
      
      setInvestments(filteredInvestments as InvestmentType[]);
      
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

  // Convert currency based on display preference
  const convertCurrency = (value: number, originalCurrency: "USD" | "ARS") => {
    if (displayCurrency === originalCurrency) return value;
    
    // Convert from USD to ARS
    if (originalCurrency === "USD" && displayCurrency === "ARS") {
      return value * cclRate;
    }
    
    // Convert from ARS to USD
    if (originalCurrency === "ARS" && displayCurrency === "USD") {
      return value / cclRate;
    }
    
    return value;
  };
  
  // Format currency with the appropriate symbol
  const formatDisplayCurrency = (value: number, originalCurrency: "USD" | "ARS") => {
    const convertedValue = convertCurrency(value, originalCurrency);
    return formatCurrency(convertedValue, displayCurrency);
  };

  if (isLoading) {
    return (
      <div className="w-full overflow-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[60px]"></TableHead>
              <TableHead>Ticker</TableHead>
              <TableHead>Nombre</TableHead>
              <TableHead className="text-right">Precio actual</TableHead>
              <TableHead className="text-right">Cambio $</TableHead>
              <TableHead className="text-right">Cambio %</TableHead>
              {filter === "cedears" && <TableHead className="text-center">Ratio</TableHead>}
              <TableHead className="text-right">Cantidad</TableHead>
              <TableHead className="text-right">PPC</TableHead>
              <TableHead className="text-right">Tenencia</TableHead>
              <TableHead className="text-right">Asignación</TableHead>
              <TableHead className="text-right w-[100px]">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array(5).fill(0).map((_, i) => (
              <TableRow key={i}>
                {Array(filter === "cedears" ? 11 : 10).fill(0).map((_, j) => (
                  <TableCell key={j}>
                    <Skeleton className="h-6 w-full" />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }

  if (investments.length === 0) {
    return (
      <div className="text-center p-8 border rounded-lg">
        <p className="text-muted-foreground mb-4">
          {searchTerm 
            ? `No se encontraron inversiones que coincidan con "${searchTerm}"`
            : `No tienes inversiones ${filter !== "all" ? `de tipo ${filter === "crypto" ? "criptomoneda" : "CEDEAR"}` : ""} registradas`
          }
        </p>
        <Button variant="outline">Agregar tu primera inversión</Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end mb-4">
        <Button onClick={toggleCurrency} variant="outline" className="flex items-center gap-2">
          <DollarSign className="h-4 w-4" />
          Mostrar en {displayCurrency === "USD" ? "ARS" : "USD"}
        </Button>
      </div>
      
      <div className="w-full overflow-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[60px]"></TableHead>
              <TableHead>Ticker</TableHead>
              <TableHead>Nombre</TableHead>
              <TableHead className="text-right">Precio actual</TableHead>
              <TableHead className="text-right">Cambio $</TableHead>
              <TableHead className="text-right">Cambio %</TableHead>
              {filter === "cedears" && <TableHead className="text-center">Ratio</TableHead>}
              <TableHead className="text-right">Cantidad</TableHead>
              <TableHead className="text-right">PPC</TableHead>
              <TableHead className="text-right">Tenencia</TableHead>
              <TableHead className="text-right">Asignación</TableHead>
              <TableHead className="text-right w-[100px]">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {investments.map((investment) => {
              // Calculate allocation percentage
              const allocation = (investment.total_value || 0) / portfolioTotal * 100;
              
              return (
                <TableRow key={investment.id} className="hover:bg-muted/30">
                  <TableCell className="text-center">
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Heart className="h-4 w-4 text-muted-foreground" />
                    </Button>
                  </TableCell>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      {investment.symbol ? (
                        <img 
                          src={findAssetByValue(investment.symbol)?.logo || `https://ui-avatars.com/api/?name=${investment.symbol}&background=random`} 
                          alt={investment.symbol}
                          className="h-6 w-6 rounded-sm object-contain"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = `https://ui-avatars.com/api/?name=${investment.symbol}&background=random`;
                          }}
                        />
                      ) : (
                        <div className="h-6 w-6 rounded-sm bg-muted flex items-center justify-center">
                          {investment.tipo === "cripto" ? 
                            <Bitcoin className="h-4 w-4" /> : 
                            <span className="text-xs font-bold">C</span>
                          }
                        </div>
                      )}
                      {investment.symbol || "---"}
                    </div>
                  </TableCell>
                  <TableCell>{investment.activo}</TableCell>
                  <TableCell className="text-right font-medium">
                    {formatDisplayCurrency(investment.current_price || 0, investment.moneda)}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className={`flex items-center justify-end gap-1 ${
                      (investment.price_change_absolute || 0) > 0 
                        ? "text-green-500" 
                        : (investment.price_change_absolute || 0) < 0 
                          ? "text-red-500" 
                          : ""
                    }`}>
                      {(investment.price_change_absolute || 0) > 0 ? "+" : ""}
                      {formatDisplayCurrency(investment.price_change_absolute || 0, investment.moneda)}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className={`flex items-center justify-end gap-1 ${
                      (investment.price_change_percent || 0) > 0 
                        ? "text-green-500" 
                        : (investment.price_change_percent || 0) < 0 
                          ? "text-red-500" 
                          : ""
                    }`}>
                      {(investment.price_change_percent || 0) > 0 ? (
                        <ArrowUpRight className="h-4 w-4" />
                      ) : (investment.price_change_percent || 0) < 0 ? (
                        <ArrowDownRight className="h-4 w-4" />
                      ) : null}
                      <span>{(investment.price_change_percent || 0).toFixed(2)}%</span>
                    </div>
                  </TableCell>
                  {filter === "cedears" && (
                    <TableCell className="text-center">
                      {investment.ratio ? (
                        <Badge variant="outline">{investment.ratio}:1</Badge>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                  )}
                  <TableCell className="text-right">{investment.cantidad.toFixed(2)}</TableCell>
                  <TableCell className="text-right">
                    {formatDisplayCurrency(investment.ppc, investment.moneda)}
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    {formatDisplayCurrency(investment.total_value, investment.moneda)}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex flex-col gap-1">
                      <span>{allocation.toFixed(2)}%</span>
                      <Progress value={allocation} className="h-1.5" />
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(investment)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="text-red-500" onClick={() => handleDelete(investment.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
      
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
