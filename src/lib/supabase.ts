
import { toast } from 'sonner';
import { supabase } from "@/integrations/supabase/client";

// Tipos para nuestras tablas
export type InvestmentType = {
  id: string;
  user_id: string;
  tipo: "cripto" | "cedear"; // Ensure strict type to match database constraints
  activo: string;
  cantidad: number;
  precio_compra: number;
  moneda: "USD" | "ARS"; // Restrict to only USD or ARS
  fecha_compra: string;
  created_at: string;
  updated_at?: string | null;
  symbol?: string; // Symbol for the asset (BTC, AAPL, etc.)
  ratio?: number; // Ratio for CEDEARs (example: 20:1)
  // Extended properties for UI functionality
  current_price?: number; 
  price_change_percent?: number;
  price_change_absolute?: number; // Added property
  total_value?: number;
  ppc?: number; // Precio Promedio de Compra
};

export type UserProfile = {
  id: string; // Changed from user_id to match Database schema
  full_name: string;
  avatar_url?: string | null;
  created_at: string;
  updated_at?: string | null;
};

// Re-export supabase client for convenience
export { supabase };
