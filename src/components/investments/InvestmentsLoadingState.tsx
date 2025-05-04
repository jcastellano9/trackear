
import React from "react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";

interface InvestmentsLoadingStateProps {
  filter: "all" | "crypto" | "cedears";
}

export const InvestmentsLoadingState = ({ filter }: InvestmentsLoadingStateProps) => {
  return (
    <div className="w-full overflow-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[60px]"></TableHead>
            <TableHead>Ticker</TableHead>
            <TableHead>Nombre</TableHead>
            <TableHead className="text-right">Precio actual</TableHead>
            <TableHead className="text-right">Cambio $</TableHead>
            <TableHead className="text-right">Cambio %</TableHead>
            {filter === "cedears" && <TableHead className="text-center">Ratio</TableHead>}
            <TableHead className="text-right">Cantidad</TableHead>
            <TableHead className="text-right">PPC</TableHead>
            <TableHead className="text-right">Tenencia</TableHead>
            <TableHead className="text-right">Asignación</TableHead>
            <TableHead className="text-right w-[100px]">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array(5).fill(0).map((_, i) => (
            <TableRow key={i}>
              {Array(filter === "cedears" ? 11 : 10).fill(0).map((_, j) => (
                <TableCell key={j}>
                  <Skeleton className="h-6 w-full" />
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
