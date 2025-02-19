"use client";

import { Row } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import DeleteMedicine from "./delete-medicine";
import Link from "next/link";
import EditStocks from "./edit-stocks";

interface DataTableRowActionsProps<TData> {
  medicineId: string;
  userRole: string;
  row: Row<TData>;
}

export function DataTableRowActions<TData>({
  medicineId,
  userRole,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  row,
}: DataTableRowActionsProps<TData>) {
  // const task = taskSchema.parse(row.original);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
        >
          <MoreHorizontal className="h-4 w-4" />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[160px]">
        {(userRole === "admin" || userRole === "pharmacist") && (
          <Link href={`/dashboard/manage/medicines/edit/${medicineId}`}>
            <DropdownMenuItem>Edit</DropdownMenuItem>
          </Link>
        )}
        {(userRole === "admin" || userRole === "pharmacist") && (
          <EditStocks medicineId={medicineId} />
        )}
        <DropdownMenuItem>Make a copy</DropdownMenuItem>
        <DropdownMenuItem>View</DropdownMenuItem>
        <DropdownMenuSeparator />
        {(userRole === "admin" || userRole === "pharmacist") && (
          <DeleteMedicine medicineId={medicineId} />
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
