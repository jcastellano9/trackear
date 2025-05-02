
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, FileSpreadsheet, FileText, Loader2 } from "lucide-react";
import { useSession } from "@supabase/auth-helpers-react";
import { supabase, InvestmentType } from "@/lib/supabase";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function ExportInvestments() {
  const [isLoading, setIsLoading] = useState(false);
  const session = useSession();

  const fetchInvestments = async () => {
    if (!session?.user.id) {
      toast.error("Debes iniciar sesión para exportar tus inversiones");
      return null;
    }

    try {
      const { data, error } = await supabase
        .from("investments")
        .select("*")
        .eq("user_id", session.user.id);

      if (error) throw error;
      return data as InvestmentType[];
    } catch (error) {
      console.error("Error al obtener inversiones:", error);
      toast.error("No se pudieron cargar tus inversiones");
      return null;
    }
  };

  const exportAsCSV = async () => {
    setIsLoading(true);
    try {
      const investments = await fetchInvestments();
      if (!investments || investments.length === 0) {
        toast.warning("No hay inversiones para exportar");
        return;
      }

      // Preparar los encabezados
      const headers = [
        "Activo",
        "Tipo",
        "Cantidad",
        "Precio de compra",
        "Moneda",
        "Fecha de compra",
      ];
      
      // Preparar las filas
      const rows = investments.map((inv) => [
        inv.activo,
        inv.tipo,
        inv.cantidad.toString(),
        inv.precio_compra.toString(),
        inv.moneda,
        new Date(inv.fecha_compra).toLocaleDateString(),
      ]);

      // Construir el contenido CSV
      const csvContent = [
        headers.join(","),
        ...rows.map((row) => row.join(",")),
      ].join("\n");

      // Crear un blob y descargar el archivo
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", `inversiones_${new Date().toISOString().slice(0, 10)}.csv`);
      link.style.display = "none";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success("Inversiones exportadas en formato CSV");
    } catch (error) {
      console.error("Error al exportar inversiones:", error);
      toast.error("No se pudieron exportar tus inversiones");
    } finally {
      setIsLoading(false);
    }
  };

  const exportAsXLSX = async () => {
    setIsLoading(true);
    try {
      toast.info("Preparando archivo Excel...");
      
      // Para exportar como XLSX, necesitaríamos una biblioteca como xlsx.js
      // Por ahora mostraremos un mensaje informando que esta función está en desarrollo
      setTimeout(() => {
        toast.info("La exportación a Excel estará disponible próximamente");
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      console.error("Error al exportar inversiones:", error);
      toast.error("No se pudieron exportar tus inversiones");
      setIsLoading(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" disabled={isLoading}>
          {isLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Download className="mr-2 h-4 w-4" />
          )}
          Exportar
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={exportAsCSV}>
          <FileText className="mr-2 h-4 w-4" /> 
          Exportar como CSV
        </DropdownMenuItem>
        <DropdownMenuItem onClick={exportAsXLSX}>
          <FileSpreadsheet className="mr-2 h-4 w-4" /> 
          Exportar como Excel
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
