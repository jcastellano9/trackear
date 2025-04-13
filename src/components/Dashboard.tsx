
import { AssetAllocation } from "./AssetAllocation";
import { ExchangeRates } from "./ExchangeRates";
import { InvestmentChart } from "./InvestmentChart";
import { motion } from "framer-motion";

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

  return (
    <div className="container px-4 py-6 mx-auto space-y-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center md:text-left"
      >
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-blue-400 to-primary bg-clip-text text-transparent">
          Bienvenido a TrackeArBit
        </h1>
        <p className="text-muted-foreground mt-2">
          Centraliza y gestiona todas tus inversiones en un solo lugar
        </p>
      </motion.div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
        <motion.div 
          custom={0}
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          className="glass-card rounded-lg p-6 space-y-2 hover:shadow-lg transition-all duration-300"
        >
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-muted-foreground">Total Invertido</p>
              <p className="text-xs text-muted-foreground">Monto original invertido</p>
            </div>
            <span className="text-xl bg-white/10 p-2 rounded-full">$</span>
          </div>
          <h2 className="text-2xl font-bold">US$ 5.000,00</h2>
        </motion.div>
        
        <motion.div 
          custom={1}
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          className="glass-card rounded-lg p-6 space-y-2 hover:shadow-lg transition-all duration-300"
        >
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-muted-foreground">Valor Actual</p>
              <p className="text-xs text-muted-foreground">Valoración a precio de mercado</p>
            </div>
            <span className="text-xl bg-white/10 p-2 rounded-full">📈</span>
          </div>
          <h2 className="text-2xl font-bold">US$ 6.250,00</h2>
        </motion.div>
        
        <motion.div 
          custom={2}
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          className="glass-card rounded-lg p-6 space-y-2 hover:shadow-lg transition-all duration-300"
        >
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-muted-foreground">Ganancia/Pérdida</p>
              <p className="text-xs text-muted-foreground">Resultado neto acumulado</p>
            </div>
            <span className="text-xl text-green-500 bg-green-500/10 p-2 rounded-full">📈</span>
          </div>
          <h2 className="text-2xl font-bold text-green-500">US$ 1.250,00</h2>
        </motion.div>
        
        <motion.div 
          custom={3}
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          className="glass-card rounded-lg p-6 space-y-2 hover:shadow-lg transition-all duration-300"
        >
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-muted-foreground">Rendimiento</p>
              <p className="text-xs text-muted-foreground">Porcentaje de retorno</p>
            </div>
            <span className="text-xl text-green-500 bg-green-500/10 p-2 rounded-full">📈</span>
          </div>
          <h2 className="text-2xl font-bold text-green-500">+25%</h2>
        </motion.div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="glass-card rounded-lg p-6 space-y-4 hover:shadow-xl transition-all duration-300"
        >
          <div>
            <h2 className="text-xl font-bold">Rendimiento de inversiones</h2>
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
          className="glass-card rounded-lg p-6 space-y-4 hover:shadow-xl transition-all duration-300"
        >
          <div>
            <h2 className="text-xl font-bold">Distribución de Activos</h2>
            <p className="text-sm text-muted-foreground">Composición actual de tu portafolio</p>
          </div>
          <AssetAllocation />
        </motion.div>
      </div>
      
      <motion.div 
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        className="glass-card rounded-lg p-6 space-y-4 w-full hover:shadow-xl transition-all duration-300"
      >
        <div>
          <h2 className="text-xl font-bold">Cotizaciones</h2>
          <p className="text-sm text-muted-foreground">Última actualización: hace 5 minutos</p>
        </div>
        <ExchangeRates />
      </motion.div>
    </div>
  );
}
