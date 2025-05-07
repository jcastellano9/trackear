
import { ReactNode } from "react";
import { Navbar } from "@/components/Navbar";
import { Logo } from "@/components/Logo";

interface AppLayoutProps {
  children: ReactNode;
  title: string;
  description?: string;
}

export function AppLayout({ children, title, description }: AppLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-grow">
        <div className="container px-4 py-6 mx-auto space-y-8">
          <h1 className="text-3xl font-bold">{title}</h1>
          {description && (
            <p className="text-muted-foreground">
              {description}
            </p>
          )}
          
          <div className="space-y-6">
            {children}
          </div>
        </div>
      </main>
      <footer className="py-6 border-t">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          © 2025 - TrackeAr
        </div>
      </footer>
    </div>
  );
}
