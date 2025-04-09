
import { useState } from "react";
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

// Esta sería una llamada a la API en una versión real
const getMockInvestments = (filter: string) => {
  const allInvestments = [
    {
      id: "1",
      type: "crypto",
      name: "Bitcoin",
      symbol: "BTC",
      quantity: 0.05,
      purchasePrice: 29500,
      currentPrice: 34200,
      purchaseDate: "2023-06-15",
      currentValue: 1710,
      purchaseValue: 1475,
      profit: 235,
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
      currentValue: 2304,
      purchaseValue: 2220,
      profit: 84,
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
      currentValue: 943.5,
      purchaseValue: 862.5,
      profit: 81,
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
    },
    {
      id: "4",
      type: "fixed",
      name: "Plazo Fijo Banco Provincia",
      symbol: "PF-BAPRO",
      quantity: 1,
      purchasePrice: 100000,
      currentPrice: 109730,
      purchaseDate: "2023-09-01",
      currentValue: 109730,
      purchaseValue: 100000,
      profit: 9730,
      profitPercentage: 9.73,
      logo: "https://www.bancoprovincia.com.ar/CDN/Get/logo_BP_og",
      performance24h: 0.03,
      history: [
        { date: "2023-09-01", value: 100000 },
        { date: "2023-10-01", value: 102500 },
        { date: "2023-11-01", value: 104500 },
        { date: "2023-12-01", value: 106000 },
        { date: "2024-01-01", value: 107500 },
        { date: "2024-02-01", value: 109000 },
        { date: "2024-03-01", value: 109730 },
      ]
    },
    {
      id: "5",
      type: "wallets",
      name: "Mercado Pago",
      symbol: "MP",
      quantity: 1,
      purchasePrice: 50000,
      currentPrice: 52250,
      purchaseDate: "2023-10-01",
      currentValue: 52250,
      purchaseValue: 50000,
      profit: 2250,
      profitPercentage: 4.5,
      logo: "https://logodownload.org/wp-content/uploads/2019/06/mercado-pago-logo-1.png",
      performance24h: 0.01,
      history: [
        { date: "2023-10-01", value: 50000 },
        { date: "2023-11-01", value: 50750 },
        { date: "2023-12-01", value: 51250 },
        { date: "2024-01-01", value: 51750 },
        { date: "2024-02-01", value: 52000 },
        { date: "2024-03-01", value: 52250 },
      ]
    }
  ];

  if (filter === "all") return allInvestments;
  return allInvestments.filter(inv => inv.type === filter);
};

type InvestmentsListProps = {
  filter: "all" | "crypto" | "cedears" | "fixed" | "wallets";
};

export function InvestmentsList({ filter }: InvestmentsListProps) {
  const [investments, setInvestments] = useState(getMockInvestments(filter));
  const [sortConfig, setSortConfig] = useState<{key: string, direction: 'ascending' | 'descending'} | null>(null);
  const [editingInvestment, setEditingInvestment] = useState<any>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
  const [investmentToDelete, setInvestmentToDelete] = useState<string | null>(null);
  const [selectedInvestment, setSelectedInvestment] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'table' | 'chart'>('table');
  
  // Calcular totales
  const totalCurrentValue = investments.reduce((sum, inv) => sum + inv.currentValue, 0);
  const totalPurchaseValue = investments.reduce((sum, inv) => sum + inv.purchaseValue, 0);
  const totalProfit = totalCurrentValue - totalPurchaseValue;
  const totalProfitPercentage = (totalProfit / totalPurchaseValue) * 100;
  
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

  const handleEditInvestment = (investment: any) => {
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

  const handleSaveEdit = (updatedInvestment: any) => {
    // En una aplicación real, aquí se actualizaría la inversión en la base de datos
    setInvestments(
      investments.map(inv => 
        inv.id === updatedInvestment.id ? {...updatedInvestment, currentValue: updatedInvestment.quantity * inv.currentPrice} : inv
      )
    );
  };

  const getSortIcon = (key: string) => {
    if (!sortConfig || sortConfig.key !== key) {
      return null;
    }
    return sortConfig.direction === 'ascending' ? <ChevronUp className="ml-1 h-4 w-4" /> : <ChevronDown className="ml-1 h-4 w-4" />;
  };

  // Obtener los datos de rendimiento para el gráfico
  const getChartData = () => {
    if (!selectedInvestment) {
      // Si no hay inversión seleccionada, mostrar el rendimiento total de todas las inversiones
      // Crear un conjunto de todas las fechas disponibles
      const allDates = new Set<string>();
      investments.forEach(inv => {
        inv.history.forEach(item => {
          allDates.add(item.date);
        });
      });
      
      // Ordenar las fechas
      const sortedDates = Array.from(allDates).sort();
      
      // Crear los datos para el gráfico
      return sortedDates.map(date => {
        const dataPoint: any = { date };
        
        // Para cada inversión, encontrar el valor correspondiente a la fecha
        investments.forEach(inv => {
          const historyItem = inv.history.find(item => item.date === date);
          if (historyItem) {
            dataPoint[inv.name] = historyItem.value;
          }
        });
        
        return dataPoint;
      });
    } else {
      // Mostrar solo la inversión seleccionada
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
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Resumen</CardTitle>
          <CardDescription>Valor total y rendimiento de tus inversiones</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg">
              <p className="text-sm text-muted-foreground">Valor actual</p>
              <p className="text-2xl font-bold">${totalCurrentValue.toLocaleString('es-AR')}</p>
            </div>
            <div className="p-4 border rounded-lg">
              <p className="text-sm text-muted-foreground">Inversión inicial</p>
              <p className="text-2xl font-bold">${totalPurchaseValue.toLocaleString('es-AR')}</p>
            </div>
            <div className="p-4 border rounded-lg">
              <p className="text-sm text-muted-foreground">Rendimiento</p>
              <div className="flex items-center gap-2">
                <p className="text-2xl font-bold">
                  ${totalProfit.toLocaleString('es-AR')}
                </p>
                <Badge variant={totalProfit >= 0 ? "default" : "destructive"} className="flex items-center">
                  {totalProfit >= 0 ? <ArrowUp className="mr-1 h-3 w-3" /> : <ArrowDown className="mr-1 h-3 w-3" />}
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
                      Precio
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
                  <TableHead className="cursor-pointer" onClick={() => requestSort('currentValue')}>
                    <div className="flex items-center">
                      Valor actual
                      {getSortIcon('currentValue')}
                    </div>
                  </TableHead>
                  <TableHead className="cursor-pointer" onClick={() => requestSort('purchasePrice')}>
                    <div className="flex items-center">
                      PPC
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
                    <TableCell>${investment.currentPrice.toLocaleString('es-AR')}</TableCell>
                    <TableCell>
                      <Badge variant={investment.performance24h >= 0 ? "default" : "destructive"} className="flex items-center">
                        {investment.performance24h >= 0 ? <ArrowUp className="mr-1 h-3 w-3" /> : <ArrowDown className="mr-1 h-3 w-3" />}
                        {Math.abs(investment.performance24h).toFixed(2)}%
                      </Badge>
                    </TableCell>
                    <TableCell>{investment.quantity}</TableCell>
                    <TableCell>${investment.currentValue.toLocaleString('es-AR')}</TableCell>
                    <TableCell>${investment.purchasePrice.toLocaleString('es-AR')}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className={investment.profit >= 0 ? "text-green-500" : "text-red-500"}>
                          ${investment.profit.toLocaleString('es-AR')}
                        </span>
                        <Badge variant={investment.profit >= 0 ? "default" : "destructive"} className="flex items-center">
                          {investment.profit >= 0 ? <ArrowUp className="mr-1 h-3 w-3" /> : <ArrowDown className="mr-1 h-3 w-3" />}
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
                      <YAxis />
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

      {/* Modal de edición */}
      {editingInvestment && (
        <EditInvestmentModal 
          isOpen={isEditModalOpen} 
          onClose={() => setIsEditModalOpen(false)}
          investment={editingInvestment}
          onSave={handleSaveEdit}
        />
      )}

      {/* Alerta de confirmación de eliminación */}
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
