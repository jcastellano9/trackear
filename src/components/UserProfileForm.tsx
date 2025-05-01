
import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";
import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSession, useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import { supabase } from "@/lib/supabase";

const profileFormSchema = z.object({
  name: z.string().min(2, {
    message: "El nombre debe tener al menos 2 caracteres.",
  }),
  email: z.string().email({
    message: "Por favor, ingresa un correo electrónico válido.",
  }),
});

type Profile = {
  id: string;
  user_id: string;
  full_name: string;
  avatar_url?: string;
  created_at: string;
};

export function UserProfileForm() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const supabaseClient = useSupabaseClient();
  const session = useSession();
  const user = useUser();
  
  useEffect(() => {
    async function loadProfile() {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', user.id)
          .single();
          
        if (error) {
          console.error('Error loading profile:', error);
          return;
        }
        
        if (data) {
          setProfile(data);
        }
      } catch (error) {
        console.error('Error:', error);
      }
    }
    
    loadProfile();
  }, [user]);
  
  const form = useForm<z.infer<typeof profileFormSchema>>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: "",
      email: "",
    },
    values: {
      name: profile?.full_name || "",
      email: user?.email || "",
    },
  });
  
  // Actualizar valores del formulario cuando el perfil cambia
  useEffect(() => {
    if (profile && user) {
      form.reset({
        name: profile.full_name,
        email: user.email || "",
      });
    }
  }, [profile, user, form]);
  
  async function onSubmit(values: z.infer<typeof profileFormSchema>) {
    if (!user) return;
    
    setIsLoading(true);
    
    try {
      // Actualizar perfil en Supabase
      const { error } = await supabase
        .from('profiles')
        .update({ 
          full_name: values.name,
          avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${values.name}`,
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', user.id);
        
      if (error) {
        throw error;
      }
      
      // Actualizar datos en el estado local
      setProfile(prev => prev ? {
        ...prev,
        full_name: values.name,
        avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${values.name}`,
      } : null);
      
      toast.success("Perfil actualizado correctamente");
    } catch (error: any) {
      console.error('Error al actualizar el perfil:', error);
      toast.error(error.message || "Error al actualizar el perfil");
    } finally {
      setIsLoading(false);
    }
  }
  
  const handleLogout = async () => {
    const { error } = await supabaseClient.auth.signOut();
    if (error) {
      console.error('Error al cerrar sesión:', error);
      toast.error("Error al cerrar sesión");
    } else {
      toast.success("Sesión cerrada correctamente");
      navigate('/login');
    }
  };
  
  if (!user || !session) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p>Cargando perfil...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Perfil de usuario</CardTitle>
          <CardDescription>
            Actualiza tu información personal
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center space-y-4 mb-6">
            <Avatar className="w-24 h-24">
              <AvatarImage src={profile?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${profile?.full_name || 'user'}`} alt={profile?.full_name || user.email || ''} />
              <AvatarFallback>{profile?.full_name?.slice(0, 2).toUpperCase() || user.email?.slice(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="text-center">
              <h3 className="text-lg font-medium">{profile?.full_name || 'Usuario'}</h3>
              <p className="text-sm text-muted-foreground">{user.email}</p>
              <p className="text-xs text-muted-foreground">
                Miembro desde {new Date(user.created_at || Date.now()).toLocaleDateString()}
              </p>
            </div>
          </div>
          
          <Separator className="my-6" />
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre completo</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormDescription>
                      Este es el nombre que se mostrará en tu perfil
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Correo electrónico</FormLabel>
                    <FormControl>
                      <Input {...field} disabled />
                    </FormControl>
                    <FormDescription>
                      Tu correo electrónico es utilizado para iniciar sesión
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-between">
                <Button 
                  type="button" 
                  variant="destructive" 
                  onClick={handleLogout}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Cerrar sesión
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Guardando..." : "Guardar cambios"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
