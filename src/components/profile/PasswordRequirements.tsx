
import { passwordRequirements } from "@/utils/passwordUtils";

export const PasswordRequirements = () => {
  return (
    <div className="text-sm text-muted-foreground">
      <p>La contraseña debe tener:</p>
      <ul className="list-disc pl-5 space-y-1">
        {passwordRequirements.map((req, index) => (
          <li key={index}>{req.text}</li>
        ))}
      </ul>
    </div>
  );
};
