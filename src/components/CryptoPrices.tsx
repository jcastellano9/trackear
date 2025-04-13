
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { fetchCryptoPrices, type CryptoPrice } from "@/services/cryptoPriceService";
import { CryptoTableRow } from "@/components/crypto/CryptoTableRow";
import { CryptoTableSkeleton } from "@/components/crypto/CryptoTableSkeleton";

export function CryptoPrices() {
  const [cryptos, setCryptos] = useState<CryptoPrice[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchCryptoData = async () => {
    try {
      const data = await fetchCryptoPrices();
      setCryptos(data);
      setLastUpdated(new Date());
    } catch (error) {
      console.error("Error in component while fetching crypto data:", error);
      toast.error("Error al cargar los datos de criptomonedas");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCryptoData();
    
    // Refresh every 5 minutes
    const interval = setInterval(() => {
      fetchCryptoData();
    }, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  const refreshData = () => {
    setLoading(true);
    fetchCryptoData();
    toast.success("Actualizando precios de criptomonedas...");
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <CardTitle className="text-xl">Precios de Criptomonedas</CardTitle>
          <CardDescription>
            {lastUpdated
              ? `Última actualización: ${lastUpdated.toLocaleTimeString('es-AR')}`
              : "Cargando datos de mercado..."
            }
          </CardDescription>
        </div>
        <RefreshCw
          className={`h-4 w-4 cursor-pointer text-muted-foreground ${loading ? "animate-spin" : ""}`}
          onClick={refreshData}
        />
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Precio</TableHead>
                <TableHead>24h %</TableHead>
                <TableHead className="hidden md:table-cell">Cap. de Mercado</TableHead>
                <TableHead className="hidden lg:table-cell">Volumen (24h)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <CryptoTableSkeleton />
              ) : (
                cryptos.map((crypto) => (
                  <CryptoTableRow key={crypto.id} crypto={crypto} />
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
