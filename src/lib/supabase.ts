
import { createClient } from '@supabase/supabase-js';
import { toast } from 'sonner';

// Check if Supabase environment variables are properly configured
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Verify if the environment variables are properly set
if (!supabaseUrl || supabaseUrl === 'https://your-supabase-url.supabase.co' || 
    !supabaseAnonKey || supabaseAnonKey === 'your-public-anon-key') {
  console.error('⚠️ Las variables de entorno de Supabase no están configuradas correctamente');
  
  // We'll create the client anyway with placeholder values to prevent application crashes,
  // but authentication operations will fail
}

// Create the Supabase client
export const supabase = createClient(
  supabaseUrl || 'https://placeholder-url.supabase.co', 
  supabaseAnonKey || 'placeholder-key'
);

// Show a warning for missing configuration on initial load
if (!supabaseUrl || supabaseUrl === 'https://your-supabase-url.supabase.co' || 
    !supabaseAnonKey || supabaseAnonKey === 'your-public-anon-key') {
  setTimeout(() => {
    toast.error("Configuración de Supabase incompleta. Consulta la documentación para configurar las variables de entorno.", {
      duration: 10000,
    });
  }, 1000);
}

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
