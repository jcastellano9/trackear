
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

interface SimulationWarningProps {
  onCancel: () => void;
  onContinue: () => void;
}

export function SimulationWarning({ onCancel, onContinue }: SimulationWarningProps) {
  return (
    <Alert variant="destructive" className="mb-4">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Atención</AlertTitle>
      <AlertDescription>
        Esta es una simulación. Los rendimientos de plazos fijos y billeteras virtuales están sujetos a cambios 
        debido a la inflación y otras variables económicas. Los valores mostrados son estimativos.
      </AlertDescription>
      <div className="mt-4 flex justify-end gap-2">
        <Button variant="outline" size="sm" onClick={onCancel}>
          Cancelar
        </Button>
        <Button size="sm" onClick={onContinue}>
          Entiendo, continuar
        </Button>
      </div>
    </Alert>
  );
}
