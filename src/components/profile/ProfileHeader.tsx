
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ProfileHeaderProps {
  fullName: string | null | undefined;
  email: string | null | undefined;
  avatarUrl: string | null | undefined;
  createdAt: string | number | Date;
}

export const ProfileHeader = ({ fullName, email, avatarUrl, createdAt }: ProfileHeaderProps) => {
  return (
    <div className="flex flex-col items-center space-y-4 mb-6">
      <Avatar className="w-24 h-24">
        <AvatarImage src={avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${fullName || 'user'}`} alt={fullName || email || ''} />
        <AvatarFallback>{fullName?.slice(0, 2).toUpperCase() || email?.slice(0, 2).toUpperCase()}</AvatarFallback>
      </Avatar>
      <div className="text-center">
        <h3 className="text-lg font-medium">{fullName || 'Usuario'}</h3>
        <p className="text-sm text-muted-foreground">{email}</p>
        <p className="text-xs text-muted-foreground">
          Miembro desde {new Date(createdAt || Date.now()).toLocaleDateString()}
        </p>
      </div>
    </div>
  );
};
