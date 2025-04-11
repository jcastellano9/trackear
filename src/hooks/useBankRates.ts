
import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { toast } from "sonner";

interface Bank {
  id: string;
  name: string;
  rate: number;
  logo: string;
}

// Esta función simula la llamada a la API para obtener tasas actualizadas
const fetchBankRates = async (): Promise<Bank[]> => {
  try {
    // En un ambiente real, esta sería la llamada a la API
    // const response = await axios.get('https://comparatasas-gateway.ferminrp.com/v1/finanzas/rendimientos');
    // return response.data.banks;

    // Datos de ejemplo
    return [
      { id: "nacion", name: "Banco Nación", rate: 118, logo: "https://www.bancoprovincia.com.ar/CDN/Get/logo_BP_og" },
      { id: "provincia", name: "Banco Provincia", rate: 115, logo: "https://www.bancoprovincia.com.ar/CDN/Get/logo_BP_og" },
      { id: "galicia", name: "Banco Galicia", rate: 112, logo: "https://www.bancogalicia.com/contentsite/etc.clientlibs/settings/wcm/designs/bancogalicia/clientlib-all/resources/images/og-images/logo-corporativo.png" },
      { id: "santander", name: "Banco Santander", rate: 110, logo: "https://www.santander.com.ar/banco/wcm/connect/e0c86350-9cdb-43fa-93ad-fde61d7ecf26/imagen_og_tag_Santander.jpg?MOD=AJPERES&CACHEID=ROOTWORKSPACE-e0c86350-9cdb-43fa-93ad-fde61d7ecf26-nA6QU9." },
      { id: "bbva", name: "BBVA", rate: 108, logo: "https://www.bbva.com.ar/content/dam/public-web/bbva/ar/images/logos/logo_bbva_600x315.png" },
    ];
  } catch (error) {
    console.error("Error fetching bank rates:", error);
    throw error;
  }
};

export function useBankRates() {
  const [bank, setBank] = useState<string>("");
  
  // Consulta para obtener los bancos y sus tasas
  const { data: banks = [], isLoading, error } = useQuery({
    queryKey: ['bankRates'],
    queryFn: fetchBankRates,
  });

  // Obtener la tasa del banco seleccionado
  const selectedBank = banks.find(b => b.id === bank);
  const rate = selectedBank?.rate || 0;

  useEffect(() => {
    // Si hay un error en la carga, mostrar notificación
    if (error) {
      toast.error("No se pudieron cargar las tasas de los bancos");
    }

    // Seleccionar el primer banco por defecto cuando se cargan los datos
    if (banks.length > 0 && !bank) {
      setBank(banks[0].id);
    }
  }, [banks, error, bank]);

  return {
    banks,
    bank,
    setBank,
    rate,
    isLoading,
    error
  };
}
