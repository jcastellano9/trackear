
import { AppLayout } from "@/components/layout/AppLayout";
import { UserProfileForm } from "@/components/UserProfileForm";

const Profile = () => {
  return (
    <AppLayout 
      title="Mi Perfil"
      description="Gestiona tu información personal y configura tus preferencias"
    >
      <UserProfileForm />
    </AppLayout>
  );
};

export default Profile;
