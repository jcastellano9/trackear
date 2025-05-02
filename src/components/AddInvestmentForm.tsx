
import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
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
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Loader2, Check, ChevronsUpDown } from "lucide-react";
import { useSession } from "@supabase/auth-helpers-react";
import { supabase, InvestmentType } from "@/lib/supabase";
import { getOptionsByType } from "@/utils/investmentOptions";
import { cn } from "@/lib/utils";

// Schema para validar los datos del formulario
const investmentSchema = z.object({
  tipo: z.enum(["cripto", "cedear"], {
    required_error: "Debes seleccionar el tipo de inversión",
  }),
  activo: z.string().min(1, {
    message: "Debes seleccionar el activo",
  }),
  cantidad: z.coerce.number().positive({
    message: "La cantidad debe ser un número positivo",
  }),
  precio_compra: z.coerce.number().positive({
    message: "El precio debe ser un número positivo",
  }),
  moneda: z.enum(["USD", "ARS"], {
    required_error: "Debes seleccionar una moneda",
  }),
  fecha_compra: z.string().min(1, {
    message: "Debes seleccionar una fecha",
  }),
  symbol: z.string().optional(),
  ratio: z.number().nullable().optional(),
});

interface AddInvestmentFormProps {
  onSuccess?: () => void;
}

export function AddInvestmentForm({ onSuccess }: AddInvestmentFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [assetOptions, setAssetOptions] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const session = useSession();

  // Configuración del formulario con React Hook Form
  const form = useForm<z.infer<typeof investmentSchema>>({
    resolver: zodResolver(investmentSchema),
    defaultValues: {
      tipo: "cripto",
      activo: "",
      cantidad: 0,
      precio_compra: 0,
      moneda: "USD",
      fecha_compra: new Date().toISOString().split("T")[0],
      symbol: "",
      ratio: null,
    },
  });

  // Update asset options when investment type changes
  const investmentType = form.watch("tipo");
  useEffect(() => {
    try {
      // Always initialize with an empty array to prevent undefined errors
      const options = getOptionsByType(investmentType) || [];
      setAssetOptions(options);
      form.setValue("activo", ""); // Reset asset when type changes
      form.setValue("symbol", ""); // Reset symbol when type changes
      form.setValue("ratio", null); // Reset ratio when type changes
    } catch (error) {
      console.error("Error loading asset options:", error);
      setAssetOptions([]);
    }
  }, [investmentType, form]);

  // Handle asset selection
  const onAssetSelect = (value: string) => {
    form.setValue("activo", value);
    
    // Find the selected asset to get its symbol and ratio
    const selectedAsset = assetOptions.find(option => option.value === value);
    if (selectedAsset) {
      form.setValue("symbol", selectedAsset.symbol || "");
      
      if (investmentType === "cedear" && selectedAsset.ratio) {
        form.setValue("ratio", selectedAsset.ratio);
      } else {
        form.setValue("ratio", null);
      }
      
      // Automatically set precio_compra with current market price
      // This would come from an API in a real application
      // For demonstration, we're using a mock price based on the asset
      const mockMarketPrice = selectedAsset.value.length * 100 + Math.random() * 1000;
      form.setValue("precio_compra", mockMarketPrice);
    }
    
    setOpen(false);
  };

  async function onSubmit(values: z.infer<typeof investmentSchema>) {
    if (!session?.user) {
      toast.error("Debes iniciar sesión para agregar inversiones");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Create a new investment object with proper typing
      const newInvestment = {
        tipo: values.tipo,
        activo: values.activo,
        cantidad: values.cantidad,
        precio_compra: values.precio_compra,
        moneda: values.moneda,
        fecha_compra: values.fecha_compra,
        user_id: session.user.id,
        created_at: new Date().toISOString(),
        symbol: values.symbol,
        ratio: values.ratio || null,
      };
      
      // Pass a properly typed object to Supabase
      const { error } = await supabase
        .from('investments')
        .insert(newInvestment);
        
      if (error) throw error;
      
      toast.success("Inversión agregada correctamente");
      form.reset({
        tipo: investmentType,
        activo: "",
        cantidad: 0,
        precio_compra: 0,
        moneda: "USD",
        fecha_compra: new Date().toISOString().split("T")[0],
        symbol: "",
        ratio: null,
      });
      onSuccess?.();
    } catch (error: any) {
      console.error("Error al guardar la inversión:", error);
      toast.error(error.message || "Error al guardar la inversión");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="tipo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tipo de inversión</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                  disabled={isSubmitting}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona el tipo" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="cripto">Criptomoneda</SelectItem>
                    <SelectItem value="cedear">CEDEAR</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>
                  Selecciona el tipo de activo que estás registrando
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="activo"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Activo</FormLabel>
                <Popover open={open} onOpenChange={setOpen}>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        className={cn(
                          "justify-between",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value
                          ? assetOptions.find((asset) => asset.value === field.value)?.name || field.value
                          : "Selecciona un activo"}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="p-0 w-full min-w-[240px]">
                    <Command>
                      <CommandInput placeholder="Buscar activo..." />
                      <CommandList>
                        <CommandEmpty>No se encontraron activos</CommandEmpty>
                        <CommandGroup className="max-h-[300px] overflow-y-auto">
                          {Array.isArray(assetOptions) && assetOptions.length > 0 ? (
                            assetOptions.map((asset) => (
                              <CommandItem
                                key={asset.value}
                                value={asset.value}
                                onSelect={onAssetSelect}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    asset.value === field.value ? "opacity-100" : "opacity-0"
                                  )}
                                />
                                {asset.logo ? (
                                  <img 
                                    src={asset.logo} 
                                    alt={asset.name} 
                                    className="w-5 h-5 mr-2"
                                  />
                                ) : (
                                  <div className="w-5 h-5 mr-2 rounded-sm bg-muted"></div>
                                )}
                                {asset.name}
                                {asset.symbol ? (
                                  <Badge variant="outline" className="ml-2">
                                    {asset.symbol}
                                  </Badge>
                                ) : null}
                                {asset.ratio ? (
                                  <span className="ml-auto text-xs text-muted-foreground">
                                    Ratio: {asset.ratio}:1
                                  </span>
                                ) : null}
                              </CommandItem>
                            ))
                          ) : (
                            <div className="py-6 text-center text-sm">No hay opciones disponibles</div>
                          )}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
                {form.watch("symbol") && (
                  <div className="mt-1">
                    <Badge>{form.watch("symbol")}</Badge>
                    {form.watch("ratio") && (
                      <Badge variant="outline" className="ml-2">
                        Ratio: {form.watch("ratio")}:1
                      </Badge>
                    )}
                  </div>
                )}
                <FormDescription>
                  Nombre del activo que has comprado
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="cantidad"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cantidad</FormLabel>
                <FormControl>
                  <Input type="number" step="any" {...field} disabled={isSubmitting} />
                </FormControl>
                <FormDescription>
                  Cantidad de unidades compradas
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="precio_compra"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Precio de compra</FormLabel>
                <FormControl>
                  <Input type="number" step="any" {...field} disabled={isSubmitting} />
                </FormControl>
                <FormDescription>
                  Precio unitario sugerido del mercado (editable)
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="moneda"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Moneda</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                  disabled={isSubmitting}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona la moneda" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="ARS">Peso argentino (ARS)</SelectItem>
                    <SelectItem value="USD">Dólar (USD)</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>
                  Moneda en la que realizaste la compra
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="fecha_compra"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Fecha de compra</FormLabel>
                <FormControl>
                  <Input type="date" {...field} disabled={isSubmitting} />
                </FormControl>
                <FormDescription>
                  Fecha en que realizaste la compra
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="flex justify-end pt-4">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Guardando...
              </>
            ) : (
              "Guardar inversión"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
