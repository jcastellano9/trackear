
import React from "react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { InvestmentRow } from "./InvestmentRow";
import { InvestmentType } from "@/lib/supabase";
import { InvestmentsEmptyState } from "./InvestmentsEmptyState";
import { InvestmentsLoadingState } from "./InvestmentsLoadingState";

interface InvestmentsTableProps {
  investments: InvestmentType[];
  isLoading: boolean;
  searchTerm: string;
  filter: "all" | "crypto" | "cedears";
  displayCurrency: "USD" | "ARS";
  portfolioTotal: number;
  cclRate: number;
  onEdit: (investment: InvestmentType) => void;
  onDelete: (id: string) => void;
}

export const InvestmentsTable = ({
  investments,
  isLoading,
  searchTerm,
  filter,
  displayCurrency,
  portfolioTotal,
  cclRate,
  onEdit,
  onDelete
}: InvestmentsTableProps) => {
  if (isLoading) {
    return <InvestmentsLoadingState filter={filter} />;
  }

  if (investments.length === 0) {
    return <InvestmentsEmptyState searchTerm={searchTerm} filter={filter} />;
  }

  const showRatioColumn = filter === "cedears" || filter === "all";

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
            {showRatioColumn && <TableHead className="text-center">Ratio</TableHead>}
            <TableHead className="text-right">Cantidad</TableHead>
            <TableHead className="text-right">PPC</TableHead>
            <TableHead className="text-right">Tenencia</TableHead>
            <TableHead className="text-right">Asignación</TableHead>
            <TableHead className="text-right w-[100px]">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {investments.map((investment) => (
            <InvestmentRow
              key={investment.id}
              investment={investment}
              displayCurrency={displayCurrency}
              portfolioTotal={portfolioTotal}
              cclRate={cclRate}
              onEdit={onEdit}
              onDelete={onDelete}
              showRatio={showRatioColumn}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
