import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Search } from "lucide-react";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";

interface Crypto {
  id: string;
  name: string;
  symbol: string;
  logo?: string;
}

interface CryptoWallet {
  id: string;
  name: string;
  logo?: string;
  cryptoYields: {
    cryptoId: string;
    apy: number;
  }[];
}

// Mock data - in a real app, this would come from an API
const fetchCryptos = async (): Promise<Crypto[]> => {
  // In a real app, fetch from API
  return [
    { id: "bitcoin", name: "Bitcoin", symbol: "BTC", logo: "https://cryptologos.cc/logos/bitcoin-btc-logo.svg?v=025" },
    { id: "ethereum", name: "Ethereum", symbol: "ETH", logo: "https://cryptologos.cc/logos/ethereum-eth-logo.svg?v=025" },
    { id: "tether", name: "Tether", symbol: "USDT", logo: "https://cryptologos.cc/logos/tether-usdt-logo.svg?v=025" },
    { id: "usd-coin", name: "USD Coin", symbol: "USDC", logo: "https://cryptologos.cc/logos/usd-coin-usdc-logo.svg?v=025" },
    { id: "binancecoin", name: "BNB", symbol: "BNB", logo: "https://cryptologos.cc/logos/bnb-bnb-logo.svg?v=025" },
    { id: "ripple", name: "XRP", symbol: "XRP", logo: "https://cryptologos.cc/logos/xrp-xrp-logo.svg?v=025" },
    { id: "cardano", name: "Cardano", symbol: "ADA", logo: "https://cryptologos.cc/logos/cardano-ada-logo.svg?v=025" },
    { id: "solana", name: "Solana", symbol: "SOL", logo: "https://cryptologos.cc/logos/solana-sol-logo.svg?v=025" },
    { id: "dogecoin", name: "Dogecoin", symbol: "DOGE", logo: "https://cryptologos.cc/logos/dogecoin-doge-logo.svg?v=025" },
    { id: "dai", name: "Dai", symbol: "DAI", logo: "https://cryptologos.cc/logos/multi-collateral-dai-dai-logo.svg?v=025" },
  ];
};

// Mock data for wallets
const fetchCryptoWallets = async (): Promise<CryptoWallet[]> => {
  // In a real app, fetch from API
  return [
    { 
      id: "ripio", 
      name: "Ripio", 
      logo: "https://storage.googleapis.com/ripio-media-arg/filer_public_thumbnails/filer_public/e6/88/e688e499-9a5c-412a-91e7-be2caf06112b/icono_celeste_vector-01.png__180x180_q85_subsampling-2.png",
      cryptoYields: [
        { cryptoId: "bitcoin", apy: 2.5 },
        { cryptoId: "ethereum", apy: 3.0 },
        { cryptoId: "tether", apy: 8.2 },
        { cryptoId: "usd-coin", apy: 8.0 },
      ]
    },
    { 
      id: "lemon", 
      name: "Lemon", 
      logo: "https://lemoncash.com.ar/wp-content/uploads/2022/02/favicon-4-2-256x256.png",
      cryptoYields: [
        { cryptoId: "bitcoin", apy: 3.0 },
        { cryptoId: "ethereum", apy: 3.5 },
        { cryptoId: "tether", apy: 8.5 },
        { cryptoId: "usd-coin", apy: 8.5 },
        { cryptoId: "dai", apy: 8.5 },
      ]
    },
    { 
      id: "fiwind", 
      name: "Fiwind", 
      logo: "https://fiwind.io/favicon.ico",
      cryptoYields: [
        { cryptoId: "bitcoin", apy: 3.2 },
        { cryptoId: "ethereum", apy: 3.8 },
        { cryptoId: "tether", apy: 9.0 },
        { cryptoId: "usd-coin", apy: 9.0 },
      ]
    },
    { 
      id: "buenbit", 
      name: "Buenbit", 
      logo: "https://buenbit.com/assets/img/favicon/android-chrome-192x192.png",
      cryptoYields: [
        { cryptoId: "bitcoin", apy: 2.8 },
        { cryptoId: "ethereum", apy: 3.2 },
        { cryptoId: "dai", apy: 8.8 },
      ]
    },
  ];
};

const TERM_OPTIONS = [
  { value: 1, label: "1 mes" },
  { value: 3, label: "3 meses" },
  { value: 6, label: "6 meses" },
  { value: 12, label: "12 meses" },
];

export function CryptoSimulator() {
  const [selectedCrypto, setSelectedCrypto] = useState<string | null>(null);
  const [selectedWallet, setSelectedWallet] = useState<string | null>(null);
  const [amount, setAmount] = useState<number>(1);
  const [months, setMonths] = useState<number>(12);
  const [results, setResults] = useState<any | null>(null);
  
  // UI state
  const [cryptoOpen, setCryptoOpen] = useState(false);
  const [walletOpen, setWalletOpen] = useState(false);

  // Get crypto and wallet data
  const { data: cryptos = [], isLoading: isLoadingCrypto } = useQuery({
    queryKey: ['cryptos'],
    queryFn: fetchCryptos,
  });

  const { data: wallets = [], isLoading: isLoadingWallets } = useQuery({
    queryKey: ['cryptoWallets'],
    queryFn: fetchCryptoWallets,
  });

  // Get selected data
  const selectedCryptoData = selectedCrypto ? cryptos.find(c => c.id === selectedCrypto) : null;
  const selectedWalletData = selectedWallet ? wallets.find(w => w.id === selectedWallet) : null;
  
  // Get APY for the selected crypto in the selected wallet
  const getAPY = () => {
    if (!selectedCrypto || !selectedWallet) return 0;
    
    const wallet = wallets.find(w => w.id === selectedWallet);
    if (!wallet) return 0;
    
    const yield_ = wallet.cryptoYields.find(y => y.cryptoId === selectedCrypto);
    return yield_ ? yield_.apy : 0;
  };
  
  const apy = getAPY();
  
  // Available wallets for the selected crypto
  const availableWallets = selectedCrypto 
    ? wallets.filter(wallet => wallet.cryptoYields.some(y => y.cryptoId === selectedCrypto))
    : [];
  
  // Calculate the result
  useEffect(() => {
    if (selectedCrypto && selectedWallet && amount > 0) {
      calculateYield();
    }
  }, [selectedCrypto, selectedWallet, amount, months, apy]);
  
  const calculateYield = () => {
    if (!selectedCrypto || !selectedWallet || amount <= 0) {
      setResults(null);
      return;
    }
    
    const monthlyRate = apy / 100 / 12;
    let finalAmount = amount;
    
    for (let i = 0; i < months; i++) {
      finalAmount += finalAmount * monthlyRate;
    }
    
    const profit = finalAmount - amount;
    
    setResults({
      initialAmount: amount,
      finalAmount: finalAmount,
      profit: profit,
      profitPercentage: (profit / amount) * 100,
      apy: apy,
      months: months,
      crypto: selectedCryptoData,
      wallet: selectedWalletData
    });
  };
  
  const handleAmountChange = (value: string) => {
    // Accept both comma and period as decimal separators
    const normalizedValue = value.replace(',', '.');
    setAmount(Number(normalizedValue));
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Input Card */}
      <Card className="lg:col-span-1 glass-card">
        <CardHeader>
          <CardTitle>Simulador de Rendimiento Cripto</CardTitle>
          <CardDescription>
            Calcula los intereses que podés ganar con tus criptomonedas
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Criptomoneda</Label>
            <Popover open={cryptoOpen} onOpenChange={setCryptoOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={cryptoOpen}
                  className="w-full justify-between bg-background/40 border-white/10"
                  disabled={isLoadingCrypto}
                >
                  {isLoadingCrypto ? "Cargando..." : (
                    selectedCryptoData ? (
                      <div className="flex items-center">
                        {selectedCryptoData.logo && (
                          <img 
                            src={selectedCryptoData.logo} 
                            alt={selectedCryptoData.name} 
                            className="h-5 w-5 mr-2"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = "https://via.placeholder.com/24?text=?";
                            }}
                          />
                        )}
                        {selectedCryptoData.name} ({selectedCryptoData.symbol})
                      </div>
                    ) : "Selecciona una criptomoneda"
                  )}
                  <Search className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0" align="start">
                <Command>
                  <CommandInput placeholder="Buscar criptomoneda..." />
                  <CommandList>
                    <CommandEmpty>No se encontraron criptomonedas.</CommandEmpty>
                    <CommandGroup>
                      {cryptos.map((crypto) => (
                        <CommandItem
                          key={crypto.id}
                          value={crypto.id}
                          onSelect={() => {
                            setSelectedCrypto(crypto.id);
                            setCryptoOpen(false);
                            setSelectedWallet(null); // Reset wallet selection
                          }}
                        >
                          <div className="flex items-center gap-2">
                            {crypto.logo && (
                              <img 
                                src={crypto.logo} 
                                alt={crypto.name} 
                                className="h-4 w-4 object-contain"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  target.src = "https://via.placeholder.com/24?text=?";
                                }}
                              />
                            )}
                            {crypto.name} ({crypto.symbol})
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
            <Label>Wallet / Exchange</Label>
            <Popover open={walletOpen} onOpenChange={setWalletOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={walletOpen}
                  className="w-full justify-between bg-background/40 border-white/10"
                  disabled={isLoadingWallets || !selectedCrypto}
                >
                  {!selectedCrypto ? "Selecciona una criptomoneda primero" : 
                    isLoadingWallets ? "Cargando..." : (
                    selectedWalletData ? (
                      <div className="flex items-center">
                        {selectedWalletData.logo && (
                          <img 
                            src={selectedWalletData.logo} 
                            alt={selectedWalletData.name} 
                            className="h-5 w-5 mr-2"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = "https://via.placeholder.com/24?text=?";
                            }}
                          />
                        )}
                        {selectedWalletData.name}
                      </div>
                    ) : "Selecciona una wallet"
                  )}
                  <Search className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0" align="start">
                <Command>
                  <CommandInput placeholder="Buscar wallet..." />
                  <CommandList>
                    <CommandEmpty>
                      {!selectedCrypto 
                        ? "Selecciona una criptomoneda primero" 
                        : "No hay wallets disponibles para esta criptomoneda"}
                    </CommandEmpty>
                    <CommandGroup>
                      {availableWallets.map((wallet) => {
                        // Find APY for this crypto in this wallet
                        const yieldInfo = wallet.cryptoYields.find(y => y.cryptoId === selectedCrypto);
                        const apy = yieldInfo ? yieldInfo.apy : 0;
                        
                        return (
                          <CommandItem
                            key={wallet.id}
                            value={wallet.id}
                            onSelect={() => {
                              setSelectedWallet(wallet.id);
                              setWalletOpen(false);
                            }}
                          >
                            <div className="flex items-center gap-2">
                              {wallet.logo && (
                                <img 
                                  src={wallet.logo} 
                                  alt={wallet.name} 
                                  className="h-4 w-4 object-contain"
                                  onError={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    target.src = "https://via.placeholder.com/24?text=?";
                                  }}
                                />
                              )}
                              {wallet.name} <span className="ml-2 text-xs text-finance-positive">({apy}% APY)</span>
                            </div>
                          </CommandItem>
                        );
                      })}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label htmlFor="cryptoAmount">Cantidad ({selectedCryptoData?.symbol || ""})</Label>
            <Input
              id="cryptoAmount"
              type="text"
              value={amount}
              onChange={(e) => handleAmountChange(e.target.value)}
              className="bg-background/40 border-white/10"
              placeholder={`Ej: 0.5 ${selectedCryptoData?.symbol || ""}`}
              disabled={!selectedCrypto}
            />
            <p className="text-xs text-muted-foreground">
              Ingresa la cantidad de {selectedCryptoData?.symbol || "criptomoneda"} que quieres simular
            </p>
          </div>
          
          <div className="space-y-2">
            <Label>Plazo</Label>
            <ToggleGroup type="single" value={months.toString()} onValueChange={(value) => setMonths(Number(value))} className="flex flex-wrap justify-between">
              {TERM_OPTIONS.map((option) => (
                <ToggleGroupItem key={option.value} value={option.value.toString()} className="flex-1 min-w-[80px] my-1">
                  {option.label}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          </div>
          
          {apy > 0 && (
            <div className="mt-2 space-y-2">
              <div className="flex justify-between">
                <Label>APY</Label>
                <span className="text-sm font-medium text-finance-positive">{apy.toFixed(2)}%</span>
              </div>
              <div className="h-2 w-full bg-green-500/30 rounded-full">
                <div 
                  className="h-full bg-finance-positive rounded-full" 
                  style={{ width: `${Math.min(apy/15*100, 100)}%` }}
                ></div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Results Card */}
      <Card className="lg:col-span-2 glass-card">
        <CardHeader>
          <CardTitle>Resultados de la simulación</CardTitle>
          <CardDescription>
            {results 
              ? `Rendimiento de ${results.crypto?.symbol} en ${results.wallet?.name} por ${results.months} meses con APY de ${apy}%` 
              : "Completa los datos para ver los resultados de la simulación"
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          {results ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1, duration: 0.5 }}
                  whileHover={{ scale: 1.03 }}
                  className="p-4 border border-white/5 bg-white/5 rounded-lg"
                >
                  <p className="text-sm text-muted-foreground">Cantidad final</p>
                  <p className="text-2xl font-bold flex items-center">
                    {results.finalAmount.toFixed(8)} {results.crypto.symbol}
                  </p>
                </motion.div>
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                  whileHover={{ scale: 1.03 }}
                  className="p-4 border border-white/5 bg-white/5 rounded-lg"
                >
                  <p className="text-sm text-muted-foreground">Ganancia</p>
                  <p className="text-2xl font-bold text-finance-positive flex items-center">
                    +{results.profit.toFixed(8)} {results.crypto.symbol}
                  </p>
                </motion.div>
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                  whileHover={{ scale: 1.03 }}
                  className="p-4 border border-white/5 bg-white/5 rounded-lg"
                >
                  <p className="text-sm text-muted-foreground">Rendimiento</p>
                  <motion.p
                    initial={{ scale: 1 }}
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity, repeatType: "loop" }}
                    className="text-2xl font-bold text-finance-positive"
                  >
                    {results.profitPercentage.toFixed(2)}%
                  </motion.p>
                </motion.div>
              </div>
              
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[180px]">Concepto</TableHead>
                    <TableHead>Valor</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>Inversión inicial</TableCell>
                    <TableCell>{results.initialAmount} {results.crypto.symbol}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>APY anual</TableCell>
                    <TableCell>{apy}%</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Plazo</TableCell>
                    <TableCell>{results.months} {results.months === 1 ? 'mes' : 'meses'}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Total ganancia</TableCell>
                    <TableCell className="text-finance-positive">+{results.profit.toFixed(8)} {results.crypto.symbol}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Cantidad final</TableCell>
                    <TableCell className="font-bold">{results.finalAmount.toFixed(8)} {results.crypto.symbol}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
              
              <Alert variant="default" className="border-yellow-500/30 bg-yellow-500/10">
                <AlertDescription>
                  Este cálculo no contempla variaciones del precio de mercado de la criptomoneda.
                  Los rendimientos se calculan únicamente en base al interés compuesto de la APY.
                </AlertDescription>
              </Alert>
            </motion.div>
          ) : (
            <div className="flex flex-col items-center justify-center h-[350px] text-center">
              <motion.p 
                initial={{ opacity: 0.5 }}
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-muted-foreground"
              >
                Selecciona una criptomoneda y una wallet para ver resultados
              </motion.p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
