import { useState, useEffect } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUp, ArrowDown, Edit, Trash2, ChevronUp, ChevronDown, LineChart, DollarSign } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EditInvestmentModal } from "./EditInvestmentModal";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { ResponsiveContainer, LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const USD_TO_ARS_RATE = 1180;

interface Investment {
  id: string;
  type: string;
  name: string;
  symbol: string;
  quantity: number;
  purchasePrice: number;
  currentPrice: number;
  purchaseDate: string;
  currentValueUSD: number;
  purchaseValueUSD: number;
  profitUSD: number;
  profitPercentage: number;
  logo?: string;
  performance24h: number;
  history: { date: string; value: number }[];
  currentValueARS?: number;
  purchaseValueARS?: number;
  profitARS?: number;
}

const getMockInvestments = (filter: string): Investment[] => {
  const allInvestments: Investment[] = [
    {
      id: "1",
      type: "crypto",
      name: "Bitcoin",
      symbol: "BTC",
      quantity: 0.05,
      purchasePrice: 29500,
      currentPrice: 34200,
      purchaseDate: "2023-06-15",
      currentValueUSD: 1710,
      purchaseValueUSD: 1475,
      profitUSD: 235,
      profitPercentage: 15.93,
      logo: "https://cryptologos.cc/logos/bitcoin-btc-logo.png",
      performance24h: 2.45,
      history: [
        { date: "2023-06-15", value: 1475 },
        { date: "2023-07-15", value: 1520 },
        { date: "2023-08-15", value: 1550 },
        { date: "2023-09-15", value: 1600 },
        { date: "2023-10-15", value: 1630 },
        { date: "2023-11-15", value: 1650 },
        { date: "2023-12-15", value: 1680 },
        { date: "2024-01-15", value: 1695 },
        { date: "2024-02-15", value: 1705 },
        { date: "2024-03-15", value: 1710 },
      ]
    },
    {
      id: "2",
      type: "crypto",
      name: "Ethereum",
      symbol: "ETH",
      quantity: 1.2,
      purchasePrice: 1850,
      currentPrice: 1920,
      purchaseDate: "2023-08-10",
      currentValueUSD: 2304,
      purchaseValueUSD: 2220,
      profitUSD: 84,
      profitPercentage: 3.78,
      logo: "https://cryptologos.cc/logos/ethereum-eth-logo.png",
      performance24h: -0.32,
      history: [
        { date: "2023-08-10", value: 2220 },
        { date: "2023-09-10", value: 2240 },
        { date: "2023-10-10", value: 2250 },
        { date: "2023-11-10", value: 2265 },
        { date: "2023-12-10", value: 2275 },
        { date: "2024-01-10", value: 2285 },
        { date: "2024-02-10", value: 2295 },
        { date: "2024-03-10", value: 2304 },
      ]
    },
    {
      id: "3",
      type: "cedears",
      name: "Apple Inc.",
      symbol: "AAPL",
      quantity: 5,
      purchasePrice: 172.5,
      currentPrice: 188.7,
      purchaseDate: "2023-05-22",
      currentValueUSD: 943.5,
      purchaseValueUSD: 862.5,
      profitUSD: 81,
      profitPercentage: 9.39,
      logo: "https://companieslogo.com/img/orig/AAPL-bf1a4314.png",
      performance24h: 1.27,
      history: [
        { date: "2023-05-22", value: 862.5 },
        { date: "2023-06-22", value: 875 },
        { date: "2023-07-22", value: 890 },
        { date: "2023-08-22", value: 900 },
        { date: "2023-09-22", value: 910 },
        { date: "2023-10-22", value: 915 },
        { date: "2023-11-22", value: 925 },
        { date: "2023-12-22", value: 930 },
        { date: "2024-01-22", value: 935 },
        { date: "2024-02-22", value: 940 },
        { date: "2024-03-22", value: 943.5 },
      ]
    }
  ];

  return allInvestments.map(inv => ({
    ...inv,
    currentValueARS: inv.currentValueUSD * USD_TO_ARS_RATE,
    purchaseValueARS: inv.purchaseValueUSD * USD_TO_ARS_RATE,
    profitARS: inv.profitUSD * USD_TO_ARS_RATE
  })).filter(filter === "all" ? () => true : inv => inv.type === filter);
};

type InvestmentsListProps = {
  filter: "all" | "crypto" | "cedears";
};

export function InvestmentsList({ filter }: InvestmentsListProps) {
  const [investments, setInvestments] = useState<Investment[]>(getMockInvestments(filter));
  const [sortConfig, setSortConfig] = useState<{key: string, direction: 'ascending' | 'descending'} | null>(null);
  const [editingInvestment, setEditingInvestment] = useState<Investment | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
  const [investmentToDelete, setInvestmentToDelete] = useState<string | null>(null);
  const [selectedInvestment, setSelectedInvestment] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'table' | 'chart'>('table');
  const [currencyDisplay, setCurrencyDisplay] = useState<'usd' | 'ars'>('usd');
  
  useEffect(() => {
    setInvestments(getMockInvestments(filter));
  }, [filter]);
  
  const totalCurrentValueUSD = investments.reduce((sum, inv) => sum + inv.currentValueUSD, 0);
  const totalPurchaseValueUSD = investments.reduce((sum, inv) => sum + inv.purchaseValueUSD, 0);
  const totalProfitUSD = totalCurrentValueUSD - totalPurchaseValueUSD;
  const totalProfitPercentage = (totalProfitUSD / totalPurchaseValueUSD) * 100;
  
  const totalCurrentValueARS = totalCurrentValueUSD * USD_TO_ARS_RATE;
  const totalPurchaseValueARS = totalPurchaseValueUSD * USD_TO_ARS_RATE;
  const totalProfitARS = totalProfitUSD * USD_TO_ARS_RATE;
  
  const requestSort = (key: string) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const getSortedInvestments = () => {
    if (!sortConfig) return investments;
    
    return [...investments].sort((a, b) => {
      if (a[sortConfig.key as keyof typeof a] < b[sortConfig.key as keyof typeof b]) {
        return sortConfig.direction === 'ascending' ? -1 : 1;
      }
      if (a[sortConfig.key as keyof typeof a] > b[sortConfig.key as keyof typeof b]) {
        return sortConfig.direction === 'ascending' ? 1 : -1;
      }
      return 0;
    });
  };
  
  const sortedInvestments = getSortedInvestments();

  const handleEditInvestment = (investment: Investment) => {
    setEditingInvestment(investment);
    setIsEditModalOpen(true);
  };

  const handleDeleteInvestment = (id: string) => {
    setInvestmentToDelete(id);
    setIsDeleteAlertOpen(true);
  };

  const confirmDelete = () => {
    if (investmentToDelete) {
      setInvestments(investments.filter(inv => inv.id !== investmentToDelete));
      toast.success("Inversión eliminada correctamente");
      setIsDeleteAlertOpen(false);
      setInvestmentToDelete(null);
    }
  };

  const handleSaveEdit = (updatedInvestment: Investment) => {
    setInvestments(
      investments.map(inv => 
        inv.id === updatedInvestment.id ? {
          ...updatedInvestment, 
          currentValueUSD: updatedInvestment.quantity * inv.currentPrice,
          currentValueARS: updatedInvestment.quantity * inv.currentPrice * USD_TO_ARS_RATE,
          purchaseValueUSD: updatedInvestment.quantity * updatedInvestment.purchasePrice,
          purchaseValueARS: updatedInvestment.quantity * updatedInvestment.purchasePrice * USD_TO_ARS_RATE,
          profitUSD: updatedInvestment.quantity * inv.currentPrice - updatedInvestment.quantity * updatedInvestment.purchasePrice,
          profitARS: (updatedInvestment.quantity * inv.currentPrice - updatedInvestment.quantity * updatedInvestment.purchasePrice) * USD_TO_ARS_RATE,
          profitPercentage: ((inv.currentPrice - updatedInvestment.purchasePrice) / updatedInvestment.purchasePrice) * 100
        } : inv
      )
    );
  };

  const getSortIcon = (key: string) => {
    if (!sortConfig || sortConfig.key !== key) {
      return null;
    }
    return sortConfig.direction === 'ascending' ? <ChevronUp className="ml-1 h-4 w-4" /> : <ChevronDown className="ml-1 h-4 w-4" />;
  };

  const getChartData = () => {
    if (!selectedInvestment) {
      const allDates = new Set<string>();
      investments.forEach(inv => {
        inv.history.forEach(item => {
          allDates.add(item.date);
        });
      });
      
      const sortedDates = Array.from(allDates).sort();
      
      return sortedDates.map(date => {
        const dataPoint: any = { date };
        
        investments.forEach(inv => {
          const historyItem = inv.history.find(item => item.date === date);
          if (historyItem) {
            dataPoint[inv.name] = historyItem.value;
          }
        });
        
        return dataPoint;
      });
    } else {
      const investment = investments.find(inv => inv.id === selectedInvestment);
      if (!investment) return [];
      
      return investment.history.map(item => ({
        date: item.date,
        [investment.name]: item.value
      }));
    }
  };

  const chartData = getChartData();
  
  if (investments.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-center text-muted-foreground">No hay inversiones para mostrar en esta categoría.</p>
        </CardContent>
      </Card>
    );
  }
  
  const formatCurrency = (value: number, currency: 'usd' | 'ars' = currencyDisplay) => {
    if (currency === 'usd') {
      return `$${value.toLocaleString('en-US')}`;
    } else {
      return `AR$${(value).toLocaleString('es-AR')}`;
    }
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Resumen</CardTitle>
          <CardDescription>Valor total y rendimiento de tus inversiones</CardDescription>
          <div className="mt-2">
            <Tabs
              value={currencyDisplay}
              onValueChange={(v) => setCurrencyDisplay(v as 'usd' | 'ars')}
              className="w-full max-w-xs"
            >
              <TabsList className="grid grid-cols-2 w-full">
                <TabsTrigger value="usd">USD</TabsTrigger>
                <TabsTrigger value="ars">ARS</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg">
              <p className="text-sm text-muted-foreground">Valor actual</p>
              <p className="text-2xl font-bold">
                {currencyDisplay === 'usd' 
                  ? formatCurrency(totalCurrentValueUSD) 
                  : formatCurrency(totalCurrentValueARS, 'ars')}
              </p>
            </div>
            <div className="p-4 border rounded-lg">
              <p className="text-sm text-muted-foreground">Inversión inicial</p>
              <p className="text-2xl font-bold">
                {currencyDisplay === 'usd' 
                  ? formatCurrency(totalPurchaseValueUSD) 
                  : formatCurrency(totalPurchaseValueARS, 'ars')}
              </p>
            </div>
            <div className="p-4 border rounded-lg">
              <p className="text-sm text-muted-foreground">Rendimiento</p>
              <div className="flex items-center gap-2">
                <p className="text-2xl font-bold">
                  {currencyDisplay === 'usd' 
                    ? formatCurrency(totalProfitUSD) 
                    : formatCurrency(totalProfitARS, 'ars')}
                </p>
                <Badge variant={totalProfitUSD >= 0 ? "default" : "destructive"} className="flex items-center">
                  {totalProfitUSD >= 0 ? <ArrowUp className="mr-1 h-3 w-3" /> : <ArrowDown className="mr-1 h-3 w-3" />}
                  {Math.abs(totalProfitPercentage).toFixed(2)}%
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2 flex flex-row items-center justify-between">
          <div>
            <CardTitle>Detalle de inversiones</CardTitle>
            <CardDescription>Visualización detallada de cada inversión</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              variant={viewMode === 'table' ? "default" : "outline"} 
              size="sm" 
              onClick={() => setViewMode('table')}
            >
              <DollarSign className="h-4 w-4 mr-1" />
              Tabla
            </Button>
            <Button 
              variant={viewMode === 'chart' ? "default" : "outline"} 
              size="sm" 
              onClick={() => setViewMode('chart')}
            >
              <LineChart className="h-4 w-4 mr-1" />
              Gráfico
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {viewMode === 'table' ? (
            <div>
              <div className="mb-4 flex justify-end">
                <Tabs
                  value={currencyDisplay}
                  onValueChange={(v) => setCurrencyDisplay(v as 'usd' | 'ars')}
                  className="w-full max-w-xs"
                >
                  <TabsList className="grid grid-cols-2 w-full">
                    <TabsTrigger value="usd">USD</TabsTrigger>
                    <TabsTrigger value="ars">ARS</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="cursor-pointer" onClick={() => requestSort('name')}>
                      <div className="flex items-center">
                        Activo
                        {getSortIcon('name')}
                      </div>
                    </TableHead>
                    <TableHead className="cursor-pointer" onClick={() => requestSort('currentPrice')}>
                      <div className="flex items-center">
                        Precio (USD)
                        {getSortIcon('currentPrice')}
                      </div>
                    </TableHead>
                    <TableHead className="cursor-pointer" onClick={() => requestSort('performance24h')}>
                      <div className="flex items-center">
                        24h%
                        {getSortIcon('performance24h')}
                      </div>
                    </TableHead>
                    <TableHead className="cursor-pointer" onClick={() => requestSort('quantity')}>
                      <div className="flex items-center">
                        Cantidad
                        {getSortIcon('quantity')}
                      </div>
                    </TableHead>
                    <TableHead className="cursor-pointer" onClick={() => requestSort('currentValueUSD')}>
                      <div className="flex items-center">
                        Valor actual
                        {getSortIcon('currentValueUSD')}
                      </div>
                    </TableHead>
                    <TableHead className="cursor-pointer" onClick={() => requestSort('purchasePrice')}>
                      <div className="flex items-center">
                        PPC (USD)
                        {getSortIcon('purchasePrice')}
                      </div>
                    </TableHead>
                    <TableHead className="cursor-pointer" onClick={() => requestSort('profitPercentage')}>
                      <div className="flex items-center">
                        Rendimiento
                        {getSortIcon('profitPercentage')}
                      </div>
                    </TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedInvestments.map((investment) => (
                    <TableRow key={investment.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {investment.logo && (
                            <img 
                              src={investment.logo} 
                              alt={`${investment.name} logo`} 
                              className="h-5 w-5 object-contain" 
                            />
                          )}
                          <div>
                            <p className="font-medium">{investment.name}</p>
                            <p className="text-xs text-muted-foreground">{investment.symbol}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>${investment.currentPrice.toLocaleString('en-US')}</TableCell>
                      <TableCell>
                        <Badge variant={investment.performance24h >= 0 ? "default" : "destructive"} className="flex items-center">
                          {investment.performance24h >= 0 ? <ArrowUp className="mr-1 h-3 w-3" /> : <ArrowDown className="mr-1 h-3 w-3" />}
                          {Math.abs(investment.performance24h).toFixed(2)}%
                        </Badge>
                      </TableCell>
                      <TableCell>{investment.quantity}</TableCell>
                      <TableCell>
                        {currencyDisplay === 'usd' 
                          ? formatCurrency(investment.currentValueUSD) 
                          : formatCurrency(investment.currentValueARS || 0, 'ars')}
                      </TableCell>
                      <TableCell>${investment.purchasePrice.toLocaleString('en-US')}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className={investment.profitUSD >= 0 ? "text-green-500" : "text-red-500"}>
                            {currencyDisplay === 'usd' 
                              ? formatCurrency(investment.profitUSD) 
                              : formatCurrency(investment.profitARS || 0, 'ars')}
                          </span>
                          <Badge variant={investment.profitUSD >= 0 ? "default" : "destructive"} className="flex items-center">
                            {investment.profitUSD >= 0 ? <ArrowUp className="mr-1 h-3 w-3" /> : <ArrowDown className="mr-1 h-3 w-3" />}
                            {Math.abs(investment.profitPercentage).toFixed(2)}%
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => handleEditInvestment(investment)}>
                              <Edit className="mr-2 h-4 w-4" />
                              Editar
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDeleteInvestment(investment.id)} className="text-red-500">
                              <Trash2 className="mr-2 h-4 w-4" />
                              Eliminar
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <p className="text-sm text-muted-foreground">
                  {selectedInvestment 
                    ? `Mostrando rendimiento de ${investments.find(inv => inv.id === selectedInvestment)?.name}` 
                    : 'Mostrando rendimiento de todas las inversiones'}
                </p>
                <div>
                  <Select 
                    value={selectedInvestment || "all"} 
                    onValueChange={(value) => setSelectedInvestment(value === "all" ? null : value)}
                  >
                    <SelectTrigger className="w-[200px]">
                      <SelectValue placeholder="Seleccionar inversión" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todas las inversiones</SelectItem>
                      {investments.map((inv) => (
                        <SelectItem key={inv.id} value={inv.id}>
                          <div className="flex items-center gap-2">
                            {inv.logo && <img src={inv.logo} alt={inv.name} className="h-4 w-4" />}
                            {inv.name}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="h-[400px] w-full">
                <ChartContainer
                  config={{
                    "primary": { color: "#7E69AB" },
                    "secondary": { color: "#8B5CF6" },
                    "other1": { color: "#0EA5E9" },
                    "other2": { color: "#33C3F0" },
                    "other3": { color: "#EA384C" }
                  }}
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsLineChart
                      data={chartData}
                      margin={{
                        top: 20,
                        right: 30,
                        left: 20,
                        bottom: 20,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="date" 
                        tickFormatter={(value) => {
                          const date = new Date(value);
                          return `${date.getMonth() + 1}/${date.getFullYear().toString().slice(2)}`;
                        }}
                      />
                      <YAxis 
                        tickFormatter={(value) => `$${value.toLocaleString('en-US')}`}
                      />
                      <Tooltip content={<ChartTooltipContent />} />
                      <Legend />
                      {Object.keys(chartData[0] || {}).filter(key => key !== 'date').map((key, index) => {
                        const colorKeys = ["primary", "secondary", "other1", "other2", "other3"];
                        const colorKey = colorKeys[index % colorKeys.length];
                        return (
                          <Line 
                            key={key}
                            type="monotone" 
                            dataKey={key} 
                            stroke={`var(--color-${colorKey})`} 
                            activeDot={{ r: 8 }} 
                          />
                        );
                      })}
                    </RechartsLineChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {editingInvestment && (
        <EditInvestmentModal 
          isOpen={isEditModalOpen} 
          onClose={() => setIsEditModalOpen(false)}
          investment={editingInvestment}
          onSave={handleSaveEdit}
        />
      )}

      <AlertDialog open={isDeleteAlertOpen} onOpenChange={setIsDeleteAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Se eliminará permanentemente esta inversión de tu cuenta.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-500 hover:bg-red-600">
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
