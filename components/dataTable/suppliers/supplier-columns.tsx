/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import {
  ArrowUpDown,
  ListCollapse,
  MoreHorizontal,
  PencilIcon,
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
    accessorKey: "supplierId",
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
    accessorKey: "supplierName",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="hover:bg-transparent hover:text-white"
        >
          Name
          <ArrowUpDown className="ml-2 h-4 w-4 text-white" />
        </Button>
      );
    },
  },
  {
    accessorKey: "contactEmail",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="hover:bg-transparent hover:text-white"
        >
          Contact Email
          <ArrowUpDown className="ml-2 h-4 w-4 text-white" />
        </Button>
      );
    },
  },
  {
    accessorKey: "address",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="hover:bg-transparent hover:text-white"
        >
          Address
          <ArrowUpDown className="ml-2 h-4 w-4 text-white" />
        </Button>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="hover:bg-transparent hover:text-white"
        >
          Created At
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
      const supplierId = row.getValue("supplierId");

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
              <Link href={`/dashboard/manage/suppliers/edit/${supplierId}`}>
                <DropdownMenuItem>
                  <PencilIcon className="h-4 w-4 mr-2" />
                  Edit
                </DropdownMenuItem>
              </Link>
            )}
            <Link href={`/dashboard/profile/${supplierId}`}>
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
