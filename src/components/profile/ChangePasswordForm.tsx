
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { PasswordRequirements } from "./PasswordRequirements";
import { BlockStatusMessage } from "./PasswordSecurity";
import { usePasswordSecurity } from "./PasswordSecurity";
import { changePassword } from "@/services/authService";
import { changePasswordSchema, ChangePasswordValues } from "@/utils/passwordUtils";

interface ChangePasswordFormProps {
  onSuccess: () => void;
}

export const ChangePasswordForm = ({ onSuccess }: ChangePasswordFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const { 
    attemptCount, 
    isBlocked, 
    blockEndTime, 
    handleFailedAttempt, 
    resetAttemptCount 
  } = usePasswordSecurity();
  
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
      await changePassword(
        values, 
        onSuccess, 
        handleFailedAttempt,
        resetAttemptCount
      );
    } finally {
      setIsLoading(false);
    }
  };
  
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
        
        <PasswordRequirements />
        
        <Button 
          type="submit" 
          className="w-full mt-4" 
          disabled={isLoading || isBlocked}
        >
          {isLoading ? "Actualizando..." : "Actualizar contraseña"}
        </Button>
        
        <BlockStatusMessage isBlocked={isBlocked} blockEndTime={blockEndTime} />
      </form>
    </Form>
  );
};
