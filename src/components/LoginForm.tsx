
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
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, UserCircle, Mail, Lock } from "lucide-react";
import { motion } from "framer-motion";
import { useSupabaseClient } from "@supabase/auth-helpers-react";

const formSchema = z.object({
  email: z.string().email({
    message: "Por favor, ingresa un correo electrónico válido.",
  }),
  password: z.string().min(6, {
    message: "La contraseña debe tener al menos 6 caracteres.",
  }),
});

export function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const supabase = useSupabaseClient();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password,
      });
      
      if (error) {
        throw error;
      }
      
      toast.success("Inicio de sesión exitoso");
      navigate("/");
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Error al iniciar sesión");
    } finally {
      setIsLoading(false);
    }
  }

  const handleForgotPassword = async () => {
    const email = form.getValues("email");
    
    if (!email) {
      toast.error("Por favor ingresa tu correo electrónico para recuperar tu contraseña");
      return;
    }
    
    setIsLoading(true);
    
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin + "/update-password",
      });
      
      if (error) {
        throw error;
      }
      
      toast.success("Se ha enviado un enlace de recuperación a tu correo electrónico");
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Error al solicitar la recuperación de contraseña");
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  return (
    <Card className="w-full max-w-md mx-auto glass-card border-white/10 backdrop-blur-xl shadow-xl">
      <CardHeader className="space-y-2">
        <div className="mx-auto rounded-full bg-primary/10 w-16 h-16 flex items-center justify-center mb-2">
          <UserCircle className="h-10 w-10 text-primary" />
        </div>
        <CardTitle className="text-2xl font-bold text-center bg-gradient-to-r from-white via-blue-200 to-white bg-clip-text text-transparent">
          Iniciar sesión
        </CardTitle>
        <CardDescription className="text-center">
          Ingresa tus credenciales para acceder a tu cuenta
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
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Correo electrónico</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input 
                          placeholder="tu@email.com" 
                          className="pl-10 bg-white/5" 
                          {...field} 
                        />
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
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contraseña</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input 
                          type={showPassword ? "text" : "password"} 
                          placeholder="******" 
                          className="pl-10 bg-white/5" 
                          {...field} 
                        />
                        <button 
                          type="button"
                          className="absolute right-3 top-3"
                          onClick={togglePasswordVisibility}
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4 text-muted-foreground" />
                          ) : (
                            <Eye className="h-4 w-4 text-muted-foreground" />
                          )}
                        </button>
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
              transition={{ duration: 0.3, delay: 0.2 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 transition-all duration-300" 
                disabled={isLoading}
              >
                {isLoading ? "Iniciando sesión..." : "Iniciar sesión"}
              </Button>
            </motion.div>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex flex-col space-y-4">
        <motion.div 
          className="text-sm text-muted-foreground text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.4 }}
        >
          ¿No tienes una cuenta? <Button variant="link" className="p-0 h-auto" onClick={() => navigate("/register")}>Regístrate</Button>
        </motion.div>
        <motion.div 
          className="text-sm text-muted-foreground text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.5 }}
        >
        </motion.div>
      </CardFooter>
    </Card>
  );
}
