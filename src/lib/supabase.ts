
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
  moneda: string; // Updated to allow more currency types
  fecha_compra: string;
  created_at: string;
  updated_at?: string | null;
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
