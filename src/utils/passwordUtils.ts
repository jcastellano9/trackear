
// Password utilities for validation and security checks
import { z } from "zod";

// Regex for password strength validation
export const passwordStrengthRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/;

// Schema for password change validation
export const changePasswordSchema = z.object({
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

export type ChangePasswordValues = z.infer<typeof changePasswordSchema>;

// Password security requirements component information
export const passwordRequirements = [
  { text: "Al menos 8 caracteres" },
  { text: "Al menos 1 letra mayúscula" },
  { text: "Al menos 1 letra minúscula" },
  { text: "Al menos 1 número" }
];
