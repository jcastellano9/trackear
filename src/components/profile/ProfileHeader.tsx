
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Edit } from "lucide-react";
import { formatCurrency } from "@/utils/formatUtils";

interface ProfileHeaderProps {
  fullName: string | null | undefined;
  email: string | null | undefined;
  avatarUrl: string | null | undefined;
  createdAt: string | number | Date;
  investmentStats?: {
    totalInvestmentsUSD: number;
    totalInvestmentsARS: number;
    activeInvestmentsCount: number;
  };
}

export const ProfileHeader = ({ 
  fullName, 
  email, 
  avatarUrl, 
  createdAt,
  investmentStats
}: ProfileHeaderProps) => {
  const [isEditingAvatar, setIsEditingAvatar] = useState(false);
  const [avatarInputFile, setAvatarInputFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(avatarUrl);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarInputFile(file);
      
      // Create a preview URL
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setPreviewUrl(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Get placeholder for avatar fallback
  const getInitials = () => {
    if (fullName) {
      return fullName.slice(0, 2).toUpperCase();
    }
    if (email) {
      return email.slice(0, 2).toUpperCase();
    }
    return "US";
  };

  return (
    <div className="flex flex-col items-center space-y-4 mb-6">
      <div className="relative">
        <Avatar className="w-24 h-24 border-2 border-primary/20">
          <AvatarImage 
            src={previewUrl || avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${fullName || 'user'}`} 
            alt={fullName || email || ''} 
          />
          <AvatarFallback>{getInitials()}</AvatarFallback>
        </Avatar>

        {/* Avatar edit button */}
        <Button 
          size="icon" 
          variant="outline" 
          className="absolute bottom-0 right-0 rounded-full h-8 w-8 bg-background"
          onClick={() => setIsEditingAvatar(!isEditingAvatar)}
        >
          <Edit className="h-4 w-4" />
        </Button>

        {/* Hidden file input */}
        {isEditingAvatar && (
          <div className="mt-2 absolute -bottom-12 left-1/2 transform -translate-x-1/2 z-10">
            <Input 
              type="file" 
              accept="image/*" 
              onChange={handleFileChange} 
              className="max-w-[200px]"
            />
          </div>
        )}
      </div>

      {/* Add extra space if editing avatar */}
      {isEditingAvatar && <div className="h-12"></div>}

      <div className="text-center">
        <h3 className="text-lg font-medium">{fullName || 'Usuario'}</h3>
        <p className="text-sm text-muted-foreground">{email}</p>
        <p className="text-xs text-muted-foreground mt-1">
          Miembro desde {new Date(createdAt).toLocaleDateString('es-ES')}
        </p>

        {/* Investment stats if available */}
        {investmentStats && (
          <div className="grid grid-cols-3 gap-2 mt-3 text-xs">
            <div className="p-2 rounded-md bg-secondary/50">
              <p className="font-semibold">{investmentStats.activeInvestmentsCount}</p>
              <p className="text-muted-foreground">Inversiones activas</p>
            </div>
            <div className="p-2 rounded-md bg-secondary/50">
              <p className="font-semibold">{formatCurrency(investmentStats.totalInvestmentsUSD, 'USD')}</p>
              <p className="text-muted-foreground">Total USD</p>
            </div>
            <div className="p-2 rounded-md bg-secondary/50">
              <p className="font-semibold">{formatCurrency(investmentStats.totalInvestmentsARS, 'ARS')}</p>
              <p className="text-muted-foreground">Total ARS</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
