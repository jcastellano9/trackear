
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { createClient } from '@supabase/supabase-js';
import { SessionContextProvider } from '@supabase/auth-helpers-react';
import Index from "./pages/Index";
import Investments from "./pages/Investments";
import Comparisons from "./pages/Comparisons";
import Cedears from "./pages/Cedears";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import Simulation from "./pages/Simulation"; 
import NotFound from "./pages/NotFound";
import ResetPassword from "./pages/ResetPassword";
import PrivateRoute from "./components/PrivateRoute";

const App = () => {
  // Create a new QueryClient instance within the component
  const [queryClient] = useState(() => new QueryClient());
  
  // Supabase client
  const [supabaseClient] = useState(() => createClient(
    import.meta.env.VITE_SUPABASE_URL || '',
    import.meta.env.VITE_SUPABASE_ANON_KEY || ''
  ));

  return (
    <SessionContextProvider supabaseClient={supabaseClient}>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/update-password" element={<ResetPassword updatePassword={true} />} />
              
              {/* Rutas protegidas */}
              <Route path="/" element={<PrivateRoute element={<Index />} />} />
              <Route path="/investments" element={<PrivateRoute element={<Investments />} />} />
              <Route path="/comparisons" element={<PrivateRoute element={<Comparisons />} />} />
              <Route path="/cedears" element={<PrivateRoute element={<Cedears />} />} />
              <Route path="/simulation" element={<PrivateRoute element={<Simulation />} />} />
              <Route path="/profile" element={<PrivateRoute element={<Profile />} />} />
              
              {/* Ruta 404 */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </SessionContextProvider>
  );
};

export default App;
