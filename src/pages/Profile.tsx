
import { Navbar } from "@/components/Navbar";
import { UserProfileForm } from "@/components/UserProfileForm";
import { useSession } from "@supabase/auth-helpers-react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Logo } from "@/components/Logo";

const Profile = () => {
  const navigate = useNavigate();
  const session = useSession();
  
  useEffect(() => {
    if (!session) {
      navigate("/login");
    }
  }, [session, navigate]);
  
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-grow">
        <div className="container px-4 py-6 mx-auto space-y-8">
          <h1 className="text-3xl font-bold">Mi Perfil</h1>
          <p className="text-muted-foreground">
            Gestiona tu información personal y configura tus preferencias
          </p>
          
          <UserProfileForm />
        </div>
      </main>
      <footer className="py-6 border-t">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          © 2025 <Logo size="sm" withText={true} className="inline-flex mx-1" /> - Universidad Siglo 21 - Trabajo Final de Grado en Ingeniería de Software
        </div>
      </footer>
    </div>
  );
};

export default Profile;
