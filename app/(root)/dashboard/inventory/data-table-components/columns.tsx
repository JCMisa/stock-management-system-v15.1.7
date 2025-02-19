/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { ColumnDef } from "@tanstack/react-table";
// import { Medicine } from "./schema";
import { DataTableColumnHeader } from "./data-table-column-header";
import { DataTableRowActions } from "./data-table-row-actions";
// import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";
import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { getUserByEmail } from "@/lib/actions/user";

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
  // {
  //   id: "select",
  //   header: ({ table }) => (
  //     <Checkbox
  //       checked={
  //         table.getIsAllPageRowsSelected() ||
  //         (table.getIsSomePageRowsSelected() && "indeterminate")
  //       }
  //       onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
  //       aria-label="Select all"
  //       className="translate-y-0.5"
  //     />
  //   ),
  //   cell: ({ row }) => (
  //     <Checkbox
  //       checked={row.getIsSelected()}
  //       onCheckedChange={(value) => row.toggleSelected(!!value)}
  //       aria-label="Select row"
  //       className="translate-y-0.5"
  //     />
  //   ),
  //   enableSorting: false,
  //   enableHiding: false,
  // },
  {
    accessorKey: "medicineId",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="ID" />
    ),
    cell: ({ row }) => (
      <div className="w-[150px] capitalize">{row.getValue("medicineId")}</div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="max-w-[500px] truncate font-medium capitalize">
            {row.getValue("name")}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "category",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Category" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex w-[100px] items-center">
          <span className="capitalize"> {row.getValue("category")}</span>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "expired",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Expiration" />
    ),
    cell: ({ row }) => {
      const type = row.getValue("expired") as string;

      if (type === "expired") {
        return (
          <Badge className="bg-transparent text-red-500 hover:text-red-600 transition-all">
            Expired
          </Badge>
        );
      } else {
        return (
          <Badge className="bg-transparent text-green-500 hover:text-green-600 transition-all">
            Not Expired
          </Badge>
        );
      }
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "stockQuantity",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Stock" />
    ),
    cell: ({ row }) => {
      const stockQuantity = row.getValue("stockQuantity");
      const reorderLevel = row.getValue("reorderLevel");

      if (Number(stockQuantity) > Number(reorderLevel) + 5) {
        return (
          <Badge className="bg-primary hover:bg-primary-100 transition-all">
            {row.getValue("stockQuantity")}
          </Badge>
        );
      } else if (
        Number(stockQuantity) === Number(reorderLevel) + 5 ||
        Number(stockQuantity) === Number(reorderLevel) + 4 ||
        Number(stockQuantity) === Number(reorderLevel) + 3 ||
        Number(stockQuantity) === Number(reorderLevel) + 2 ||
        Number(stockQuantity) === Number(reorderLevel) + 1 ||
        Number(stockQuantity) === Number(reorderLevel)
      ) {
        return (
          <Badge className="bg-orange-500 hover:bg-orange-600 transition-all">
            {row.getValue("stockQuantity")}
          </Badge>
        );
      } else {
        return (
          <Badge className="bg-red-500 hover:bg-red-600 transition-all">
            {row.getValue("stockQuantity")}
          </Badge>
        );
      }
    },
  },
  {
    accessorKey: "reorderLevel",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Reorder Level" />
    ),
    cell: ({ row }) => (
      <div className="flex w-[100px] items-center">
        <span className="capitalize"> {row.getValue("reorderLevel")}</span>
      </div>
    ),
  },
  {
    accessorKey: "sellingPrice",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Price" />
    ),
    cell: ({ row }) => (
      <div className="flex w-[100px] items-center">
        <span className="capitalize">
          {" "}
          {formatCurrency(Number(row.getValue("sellingPrice")))}
        </span>
      </div>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const userRole = CurrentUserRole();
      const medicineId = row.getValue("medicineId");
      return (
        <DataTableRowActions
          medicineId={medicineId as string}
          userRole={userRole}
          row={row}
        />
      );
    },
  },
];
