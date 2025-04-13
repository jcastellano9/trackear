
import React from "react";
import { TableRow, TableCell } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";

export const CryptoTableSkeleton = () => {
  return (
    <>
      {Array(6).fill(0).map((_, i) => (
        <TableRow key={`skeleton-${i}`}>
          <TableCell><Skeleton className="h-6 w-24" /></TableCell>
          <TableCell><Skeleton className="h-6 w-16" /></TableCell>
          <TableCell><Skeleton className="h-6 w-16" /></TableCell>
          <TableCell className="hidden md:table-cell"><Skeleton className="h-6 w-24" /></TableCell>
          <TableCell className="hidden lg:table-cell"><Skeleton className="h-6 w-24" /></TableCell>
        </TableRow>
      ))}
    </>
  );
};
