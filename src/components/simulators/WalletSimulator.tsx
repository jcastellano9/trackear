
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Search } from "lucide-react";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface Wallet {
  name: string;
  logo: string;
  rate: number;
  provider: string;
}

// Esta función simula la llamada a la API para obtener tasas actualizadas
const fetchWallets = async (): Promise<Wallet[]> => {
  try {
    // En un ambiente real, esta sería la llamada a la API
    // const response = await axios.get('https://api.argentinadatos.com/v1/finanzas/rendimientos');
    // return response.data.wallets;

    // Datos de ejemplo
    return [
      { provider: "mercado_pago", name: "Mercado Pago", logo: "https://www.mercadopago.com/org-img/MP3/logo/logomp3.svg", rate: 97.5 },
      { provider: "uala", name: "Ualá", logo: "https://play-lh.googleusercontent.com/Czh-ajGR5uP2vwAW9mGqhg1CMUj2H8EQkJFAUW3ZB5SZ9axbM5YGxavoyWQjBzxGZA", rate: 96 },
      { provider: "naranja_x", name: "Naranja X", logo: "https://appstore.naranjax.com/static/media/icon192.c3cf0cef.png", rate: 95 },
      { provider: "lemon_cash", name: "Lemon Cash", logo: "https://lemoncash.com.ar/wp-content/uploads/2022/02/favicon-4-2-256x256.png", rate: 94 },
      { provider: "belo", name: "Belo", logo: "https://play-lh.googleusercontent.com/MNkfK6CncL8wRwHWcXm-Z6RwgaivA6hOG2taiQH0ZEpDskXN6LIVaSZBZ0sDrq4C3TUN", rate: 93 },
    ];
  } catch (error) {
    console.error("Error fetching wallet rates:", error);
    throw error;
  }
};

const TERM_OPTIONS = [
  { value: 1, label: "1 mes" },
  { value: 3, label: "3 meses" },
  { value: 6, label: "6 meses" },
  { value: 12, label: "12 meses" },
  { value: 24, label: "24 meses" },
];

export function WalletSimulator() {
  const [amount, setAmount] = useState<number>(100000);
  const [months, setMonths] = useState<number>(12);
  const [selectedWallet, setSelectedWallet] = useState<string | null>(null);
  const [results, setResults] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Consulta para obtener las billeteras y sus tasas
  const { data: wallets = [], isLoading, error } = useQuery({
    queryKey: ['walletRates'],
    queryFn: fetchWallets,
  });

  // Get selected wallet
  const selectedWalletData = selectedWallet 
    ? wallets.find(wallet => wallet.provider === selectedWallet) 
    : null;
  
  // Calculate for single wallet if selected
  useEffect(() => {
    if (error) {
      toast.error("No se pudieron cargar las tasas de las billeteras virtuales");
      return;
    }
    
    if (wallets.length > 0 && amount > 0) {
      calculateWalletReturns();
    }
  }, [selectedWallet, amount, months, wallets]);

  const calculateWalletReturns = () => {
    if (!amount || amount <= 0) {
      toast.error("Ingresa un monto válido mayor a cero");
      return;
    }

    // Filter only selected wallet if chosen, otherwise calculate for all
    const walletsToCalculate = selectedWallet 
      ? wallets.filter(wallet => wallet.provider === selectedWallet)
      : wallets;

    const calculatedResults = walletsToCalculate.map(wallet => {
      const monthlyRate = wallet.rate / 100 / 12;
      let finalAmount = amount;
      
      for (let i = 0; i < months; i++) {
        finalAmount += finalAmount * monthlyRate;
      }
      
      const profit = finalAmount - amount;
      const yearlyRate = Math.pow(1 + monthlyRate, 12) - 1;
      
      return {
        name: wallet.name,
        logo: wallet.logo,
        initialAmount: amount,
        finalAmount,
        profit,
        yearlyRate: yearlyRate * 100,
        effectiveRate: wallet.rate,
        months
      };
    });
    
    // Sort by profit (highest first)
    calculatedResults.sort((a, b) => b.profit - a.profit);
    setResults(calculatedResults);
  };

  return (
    <div className="space-y-6">
      <Card className="glass-card">
        <CardHeader>
          <CardTitle>Simulador de Rendimiento de Billeteras Virtuales</CardTitle>
          <CardDescription>
            Calcula cuánto generarían distintas billeteras virtuales según su tasa y plazo
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label>Billetera Virtual</Label>
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-full justify-between bg-background/40 border-white/10"
                    disabled={isLoading}
                  >
                    {isLoading ? "Cargando billeteras..." : (
                      selectedWalletData ? selectedWalletData.name : "Todas las billeteras"
                    )}
                    <Search className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0" align="start">
                  <Command>
                    <CommandInput placeholder="Buscar billetera..." value={searchTerm} onValueChange={setSearchTerm} />
                    <CommandList>
                      <CommandEmpty>No se encontraron billeteras.</CommandEmpty>
                      <CommandGroup>
                        <CommandItem
                          value="all"
                          onSelect={() => {
                            setSelectedWallet(null);
                            setOpen(false);
                          }}
                        >
                          Todas las billeteras
                        </CommandItem>
                        {wallets.map((wallet) => (
                          <CommandItem
                            key={wallet.provider}
                            value={wallet.provider}
                            onSelect={() => {
                              setSelectedWallet(wallet.provider);
                              setOpen(false);
                            }}
                          >
                            <div className="flex items-center gap-2">
                              <img 
                                src={wallet.logo} 
                                alt={wallet.name} 
                                className="h-4 w-4 object-contain"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  target.src = "https://via.placeholder.com/24?text=?";
                                }}
                              />
                              {wallet.name} ({wallet.rate.toFixed(1)}% TNA)
                            </div>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>
            <div className="space-y-2">
              <Label htmlFor="amount">Monto a invertir (ARS)</Label>
              <Input
                id="amount"
                type="number"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                min="1000"
                step="1000"
                className="bg-background/40 border-white/10"
              />
              <p className="text-xs text-muted-foreground">
                Monto mínimo recomendado: $1.000
              </p>
            </div>
            
            <div className="space-y-2">
              <Label>Plazo</Label>
              <ToggleGroup type="single" value={months.toString()} onValueChange={(value) => setMonths(Number(value))} className="flex flex-wrap justify-between">
                {TERM_OPTIONS.map((option) => (
                  <ToggleGroupItem key={option.value} value={option.value.toString()} className="flex-1 min-w-[50px] text-xs md:text-sm my-1">
                    {option.label}
                  </ToggleGroupItem>
                ))}
              </ToggleGroup>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="glass-card">
        <CardHeader>
          <CardTitle>Resultados de la simulación</CardTitle>
          <CardDescription>
            Comparativa de rendimientos entre distintas billeteras virtuales
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center h-[200px]">
              <p>Cargando datos de billeteras...</p>
            </div>
          ) : results.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[180px]">Billetera</TableHead>
                  <TableHead>TNA</TableHead>
                  <TableHead>Rendimiento</TableHead>
                  <TableHead className="text-right">Monto final</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {results.map((result, index) => (
                  <TableRow key={index} className={index === 0 ? "bg-blue-900/20" : ""}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <img 
                          src={result.logo} 
                          alt={result.name} 
                          className="h-6 w-6 object-contain"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = "https://via.placeholder.com/24?text=?";
                          }}
                        />
                        <div className="font-medium">{result.name}</div>
                      </div>
                    </TableCell>
                    <TableCell>{result.effectiveRate.toFixed(1)}%</TableCell>
                    <TableCell className="font-medium text-finance-positive">
                      +${result.profit.toLocaleString('es-AR', {maximumFractionDigits: 0})}
                      <div className="text-xs text-muted-foreground">
                        (+{(result.profit / result.initialAmount * 100).toFixed(2)}%)
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      ${result.finalAmount.toLocaleString('es-AR', {maximumFractionDigits: 0})}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="flex justify-center items-center h-[100px]">
              <p>Seleccione parámetros para ver los resultados</p>
            </div>
          )}

          <div className="mt-4 text-xs text-muted-foreground">
            <p>* Los cálculos son estimativos y pueden variar según las políticas de cada billetera.</p>
            <p>* Las tasas utilizadas son aproximadas y pueden cambiar sin previo aviso.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
