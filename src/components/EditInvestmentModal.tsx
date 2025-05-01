
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
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { InvestmentType, supabase } from "@/lib/supabase";

// Schema para validar los datos del formulario
const investmentSchema = z.object({
  tipo: z.enum(["cripto", "cedear"], {
    required_error: "Debes seleccionar el tipo de inversión",
  }),
  activo: z.string().min(1, {
    message: "Debes ingresar el nombre del activo",
  }),
  cantidad: z.coerce.number().positive({
    message: "La cantidad debe ser un número positivo",
  }),
  precio_compra: z.coerce.number().positive({
    message: "El precio debe ser un número positivo",
  }),
  moneda: z.string().min(1, {
    message: "Debes seleccionar una moneda",
  }),
  fecha_compra: z.string().min(1, {
    message: "Debes seleccionar una fecha",
  }),
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

  // Configuración del formulario con React Hook Form
  const form = useForm<z.infer<typeof investmentSchema>>({
    resolver: zodResolver(investmentSchema),
    defaultValues: {
      tipo: investment.tipo,
      activo: investment.activo,
      cantidad: investment.cantidad,
      precio_compra: investment.precio_compra,
      moneda: investment.moneda,
      fecha_compra: investment.fecha_compra.split('T')[0],
    },
  });
  
  // Actualizar el formulario cuando cambia la inversión
  useEffect(() => {
    form.reset({
      tipo: investment.tipo,
      activo: investment.activo,
      cantidad: investment.cantidad,
      precio_compra: investment.precio_compra,
      moneda: investment.moneda,
      fecha_compra: investment.fecha_compra.split('T')[0],
    });
  }, [investment, form]);
  
  async function onSubmit(values: z.infer<typeof investmentSchema>) {
    setIsSubmitting(true);
    
    try {
      const { error } = await supabase
        .from('investments')
        .update({
          tipo: values.tipo,
          activo: values.activo,
          cantidad: values.cantidad,
          precio_compra: values.precio_compra,
          moneda: values.moneda,
          fecha_compra: values.fecha_compra,
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
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="activo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Activo</FormLabel>
                  <FormControl>
                    <Input placeholder="Ej: Bitcoin, Apple, etc." {...field} disabled={isSubmitting} />
                  </FormControl>
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
                        <SelectItem value="EUR">Euro (EUR)</SelectItem>
                        <SelectItem value="BRL">Real brasileño (BRL)</SelectItem>
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
