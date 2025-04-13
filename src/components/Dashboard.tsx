
import { AssetAllocation } from "./AssetAllocation";
import { ExchangeRates } from "./ExchangeRates";
import { InvestmentChart } from "./InvestmentChart";
import { motion } from "framer-motion";
import { TrendingUp, DollarSign, PieChart, BarChart4 } from "lucide-react";

export function Dashboard() {
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

  return (
    <div className="container px-4 py-6 mx-auto space-y-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center md:text-left"
      >
        <h1 className="text-4xl font-bold text-gradient glow">
          Bienvenido a TrackeArBit
        </h1>
        <p className="text-muted-foreground mt-2">
          Centraliza y gestiona todas tus inversiones en un solo lugar
        </p>
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
          className="glass-card rounded-lg p-6 space-y-2 hover:shadow-lg transition-all duration-300 glow-box card-3d"
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
          <h2 className="text-2xl font-bold">US$ 5.000,00</h2>
        </motion.div>
        
        <motion.div 
          variants={item}
          whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
          className="glass-card rounded-lg p-6 space-y-2 hover:shadow-lg transition-all duration-300 glow-box card-3d"
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
          <h2 className="text-2xl font-bold">US$ 6.250,00</h2>
        </motion.div>
        
        <motion.div 
          variants={item}
          whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
          className="glass-card rounded-lg p-6 space-y-2 hover:shadow-lg transition-all duration-300 glow-box card-3d"
        >
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-muted-foreground">Ganancia/Pérdida</p>
              <p className="text-xs text-muted-foreground">Resultado neto acumulado</p>
            </div>
            <span className="text-xl text-white bg-green-500/70 p-2 rounded-full flex items-center justify-center">
              <TrendingUp />
            </span>
          </div>
          <h2 className="text-2xl font-bold text-green-500">US$ 1.250,00</h2>
        </motion.div>
        
        <motion.div 
          variants={item}
          whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
          className="glass-card rounded-lg p-6 space-y-2 hover:shadow-lg transition-all duration-300 glow-box card-3d"
        >
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-muted-foreground">Rendimiento</p>
              <p className="text-xs text-muted-foreground">Porcentaje de retorno</p>
            </div>
            <span className="text-xl text-white bg-green-500/70 p-2 rounded-full flex items-center justify-center">
              <PieChart />
            </span>
          </div>
          <h2 className="text-2xl font-bold text-green-500">+25%</h2>
        </motion.div>
      </motion.div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          whileHover={{ scale: 1.01, transition: { duration: 0.2 } }}
          className="glass-card rounded-lg p-6 space-y-4 hover:shadow-xl transition-all duration-300 glow-box"
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
          className="glass-card rounded-lg p-6 space-y-4 hover:shadow-xl transition-all duration-300 glow-box"
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
        className="glass-card rounded-lg p-6 space-y-4 w-full hover:shadow-xl transition-all duration-300 glow-box"
      >
        <div>
          <h2 className="text-xl font-bold text-gradient">Cotizaciones</h2>
          <p className="text-sm text-muted-foreground">Última actualización: hace 5 minutos</p>
        </div>
        <ExchangeRates />
      </motion.div>
    </div>
  );
}
