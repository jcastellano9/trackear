
import { useEffect, useState } from 'react';
import { ProfileCard } from '@/components/profile/ProfileCard';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardHeader } from './ui/card';
import { Skeleton } from './ui/skeleton';
import { UserProfile } from '@/lib/supabase';
import { useSession } from '@supabase/auth-helpers-react';

export const UserProfileForm = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const session = useSession();
  
  useEffect(() => {
    if (!session?.user) {
      navigate('/login');
      return;
    }
    
    const getProfile = async () => {
      setIsLoading(true);
      
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();
          
        if (error) {
          throw error;
        }
        
        if (data) {
          setProfile(data as UserProfile);
        }
      } catch (error) {
        console.error('Error loading profile:', error);
        toast.error('Error al cargar el perfil');
      } finally {
        setIsLoading(false);
      }
    };
    
    getProfile();
  }, [session, navigate]);
  
  const updateProfile = async (name: string) => {
    try {
      if (!session?.user) return;
      
      const { error } = await supabase
        .from('profiles')
        .update({ full_name: name })
        .eq('id', session.user.id);
        
      if (error) {
        throw error;
      }
      
      // Update profile in local state
      if (profile) {
        setProfile({...profile, full_name: name});
      }
      
      toast.success('Perfil actualizado con éxito');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Error al actualizar el perfil');
    }
  };
  
  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        throw error;
      }
      
      toast.success('Sesión cerrada con éxito');
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
      toast.error('Error al cerrar sesión');
    }
  };
  
  if (isLoading) {
    return (
      <Card>
        <CardHeader className="flex-row items-center gap-4">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-3 w-24" />
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-10 w-full" />
        </CardContent>
      </Card>
    );
  }
  
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <ProfileCard 
        profile={profile}
        user={session?.user}
        onUpdateProfile={updateProfile}
        onLogout={handleLogout}
      />
      
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold">Preferencias de la aplicación</h3>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            En desarrollo. Pronto podrás personalizar tu experiencia.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
