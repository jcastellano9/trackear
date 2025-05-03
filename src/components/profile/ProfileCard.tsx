
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ProfileHeader } from "./ProfileHeader";
import { ProfileForm } from "./ProfileForm";
import { useState } from "react";
import { UserProfile } from "@/lib/supabase";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ChangePasswordForm } from "./ChangePasswordForm";

interface ProfileCardProps {
  profile: UserProfile | null;
  user: any;
  onUpdateProfile: (name: string, avatarUrl?: string) => Promise<void>;
  onLogout: () => Promise<void>;
  investmentStats?: {
    totalInvestmentsUSD: number;
    totalInvestmentsARS: number;
    activeInvestmentsCount: number;
  };
}

export const ProfileCard = ({ 
  profile, 
  user, 
  onUpdateProfile, 
  onLogout,
  investmentStats 
}: ProfileCardProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [changePasswordOpen, setChangePasswordOpen] = useState(false);
  
  const handleSubmit = async (values: { name: string; email: string }, avatarFile?: File) => {
    setIsLoading(true);
    try {
      let avatarUrl = profile?.avatar_url;
      
      // If we have a new avatar file, upload it
      if (avatarFile) {
        // Implement file upload logic here when needed
        // This would involve uploading to Supabase Storage
        // avatarUrl = await uploadAvatar(avatarFile, user.id);
      }
      
      await onUpdateProfile(values.name, avatarUrl);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Perfil de usuario</CardTitle>
        <CardDescription>
          Actualiza tu información personal
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ProfileHeader
          fullName={profile?.full_name}
          email={user?.email}
          avatarUrl={profile?.avatar_url}
          createdAt={user?.created_at || profile?.created_at || Date.now()}
          investmentStats={investmentStats}
        />
        
        <Separator className="my-6" />
        
        <ProfileForm
          initialValues={{
            name: profile?.full_name || "",
            email: user?.email || "",
          }}
          onSubmit={handleSubmit}
          onChangePassword={() => setChangePasswordOpen(true)}
          onLogout={onLogout}
          isLoading={isLoading}
        />
      </CardContent>

      {/* Change Password Dialog */}
      <Dialog open={changePasswordOpen} onOpenChange={setChangePasswordOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cambiar contraseña</DialogTitle>
          </DialogHeader>
          <ChangePasswordForm onSuccess={() => setChangePasswordOpen(false)} />
        </DialogContent>
      </Dialog>
    </Card>
  );
};
