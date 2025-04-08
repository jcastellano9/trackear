
import { useState } from "react";
import { Link } from "react-router-dom";
import { ThemeSwitcher } from "./ThemeSwitcher";
import { Button } from "@/components/ui/button";
import { Menu, X, Home, LineChart, PiggyBank, BarChart4, DollarSign } from "lucide-react";

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <nav className="border-b sticky top-0 bg-background z-10">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center">
          <Link to="/" className="font-bold text-xl text-primary flex items-center gap-2">
            <BarChart4 className="h-5 w-5" />
            <span>TrackeArBit</span>
          </Link>
        </div>
        
        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-6">
          <Link to="/" className="text-foreground/80 hover:text-primary flex items-center gap-1">
            <Home className="h-4 w-4" />
            <span>Inicio</span>
          </Link>
          <Link to="/investments" className="text-foreground/80 hover:text-primary flex items-center gap-1">
            <LineChart className="h-4 w-4" />
            <span>Inversiones</span>
          </Link>
          <Link to="/simulator" className="text-foreground/80 hover:text-primary flex items-center gap-1">
            <PiggyBank className="h-4 w-4" />
            <span>Simulador</span>
          </Link>
          <Link to="/exchange" className="text-foreground/80 hover:text-primary flex items-center gap-1">
            <DollarSign className="h-4 w-4" />
            <span>Cotizaciones</span>
          </Link>
        </div>
        
        <div className="hidden md:flex items-center gap-2">
          <ThemeSwitcher />
          <Button size="sm" variant="default">
            Iniciar Sesión
          </Button>
        </div>
        
        {/* Mobile Menu Button */}
        <div className="flex md:hidden items-center gap-2">
          <ThemeSwitcher />
          <Button variant="ghost" size="icon" onClick={toggleMenu} aria-label="Menu">
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </Button>
        </div>
      </div>
      
      {/* Mobile Menu Dropdown */}
      {menuOpen && (
        <div className="md:hidden py-4 px-4 space-y-3 border-t">
          <Link 
            to="/" 
            className="block px-4 py-2 rounded-md hover:bg-muted" 
            onClick={closeMenu}
          >
            <div className="flex items-center gap-2">
              <Home className="h-4 w-4" />
              <span>Inicio</span>
            </div>
          </Link>
          <Link 
            to="/investments" 
            className="block px-4 py-2 rounded-md hover:bg-muted" 
            onClick={closeMenu}
          >
            <div className="flex items-center gap-2">
              <LineChart className="h-4 w-4" />
              <span>Inversiones</span>
            </div>
          </Link>
          <Link 
            to="/simulator" 
            className="block px-4 py-2 rounded-md hover:bg-muted" 
            onClick={closeMenu}
          >
            <div className="flex items-center gap-2">
              <PiggyBank className="h-4 w-4" />
              <span>Simulador</span>
            </div>
          </Link>
          <Link 
            to="/exchange" 
            className="block px-4 py-2 rounded-md hover:bg-muted" 
            onClick={closeMenu}
          >
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              <span>Cotizaciones</span>
            </div>
          </Link>
          <div className="pt-2 border-t">
            <Button className="w-full" size="sm">
              Iniciar Sesión
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
}
