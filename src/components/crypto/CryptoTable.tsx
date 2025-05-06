
import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CryptoTableRow } from "./CryptoTableRow";
import { CryptoTableSkeleton } from "./CryptoTableSkeleton";
import { useCryptoPriceFormatter } from "./useCryptoPriceFormatter";
import { ExchangeRate } from "@/types/exchangeRate";

interface CryptoTableProps {
  rates: ExchangeRate[];
  loading: boolean;
}

export const CryptoTable = ({ rates, loading }: CryptoTableProps) => {
  const { formatPrice } = useCryptoPriceFormatter();

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Exchange</TableHead>
            <TableHead>Moneda</TableHead>
            <TableHead className="text-right">Compra</TableHead>
            <TableHead className="text-right">Venta</TableHead>
            <TableHead className="text-right">Spread</TableHead>
            <TableHead className="text-right">Variación 24h</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            <CryptoTableSkeleton />
          ) : rates.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                No hay datos disponibles
              </TableCell>
            </TableRow>
          ) : (
            rates.map((rate, index) => (
              <CryptoTableRow 
                key={index}
                rate={rate}
                formatPrice={(price) => formatPrice(price, rate.coin)}
              />
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};
