
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { SimulationParameters } from "@/components/simulators/fixed-term/SimulationParameters";
import { SimulationResults } from "@/components/simulators/fixed-term/SimulationResults";
import { calculateFixedTermReturn } from "@/services/fixedTermCalculator";
import { useQuery } from "@tanstack/react-query";
import { fetchInterestRates } from "@/services/interestRatesService";
import { InterestRate } from "@/types/interestRate";

export function FixedTermSimulator() {
  const [amount, setAmount] = useState<number>(100000);
  const [termDays, setTermDays] = useState<number>(30);
  const [selectedBank, setSelectedBank] = useState<string | null>(null);
  const [results, setResults] = useState<any>(null);
  
  // Get bank data from the API
  const { data: allBanks = [], isLoading } = useQuery({
    queryKey: ['bankRates'],
    queryFn: fetchInterestRates,
  });
  
  // Filter to only get fixed term rates in ARS
  const banks = allBanks.filter(
    (item: InterestRate) => item.type === "fixed" && item.currency === "ARS"
  );
  
  // Get rate based on selected bank
  const rate = selectedBank 
    ? banks.find((bank: InterestRate) => bank.provider === selectedBank)?.annualRate || 0 
    : 0;

  const calculate = () => {
    if (amount <= 0) {
      toast.error("El monto debe ser mayor a 0");
      return;
    }

    if (!selectedBank) {
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

  // Auto-calculate when inputs change
  useEffect(() => {
    if (selectedBank && amount > 0) {
      calculate();
    }
  }, [selectedBank, amount, termDays, rate]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <SimulationParameters 
        banks={banks}
        selectedBank={selectedBank}
        amount={amount}
        termDays={termDays}
        rate={rate}
        isLoading={isLoading}
        setSelectedBank={setSelectedBank}
        setAmount={setAmount}
        setTermDays={setTermDays}
        onCalculate={calculate}
      />
      
      <SimulationResults results={results} />
    </div>
  );
}
