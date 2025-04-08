
import { Link, useLocation } from "react-router-dom";
import { ThemeSwitcher } from "./ThemeSwitcher";
import { ChartLine, CircleDollarSign, LayoutDashboard, Scale } from "lucide-react";

export function Navbar() {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background">
      <div className="container flex h-16 items-center px-4 sm:px-6">
        <div className="mr-4 flex">
          <Link to="/" className="flex items-center space-x-2">
            <CircleDollarSign className="h-6 w-6" />
            <span className="font-bold inline-block">TrackeArBit 2.0</span>
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
        </nav>
        <div className="ml-auto flex items-center space-x-4">
          <ThemeSwitcher />
        </div>
      </div>
    </header>
  );
}
