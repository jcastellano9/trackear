
import { useSession } from "@supabase/auth-helpers-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Logo } from "./Logo";
import { ThemeSwitcher } from "./ThemeSwitcher";
import { 
  Home, 
  Briefcase, 
  LineChart, 
  Calculator, 
  User,
  Menu,
  X
} from "lucide-react";
import { Button } from "./ui/button";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import { useState } from "react";
import { cn } from "@/lib/utils";

export function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const session = useSession();
  const [open, setOpen] = useState(false);
  
  const isActive = (path: string) => location.pathname === path;
  
  const navItems = [
    { path: "/", label: "Inicio", icon: <Home className="mr-2 h-4 w-4" /> },
    { path: "/investments", label: "Mi Cartera", icon: <Briefcase className="mr-2 h-4 w-4" /> },
    { path: "/analysis", label: "Análisis", icon: <LineChart className="mr-2 h-4 w-4" /> },
    { path: "/simulation", label: "Simulador", icon: <Calculator className="mr-2 h-4 w-4" /> },
  ];
  
  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      navigate('/login');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  if (!session) {
    return (
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex items-center justify-between h-16 py-4">
          <Logo size="md" withText={true} />
          <div className="flex items-center gap-2">
            <ThemeSwitcher />
            <Link to="/login">
              <Button variant="outline" size="sm">Iniciar sesión</Button>
            </Link>
            <Link to="/register">
              <Button size="sm">Registro</Button>
            </Link>
          </div>
        </div>
      </header>
    );
  }
  
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex items-center justify-between h-16 py-4">
        <Logo size="md" withText={true} />
        
        {/* Mobile Navigation */}
        <div className="flex md:hidden">
          <ThemeSwitcher />
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="ml-2">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <div className="flex flex-col space-y-6 mt-8">
                {navItems.map(item => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={cn(
                      "flex items-center text-muted-foreground hover:text-foreground",
                      isActive(item.path) && "text-foreground font-medium"
                    )}
                    onClick={() => setOpen(false)}
                  >
                    {item.icon}
                    {item.label}
                  </Link>
                ))}
                <hr className="my-2" />
                <Link
                  to="/profile"
                  className={cn(
                    "flex items-center text-muted-foreground hover:text-foreground",
                    isActive("/profile") && "text-foreground font-medium"
                  )}
                  onClick={() => setOpen(false)}
                >
                  <User className="mr-2 h-4 w-4" />
                  Mi Perfil
                </Link>
                <Button variant="destructive" size="sm" onClick={handleLogout}>
                  Cerrar sesión
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex md:items-center md:space-x-4">
          {navItems.map(item => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center px-3 py-1.5 rounded-md text-sm transition-colors",
                isActive(item.path)
                  ? "bg-primary/10 text-primary font-medium"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent"
              )}
            >
              {item.icon}
              {item.label}
            </Link>
          ))}
        </div>
        
        <div className="hidden md:flex md:items-center md:space-x-2">
          <ThemeSwitcher />
          <Link to="/profile">
            <Button variant="ghost" size="icon">
              <User className="h-5 w-5" />
            </Button>
          </Link>
          <Button variant="outline" size="sm" onClick={handleLogout}>
            Cerrar sesión
          </Button>
        </div>
      </div>
    </header>
  );
}

// Import needed at the end to avoid circular dependency
import { supabase } from "@/lib/supabase";
