
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

interface AssetSelectionFieldProps {
  onAssetSelection: (name: string, type: string) => void;
}

export function AssetSelectionField({ onAssetSelection }: AssetSelectionFieldProps) {
  const form = useFormContext();
  const investmentType = form.watch("type");

  return (
    <FormField
      control={form.control}
      name="name"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Nombre</FormLabel>
          {investmentType === "crypto" || investmentType === "cedears" || investmentType === "wallets" ? (
            <Select 
              onValueChange={(value) => {
                field.onChange(value);
                onAssetSelection(value, investmentType);
              }} 
              defaultValue={field.value}
              disabled={!investmentType}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona un activo" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {getOptionsByType(investmentType).map((option) => (
                  <SelectItem key={option.value} value={option.name}>
                    <div className="flex items-center gap-2">
                      <img 
                        src={option.logo} 
                        alt={option.name} 
                        className="h-5 w-5 object-contain" 
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = `https://ui-avatars.com/api/?name=${option.name.substring(0,2)}&background=random&size=32`;
                        }}
                      />
                      {option.name}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <FormControl>
              <Input placeholder="Ej: Plazo Fijo Banco Nación" {...field} />
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
