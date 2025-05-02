
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

interface ProfileCardProps {
  profile: UserProfile | null;
  user: any;
  onUpdateProfile: (name: string) => Promise<void>;
  onLogout: () => Promise<void>;
}

export const ProfileCard = ({ profile, user, onUpdateProfile, onLogout }: ProfileCardProps) => {
  const [isLoading, setIsLoading] = useState(false);
  
  const handleSubmit = async (values: { name: string; email: string }) => {
    setIsLoading(true);
    try {
      await onUpdateProfile(values.name);
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
        />
        
        <Separator className="my-6" />
        
        <ProfileForm
          initialValues={{
            name: profile?.full_name || "",
            email: user?.email || "",
          }}
          onSubmit={handleSubmit}
          onLogout={onLogout}
          isLoading={isLoading}
        />
      </CardContent>
    </Card>
  );
};
