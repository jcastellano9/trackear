
import { createClient } from '@supabase/supabase-js';

// Intentamos obtener las variables de entorno, o usamos valores de respaldo temporales
// Estos valores deberían configurarse correctamente en la interfaz de Lovable
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-supabase-url.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-public-anon-key';

// Crear el cliente Supabase
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
