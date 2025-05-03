
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Search } from "lucide-react";
import { InterestRate } from "@/types/interestRate";

export const TERM_OPTIONS = [
  { value: 30, label: "30 días" },
  { value: 60, label: "60 días" },
  { value: 90, label: "90 días" },
  { value: 180, label: "180 días" },
  { value: 365, label: "365 días" },
];

interface SimulationParametersProps {
  banks: InterestRate[];
  selectedBank: string | null;
  amount: number;
  termDays: number;
  rate: number;
  isLoading: boolean;
  setSelectedBank: (bankId: string) => void;
  setAmount: (amount: number) => void;
  setTermDays: (days: number) => void;
  onCalculate: () => void;
}

export function SimulationParameters({
  banks,
  selectedBank,
  amount,
  termDays,
  rate,
  isLoading,
  setSelectedBank,
  setAmount,
  setTermDays,
  onCalculate,
}: SimulationParametersProps) {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Get selected bank name for display
  const selectedBankName = selectedBank 
    ? banks.find(bank => bank.provider === selectedBank)?.name || selectedBank
    : "Selecciona un banco";

  return (
    <Card className="lg:col-span-1 glass-card">
      <CardHeader>
        <CardTitle>Parámetros de Simulación</CardTitle>
        <CardDescription>Ingresa los datos para simular tu plazo fijo</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="bank">Entidad bancaria</Label>
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className="w-full justify-between bg-background/40 border-white/10"
                disabled={isLoading}
              >
                {isLoading ? "Cargando bancos..." : selectedBankName}
                <Search className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0" align="start">
              <Command>
                <CommandInput placeholder="Buscar banco..." value={searchTerm} onValueChange={setSearchTerm} />
                <CommandList>
                  <CommandEmpty>No se encontraron bancos.</CommandEmpty>
                  <CommandGroup>
                    {banks.map((bank) => (
                      <CommandItem
                        key={bank.provider}
                        value={bank.provider}
                        onSelect={() => {
                          setSelectedBank(bank.provider);
                          setOpen(false);
                        }}
                      >
                        <div className="flex items-center gap-2">
                          {bank.name} ({bank.annualRate.toFixed(2)}% TNA)
                        </div>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="amount">Monto inicial (ARS)</Label>
          <Input
            id="amount"
            type="number"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            min={1000}
            step={1000}
            className="bg-background/40 border-white/10"
          />
        </div>
        
        <div className="space-y-2">
          <Label>Plazo</Label>
          <ToggleGroup type="single" value={termDays.toString()} onValueChange={(value) => setTermDays(Number(value))} className="flex flex-wrap justify-between">
            {TERM_OPTIONS.map((option) => (
              <ToggleGroupItem key={option.value} value={option.value.toString()} className="flex-1 min-w-[80px] my-1">
                {option.label}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between">
            <Label>Tasa anual</Label>
            <span className="text-sm font-medium">{rate.toFixed(2)}%</span>
          </div>
          <div className="h-2 w-full bg-blue-500/30 rounded-full">
            <div 
              className="h-full bg-blue-500 rounded-full" 
              style={{ width: `${Math.min(rate/150*100, 100)}%` }}
            ></div>
          </div>
          <p className="text-xs text-muted-foreground">*La tasa es proporcionada por el banco seleccionado</p>
        </div>
        
        <Button onClick={onCalculate} className="w-full mt-4 bg-blue-600 hover:bg-blue-700">Calcular</Button>
      </CardContent>
    </Card>
  );
}
