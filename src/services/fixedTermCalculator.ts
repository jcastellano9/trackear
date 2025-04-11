
interface CalculationResult {
  initialAmount: number;
  finalAmount: number;
  profit: number;
  profitPercentage: number;
  monthlyData: Array<{ month: number; amount: number }>;
  months: number;
  termDays: number;
  rate: number;
}

export function calculateFixedTermReturn(amount: number, termDays: number, rate: number): CalculationResult | null {
  if (amount <= 0) {
    return null;
  }

  if (!rate) {
    return null;
  }

  // Convertir días a meses para el cálculo
  const months = termDays / 30;
  
  // Calculate monthly interest rate
  const monthlyRate = rate / 12 / 100;
  
  // Calculate final amount
  let finalAmount = amount;
  const monthlyData = [{ month: 0, amount: finalAmount }];
  
  for (let i = 1; i <= months; i++) {
    finalAmount = finalAmount * (1 + monthlyRate);
    monthlyData.push({ month: i, amount: Math.round(finalAmount) });
  }
  
  const profit = finalAmount - amount;
  const profitPercentage = (profit / amount) * 100;
  
  return {
    initialAmount: amount,
    finalAmount,
    profit,
    profitPercentage,
    monthlyData,
    months,
    termDays,
    rate
  };
}
