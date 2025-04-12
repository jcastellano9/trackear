
import { PixWallet } from "@/types/pixWallet";
import { MOCK_PIX_WALLETS } from "@/data/mockPixWallets";

// Function to fetch PIX wallets data
export const fetchPixWallets = async (): Promise<PixWallet[]> => {
  // In a real app, this would be an API call
  // For example: return fetch('https://api.comparapix.ar/wallets').then(res => res.json())
  
  // Simulate API latency
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Return mock data
  return MOCK_PIX_WALLETS;
};

// Calculate final amount after exchange rate and fees
export const calculateFinalAmount = (wallet: PixWallet, amount: number): number => {
  // Calculate BRL amount based on exchange rate
  const brlAmount = amount * wallet.exchangeRate;
  
  // Apply fee
  const feeAmount = (wallet.fee / 100) * brlAmount;
  
  // Return final amount after fees
  return brlAmount - feeAmount;
};

// Find best wallet for a given amount
export const getBestWallet = (pixWallets: PixWallet[], amount: number): PixWallet | null => {
  if (!pixWallets?.length) return null;
  
  // Filter wallets that support this amount
  const eligibleWallets = pixWallets.filter(
    w => amount >= w.minimumAmount && (!w.maximumAmount || amount <= w.maximumAmount)
  );
  
  if (eligibleWallets.length === 0) return null;
  
  // Find wallet with best final amount
  return eligibleWallets.reduce((best, current) => {
    const bestAmount = calculateFinalAmount(best, amount);
    const currentAmount = calculateFinalAmount(current, amount);
    return currentAmount > bestAmount ? current : best;
  }, eligibleWallets[0]);
};
