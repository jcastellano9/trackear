
import { useState } from "react";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
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
import { useNavigate, useSearchParams } from "react-router-dom";
import { Logo } from "@/components/Logo";
import { Lock, KeyRound, Mail, ArrowLeft } from "lucide-react";

interface ResetPasswordProps {
  updatePassword?: boolean;
}

const RequestResetSchema = z.object({
  email: z.string().email({
    message: "Por favor, ingresa un correo electrónico válido.",
  }),
});

const UpdatePasswordSchema = z.object({
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

const ResetPassword = ({ updatePassword = false }: ResetPasswordProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const supabase = useSupabaseClient();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const requestForm = useForm<z.infer<typeof RequestResetSchema>>({
    resolver: zodResolver(RequestResetSchema),
    defaultValues: {
      email: "",
    },
  });

  const updateForm = useForm<z.infer<typeof UpdatePasswordSchema>>({
    resolver: zodResolver(UpdatePasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const onRequestReset = async (values: z.infer<typeof RequestResetSchema>) => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(values.email, {
        redirectTo: window.location.origin + "/update-password",
      });
      
      if (error) throw error;
      
      toast.success("Se ha enviado un enlace de recuperación a tu correo electrónico");
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Error al solicitar la recuperación de contraseña");
    } finally {
      setIsLoading(false);
    }
  };

  const onUpdatePassword = async (values: z.infer<typeof UpdatePasswordSchema>) => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: values.password,
      });
      
      if (error) throw error;
      
      toast.success("Contraseña actualizada correctamente");
      navigate("/login");
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Error al actualizar la contraseña");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      <div className="absolute inset-0 opacity-30">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white/10"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              width: `${Math.random() * 300}px`,
              height: `${Math.random() * 300}px`,
              filter: 'blur(50px)',
              animation: `pulse ${5 + Math.random() * 10}s infinite alternate ${Math.random() * 5}s`,
            }}
          />
        ))}
      </div>

      <div className="container mx-auto px-4 py-8 z-10">
        <div className="flex items-center justify-between mb-8">
          <Logo size="lg" withText={true} className="text-white" />
          <Button variant="ghost" className="text-white" onClick={() => navigate(-1)}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver
          </Button>
        </div>
      </div>

      <main className="flex-grow flex items-center justify-center p-4 z-10">
        <Card className="w-full max-w-md mx-auto glass-card border-white/10 backdrop-blur-xl shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center bg-gradient-to-r from-white via-blue-200 to-white bg-clip-text text-transparent">
              {updatePassword ? "Crear nueva contraseña" : "Recuperar contraseña"}
            </CardTitle>
            <CardDescription className="text-center">
              {updatePassword 
                ? "Ingresa tu nueva contraseña para actualizar tu cuenta" 
                : "Ingresa tu correo electrónico para recibir instrucciones de recuperación"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!updatePassword ? (
              <Form {...requestForm}>
                <form onSubmit={requestForm.handleSubmit(onRequestReset)} className="space-y-6">
                  <FormField
                    control={requestForm.control}
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
                  <Button type="submit" className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700" disabled={isLoading}>
                    {isLoading ? "Enviando..." : "Enviar instrucciones"}
                  </Button>
                </form>
              </Form>
            ) : (
              <Form {...updateForm}>
                <form onSubmit={updateForm.handleSubmit(onUpdatePassword)} className="space-y-6">
                  <FormField
                    control={updateForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nueva contraseña</FormLabel>
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
                  <FormField
                    control={updateForm.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirmar contraseña</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <KeyRound className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input type="password" placeholder="******" className="pl-10 bg-white/5" {...field} />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700" disabled={isLoading}>
                    {isLoading ? "Actualizando..." : "Actualizar contraseña"}
                  </Button>
                </form>
              </Form>
            )}
          </CardContent>
          <CardFooter>
            <div className="text-sm text-muted-foreground text-center w-full">
              <Button variant="link" className="p-0 h-auto" onClick={() => navigate("/login")}>
                Volver a inicio de sesión
              </Button>
            </div>
          </CardFooter>
        </Card>
      </main>

      <footer className="py-6 text-center text-sm text-white/70 z-10">
        <div className="container mx-auto px-4">
          © 2025 <Logo size="sm" withText={true} className="inline-flex mx-1 text-white" /> - Universidad Siglo 21 - Trabajo Final de Grado en Ingeniería de Software
        </div>
      </footer>
    </div>
  );
};

export default ResetPassword;
