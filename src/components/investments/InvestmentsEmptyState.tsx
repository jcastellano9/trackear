
import React from "react";
import { Button } from "@/components/ui/button";

interface InvestmentsEmptyStateProps {
  searchTerm?: string;
  filter: "all" | "crypto" | "cedears";
}

export const InvestmentsEmptyState = ({ searchTerm = "", filter }: InvestmentsEmptyStateProps) => {
  return (
    <div className="text-center p-8 border rounded-lg">
      <p className="text-muted-foreground mb-4">
        {searchTerm 
          ? `No se encontraron inversiones que coincidan con "${searchTerm}"`
          : `No tienes inversiones ${filter !== "all" ? `de tipo ${filter === "crypto" ? "criptomoneda" : "CEDEAR"}` : ""} registradas`
        }
      </p>
      <Button variant="outline">Agregar tu primera inversión</Button>
    </div>
  );
};
