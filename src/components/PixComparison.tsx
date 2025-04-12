
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { RefreshCw, Search, ExternalLink } from "lucide-react";
import { PixWallet } from "@/types/pixWallet";
import { fetchPixWallets } from "@/services/pixService";
import { formatTime } from "@/utils/formatUtils";
import { PixSimulator } from "./pix/PixSimulator";
import { PixWalletsTable } from "./pix/PixWalletsTable";

export function PixComparison() {
  const [searchTerm, setSearchTerm] = useState("");
  const [amount, setAmount] = useState<number>(1000);
  
  // Use react-query to fetch data
  const { data: pixWallets, isLoading, isError, refetch } = useQuery({
    queryKey: ['pixWallets'],
    queryFn: fetchPixWallets,
  });
  
  // Filter wallets based on search term
  const filteredWallets = pixWallets?.filter(wallet => 
    wallet.name.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-semibold">Comparador de PIX</h2>
          <p className="text-muted-foreground">
            Encontrá la mejor opción para enviar dinero a Brasil
          </p>
        </div>
        
        <div className="w-full md:w-auto flex items-center gap-2">
          <div className="relative w-full md:w-auto">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar proveedor..."
              className="pl-8 w-full dark:bg-zinc-900"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <button 
            onClick={() => refetch()} 
            className="p-2 rounded-md hover:bg-secondary transition-colors"
            aria-label="Actualizar datos"
          >
            <RefreshCw className={`h-5 w-5 ${isLoading ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>
      
      <PixSimulator 
        pixWallets={pixWallets}
        isLoading={isLoading}
        isError={isError}
        amount={amount}
        setAmount={setAmount}
      />
      
      <Card className="dark:bg-zinc-900 border-zinc-800">
        <CardHeader className="pb-2">
          <CardTitle>Todos los Proveedores</CardTitle>
          <CardDescription>
            Comparativo completo de opciones para enviar dinero a Brasil
          </CardDescription>
        </CardHeader>
        <CardContent>
          <PixWalletsTable
            pixWallets={pixWallets}
            filteredWallets={filteredWallets}
            isLoading={isLoading}
            isError={isError}
            amount={amount}
          />
        </CardContent>
      </Card>
      
      <div className="text-sm text-muted-foreground flex items-center justify-between">
        <div>
          Datos obtenidos de <a href="https://comparapix.ar" target="_blank" rel="noopener noreferrer" className="underline underline-offset-4 inline-flex items-center gap-1">comparapix.ar <ExternalLink className="h-3 w-3" /></a>
        </div>
        <div>
          Última actualización: {pixWallets?.length ? formatTime(pixWallets[0].lastUpdated) : "..."}
        </div>
      </div>
    </div>
  );
}
