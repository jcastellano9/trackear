
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Las variables de entorno de Supabase no están definidas');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

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
