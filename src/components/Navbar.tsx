
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ThemeSwitcher } from "./ThemeSwitcher";
import { ChartLine, CircleDollarSign, LayoutDashboard, Scale, UserCircle, LogIn } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  
  useEffect(() => {
    // Check if user is logged in
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  };
  
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background">
      <div className="container flex h-16 items-center px-4 sm:px-6">
        <div className="mr-4 flex">
          <Link to="/" className="flex items-center space-x-2">
            <CircleDollarSign className="h-6 w-6" />
            <span className="font-bold inline-block">TrackeArBit</span>
          </Link>
        </div>
        <nav className="flex items-center space-x-4 lg:space-x-6 mx-6">
          <Link
            to="/"
            className={`text-sm font-medium transition-colors hover:text-primary flex items-center ${
              isActive("/") 
                ? "text-foreground" 
                : "text-muted-foreground"
            }`}
          >
            <LayoutDashboard className="h-4 w-4 mr-1" />
            <span className="hidden sm:inline-block">Dashboard</span>
          </Link>
          <Link
            to="/investments"
            className={`text-sm font-medium transition-colors hover:text-primary flex items-center ${
              isActive("/investments") 
                ? "text-foreground" 
                : "text-muted-foreground"
            }`}
          >
            <ChartLine className="h-4 w-4 mr-1" />
            <span className="hidden sm:inline-block">Inversiones</span>
          </Link>
          <Link
            to="/comparisons"
            className={`text-sm font-medium transition-colors hover:text-primary flex items-center ${
              isActive("/comparisons") 
                ? "text-foreground" 
                : "text-muted-foreground"
            }`}
          >
            <Scale className="h-4 w-4 mr-1" />
            <span className="hidden sm:inline-block">Comparaciones</span>
          </Link>
          <Link
            to="/cedears"
            className={`text-sm font-medium transition-colors hover:text-primary flex items-center ${
              isActive("/cedears") 
                ? "text-foreground" 
                : "text-muted-foreground"
            }`}
          >
            <ChartLine className="h-4 w-4 mr-1" />
            <span className="hidden sm:inline-block">CEDEARS</span>
          </Link>
        </nav>
        <div className="ml-auto flex items-center space-x-4">
          <ThemeSwitcher />
          
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback>{user.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user.name}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate("/profile")}>
                  <UserCircle className="mr-2 h-4 w-4" />
                  <span>Mi Perfil</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogIn className="mr-2 h-4 w-4" />
                  <span>Cerrar sesión</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button variant="outline" size="sm" onClick={() => navigate("/login")} className="flex items-center">
              <LogIn className="mr-2 h-4 w-4" />
              <span>Iniciar sesión</span>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
