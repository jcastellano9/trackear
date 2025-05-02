
import { useState, useEffect } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import { supabase, UserProfile } from "@/lib/supabase";
import { ProfileCard } from "./profile/ProfileCard";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export function UserProfileForm() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const session = useSession();
  const navigate = useNavigate();
  
  useEffect(() => {
    async function fetchProfile() {
      if (!session?.user.id) return;
      
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();
          
        if (error) throw error;
        
        if (data) {
          setProfile(data as UserProfile);
        } else {
          // Create a new profile if one doesn't exist
          const newProfile = {
            id: session.user.id,
            full_name: session.user.email?.split('@')[0] || 'Usuario',
          };
          
          const { error: insertError } = await supabase
            .from('profiles')
            .insert(newProfile);
          
          if (insertError) throw insertError;
          
          setProfile(newProfile as UserProfile);
        }
      } catch (error) {
        console.error('Error loading profile:', error);
        toast.error('No se pudo cargar tu perfil de usuario');
      } finally {
        setLoading(false);
      }
    }
    
    fetchProfile();
  }, [session]);
  
  const handleUpdateProfile = async (name: string) => {
    if (!session?.user.id) return;
    
    try {
      const updates = {
        id: session.user.id,
        full_name: name,
        updated_at: new Date().toISOString(),
      };
      
      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', session.user.id);
        
      if (error) throw error;
      
      setProfile(prev => prev ? { ...prev, full_name: name } : null);
      toast.success('Perfil actualizado correctamente');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('No se pudo actualizar tu perfil');
    }
  };
  
  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      toast.info('Sesión cerrada correctamente');
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
      toast.error('Error al cerrar sesión');
    }
  };
  
  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="h-20 w-20 mx-auto rounded-full bg-muted animate-pulse"></div>
        <div className="h-8 w-48 mx-auto mt-4 bg-muted animate-pulse rounded"></div>
      </div>
    );
  }
  
  return (
    <div className="max-w-md mx-auto">
      <ProfileCard
        profile={profile}
        user={session?.user}
        onUpdateProfile={handleUpdateProfile}
        onLogout={handleLogout}
      />
    </div>
  );
}
