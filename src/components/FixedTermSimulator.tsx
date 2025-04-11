
import { useState } from "react";
import { toast } from "sonner";
import { SimulationParameters } from "./fixed-term/SimulationParameters";
import { SimulationResults } from "./fixed-term/SimulationResults";
import { useBankRates } from "@/hooks/useBankRates";
import { calculateFixedTermReturn } from "@/services/fixedTermCalculator";

export function FixedTermSimulator() {
  const [amount, setAmount] = useState<number>(100000);
  const [termDays, setTermDays] = useState<number>(30);
  const [results, setResults] = useState<any>(null);
  
  // Usar el hook personalizado para los datos de bancos
  const { banks, bank, setBank, rate, isLoading } = useBankRates();

  const calculate = () => {
    if (amount <= 0) {
      toast.error("El monto debe ser mayor a 0");
      return;
    }

    if (!bank) {
      toast.error("Selecciona un banco");
      return;
    }

    if (!rate) {
      toast.error("La tasa no es válida");
      return;
    }

    const calculationResults = calculateFixedTermReturn(amount, termDays, rate);
    
    if (calculationResults) {
      setResults(calculationResults);
      toast.success("Simulación calculada con éxito");
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <SimulationParameters 
        banks={banks}
        bank={bank}
        amount={amount}
        termDays={termDays}
        rate={rate}
        isLoading={isLoading}
        setBank={setBank}
        setAmount={setAmount}
        setTermDays={setTermDays}
        onCalculate={calculate}
      />
      
      <SimulationResults results={results} />
    </div>
  );
}
