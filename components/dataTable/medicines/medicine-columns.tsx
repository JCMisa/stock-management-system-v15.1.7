/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import {
  ArrowUpDown,
  ListCollapse,
  MoreHorizontal,
  Settings,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import Image from "next/image";
import { cn, formatCurrency } from "@/lib/utils";
import { Badge } from "../../ui/badge";
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
    accessorKey: "medicineId",
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
    accessorKey: "imageUrl",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="hover:bg-transparent hover:text-white"
        >
          Image
          <ArrowUpDown className="ml-2 h-4 w-4 text-white" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const imageUrl = (row.getValue("imageUrl") as string) || "/empty-img.png";

      return imageUrl ? (
        <Image
          src={imageUrl}
          loading="lazy"
          placeholder="blur"
          blurDataURL="/blur.jpg"
          alt="avatar"
          width={1000}
          height={1000}
          className="w-10 h-10 rounded-full"
        />
      ) : (
        <Image
          src="/empty-img.png"
          loading="lazy"
          placeholder="blur"
          blurDataURL="/blur.jpg"
          alt="avatar"
          width={1000}
          height={1000}
          className="w-10 h-10 rounded-full"
        />
      );
    },
  },
  {
    accessorKey: "name",
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
    accessorKey: "brand",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="hover:bg-transparent hover:text-white"
        >
          Brand
          <ArrowUpDown className="ml-2 h-4 w-4 text-white" />
        </Button>
      );
    },
  },
  {
    accessorKey: "category",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="hover:bg-transparent hover:text-white"
        >
          Category
          <ArrowUpDown className="ml-2 h-4 w-4 text-white" />
        </Button>
      );
    },
  },
  {
    accessorKey: "form",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="hover:bg-transparent hover:text-white"
        >
          Form
          <ArrowUpDown className="ml-2 h-4 w-4 text-white" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const form = row.getValue("form") as string;

      return (
        <Badge
          className={cn(
            "bg-dark-100",
            form === "tablet" && "bg-primary",
            form === "capsule" && "bg-secondary",
            form === "syrup" && "bg-purple-500"
          )}
        >
          {form === "tablet"
            ? "Tablet"
            : form === "capsule"
            ? "Capsule"
            : form === "syrup"
            ? "Syrup"
            : "unknown"}
        </Badge>
      );
    },
  },
  {
    accessorKey: "expired",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="hover:bg-transparent hover:text-white"
        >
          Expiration
          <ArrowUpDown className="ml-2 h-4 w-4 text-white" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const expiration = row.getValue("expired") as string;

      if (expiration === "expired") {
        return (
          <Badge className="bg-red-500 hover:bg-red-600 transition-all">
            Expired
          </Badge>
        );
      } else {
        return <Badge>Not Expired</Badge>;
      }
    },
  },
  {
    accessorKey: "stockQuantity",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="hover:bg-transparent hover:text-white"
        >
          Stock
          <ArrowUpDown className="ml-2 h-4 w-4 text-white" />
        </Button>
      );
    },
  },
  {
    accessorKey: "costPrice",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="hover:bg-transparent hover:text-white"
        >
          Cost Price
          <ArrowUpDown className="ml-2 h-4 w-4 text-white" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const costPrice = row.getValue("costPrice") as number;

      return formatCurrency(costPrice);
    },
  },
  {
    accessorKey: "sellingPrice",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="hover:bg-transparent hover:text-white"
        >
          Selling Price
          <ArrowUpDown className="ml-2 h-4 w-4 text-white" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const sellingPrice = row.getValue("sellingPrice") as number;

      return formatCurrency(sellingPrice);
    },
  },
  {
    accessorKey: "fdaApproved",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="hover:bg-transparent hover:text-white"
        >
          FDA Approved
          <ArrowUpDown className="ml-2 h-4 w-4 text-white" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const isFdaApproved = row.getValue("fdaApproved");

      return (
        <Badge
          className={cn("bg-red-500", isFdaApproved === "true" && "bg-primary")}
        >
          {isFdaApproved === "true" ? "FDA Approved" : "Not FDA Approved"}
        </Badge>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      // const { id } = row.original;
      const userRole = CurrentUserRole();
      const medicineId = row.getValue("medicineId");

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
              <Link href={`/dashboard/manage/medicines/edit/${medicineId}`}>
                <DropdownMenuItem>
                  <Settings className="h-4 w-4 mr-2" />
                  Manage
                </DropdownMenuItem>
              </Link>
            )}
            <Link href={`/dashboard/profile/${medicineId}`}>
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
