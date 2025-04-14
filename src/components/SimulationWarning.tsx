import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export function SimulationWarning() {
  return (
    <Alert variant="destructive" className="mb-4 border border-destructive/20 bg-destructive/10">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Atención</AlertTitle>
      <AlertDescription className="mt-2">
        Esta es una simulación. Los rendimientos de plazos fijos y billeteras virtuales están sujetos a cambios
        debido a la inflación y otras variables económicas. Los valores mostrados son estimativos.
      </AlertDescription>
    </Alert>
  );
}
