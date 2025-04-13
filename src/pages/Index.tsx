
import { Navbar } from "@/components/Navbar";
import { Dashboard } from "@/components/Dashboard";
import { Logo } from "@/components/Logo";
import { motion } from "framer-motion";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background relative">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-purple-600/5"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              width: `${Math.random() * 400 + 100}px`,
              height: `${Math.random() * 400 + 100}px`,
            }}
            animate={{
              x: [0, Math.random() * 100 - 50],
              y: [0, Math.random() * 100 - 50],
            }}
            transition={{
              duration: 20 + Math.random() * 10,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut",
            }}
          />
        ))}
      </div>
      
      <Navbar />
      
      <main className="flex-grow">
        <Dashboard />
      </main>
      
      <motion.footer 
        className="py-6 border-t border-white/10 backdrop-blur-sm"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 1 }}
      >
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          © 2025 <Logo size="sm" withText={true} className="inline-flex mx-1" /> - Universidad Siglo 21 - Trabajo Final de Grado en Ingeniería de Software
        </div>
      </motion.footer>
    </div>
  );
};

export default Index;
