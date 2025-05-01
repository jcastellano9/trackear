
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSession, useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import { ProfileCard } from "./profile/ProfileCard";

type Profile = {
  id: string;
  user_id: string;
  full_name: string;
  avatar_url?: string;
  created_at: string;
};

export function UserProfileForm() {
  const [profile, setProfile] = useState<Profile | null>(null);
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
  
  const handleUpdateProfile = async (name: string) => {
    if (!user) return;
    
    try {
      // Actualizar perfil en Supabase
      const { error } = await supabase
        .from('profiles')
        .update({ 
          full_name: name,
          avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`,
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', user.id);
        
      if (error) {
        throw error;
      }
      
      // Actualizar datos en el estado local
      setProfile(prev => prev ? {
        ...prev,
        full_name: name,
        avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`,
      } : null);
      
      toast.success("Perfil actualizado correctamente");
    } catch (error: any) {
      console.error('Error al actualizar el perfil:', error);
      toast.error(error.message || "Error al actualizar el perfil");
    }
  };
  
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
      <ProfileCard
        profile={profile}
        user={user}
        onUpdateProfile={handleUpdateProfile}
        onLogout={handleLogout}
      />
    </div>
  );
}

// Importing Card components for loading state
import { Card, CardContent } from "@/components/ui/card";
