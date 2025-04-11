
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { toast } from "sonner";

interface Bank {
  id: string;
  name: string;
  rate: number;
  logo: string;
}

export const TERM_OPTIONS = [
  { value: 30, label: "30 días" },
  { value: 60, label: "60 días" },
  { value: 90, label: "90 días" },
  { value: 180, label: "180 días" },
  { value: 365, label: "365 días" },
];

interface SimulationParametersProps {
  banks: Bank[];
  bank: string;
  amount: number;
  termDays: number;
  rate: number;
  isLoading: boolean;
  setBank: (bankId: string) => void;
  setAmount: (amount: number) => void;
  setTermDays: (days: number) => void;
  onCalculate: () => void;
}

export function SimulationParameters({
  banks,
  bank,
  amount,
  termDays,
  rate,
  isLoading,
  setBank,
  setAmount,
  setTermDays,
  onCalculate,
}: SimulationParametersProps) {
  return (
    <Card className="lg:col-span-1 glass-card">
      <CardHeader>
        <CardTitle>Parámetros de Simulación</CardTitle>
        <CardDescription>Ingresa los datos para simular tu plazo fijo</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="bank">Entidad bancaria</Label>
          <Select value={bank} onValueChange={setBank} disabled={isLoading}>
            <SelectTrigger id="bank" className="bg-background/40 border-white/10">
              <SelectValue placeholder={isLoading ? "Cargando bancos..." : "Selecciona un banco"} />
            </SelectTrigger>
            <SelectContent>
              {banks.map((bank) => (
                <SelectItem key={bank.id} value={bank.id}>
                  <div className="flex items-center gap-2">
                    <img src={bank.logo} alt={bank.name} className="h-4 w-4 object-contain" />
                    <span>{bank.name} ({bank.rate}% TNA)</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
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
            <span className="text-sm font-medium">{rate}%</span>
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
