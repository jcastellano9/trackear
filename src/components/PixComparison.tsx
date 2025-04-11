
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { RefreshCw, Search, ExternalLink } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Define types for PIX wallets
type PixWallet = {
  name: string;
  logo?: string;
  exchangeRate: number;
  fee: number;
  processingTime: string; // We'll keep this in the data but not display it
  minimumAmount: number;
  maximumAmount?: number;
  features: string[];
  lastUpdated: string;
};

// Mock data for PIX wallets with logos
const MOCK_PIX_WALLETS: PixWallet[] = [
  {
    name: "Prex",
    logo: "https://play-lh.googleusercontent.com/A_OUicxIe4zyoF0QgXFkr4Jp9-KquJt1U_g6r-UcEpspfT_lmMt1J-aWbFtJQ9MdcQ=w240-h480-rw",
    exchangeRate: 3.89,
    fee: 0.5,
    processingTime: "1-2 horas",
    minimumAmount: 1000,
    maximumAmount: 100000,
    features: ["Envío de ARS a BRL", "Recepción de BRL a ARS", "Cuenta en Brasil"],
    lastUpdated: "2025-04-08T12:30:00Z",
  },
  {
    name: "Belo",
    logo: "https://belo.app/static/img/logo-belo.svg",
    exchangeRate: 3.91,
    fee: 0.3,
    processingTime: "30 min - 1 hora",
    minimumAmount: 500,
    maximumAmount: 200000,
    features: ["Envío de ARS a BRL", "Transferencia bancaria a Brasil", "Cuenta en Brasil"],
    lastUpdated: "2025-04-08T12:32:00Z",
  },
  {
    name: "Ripio",
    logo: "https://ripio.com/wp-content/uploads/2020/09/logo-brand.svg",
    exchangeRate: 3.85,
    fee: 0.7,
    processingTime: "1-3 horas",
    minimumAmount: 1000,
    maximumAmount: 150000,
    features: ["Envío de ARS a BRL", "Recepción de BRL a ARS", "Cuenta en Brasil"],
    lastUpdated: "2025-04-08T12:34:00Z",
  },
  {
    name: "Western Union",
    logo: "https://brand.westernunion.com/content/dam/wu/logo/logo_detail_yellow.png",
    exchangeRate: 3.80,
    fee: 1.0,
    processingTime: "2-4 horas",
    minimumAmount: 2000,
    maximumAmount: 250000,
    features: ["Envío de ARS a BRL", "Recepción de BRL a ARS", "Retiro en efectivo"],
    lastUpdated: "2025-04-08T12:36:00Z",
  },
  {
    name: "Wise",
    logo: "https://wise.com/public-resources/assets/logos/wise/brand_logo.svg",
    exchangeRate: 3.92,
    fee: 0.6,
    processingTime: "1-2 horas",
    minimumAmount: 1500,
    maximumAmount: 300000,
    features: ["Envío de ARS a BRL", "Cuenta multi-divisa", "Tarjeta internacional"],
    lastUpdated: "2025-04-08T12:38:00Z",
  },
  {
    name: "Global66",
    logo: "https://global66.com/static/logo-light-3ea2f326dc87da06a8fcd6d1c71badc7.svg",
    exchangeRate: 3.87,
    fee: 0.4,
    processingTime: "1-2 horas",
    minimumAmount: 1000,
    maximumAmount: 200000,
    features: ["Envío de ARS a BRL", "Recepción de BRL a ARS", "Sin cuenta en Brasil"],
    lastUpdated: "2025-04-08T12:40:00Z",
  },
];

// Function to fetch PIX wallets data
const fetchPixWallets = async () => {
  // In a real app, this would be an API call
  // For example: return fetch('https://api.comparapix.ar/wallets').then(res => res.json())
  
  // Simulate API latency
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Return mock data
  return MOCK_PIX_WALLETS;
};

export function PixComparison() {
  const [searchTerm, setSearchTerm] = useState("");
  const [amount, setAmount] = useState<number>(1000);
  
  // Use react-query to fetch data
  const { data: pixWallets, isLoading, isError, refetch } = useQuery({
    queryKey: ['pixWallets'],
    queryFn: fetchPixWallets,
  });
  
  // Format currency
  const formatCurrency = (value: number, currency: string) => {
    return new Intl.NumberFormat(currency === "BRL" ? "pt-BR" : "es-AR", {
      style: "currency",
      currency: currency,
      maximumFractionDigits: 2,
    }).format(value);
  };
  
  // Format percentage
  const formatPercentage = (value: number) => {
    return `${value.toFixed(2)}%`;
  };
  
  // Format time
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("es-AR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };
  
  // Filter wallets based on search term
  const filteredWallets = pixWallets?.filter(wallet => 
    wallet.name.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];
  
  // Calculate final amount after exchange rate and fees
  const calculateFinalAmount = (wallet: PixWallet, amount: number) => {
    // Calculate BRL amount based on exchange rate
    const brlAmount = amount * wallet.exchangeRate;
    
    // Apply fee
    const feeAmount = (wallet.fee / 100) * brlAmount;
    
    // Return final amount after fees
    return brlAmount - feeAmount;
  };
  
  // Find best wallet for a given amount
  const getBestWallet = (amount: number) => {
    if (!pixWallets?.length) return null;
    
    // Filter wallets that support this amount
    const eligibleWallets = pixWallets.filter(
      w => amount >= w.minimumAmount && (!w.maximumAmount || amount <= w.maximumAmount)
    );
    
    if (eligibleWallets.length === 0) return null;
    
    // Find wallet with best final amount
    return eligibleWallets.reduce((best, current) => {
      const bestAmount = calculateFinalAmount(best, amount);
      const currentAmount = calculateFinalAmount(current, amount);
      return currentAmount > bestAmount ? current : best;
    }, eligibleWallets[0]);
  };

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
      
      <Card className="dark:bg-zinc-900 border-zinc-800">
        <CardHeader className="pb-2">
          <CardTitle>Simulador de Envío</CardTitle>
          <CardDescription>
            Calculá cuánto recibirá en BRL tu destinatario en Brasil
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <Label htmlFor="amount">Monto a enviar (ARS)</Label>
              <Input
                id="amount"
                type="number"
                min="500"
                max="500000"
                value={amount}
                onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
                className="mt-1 dark:bg-zinc-950"
              />
            </div>
            
            {isLoading ? (
              <Skeleton className="h-36 w-full" />
            ) : isError ? (
              <div className="text-center py-6 text-destructive">
                Error al cargar datos. Intente nuevamente.
              </div>
            ) : getBestWallet(amount) ? (
              <div className="bg-zinc-800/50 p-4 rounded-lg">
                <div className="text-sm text-muted-foreground mb-1">
                  Mejor opción para {formatCurrency(amount, "ARS")}
                </div>
                <div className="flex justify-between items-center mb-3">
                  <div className="flex items-center gap-2">
                    {getBestWallet(amount)?.logo && (
                      <img 
                        src={getBestWallet(amount)?.logo} 
                        alt={getBestWallet(amount)?.name || "Logo"} 
                        className="h-8 w-8 object-contain" 
                      />
                    )}
                    <div className="text-xl font-semibold">{getBestWallet(amount)?.name}</div>
                  </div>
                  <Badge className="bg-green-600 hover:bg-green-700">Recomendado</Badge>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <div className="text-sm text-muted-foreground">Tipo de cambio</div>
                    <div className="font-medium">1 ARS = {getBestWallet(amount)?.exchangeRate.toFixed(2)} BRL</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Comisión</div>
                    <div className="font-medium">{formatPercentage(getBestWallet(amount)?.fee || 0)}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Monto que recibirá</div>
                    <div className="font-bold text-lg text-green-500">
                      {formatCurrency(calculateFinalAmount(getBestWallet(amount)!, amount), "BRL")}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-6 text-muted-foreground">
                No hay proveedores disponibles para este monto.
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      
      <Card className="dark:bg-zinc-900 border-zinc-800">
        <CardHeader className="pb-2">
          <CardTitle>Todos los Proveedores</CardTitle>
          <CardDescription>
            Comparativo completo de opciones para enviar dinero a Brasil
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-6">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-24 w-full" />
              ))}
            </div>
          ) : isError ? (
            <div className="text-center py-6 text-destructive">
              Error al cargar datos. Intente nuevamente.
            </div>
          ) : filteredWallets.length === 0 ? (
            <div className="text-center py-6 text-muted-foreground">
              No se encontraron proveedores que coincidan con la búsqueda.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Proveedor</TableHead>
                    <TableHead className="text-center">Tipo de Cambio</TableHead>
                    <TableHead className="text-center">Comisión</TableHead>
                    <TableHead className="text-center">Monto Mínimo</TableHead>
                    <TableHead className="text-center">Monto Máximo</TableHead>
                    <TableHead className="text-center">Ejemplo</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredWallets
                    .sort((a, b) => calculateFinalAmount(b, amount) - calculateFinalAmount(a, amount))
                    .map((wallet) => {
                      const isBest = getBestWallet(amount)?.name === wallet.name;
                      return (
                        <TableRow 
                          key={wallet.name} 
                          className={isBest ? 'bg-zinc-800/30' : ''}
                        >
                          <TableCell>
                            <div className="flex items-center gap-2">
                              {wallet.logo && (
                                <img 
                                  src={wallet.logo} 
                                  alt={`${wallet.name} logo`} 
                                  className="h-8 w-8 object-contain" 
                                />
                              )}
                              <div>
                                <div className="font-medium flex items-center gap-1">
                                  {wallet.name}
                                  {isBest && <Badge className="text-xs bg-green-600 hover:bg-green-700">Mejor</Badge>}
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  actualizado {formatTime(wallet.lastUpdated)}
                                </div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="text-center">
                            <div className="font-medium">1 ARS = {wallet.exchangeRate.toFixed(2)} BRL</div>
                          </TableCell>
                          <TableCell className="text-center">
                            {formatPercentage(wallet.fee)}
                          </TableCell>
                          <TableCell className="text-center">
                            {formatCurrency(wallet.minimumAmount, "ARS")}
                          </TableCell>
                          <TableCell className="text-center">
                            {wallet.maximumAmount 
                              ? formatCurrency(wallet.maximumAmount, "ARS") 
                              : "Sin límite"}
                          </TableCell>
                          <TableCell className="text-center">
                            <div className="font-semibold">
                              {amount >= wallet.minimumAmount && 
                               (!wallet.maximumAmount || amount <= wallet.maximumAmount)
                                ? formatCurrency(calculateFinalAmount(wallet, amount), "BRL")
                                : "No disponible"}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              para {formatCurrency(amount, "ARS")}
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                </TableBody>
              </Table>
            </div>
          )}
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

// Helper component for the Label
const Label = ({ htmlFor, children }: { htmlFor: string, children: React.ReactNode }) => (
  <label 
    htmlFor={htmlFor} 
    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
  >
    {children}
  </label>
);
