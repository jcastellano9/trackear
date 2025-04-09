
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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
import { toast } from "sonner";
import { getOptionsByType } from "@/utils/investmentOptions";
import { investmentFormSchema, type InvestmentFormValues } from "@/utils/investmentValidation";
import { SimulationWarning } from "@/components/SimulationWarning";
import { AssetSelectionField } from "@/components/AssetSelectionField";

type AddInvestmentFormProps = {
  onSuccess?: () => void;
};

export function AddInvestmentForm({ onSuccess }: AddInvestmentFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSimulationWarning, setShowSimulationWarning] = useState(false);
  const [selectedLogo, setSelectedLogo] = useState<string>();

  // Initialize form with default values
  const form = useForm<InvestmentFormValues>({
    resolver: zodResolver(investmentFormSchema),
    defaultValues: {
      type: "",
      name: "",
      symbol: "",
      quantity: "",
      purchasePrice: "",
      purchaseDate: new Date().toISOString().split("T")[0],
    },
  });

  // Handle form submission
  const onSubmit = (data: InvestmentFormValues) => {
    if (data.type === "fixed" || data.type === "wallets") {
      setShowSimulationWarning(true);
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      console.log("Datos de la inversión:", {...data, logo: selectedLogo});
      toast.success("Inversión agregada correctamente");
      setIsSubmitting(false);
      form.reset();
      setSelectedLogo(undefined);
      
      if (onSuccess) {
        onSuccess();
      }
    }, 1000);
  };

  // Update symbol and logo when an asset is selected
  const handleAssetSelection = (name: string, type: string) => {
    const options = getOptionsByType(type);
    const selected = options.find(option => option.name === name);
    
    if (selected) {
      form.setValue("symbol", selected.value);
      setSelectedLogo(selected.logo);
    }
  };

  // Handle simulation warning actions
  const handleSimulationContinue = () => {
    setShowSimulationWarning(false);
    if (onSuccess) {
      onSuccess();
    }
    toast.success("Simulación guardada correctamente");
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {showSimulationWarning && (
          <SimulationWarning 
            onCancel={() => setShowSimulationWarning(false)} 
            onContinue={handleSimulationContinue} 
          />
        )}

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

          <AssetSelectionField onAssetSelection={handleAssetSelection} />

          <FormField
            control={form.control}
            name="symbol"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Símbolo</FormLabel>
                <FormControl>
                  <Input readOnly={form.getValues("type") !== "fixed"} {...field} />
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
                <FormLabel>{form.getValues("type") === "fixed" || form.getValues("type") === "wallets" ? "Monto" : "Precio de compra"}</FormLabel>
                <FormControl>
                  <Input type="number" step="any" placeholder="Ej: 30000, 180.5" {...field} />
                </FormControl>
                <FormDescription>
                  {form.getValues("type") === "fixed" || form.getValues("type") === "wallets" ? "Monto en ARS" : "Precio unitario en USD"}
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
