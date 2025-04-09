
import { Navbar } from "@/components/Navbar";
import { CedearsExplorer } from "@/components/CedearsExplorer";

const Cedears = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-grow">
        <div className="container px-4 py-6 mx-auto space-y-8">
          <h1 className="text-3xl font-bold">CEDEARS</h1>
          <p className="text-muted-foreground">
            Explora y compara los principales CEDEARS disponibles en el mercado argentino
          </p>
          
          <CedearsExplorer />
        </div>
      </main>
      <footer className="py-6 border-t">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          © 2025 TrackeArBit - Universidad Siglo 21 - Trabajo Final de Grado en Ingeniería de Software
        </div>
      </footer>
    </div>
  );
};

export default Cedears;
