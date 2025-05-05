
import { AssetAllocation } from "./AssetAllocation";
import { ExchangeRates } from "./ExchangeRates";
import { InvestmentChart } from "./InvestmentChart";
import { motion } from "framer-motion";
import { TrendingUp, DollarSign, PieChart, BarChart4, RefreshCw } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useSession } from "@supabase/auth-helpers-react";
import { Button } from "@/components/ui/button";

export function Dashboard() {
  const session = useSession();
  const [hasInvestments, setHasInvestments] = useState(false);
  const [investmentStats, setInvestmentStats] = useState({
    totalInvested: 0,
    currentValue: 0,
    profit: 0,
    profitPercentage: 0
  });
  const [loading, setLoading] = useState(true);

  // Check if user has investments and get stats
  const fetchInvestmentData = async () => {
    setLoading(true);
    if (!session?.user?.id) {
      setInvestmentStats({
        totalInvested: 0,
        currentValue: 0,
        profit: 0,
        profitPercentage: 0
      });
      setHasInvestments(false);
      setLoading(false);
      return;
    }
    
    try {
      const { data, error, count } = await supabase
        .from('investments')
        .select('*', { count: 'exact' })
        .eq('user_id', session.user.id);
        
      if (error) throw error;
      
      if (count && count > 0) {
        setHasInvestments(true);
        
        // Calculate stats from actual investments
        let totalInvested = 0;
        let currentValue = 0;
        
        data?.forEach(investment => {
          const investmentAmount = investment.precio_compra * investment.cantidad;
          totalInvested += investmentAmount;
          
          // Mock current value with a random change
          const randomChange = 1 + (Math.random() * 0.5 - 0.25); // -25% to +25%
          const currentInvestmentValue = investmentAmount * randomChange;
          currentValue += currentInvestmentValue;
        });
        
        const profit = currentValue - totalInvested;
        const profitPercentage = totalInvested > 0 ? (profit / totalInvested) * 100 : 0;
        
        setInvestmentStats({
          totalInvested,
          currentValue,
          profit,
          profitPercentage
        });
      } else {
        // No investments found, reset stats to zero
        setInvestmentStats({
          totalInvested: 0,
          currentValue: 0,
          profit: 0,
          profitPercentage: 0
        });
        setHasInvestments(false);
      }
    } catch (error) {
      console.error("Error checking investments:", error);
      // On error, reset stats to zero
      setInvestmentStats({
        totalInvested: 0,
        currentValue: 0,
        profit: 0,
        profitPercentage: 0
      });
      setHasInvestments(false);
    } finally {
      setLoading(false);
    }
  };
    
  useEffect(() => {
    fetchInvestmentData();
  }, [session]);
  
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
        ease: "easeOut"
      }
    })
  };

  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { 
        type: "spring", 
        stiffness: 100,
        damping: 10
      }
    }
  };

  const formatCurrency = (amount: number) => {
    return `US$ ${amount.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}`;
  };

  return (
    <div className="container px-4 py-6 mx-auto space-y-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center md:text-left"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
          <div>
            <h1 className="text-4xl font-bold text-gradient glow">
              Bienvenido a TrackeAr
            </h1>
            <p className="text-muted-foreground mt-2">
              Centraliza y gestiona todas tus inversiones en un solo lugar
            </p>
          </div>
          
          <Button 
            variant="outline"
            className="flex items-center gap-2"
            onClick={fetchInvestmentData}
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            Actualizar datos
          </Button>
        </div>
      </motion.div>
      
      <motion.div 
        variants={container}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6"
      >
        <motion.div 
          variants={item}
          whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
          className="rounded-lg p-6 space-y-2 hover:shadow-lg transition-all duration-300 bg-card text-card-foreground"
        >
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-muted-foreground">Total Invertido</p>
              <p className="text-xs text-muted-foreground">Monto original invertido</p>
            </div>
            <span className="text-xl bg-gradient-to-br from-blue-500 to-purple-600 p-2 rounded-full flex items-center justify-center">
              <DollarSign className="text-white" />
            </span>
          </div>
          <h2 className="text-2xl font-bold">
            {loading ? "Cargando..." : formatCurrency(investmentStats.totalInvested)}
          </h2>
        </motion.div>
        
        <motion.div 
          variants={item}
          whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
          className="rounded-lg p-6 space-y-2 hover:shadow-lg transition-all duration-300 bg-card text-card-foreground"
        >
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-muted-foreground">Valor Actual</p>
              <p className="text-xs text-muted-foreground">Valoración a precio de mercado</p>
            </div>
            <span className="text-xl bg-gradient-to-br from-blue-500 to-purple-600 p-2 rounded-full flex items-center justify-center">
              <BarChart4 className="text-white" />
            </span>
          </div>
          <h2 className="text-2xl font-bold">
            {loading ? "Cargando..." : formatCurrency(investmentStats.currentValue)}
          </h2>
        </motion.div>
        
        <motion.div 
          variants={item}
          whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
          className="rounded-lg p-6 space-y-2 hover:shadow-lg transition-all duration-300 bg-card text-card-foreground"
        >
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-muted-foreground">Ganancia/Pérdida</p>
              <p className="text-xs text-muted-foreground">Resultado neto acumulado</p>
            </div>
            <span className={`text-xl text-white ${investmentStats.profit >= 0 ? 'bg-green-500/70' : 'bg-red-500/70'} p-2 rounded-full flex items-center justify-center`}>
              <TrendingUp />
            </span>
          </div>
          <h2 className={`text-2xl font-bold ${investmentStats.profit >= 0 ? 'text-green-500' : 'text-red-500'}`}>
            {loading ? "Cargando..." : formatCurrency(investmentStats.profit)}
          </h2>
        </motion.div>
        
        <motion.div 
          variants={item}
          whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
          className="rounded-lg p-6 space-y-2 hover:shadow-lg transition-all duration-300 bg-card text-card-foreground"
        >
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-muted-foreground">Rendimiento</p>
              <p className="text-xs text-muted-foreground">Porcentaje de retorno</p>
            </div>
            <span className={`text-xl text-white ${investmentStats.profitPercentage >= 0 ? 'bg-green-500/70' : 'bg-red-500/70'} p-2 rounded-full flex items-center justify-center`}>
              <PieChart />
            </span>
          </div>
          <h2 className={`text-2xl font-bold ${investmentStats.profitPercentage >= 0 ? 'text-green-500' : 'text-red-500'}`}>
            {loading ? "Cargando..." : `${investmentStats.profitPercentage.toFixed(2)}%`}
          </h2>
        </motion.div>
      </motion.div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          whileHover={{ scale: 1.01, transition: { duration: 0.2 } }}
          className="rounded-lg p-6 space-y-4 hover:shadow-xl transition-all duration-300 bg-card text-card-foreground"
        >
          <div>
            <h2 className="text-xl font-bold text-gradient">Rendimiento de inversiones</h2>
            <p className="text-sm text-muted-foreground">Evolución del capital invertido vs. valor actual</p>
          </div>
          <div className="h-[300px] mt-6">
            <InvestmentChart />
          </div>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          whileHover={{ scale: 1.01, transition: { duration: 0.2 } }}
          className="rounded-lg p-6 space-y-4 hover:shadow-xl transition-all duration-300 bg-card text-card-foreground"
        >
          <div>
            <h2 className="text-xl font-bold text-gradient">Distribución de Activos</h2>
            <p className="text-sm text-muted-foreground">Composición actual de tu portafolio</p>
          </div>
          <AssetAllocation />
        </motion.div>
      </div>
      
      <motion.div 
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        whileHover={{ scale: 1.01, transition: { duration: 0.2 } }}
        className="rounded-lg p-6 space-y-4 w-full hover:shadow-xl transition-all duration-300 bg-card text-card-foreground"
      >
        <div>
          <h2 className="text-xl font-bold text-gradient">Cotizaciones</h2>
          <p className="text-sm text-muted-foreground">Última actualización: {new Date().toLocaleTimeString()}</p>
        </div>
        <ExchangeRates />
      </motion.div>
    </div>
  );
}
