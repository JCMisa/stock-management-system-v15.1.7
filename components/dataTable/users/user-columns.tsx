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
import { cn } from "@/lib/utils";
import { Badge } from "../../ui/badge";
import { getUserByEmail } from "@/lib/actions/user";
import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import UpdateRemainingRequest from "@/app/(root)/dashboard/manage/users/_components/UpdateRemainingRequest";

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
    accessorKey: "userId",
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
          Avatar
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
    accessorKey: "email",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="hover:bg-transparent hover:text-white"
        >
          Email
          <ArrowUpDown className="ml-2 h-4 w-4 text-white" />
        </Button>
      );
    },
  },
  {
    accessorKey: "lastname",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="hover:bg-transparent hover:text-white"
        >
          Last Name
          <ArrowUpDown className="ml-2 h-4 w-4 text-white" />
        </Button>
      );
    },
  },
  {
    accessorKey: "firstname",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="hover:bg-transparent hover:text-white"
        >
          First Name
          <ArrowUpDown className="ml-2 h-4 w-4 text-white" />
        </Button>
      );
    },
  },
  {
    accessorKey: "contact",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="hover:bg-transparent hover:text-white"
        >
          Contact
          <ArrowUpDown className="ml-2 h-4 w-4 text-white" />
        </Button>
      );
    },
  },
  {
    accessorKey: "role",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="hover:bg-transparent hover:text-white"
        >
          Role
          <ArrowUpDown className="ml-2 h-4 w-4 text-white" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const role = row.getValue("role") || "guest";

      return (
        <Badge
          className={cn(
            "bg-dark-100",
            role === "admin" && "bg-primary",
            role === "doctor" && "bg-secondary",
            role === "receptionist" && "bg-purple-500",
            role === "pharmacist" && "bg-yellow-500",
            role === "guest" && "bg-gray-500"
          )}
        >
          {role === "admin"
            ? "Admin"
            : role === "doctor"
            ? "Doctor"
            : role === "receptionist"
            ? "Receptionist"
            : role === "pharmacist"
            ? "Pharmacist"
            : role === "guest"
            ? "Guest"
            : ""}
        </Badge>
      );
    },
  },
  {
    accessorKey: "roleChangeRequest",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="hover:bg-transparent hover:text-white"
        >
          Remaining Request
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
      const userId = row.getValue("userId");

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant={"ghost"} className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {userRole === "admin" && (
              <UpdateRemainingRequest userId={userId as string} />
            )}
            {userRole === "admin" && (
              <Link href={`/dashboard/profile/edit/${userId}`}>
                <DropdownMenuItem>
                  <Settings className="h-4 w-4 mr-2" />
                  Manage
                </DropdownMenuItem>
              </Link>
            )}
            <Link href={`/dashboard/profile/${userId}`}>
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
