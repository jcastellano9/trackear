import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

// Esquema de validación para el formulario
const formSchema = z.object({
  type: z.string({
    required_error: "Selecciona el tipo de inversión",
  }),
  name: z.string().min(2, {
    message: "El nombre debe tener al menos 2 caracteres",
  }),
  symbol: z.string().min(1, {
    message: "El símbolo es requerido",
  }),
  quantity: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: "La cantidad debe ser un número mayor a 0",
  }),
  purchasePrice: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: "El precio de compra debe ser un número mayor a 0",
  }),
  purchaseDate: z.string().min(1, {
    message: "La fecha de compra es requerida",
  }),
});

const cryptoOptions = [
  { value: "BTC", name: "Bitcoin", logo: "https://cryptologos.cc/logos/bitcoin-btc-logo.png" },
  { value: "ETH", name: "Ethereum", logo: "https://cryptologos.cc/logos/ethereum-eth-logo.png" },
  { value: "USDT", name: "Tether", logo: "https://cryptologos.cc/logos/tether-usdt-logo.png" },
  { value: "BNB", name: "Binance Coin", logo: "https://cryptologos.cc/logos/bnb-bnb-logo.png" },
  { value: "ADA", name: "Cardano", logo: "https://cryptologos.cc/logos/cardano-ada-logo.png" },
  { value: "SOL", name: "Solana", logo: "https://cryptologos.cc/logos/solana-sol-logo.png" },
  { value: "DOT", name: "Polkadot", logo: "https://cryptologos.cc/logos/polkadot-new-dot-logo.png" },
];

const cedearsOptions = [
  { value: "AAPL", name: "Apple Inc.", logo: "https://companieslogo.com/img/orig/AAPL-bf1a4314.png" },
  { value: "MSFT", name: "Microsoft", logo: "https://companieslogo.com/img/orig/MSFT-1384f0.png" },
  { value: "AMZN", name: "Amazon", logo: "https://companieslogo.com/img/orig/AMZN-e9f942e4.png" },
  { value: "GOOGL", name: "Alphabet", logo: "https://companieslogo.com/img/orig/GOOGL-0ed88f7c.png" },
  { value: "META", name: "Meta Platforms", logo: "https://companieslogo.com/img/orig/META-5599b38e.png" },
  { value: "TSLA", name: "Tesla", logo: "https://companieslogo.com/img/orig/TSLA-6da00fb2.png" },
  { value: "KO", name: "Coca-Cola", logo: "https://companieslogo.com/img/orig/KO-7fa7a6cc.png" },
];

const walletsOptions = [
  { value: "MP", name: "Mercado Pago", logo: "https://logodownload.org/wp-content/uploads/2019/06/mercado-pago-logo-1.png" },
  { value: "UALA", name: "Ualá", logo: "https://logos-marcas.com/wp-content/uploads/2021/03/Uala-Logo.png" },
  { value: "NAR", name: "Naranja X", logo: "https://www.redusers.com/noticias/wp-content/uploads/2020/07/naranjax_logo.png" },
  { value: "BRU", name: "Brubank", logo: "https://play-lh.googleusercontent.com/exoS4C9cm_GQD-RFKG2LNK0_-KQYtnJNcHCTc-qEKYPRDHVUz0abUnNNHWmTjh2Hh4Pk" },
];

type Investment = {
  id: string;
  type: string;
  name: string;
  symbol: string;
  quantity: number;
  purchasePrice: number;
  currentPrice: number;
  purchaseDate: string;
  currentValueUSD: number;
  purchaseValueUSD: number;
  profitUSD: number;
  profitPercentage: number;
  logo?: string;
  performance24h?: number;
  history?: { date: string; value: number }[];
  currentValueARS?: number;
  purchaseValueARS?: number;
  profitARS?: number;
};

type EditInvestmentModalProps = {
  isOpen: boolean;
  onClose: () => void;
  investment: Investment | null;
  onSave: (investment: any) => void;
};

export function EditInvestmentModal({ 
  isOpen, 
  onClose, 
  investment, 
  onSave 
}: EditInvestmentModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Inicializar el formulario con valores por defecto
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      type: investment?.type || "",
      name: investment?.name || "",
      symbol: investment?.symbol || "",
      quantity: investment?.quantity.toString() || "",
      purchasePrice: investment?.purchasePrice.toString() || "",
      purchaseDate: investment?.purchaseDate || new Date().toISOString().split("T")[0],
    },
  });

  // Función para manejar el envío del formulario
  const onSubmit = (data: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    
    // Preparar datos actualizados
    const updatedInvestment = {
      ...investment,
      type: data.type,
      name: data.name,
      symbol: data.symbol,
      quantity: Number(data.quantity),
      purchasePrice: Number(data.purchasePrice),
      purchaseDate: data.purchaseDate,
      purchaseValue: Number(data.quantity) * Number(data.purchasePrice),
      // El resto de los valores se calcularán cuando se guarde
    };
    
    setTimeout(() => {
      onSave(updatedInvestment);
      toast.success("Inversión actualizada correctamente");
      setIsSubmitting(false);
      onClose();
    }, 500);
  };

  // Estado para guardar el logo seleccionado
  const [selectedLogo, setSelectedLogo] = useState<string | undefined>(investment?.logo);

  // Función para obtener opciones basadas en el tipo
  const getOptionsByType = (type: string) => {
    switch (type) {
      case "crypto":
        return cryptoOptions;
      case "cedears":
        return cedearsOptions;
      case "wallets":
        return walletsOptions;
      default:
        return [];
    }
  };

  // Actualizar automáticamente el símbolo y el logo cuando se selecciona un nombre
  const handleAssetSelection = (name: string, type: string) => {
    const options = getOptionsByType(type);
    const selected = options.find(option => option.name === name);
    
    if (selected) {
      form.setValue("symbol", selected.value);
      setSelectedLogo(selected.logo);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Editar inversión</DialogTitle>
          <DialogDescription>
            Actualiza los detalles de tu inversión
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo de inversión</FormLabel>
                    <Select 
                      onValueChange={(value) => {
                        field.onChange(value);
                        form.setValue("name", "");
                        form.setValue("symbol", "");
                        setSelectedLogo(undefined);
                      }} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona un tipo" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="crypto">Criptomoneda</SelectItem>
                        <SelectItem value="cedears">CEDEAR</SelectItem>
                        <SelectItem value="wallets">Billetera Virtual</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Categoría de tu inversión
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre</FormLabel>
                    <Select 
                      onValueChange={(value) => {
                        field.onChange(value);
                        handleAssetSelection(value, form.getValues("type"));
                      }} 
                      defaultValue={field.value}
                      disabled={!form.getValues("type")}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona un activo" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {getOptionsByType(form.getValues("type")).map((option) => (
                          <SelectItem key={option.value} value={option.name}>
                            <div className="flex items-center gap-2">
                              <img src={option.logo} alt={option.name} className="h-4 w-4 object-contain" />
                              {option.name}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Nombre del activo o instrumento
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="symbol"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Símbolo</FormLabel>
                    <FormControl>
                      <Input readOnly {...field} />
                    </FormControl>
                    <FormDescription>
                      Símbolo o ticker del activo
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="quantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cantidad</FormLabel>
                    <FormControl>
                      <Input type="number" step="any" placeholder="Ej: 0.5, 10" {...field} />
                    </FormControl>
                    <FormDescription>
                      Cantidad adquirida
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="purchasePrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Precio de compra</FormLabel>
                    <FormControl>
                      <Input type="number" step="any" placeholder="Ej: 30000, 180.5" {...field} />
                    </FormControl>
                    <FormDescription>
                      Precio unitario en USD
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="purchaseDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fecha de compra</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormDescription>
                      Fecha de adquisición
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancelar
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Guardando..." : "Guardar cambios"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
