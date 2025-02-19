/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import {
  ArrowUpDown,
  ListCollapse,
  MoreHorizontal,
  Pencil,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { getUserByEmail } from "@/lib/actions/user";
import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { formatCurrency } from "@/lib/utils";
import DeleteTransaction from "@/app/(root)/dashboard/inventory/transactions/_components/DeleteTransaction";

const CurrentUserRole = () => {
  const { user } = useUser();
  const [userRole, setUserRole] = useState("");

  useEffect(() => {
    const getUserFromDb = async () => {
      try {
        if (!user) return null;
        const currentUser = await getUserByEmail(
          user?.primaryEmailAddress?.emailAddress as string
        );
        setUserRole(currentUser?.data?.role);
      } catch (error) {
        console.error("Error fetching user role:", error);
      }
    };

    getUserFromDb();
  }, [user]);

  return userRole;
};

export const columns: ColumnDef<any>[] = [
  {
    accessorKey: "transactionId",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="hover:bg-transparent hover:text-white"
        >
          ID
          <ArrowUpDown className="ml-2 h-4 w-4 text-white" />
        </Button>
      );
    },
  },
  {
    accessorKey: "patientId",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="hover:bg-transparent hover:text-white"
        >
          Patient ID
          <ArrowUpDown className="ml-2 h-4 w-4 text-white" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const patientId = row.getValue("patientId") as string[];

      return <div>{patientId ? patientId : "walk in client"}</div>;
    },
  },
  {
    accessorKey: "patientName",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="hover:bg-transparent hover:text-white"
        >
          Patient Name
          <ArrowUpDown className="ml-2 h-4 w-4 text-white" />
        </Button>
      );
    },
  },
  {
    accessorKey: "medicines",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="hover:bg-transparent hover:text-white"
        >
          Medicine IDs
          <ArrowUpDown className="ml-2 h-4 w-4 text-white" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const medicinesArray = row.getValue("medicines") as string[];

      return (
        <div className="flex items-center gap-1 overflow-auto card-scroll w-52">
          {medicinesArray?.length > 0 &&
            medicinesArray?.map((medicine, index) => (
              <p key={index}>{medicine},</p>
            ))}
        </div>
      );
    },
  },
  {
    accessorKey: "medicineNames",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="hover:bg-transparent hover:text-white"
        >
          Medicine Names
          <ArrowUpDown className="ml-2 h-4 w-4 text-white" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const medicineNames = row.getValue("medicineNames") as string[];

      return (
        <div className="flex items-center gap-1 overflow-auto card-scroll w-52">
          {medicineNames?.length > 0 &&
            medicineNames?.map((medicine, index) => (
              <p key={index}>{medicine},</p>
            ))}
        </div>
      );
    },
  },
  {
    accessorKey: "totalSales",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="hover:bg-transparent hover:text-white"
        >
          Total Sales
          <ArrowUpDown className="ml-2 h-4 w-4 text-white" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const totalSales = row.getValue("totalSales");

      return (
        <div className="flex items-center gap-1 overflow-auto card-scroll w-52">
          {formatCurrency(Number(totalSales))}
        </div>
      );
    },
  },
  {
    accessorKey: "transactionDate",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="hover:bg-transparent hover:text-white"
        >
          Transaction Date
          <ArrowUpDown className="ml-2 h-4 w-4 text-white" />
        </Button>
      );
    },
  },
  {
    accessorKey: "sellerEmail",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="hover:bg-transparent hover:text-white"
        >
          Seller
          <ArrowUpDown className="ml-2 h-4 w-4 text-white" />
        </Button>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      // const { id } = row.original;
      const userRole = CurrentUserRole();
      const transactionId = row.getValue("transactionId");

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant={"ghost"} className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {(userRole === "admin" || userRole === "pharmacist") && (
              <Link
                href={`/dashboard/inventory/transactions/edit/${transactionId}`}
              >
                <DropdownMenuItem>
                  <Pencil className="h-4 w-4 mr-2" />
                  Edit
                </DropdownMenuItem>
              </Link>
            )}
            {(userRole === "admin" || userRole === "pharmacist") && (
              <DeleteTransaction transactionId={transactionId as string} />
            )}
            <Link href={`/dashboard/profile/${transactionId}`}>
              <DropdownMenuItem>
                <ListCollapse className="h-4 w-4 mr-2" />
                Details
              </DropdownMenuItem>
            </Link>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
