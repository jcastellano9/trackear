
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
} from "@/components/ui/form";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { motion } from "framer-motion";
import { UserPlus, Mail, Lock, User } from "lucide-react";
import { FormFieldWithIcon } from "./form/FormFieldWithIcon";
import { registerFormSchema, type RegisterFormValues } from "@/lib/schemas/registerSchema";

export function RegisterForm() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const supabase = useSupabaseClient();

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(values: RegisterFormValues) {
    setIsLoading(true);
    
    try {
      // Verificar si las variables de entorno de Supabase están configuradas
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
      
      if (!supabaseUrl || supabaseUrl === 'https://your-supabase-url.supabase.co' || 
          !supabaseAnonKey || supabaseAnonKey === 'your-public-anon-key') {
        throw new Error("La configuración de Supabase no está completa. Por favor configure las variables de entorno.");
      }
      
      // 1. Registrar usuario con email y contraseña
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
        options: {
          data: {
            full_name: values.name,
          },
        }
      });
      
      if (authError) {
        throw authError;
      }
      
      // 2. Crear el perfil del usuario
      if (authData.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .insert([
            { 
              user_id: authData.user.id, 
              full_name: values.name,
              avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${values.name}`,
            }
          ]);
          
        if (profileError) {
          console.error("Error creando el perfil:", profileError);
        }
      }
      
      toast.success("Registro exitoso. Bienvenido/a a TrackeArBit.");
      navigate("/");
    } catch (error: any) {
      console.error("Error durante el registro:", error);
      toast.error(error.message || "Error al crear la cuenta");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto glass-card border-white/10 backdrop-blur-xl shadow-xl">
      <CardHeader className="space-y-2">
        <FormHeader />
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormFields control={form.control} />
            <SubmitButton isLoading={isLoading} />
          </form>
        </Form>
      </CardContent>
      <CardFooter>
        <LoginLink navigate={navigate} />
      </CardFooter>
      
      {/* Show warning if Supabase is not properly configured */}
      {(import.meta.env.VITE_SUPABASE_URL === 'https://your-supabase-url.supabase.co' || 
        !import.meta.env.VITE_SUPABASE_URL ||
        import.meta.env.VITE_SUPABASE_ANON_KEY === 'your-public-anon-key' ||
        !import.meta.env.VITE_SUPABASE_ANON_KEY) && (
        <div className="mt-4 p-4 bg-yellow-500/20 rounded-md">
          <p className="text-yellow-200 text-sm">
            <strong>⚠️ Configuración incompleta:</strong> Las credenciales de Supabase no están configuradas. 
            Por favor configure las variables de entorno VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY.
          </p>
        </div>
      )}
    </Card>
  );
}

// Componentes auxiliares
const FormHeader = () => (
  <>
    <motion.div 
      className="mx-auto rounded-full bg-primary/10 w-16 h-16 flex items-center justify-center mb-2"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
    >
      <UserPlus className="h-10 w-10 text-primary" />
    </motion.div>
    <CardTitle className="text-2xl font-bold text-center bg-gradient-to-r from-white via-blue-200 to-white bg-clip-text text-transparent">
      Crear cuenta
    </CardTitle>
    <CardDescription className="text-center">
      Completa el formulario para registrarte en TrackeArBit
    </CardDescription>
  </>
);

const FormFields = ({ control }: { control: any }) => (
  <>
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <FormFieldWithIcon
        name="name"
        label="Nombre completo"
        placeholder="Juan Pérez"
        control={control}
        icon={User}
      />
    </motion.div>
    
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.1 }}
    >
      <FormFieldWithIcon
        name="email"
        label="Correo electrónico"
        placeholder="tu@email.com"
        control={control}
        icon={Mail}
      />
    </motion.div>
    
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.2 }}
    >
      <FormFieldWithIcon
        name="password"
        label="Contraseña"
        placeholder="******"
        type="password"
        control={control}
        icon={Lock}
      />
    </motion.div>
    
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.3 }}
    >
      <FormFieldWithIcon
        name="confirmPassword"
        label="Confirmar contraseña"
        placeholder="******"
        type="password"
        control={control}
        icon={Lock}
      />
    </motion.div>
  </>
);

const SubmitButton = ({ isLoading }: { isLoading: boolean }) => (
  <motion.div
    initial={{ opacity: 0, y: 10, scale: 0.95 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    transition={{ duration: 0.3, delay: 0.4 }}
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
  >
    <Button type="submit" className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 transition-all duration-300" disabled={isLoading}>
      {isLoading ? "Creando cuenta..." : "Crear cuenta"}
    </Button>
  </motion.div>
);

const LoginLink = ({ navigate }: { navigate: (path: string) => void }) => (
  <motion.div 
    className="text-sm text-muted-foreground text-center w-full"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.3, delay: 0.5 }}
  >
    ¿Ya tienes una cuenta? <Button variant="link" className="p-0 h-auto" onClick={() => navigate("/login")}>Inicia sesión</Button>
  </motion.div>
);
