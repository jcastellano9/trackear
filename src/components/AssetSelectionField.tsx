
import { useFormContext } from "react-hook-form";
import {
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
import { getOptionsByType } from "@/utils/investmentOptions";
import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { RefreshCw } from "lucide-react";

interface AssetSelectionFieldProps {
  onAssetSelection: (name: string, type: string) => void;
}

export function AssetSelectionField({ onAssetSelection }: AssetSelectionFieldProps) {
  const form = useFormContext();
  const investmentType = form.watch("type");
  const [loading, setLoading] = useState(false);
  const [options, setOptions] = useState<any[]>([]);

  useEffect(() => {
    if (investmentType) {
      setLoading(true);
      // Simular carga de datos
      const timer = setTimeout(() => {
        setOptions(getOptionsByType(investmentType));
        setLoading(false);
      }, 300);
      
      return () => clearTimeout(timer);
    }
  }, [investmentType]);

  return (
    <FormField
      control={form.control}
      name="name"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Nombre</FormLabel>
          {investmentType === "crypto" || investmentType === "cedears" || investmentType === "wallets" ? (
            <div className="relative">
              <Select 
                onValueChange={(value) => {
                  field.onChange(value);
                  onAssetSelection(value, investmentType);
                }} 
                defaultValue={field.value}
                disabled={!investmentType || loading}
              >
                <FormControl>
                  <SelectTrigger className="bg-background/40 border-white/10 backdrop-blur-sm">
                    <SelectValue placeholder={loading ? "Cargando activos..." : "Selecciona un activo"} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="max-h-[300px]">
                  {options.map((option) => (
                    <SelectItem key={option.value} value={option.name} className="py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-6 h-6 rounded-full overflow-hidden flex items-center justify-center bg-white">
                          <img 
                            src={option.logo} 
                            alt={option.name} 
                            className="h-5 w-5 object-contain" 
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(option.name.substring(0,2))}&background=random&size=32&color=fff`;
                            }}
                          />
                        </div>
                        <div className="flex flex-col">
                          <span className="font-medium">{option.name}</span>
                          {option.ticker && (
                            <span className="text-xs text-muted-foreground">{option.ticker}</span>
                          )}
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {loading && (
                <div className="absolute right-10 top-1/2 transform -translate-y-1/2">
                  <RefreshCw className="h-4 w-4 animate-spin text-muted-foreground" />
                </div>
              )}
            </div>
          ) : (
            <FormControl>
              <Input 
                placeholder="Ej: Plazo Fijo Banco Nación" 
                {...field} 
                className="bg-background/40 border-white/10"
              />
            </FormControl>
          )}
          <FormDescription>
            Nombre del activo o instrumento
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
