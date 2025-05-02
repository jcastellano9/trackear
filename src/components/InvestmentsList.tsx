
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, Download, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { toast } from "sonner";
import { formatCurrency } from "@/utils/formatUtils";
import { EditInvestmentModal } from "./EditInvestmentModal";
import { useSession } from "@supabase/auth-helpers-react";
import { supabase, InvestmentType } from "@/lib/supabase";

interface InvestmentsListProps {
  filter: "all" | "crypto" | "cedears";
}

export function InvestmentsList({ filter }: InvestmentsListProps) {
  const [investments, setInvestments] = useState<InvestmentType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingInvestment, setEditingInvestment] = useState<InvestmentType | null>(null);
  const session = useSession();
  
  const fetchInvestments = async () => {
    if (!session?.user) return;
    
    setIsLoading(true);
    try {
      let query = supabase
        .from('investments')
        .select('*')
        .eq('user_id', session.user.id);
        
      // Aplicar filtro si es necesario
      if (filter !== "all") {
        query = query.eq('tipo', filter === "crypto" ? "cripto" : "cedear");
      }
      
      const { data, error } = await query
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      
      setInvestments(data || []);
    } catch (error: any) {
      console.error('Error al cargar inversiones:', error);
      toast.error("Error al cargar tus inversiones");
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    fetchInvestments();
  }, [session, filter]);
  
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

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-12 bg-muted rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (investments.length === 0) {
    return (
      <Card className="border-dashed">
        <CardContent className="p-6 text-center">
          <p className="text-muted-foreground mb-4">
            No tienes inversiones {filter !== "all" ? `de tipo ${filter === "crypto" ? "criptomoneda" : "CEDEAR"}` : ""} registradas
          </p>
          <Button variant="outline">Agregar tu primera inversión</Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {investments.map((investment) => {
        const isProfitable = Math.random() > 0.5; // En un caso real esto sería calculado
        
        return (
          <Card key={investment.id} className="overflow-hidden transition-all hover:shadow-md">
            <CardContent className="p-0">
              <div className="flex items-center justify-between p-4 border-l-4 border-l-primary">
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Badge variant={investment.tipo === "cripto" ? "default" : "outline"}>
                        {investment.tipo === "cripto" ? "Cripto" : "CEDEAR"}
                      </Badge>
                      <h3 className="font-semibold">{investment.activo}</h3>
                    </div>
                    <div className="flex items-center space-x-2">
                      {isProfitable ? (
                        <span className="flex items-center text-green-500 text-sm">
                          <ArrowUpRight className="h-4 w-4 mr-1" />
                          +2.4%
                        </span>
                      ) : (
                        <span className="flex items-center text-red-500 text-sm">
                          <ArrowDownRight className="h-4 w-4 mr-1" />
                          -1.2%
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="mt-2 flex justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Cantidad: <span className="font-medium text-foreground">{investment.cantidad}</span></p>
                      <p className="text-sm text-muted-foreground">Precio compra: <span className="font-medium text-foreground">{formatCurrency(investment.precio_compra, investment.moneda)}</span></p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Fecha: <span className="font-medium text-foreground">{new Date(investment.fecha_compra).toLocaleDateString()}</span></p>
                      <p className="text-sm text-muted-foreground">Total: <span className="font-medium text-foreground">{formatCurrency(investment.cantidad * investment.precio_compra, investment.moneda)}</span></p>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col space-y-2 ml-4">
                  <Button variant="ghost" size="icon" onClick={() => handleEdit(investment)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="text-red-500" onClick={() => handleDelete(investment.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
      
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
