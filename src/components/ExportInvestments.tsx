
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { DownloadCloud } from "lucide-react";
import { useSession } from "@supabase/auth-helpers-react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

export function ExportInvestments() {
  const [isExporting, setIsExporting] = useState(false);
  const session = useSession();

  const exportToCSV = async () => {
    if (!session?.user) {
      toast.error("Debes iniciar sesión para exportar tus inversiones");
      return;
    }
    
    setIsExporting(true);
    
    try {
      // Fetch user's investments
      const { data, error } = await supabase
        .from('investments')
        .select('*')
        .eq('user_id', session.user.id);
        
      if (error) throw error;
      
      if (!data || data.length === 0) {
        toast.info("No tienes inversiones para exportar");
        return;
      }
      
      // Convert data to CSV
      const headers = [
        'Tipo',
        'Activo',
        'Símbolo',
        'Cantidad',
        'Precio de compra',
        'Moneda',
        'Fecha de compra',
        'Ratio (CEDEARs)',
        'Valor total'
      ];
      
      const csvRows = [
        headers.join(','),
        ...data.map(item => [
          item.tipo === 'cripto' ? 'Criptomoneda' : 'CEDEAR',
          `"${item.activo}"`, // Wrap in quotes to handle commas in names
          item.symbol || '',
          item.cantidad,
          item.precio_compra,
          item.moneda,
          new Date(item.fecha_compra).toLocaleDateString(),
          item.ratio || '',
          item.cantidad * item.precio_compra
        ].join(','))
      ];
      
      const csvContent = csvRows.join('\n');
      
      // Create a blob and download link
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      
      link.setAttribute('href', url);
      link.setAttribute('download', `inversiones_trackear_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success("Inversiones exportadas correctamente");
    } catch (error: any) {
      console.error("Error al exportar inversiones:", error);
      toast.error(error.message || "Error al exportar inversiones");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Button 
      variant="outline" 
      onClick={exportToCSV} 
      disabled={isExporting}
    >
      <DownloadCloud className="mr-2 h-4 w-4" />
      {isExporting ? "Exportando..." : "Exportar cartera"}
    </Button>
  );
}
