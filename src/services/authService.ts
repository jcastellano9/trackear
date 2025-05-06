
import { supabase } from "@/lib/supabase";
import { ChangePasswordValues } from "@/utils/passwordUtils";
import { toast } from "sonner";

export const verifyCurrentPassword = async (email: string, password: string) => {
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  
  return { isValid: !error, error };
};

export const updateUserPassword = async (newPassword: string) => {
  const { error } = await supabase.auth.updateUser({
    password: newPassword,
  });
  
  return { success: !error, error };
};

export const changePassword = async (
  values: ChangePasswordValues, 
  onSuccess: () => void,
  onFailedAttempt: () => void,
  resetAttemptCount: () => void
) => {
  try {
    // Get the current user's email
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user || !user.email) {
      toast.error("No se pudo obtener la información del usuario");
      return false;
    }
    
    // First, try to sign in with the current password
    const { isValid, error: signInError } = await verifyCurrentPassword(
      user.email, 
      values.currentPassword
    );
    
    if (!isValid) {
      onFailedAttempt();
      toast.error("La contraseña actual es incorrecta");
      return false;
    }
    
    // If sign in successful, update password
    const { success, error: updateError } = await updateUserPassword(values.newPassword);
    
    if (!success) {
      toast.error("Error al actualizar la contraseña");
      return false;
    }
    
    toast.success("Contraseña actualizada exitosamente");
    resetAttemptCount();
    onSuccess();
    return true;
    
  } catch (error) {
    console.error("Error changing password:", error);
    toast.error("Ocurrió un error al cambiar la contraseña");
    return false;
  }
};
