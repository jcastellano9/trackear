
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

type FormValues = z.infer<typeof formSchema>;

type AddInvestmentFormProps = {
  onSuccess?: () => void;
};

export function AddInvestmentForm({ onSuccess }: AddInvestmentFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Inicializar el formulario con valores por defecto
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      type: "",
      name: "",
      symbol: "",
      quantity: "",
      purchasePrice: "",
      purchaseDate: new Date().toISOString().split("T")[0],
    },
  });

  // Función para manejar el envío del formulario
  const onSubmit = (data: FormValues) => {
    setIsSubmitting(true);
    
    // Simulación de envío a la API
    setTimeout(() => {
      console.log("Datos de la inversión:", data);
      toast.success("Inversión agregada correctamente");
      setIsSubmitting(false);
      form.reset();
      
      if (onSuccess) {
        onSuccess();
      }
    }, 1000);
  };

  return (
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
                  onValueChange={field.onChange} 
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
                    <SelectItem value="fixed">Plazo Fijo</SelectItem>
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
                <FormControl>
                  <Input placeholder="Ej: Bitcoin, Apple Inc." {...field} />
                </FormControl>
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
                  <Input placeholder="Ej: BTC, AAPL" {...field} />
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

        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? "Guardando..." : "Guardar inversión"}
        </Button>
      </form>
    </Form>
  );
}
