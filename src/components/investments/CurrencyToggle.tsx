
import React from "react";
import { Button } from "@/components/ui/button";
import { DollarSign } from "lucide-react";

interface CurrencyToggleProps {
  displayCurrency: "USD" | "ARS";
  onToggle: () => void;
}

export const CurrencyToggle = ({ displayCurrency, onToggle }: CurrencyToggleProps) => {
  return (
    <div className="flex justify-end mb-4">
      <Button onClick={onToggle} variant="outline" className="flex items-center gap-2">
        <DollarSign className="h-4 w-4" />
        Mostrar en {displayCurrency === "USD" ? "ARS" : "USD"}
      </Button>
    </div>
  );
};
