
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { CircleDollarSign, Menu, X, LogIn, UserPlus, User, LogOut, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";
import { useMediaQuery } from "@/hooks/use-mobile";
import { Logo } from "@/components/Logo";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { toast } from "sonner";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const isMobile = useMediaQuery("(max-width: 768px)");
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<{name: string, email: string} | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setIsLoggedIn(true);
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    setUser(null);
    toast.success("Sesión cerrada correctamente");
  };

  const closeMenu = () => {
    if (isMobile) {
      setIsOpen(false);
    }
  };

  const getInitials = (name: string) => {
    if (!name) return "U";
    return name.split(" ").map(n => n[0]).join("").toUpperCase();
  };

  return (
    <nav className="bg-background border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <Logo size="md" withText={true} />
            </Link>
          </div>

          <div className="hidden md:block">
            <div className="flex items-center space-x-4">
              <Link
                to="/"
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  location.pathname === "/" ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-accent hover:text-accent-foreground"
                }`}
              >
                Dashboard
              </Link>
              <Link
                to="/investments"
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  location.pathname === "/investments" ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-accent hover:text-accent-foreground"
                }`}
              >
                Inversiones
              </Link>
              <Link
                to="/comparisons"
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  location.pathname === "/comparisons" ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-accent hover:text-accent-foreground"
                }`}
              >
                Comparaciones
              </Link>
              <Link
                to="/cedears"
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  location.pathname === "/cedears" ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-accent hover:text-accent-foreground"
                }`}
              >
                CEDEARs
              </Link>
              <Link
                to="/simulation"
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  location.pathname === "/simulation" ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-accent hover:text-accent-foreground"
                }`}
              >
                Simulación
              </Link>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <ThemeSwitcher />
            
            {isLoggedIn ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative rounded-full h-8 w-8 p-0">
                    <Avatar>
                      <AvatarImage src="/placeholder.svg" alt={user?.name || "Usuario"} />
                      <AvatarFallback>{user ? getInitials(user.name) : "U"}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Mi cuenta</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/profile" className="cursor-pointer flex items-center">
                      <User className="mr-2 h-4 w-4" />
                      <span>Perfil</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/investments" className="cursor-pointer flex items-center">
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Mis inversiones</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-500">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Cerrar sesión</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center space-x-2">
                <Button asChild variant="ghost" size="sm">
                  <Link to="/login" className="flex items-center">
                    <LogIn className="h-4 w-4 mr-1" />
                    Iniciar sesión
                  </Link>
                </Button>
                <Button asChild size="sm">
                  <Link to="/register" className="flex items-center">
                    <UserPlus className="h-4 w-4 mr-1" />
                    Registrarse
                  </Link>
                </Button>
              </div>
            )}
            
            <Button
              className="md:hidden"
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-background border-t">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link
              to="/"
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                location.pathname === "/" ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-accent hover:text-accent-foreground"
              }`}
              onClick={closeMenu}
            >
              Dashboard
            </Link>
            <Link
              to="/investments"
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                location.pathname === "/investments" ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-accent hover:text-accent-foreground"
              }`}
              onClick={closeMenu}
            >
              Inversiones
            </Link>
            <Link
              to="/comparisons"
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                location.pathname === "/comparisons" ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-accent hover:text-accent-foreground"
              }`}
              onClick={closeMenu}
            >
              Comparaciones
            </Link>
            <Link
              to="/cedears"
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                location.pathname === "/cedears" ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-accent hover:text-accent-foreground"
              }`}
              onClick={closeMenu}
            >
              CEDEARs
            </Link>
            <Link
              to="/simulation"
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                location.pathname === "/simulation" ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-accent hover:text-accent-foreground"
              }`}
              onClick={closeMenu}
            >
              Simulación
            </Link>
            
            {!isLoggedIn && (
              <>
                <Link
                  to="/login"
                  className="block px-3 py-2 rounded-md text-base font-medium text-foreground hover:bg-accent hover:text-accent-foreground"
                  onClick={closeMenu}
                >
                  Iniciar sesión
                </Link>
                <Link
                  to="/register"
                  className="block px-3 py-2 rounded-md text-base font-medium text-foreground hover:bg-accent hover:text-accent-foreground"
                  onClick={closeMenu}
                >
                  Registrarse
                </Link>
              </>
            )}
            
            {isLoggedIn && (
              <>
                <Link
                  to="/profile"
                  className="block px-3 py-2 rounded-md text-base font-medium text-foreground hover:bg-accent hover:text-accent-foreground"
                  onClick={closeMenu}
                >
                  Mi perfil
                </Link>
                <button
                  className="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-red-500 hover:bg-accent"
                  onClick={() => {
                    handleLogout();
                    closeMenu();
                  }}
                >
                  Cerrar sesión
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
