
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";
import { useLocalStorage } from "@/hooks/useLocalStorage";

export function ThemeSwitcher() {
  // Use the custom useLocalStorage hook
  const [theme, setTheme] = useLocalStorage<"light" | "dark">(
    "theme", 
    typeof window !== "undefined"
      ? window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
      : "dark"
  );

  // Apply theme on component mount and when theme changes
  useEffect(() => {
    if (typeof window !== "undefined") {
      // Update the document class
      const root = document.documentElement;
      
      if (theme === "dark") {
        root.classList.add("dark");
        root.classList.remove("light");
      } else {
        root.classList.add("light");
        root.classList.remove("dark");
      }
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
    >
      {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
    </Button>
  );
}
