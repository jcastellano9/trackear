
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { supabase } from "@/lib/supabase";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const passwordStrengthRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/;

const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "La contraseña actual es obligatoria"),
  newPassword: z
    .string()
    .min(8, "La nueva contraseña debe tener al menos 8 caracteres")
    .regex(
      passwordStrengthRegex,
      "La contraseña debe contener al menos una mayúscula, una minúscula y un número"
    ),
  confirmPassword: z.string().min(8, "Debes confirmar la nueva contraseña"),
}).refine(data => data.newPassword === data.confirmPassword, {
  message: "Las contraseñas no coinciden",
  path: ["confirmPassword"],
});

type ChangePasswordValues = z.infer<typeof changePasswordSchema>;

interface ChangePasswordFormProps {
  onSuccess: () => void;
}

export const ChangePasswordForm = ({ onSuccess }: ChangePasswordFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [attemptCount, setAttemptCount] = useState(0);
  const [isBlocked, setIsBlocked] = useState(false);
  const [blockEndTime, setBlockEndTime] = useState<Date | null>(null);
  
  const form = useForm<ChangePasswordValues>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });
  
  const handlePasswordChange = async (values: ChangePasswordValues) => {
    if (isBlocked) {
      const timeRemaining = blockEndTime ? Math.ceil((blockEndTime.getTime() - Date.now()) / 60000) : 15;
      toast.error(`Demasiados intentos fallidos. Intente nuevamente en ${timeRemaining} minutos.`);
      return;
    }

    setIsLoading(true);
    
    try {
      // Get the current user's email
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user || !user.email) {
        toast.error("No se pudo obtener la información del usuario");
        return;
      }
      
      // First, try to sign in with the current password
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: values.currentPassword,
      });
      
      if (signInError) {
        // Increment attempt count on failure
        const newAttemptCount = attemptCount + 1;
        setAttemptCount(newAttemptCount);
        
        // Block after 5 failed attempts
        if (newAttemptCount >= 5) {
          const blockEndTime = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes
          setIsBlocked(true);
          setBlockEndTime(blockEndTime);
          
          // Store block time in localStorage
          localStorage.setItem('passwordChangeBlockUntil', blockEndTime.toISOString());
          
          toast.error("Demasiados intentos fallidos. Bloqueado por 15 minutos.");
          
          // Set a timeout to unblock
          setTimeout(() => {
            setIsBlocked(false);
            setAttemptCount(0);
            setBlockEndTime(null);
            localStorage.removeItem('passwordChangeBlockUntil');
          }, 15 * 60 * 1000);
          
          return;
        }
        
        toast.error("La contraseña actual es incorrecta");
        return;
      }
      
      // If sign in successful, update password
      const { error: updateError } = await supabase.auth.updateUser({
        password: values.newPassword,
      });
      
      if (updateError) {
        toast.error("Error al actualizar la contraseña");
        return;
      }
      
      toast.success("Contraseña actualizada exitosamente");
      setAttemptCount(0); // Reset attempt count on success
      onSuccess();
      
    } catch (error) {
      console.error("Error changing password:", error);
      toast.error("Ocurrió un error al cambiar la contraseña");
    } finally {
      setIsLoading(false);
    }
  };

  // Check for existing block on component mount
  useState(() => {
    const blockedUntil = localStorage.getItem('passwordChangeBlockUntil');
    
    if (blockedUntil) {
      const blockEndTime = new Date(blockedUntil);
      
      if (blockEndTime > new Date()) {
        // Still in block period
        setIsBlocked(true);
        setBlockEndTime(blockEndTime);
        
        // Set timeout to clear the block
        const timeoutMs = blockEndTime.getTime() - Date.now();
        setTimeout(() => {
          setIsBlocked(false);
          setAttemptCount(0);
          setBlockEndTime(null);
          localStorage.removeItem('passwordChangeBlockUntil');
        }, timeoutMs);
      } else {
        // Block period has ended, clear it
        localStorage.removeItem('passwordChangeBlockUntil');
      }
    }
  });
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handlePasswordChange)} className="space-y-4">
        <FormField
          control={form.control}
          name="currentPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Contraseña actual</FormLabel>
              <FormControl>
                <Input type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="newPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nueva contraseña</FormLabel>
              <FormControl>
                <Input type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirmar contraseña</FormLabel>
              <FormControl>
                <Input type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="text-sm text-muted-foreground">
          <p>La contraseña debe tener:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Al menos 8 caracteres</li>
            <li>Al menos 1 letra mayúscula</li>
            <li>Al menos 1 letra minúscula</li>
            <li>Al menos 1 número</li>
          </ul>
        </div>
        
        <Button 
          type="submit" 
          className="w-full mt-4" 
          disabled={isLoading || isBlocked}
        >
          {isLoading ? "Actualizando..." : "Actualizar contraseña"}
        </Button>
        
        {isBlocked && blockEndTime && (
          <p className="text-sm text-destructive text-center">
            Cuenta bloqueada. Intente nuevamente en {
              Math.ceil((blockEndTime.getTime() - Date.now()) / 60000)
            } minutos.
          </p>
        )}
      </form>
    </Form>
  );
};
