
import { Navbar } from "@/components/Navbar";
import { SimulationTool } from "@/components/SimulationTool";
import { Logo } from "@/components/Logo";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

const Simulation = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-grow">
        <div className="container px-4 py-6 mx-auto space-y-8">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">Simulación de Rendimientos</h1>
            <p className="text-muted-foreground">
              Calcula el rendimiento potencial de distintos instrumentos financieros en diferentes plazos de tiempo
            </p>
          </div>
          
          <QueryClientProvider client={queryClient}>
            <SimulationTool />
          </QueryClientProvider>
        </div>
      </main>
      <footer className="py-6 border-t border-white/10">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          © 2025 <Logo size="sm" withText={true} className="inline-flex mx-1" /> - Universidad Siglo 21 - Trabajo Final de Grado en Ingeniería de Software
        </div>
      </footer>
    </div>
  );
};

export default Simulation;
