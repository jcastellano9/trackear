
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

interface SimulationWarningProps {
  onCancel: () => void;
  onContinue: () => void;
}

export function SimulationWarning({ onCancel, onContinue }: SimulationWarningProps) {
  return (
    <Alert variant="destructive" className="mb-4 border border-destructive/20 bg-destructive/10">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Atención</AlertTitle>
      <AlertDescription className="mt-2">
        Esta es una simulación. Los rendimientos de plazos fijos y billeteras virtuales están sujetos a cambios 
        debido a la inflación y otras variables económicas. Los valores mostrados son estimativos.
      </AlertDescription>
      <div className="mt-6 flex justify-end gap-2">
        <Button variant="outline" size="sm" onClick={onCancel} className="border-white/20 bg-transparent hover:bg-background/20">
          Cancelar
        </Button>
        <Button size="sm" onClick={onContinue} className="bg-blue-600 hover:bg-blue-700 text-white font-medium">
          Entiendo, continuar
        </Button>
      </div>
    </Alert>
  );
}
