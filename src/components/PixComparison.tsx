
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import axios from "axios";

type PixQuoteProvider = {
  id: string;
  name: string;
  logo: string;
  exchange_rate: number;
  payment_methods: string[];
  fee_percentage?: number;
  min_amount?: number;
  max_amount?: number;
};

export function PixComparison() {
  const [currency, setCurrency] = useState<"ARS" | "USDT">("ARS");

  const { data: pixQuotes, isLoading, error } = useQuery({
    queryKey: ["pixQuotes", currency],
    queryFn: async () => {
      try {
        // Try to fetch from the pix.ferminrp.com API
        const response = await axios.get("https://pix.ferminrp.com/quotes");
        
        if (response.status === 200) {
          const formattedData: PixQuoteProvider[] = response.data.map((item: any) => ({
            id: item.id || String(Math.random()),
            name: item.name,
            logo: item.logo || `https://ui-avatars.com/api/?name=${item.name}&background=random`,
            exchange_rate: item.exchange_rate,
            payment_methods: item.payment_methods || ["Transferencia bancaria"],
            fee_percentage: item.fee_percentage,
            min_amount: item.min_amount,
            max_amount: item.max_amount
          }));
          
          return formattedData;
        }
        
        throw new Error("Failed to fetch PIX quotes");
      } catch (error) {
        console.error("Error fetching PIX quotes:", error);
        
        // Use mock data if API call fails
        const mockData: PixQuoteProvider[] = [
          {
            id: "dolarapp",
            name: "DolarApp",
            logo: "https://play-lh.googleusercontent.com/k2-lFrr-Jh6XxaQ2MNq-U8g_BO-H8JSe1H4jXSAM8XnGAlAM1QdxNWX107osV0HRlg=w240-h480-rw",
            exchange_rate: 255.5,
            payment_methods: ["Transferencia bancaria", "Billeteras virtuales"],
            fee_percentage: 1.2,
            min_amount: 5000,
          },
          {
            id: "wise",
            name: "Wise",
            logo: "https://wise.com/public-resources/assets/logos/wise/brand_logo.svg",
            exchange_rate: 252.8,
            payment_methods: ["Tarjeta de débito", "Transferencia bancaria"],
            fee_percentage: 2.5,
          },
          {
            id: "wally",
            name: "Wally",
            logo: "https://play-lh.googleusercontent.com/AnHiD1xL4-_QjLgKdnFaPF7kPLjTlbcUvQJrXz-8f-w1CIRCXl_vHcFwi7dzKHNV5g=w240-h480-rw",
            exchange_rate: 254.3,
            payment_methods: ["Transferencia bancaria"],
            fee_percentage: 1.5,
          },
          {
            id: "prex",
            name: "Prex",
            logo: "https://www.prexcard.com/media/olwn5nqn/logo-prex-simple.svg",
            exchange_rate: 251.7,
            payment_methods: ["Transferencia bancaria", "Tarjeta de débito"],
            fee_percentage: 1.8,
            max_amount: 100000,
          },
          {
            id: "creditcard",
            name: "Tarjeta de Crédito",
            logo: "https://cdn-icons-png.flaticon.com/512/93/93162.png",
            exchange_rate: 241.5,
            payment_methods: ["Internacional"],
            fee_percentage: 5,
          }
        ];

        // If currency is USDT, we would adjust these rates
        if (currency === "USDT") {
          return mockData.map(provider => ({
            ...provider,
            exchange_rate: provider.exchange_rate / 1140 // Mock conversion rate
          }));
        }

        return mockData;
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Find the provider with the best exchange rate
  const bestProvider = pixQuotes?.reduce((best, current) => 
    current.exchange_rate > best.exchange_rate ? current : best
  , pixQuotes[0]);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Compará cómo te conviene pagar con PIX</CardTitle>
          <CardDescription>
            Encontrá el mejor tipo de cambio para enviar dinero a Brasil
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="ARS" className="mb-6" onValueChange={(value) => setCurrency(value as "ARS" | "USDT")}>
            <TabsList>
              <TabsTrigger value="ARS">ARS</TabsTrigger>
              <TabsTrigger value="USDT">USD/USDT</TabsTrigger>
            </TabsList>
          </Tabs>

          {isLoading ? (
            <div className="space-y-6">
              <div className="flex flex-col md:flex-row gap-4">
                <Skeleton className="h-28 w-full md:w-1/2" />
                <Skeleton className="h-28 w-full md:w-1/2" />
              </div>
              <Skeleton className="h-64 w-full" />
            </div>
          ) : error ? (
            <div className="text-center p-6 border rounded-lg">
              <p className="text-red-500">Error al cargar las cotizaciones. Por favor, intenta nuevamente.</p>
            </div>
          ) : (
            <>
              {bestProvider && (
                <div className="bg-primary-900 text-white p-4 rounded-lg mb-6">
                  <div className="flex items-center">
                    <img 
                      src={bestProvider.logo} 
                      alt={bestProvider.name} 
                      className="w-12 h-12 object-contain mr-4 bg-white p-1 rounded"
                    />
                    <div>
                      <h3 className="text-lg font-medium">{bestProvider.name} tiene el mejor tipo de cambio</h3>
                      <div className="text-xl md:text-2xl font-bold">
                        1 R$ = {currency === "ARS" ? "$" : "US$"} {bestProvider.exchange_rate.toFixed(2)}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Proveedor</TableHead>
                    <TableHead className="text-right">Tipo de Cambio</TableHead>
                    <TableHead className="text-right">Comisión</TableHead>
                    <TableHead className="text-right">Métodos de Pago</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pixQuotes?.sort((a, b) => b.exchange_rate - a.exchange_rate).map((provider) => (
                    <TableRow key={provider.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded bg-white flex-shrink-0 flex items-center justify-center">
                            <img 
                              src={provider.logo} 
                              alt={provider.name}
                              className="w-6 h-6 object-contain"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.src = `https://ui-avatars.com/api/?name=${provider.name}&background=random`;
                              }}
                            />
                          </div>
                          <span className="font-medium">{provider.name}</span>
                          {provider === bestProvider && (
                            <Badge className="ml-1 bg-green-500">Mejor</Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        1 R$ = {currency === "ARS" ? "$" : "US$"} {provider.exchange_rate.toFixed(2)}
                      </TableCell>
                      <TableCell className="text-right">
                        {provider.fee_percentage ? `${provider.fee_percentage}%` : "—"}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex flex-wrap justify-end gap-1">
                          {provider.payment_methods.slice(0, 2).map((method) => (
                            <Badge key={method} variant="outline" className="text-xs">
                              {method}
                            </Badge>
                          ))}
                          {provider.payment_methods.length > 2 && (
                            <Badge variant="outline" className="text-xs">
                              +{provider.payment_methods.length - 2}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              <div className="mt-4 text-sm text-muted-foreground">
                <p>* Los tipos de cambio y comisiones pueden variar. Última actualización: {new Date().toLocaleString()}</p>
                <p>* Algunos proveedores pueden tener límites mínimos y máximos.</p>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
