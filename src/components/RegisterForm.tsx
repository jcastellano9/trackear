
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
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
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { motion } from "framer-motion";
import { UserPlus, Mail, Lock, User } from "lucide-react";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "El nombre debe tener al menos 2 caracteres.",
  }),
  email: z.string().email({
    message: "Por favor, ingresa un correo electrónico válido.",
  }),
  password: z.string().min(6, {
    message: "La contraseña debe tener al menos 6 caracteres.",
  }),
  confirmPassword: z.string().min(6, {
    message: "La contraseña debe tener al menos 6 caracteres.",
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Las contraseñas no coinciden",
  path: ["confirmPassword"],
});

export function RegisterForm() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const supabase = useSupabaseClient();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    
    try {
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
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre completo</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input placeholder="Juan Pérez" className="pl-10 bg-white/5" {...field} />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Correo electrónico</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input placeholder="tu@email.com" className="pl-10 bg-white/5" {...field} />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contraseña</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input type="password" placeholder="******" className="pl-10 bg-white/5" {...field} />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.3 }}
            >
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirmar contraseña</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input type="password" placeholder="******" className="pl-10 bg-white/5" {...field} />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </motion.div>
            
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
          </form>
        </Form>
      </CardContent>
      <CardFooter>
        <motion.div 
          className="text-sm text-muted-foreground text-center w-full"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.5 }}
        >
          ¿Ya tienes una cuenta? <Button variant="link" className="p-0 h-auto" onClick={() => navigate("/login")}>Inicia sesión</Button>
        </motion.div>
      </CardFooter>
    </Card>
  );
}
