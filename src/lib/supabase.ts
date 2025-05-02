
import { toast } from 'sonner';
import { supabase } from "@/integrations/supabase/client";

// Tipos para nuestras tablas
export type InvestmentType = {
  id: string;
  user_id: string;
  tipo: 'cripto' | 'cedear';
  activo: string;
  cantidad: number;
  precio_compra: number;
  moneda: string;
  fecha_compra: string;
  created_at: string;
};

export type UserProfile = {
  id: string;
  user_id: string;
  full_name: string;
  avatar_url?: string;
  created_at: string;
};

// Re-export supabase client for convenience
export { supabase };
