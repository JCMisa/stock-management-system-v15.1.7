/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import * as React from "react";

import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
// import AddTransaction from "@/app/(root)/dashboard/inventory/transactions/_components/AddTransaction";
import { PlusCircle, PrinterIcon, SheetIcon } from "lucide-react";
import Link from "next/link";

import html2canvas from "html2canvas";
import jsPDF from "jspdf";

import { utils, writeFile } from "xlsx";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  query1?: string;
  showCreate?: boolean;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  query1,
  showCreate = false,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
    },
    initialState: {
      pagination: {
        pageSize: 5, // Set to show 3 records per page
      },
    },
  });

  // handle table-to-pdf functionality
  const tableRef = React.useRef<HTMLDivElement>(null);
  const handleDownloadPdf = async () => {
    const element = tableRef.current;
    if (!element) return;

    try {
      const canvas = await html2canvas(element, {
        scale: 2, // Higher scale for better resolution
        useCORS: true, // If you have external images
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const imgWidth = 190; // A4 page width in mm (210 - 10mm margins)
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", 10, 10, imgWidth, imgHeight);
      pdf.save("transactions-table.pdf");
    } catch (error) {
      console.error("Error generating PDF:", error);
    }
  };

  // handle export transaction data to excel spreadsheet - this transform the data from props to excel
  const processComplexData = (data: any[]) => {
    return data.map((item) => {
      const processed: Record<string, any> = {};

      Object.entries(item).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          processed[key] = value
            .map((el) => (typeof el === "object" ? JSON.stringify(el) : el))
            .join(", ");
        } else if (typeof value === "object") {
          processed[key] = JSON.stringify(value);
        } else {
          processed[key] = value;
        }
      });

      return processed;
    });
  };
  const handleExport = () => {
    // Clean the data to be passed, stringify data types like arrays or json
    const processedData = processComplexData(data);

    // Create worksheet
    const ws = utils.json_to_sheet(processedData);

    // Create workbook
    const wb = utils.book_new();
    utils.book_append_sheet(wb, ws, "Transactions");

    // Export to Excel
    writeFile(wb, "transaction-table.xlsx");
  };

  // handle export transaction data to excel spreadsheet - this transform the table itself to excel
  // const handleExportFromHTML = () => {
  //   const table = document.getElementById("transactions-table");
  //   const ws = utils.table_to_sheet(table);
  //   const wb = utils.book_new();
  //   utils.book_append_sheet(wb, ws, "Transactions");
  //   writeFile(wb, "transaction-table.xlsx");
  // };

  return (
    <div>
      <div className="flex items-center py-4 justify-between gap-2">
        <Input
          placeholder={`Filter by ${query1} ...`}
          value={
            (table.getColumn(query1 as string)?.getFilterValue() as string) ??
            ""
          }
          onChange={(event) =>
            table
              .getColumn(query1 as string)
              ?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />

        <div className="flex items-center gap-3">
          <div
            onClick={handleDownloadPdf}
            className="w-10 h-10 rounded-lg p-2 bg-light-100 dark:bg-dark-100 cursor-pointer flex items-center justify-center shadow-lg"
          >
            <PrinterIcon className="w-5 h-5" />
          </div>

          <div
            onClick={handleExport}
            className="w-10 h-10 rounded-lg p-2 bg-light-100 dark:bg-dark-100 cursor-pointer flex items-center justify-center shadow-lg"
          >
            <SheetIcon className="w-5 h-5" />
          </div>

          {showCreate && (
            <Link
              href={"/dashboard/inventory/transactions/create"}
              className="flex items-center justify-center gap-1 p-3 px-5 min-w-52 max-w-52 bg-primary hover:bg-primary-100 transition-all cursor-pointer rounded-lg text-white"
            >
              <PlusCircle className="w-5 h-5" />
              <p className="text-sm">Add Transaction</p>
            </Link>
          )}
        </div>
      </div>
      <div
        className="rounded-md bg-light-100 dark:bg-dark-100"
        ref={tableRef}
        id="transactions-table"
      >
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between space-x-2 py-4">
        <div className="text-sm text-muted-foreground">
          Page {table.getState().pagination.pageIndex + 1} of{" "}
          {table.getPageCount()}
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
