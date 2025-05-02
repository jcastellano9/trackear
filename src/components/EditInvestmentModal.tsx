import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
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
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Loader2, Check, ChevronsUpDown } from "lucide-react";
import { InvestmentType, supabase } from "@/lib/supabase";
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

interface EditInvestmentModalProps {
  investment: InvestmentType;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSaved?: () => void;
}

export function EditInvestmentModal({ 
  investment,
  open,
  onOpenChange,
  onSaved
}: EditInvestmentModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [assetOptions, setAssetOptions] = useState<any[]>([]);
  const [assetSelectOpen, setAssetSelectOpen] = useState(false);
  
  // Configuración del formulario con React Hook Form
  const form = useForm<z.infer<typeof investmentSchema>>({
    resolver: zodResolver(investmentSchema),
    defaultValues: {
      tipo: investment.tipo,
      activo: investment.activo,
      cantidad: investment.cantidad,
      precio_compra: investment.precio_compra,
      moneda: investment.moneda as "USD" | "ARS",
      fecha_compra: investment.fecha_compra.split('T')[0],
      symbol: investment.symbol || "",
      ratio: investment.ratio || null,
    },
  });
  
  // Load asset options when the modal opens
  useEffect(() => {
    const options = getOptionsByType(investment.tipo) || [];
    setAssetOptions(options);
  }, [investment.tipo]);
  
  // Actualizar el formulario cuando cambia la inversión
  useEffect(() => {
    form.reset({
      tipo: investment.tipo,
      activo: investment.activo,
      cantidad: investment.cantidad,
      precio_compra: investment.precio_compra,
      moneda: investment.moneda as "USD" | "ARS",
      fecha_compra: investment.fecha_compra.split('T')[0],
      symbol: investment.symbol || "",
      ratio: investment.ratio || null,
    });
  }, [investment, form]);
  
  // Handle asset selection
  const onAssetSelect = (value: string) => {
    form.setValue("activo", value);
    
    // Find the selected asset to get its symbol and ratio
    const selectedAsset = assetOptions.find(option => option.value === value);
    if (selectedAsset) {
      form.setValue("symbol", selectedAsset.symbol || "");
      
      if (investment.tipo === "cedear" && selectedAsset.ratio) {
        form.setValue("ratio", selectedAsset.ratio);
      } else {
        form.setValue("ratio", null);
      }
    }
    
    setAssetSelectOpen(false);
  };
  
  async function onSubmit(values: z.infer<typeof investmentSchema>) {
    setIsSubmitting(true);
    
    try {
      const { error } = await supabase
        .from('investments')
        .update({
          activo: values.activo,
          cantidad: values.cantidad,
          precio_compra: values.precio_compra,
          moneda: values.moneda,
          fecha_compra: values.fecha_compra,
          symbol: values.symbol,
          ratio: values.ratio,
        })
        .eq('id', investment.id);
        
      if (error) throw error;
      
      toast.success("Inversión actualizada correctamente");
      onSaved?.();
      onOpenChange(false);
    } catch (error: any) {
      console.error("Error al actualizar la inversión:", error);
      toast.error(error.message || "Error al actualizar la inversión");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Editar inversión</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="tipo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo de inversión</FormLabel>
                  <FormControl>
                    <Input value={field.value === "cripto" ? "Criptomoneda" : "CEDEAR"} disabled className="bg-muted" />
                  </FormControl>
                  <FormDescription className="text-xs text-muted-foreground">
                    El tipo de inversión no se puede modificar
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
                  <Popover open={assetSelectOpen} onOpenChange={setAssetSelectOpen}>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          aria-expanded={assetSelectOpen}
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
                        <CommandEmpty>No se encontraron activos</CommandEmpty>
                        <CommandGroup className="max-h-[300px] overflow-y-auto">
                          {assetOptions && assetOptions.length > 0 ? (
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
                                ) : null}
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
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="cantidad"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cantidad</FormLabel>
                    <FormControl>
                      <Input type="number" step="any" {...field} disabled={isSubmitting} />
                    </FormControl>
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
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
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
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="flex justify-end space-x-2 pt-4">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
                Cancelar
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Guardando...
                  </>
                ) : (
                  "Guardar cambios"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
