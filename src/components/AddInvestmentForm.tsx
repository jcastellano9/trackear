
import { useState } from "react";
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
import { useSession } from "@supabase/auth-helpers-react";
import { supabase, InvestmentType } from "@/lib/supabase";

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

interface AddInvestmentFormProps {
  onSuccess?: () => void;
}

export function AddInvestmentForm({ onSuccess }: AddInvestmentFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
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
    },
  });

  async function onSubmit(values: z.infer<typeof investmentSchema>) {
    if (!session?.user) {
      toast.error("Debes iniciar sesión para agregar inversiones");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Create a new investment object with proper typing
      const newInvestment = {
        ...values,
        user_id: session.user.id,
        created_at: new Date().toISOString(),
      };
      
      // Fix: Pass a properly typed object to Supabase, not an array
      const { error } = await supabase
        .from('investments')
        .insert(newInvestment); // Fixed: Removed array brackets here
        
      if (error) throw error;
      
      toast.success("Inversión agregada correctamente");
      form.reset();
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
              <FormItem>
                <FormLabel>Activo</FormLabel>
                <FormControl>
                  <Input placeholder="Ej: Bitcoin, Apple, etc." {...field} disabled={isSubmitting} />
                </FormControl>
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
                  Precio unitario de compra
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
                    <SelectItem value="EUR">Euro (EUR)</SelectItem>
                    <SelectItem value="BRL">Real brasileño (BRL)</SelectItem>
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
