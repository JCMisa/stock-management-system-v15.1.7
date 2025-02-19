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
import Image from "next/image";
import { getUserByEmail } from "@/lib/actions/user";
import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { Badge } from "@/components/ui/badge";
import DeletePatient from "@/app/(root)/dashboard/manage/patients/_components/DeletePatient";

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
    accessorKey: "patientId",
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
          Profile
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
    accessorKey: "fullname",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="hover:bg-transparent hover:text-white"
        >
          FullName
          <ArrowUpDown className="ml-2 h-4 w-4 text-white" />
        </Button>
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
    accessorKey: "doctorId",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="hover:bg-transparent hover:text-white"
        >
          Is Appointed
          <ArrowUpDown className="ml-2 h-4 w-4 text-white" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const isAppointed = row.getValue("doctorId") as string;

      if (isAppointed !== null) {
        return <Badge>Appointed</Badge>;
      } else {
        return (
          <Badge className="bg-red-500 hover:bg-red-600 transition-all">
            Not Appointed
          </Badge>
        );
      }
    },
  },
  {
    accessorKey: "age",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="hover:bg-transparent hover:text-white"
        >
          Age
          <ArrowUpDown className="ml-2 h-4 w-4 text-white" />
        </Button>
      );
    },
  },
  {
    accessorKey: "conditionName",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="hover:bg-transparent hover:text-white"
        >
          Condition
          <ArrowUpDown className="ml-2 h-4 w-4 text-white" />
        </Button>
      );
    },
  },
  {
    accessorKey: "conditionSeverity",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="hover:bg-transparent hover:text-white"
        >
          Severity
          <ArrowUpDown className="ml-2 h-4 w-4 text-white" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const severity = row.getValue("conditionSeverity") as string;

      if (severity === "mild")
        return (
          <Badge className="bg-yellow-500 hover:bg-yellow-600 transition-all">
            Mild
          </Badge>
        );
      if (severity === "moderate")
        return (
          <Badge className="bg-orange-500 hover:bg-orange-600 transition-all">
            Moderate
          </Badge>
        );
      if (severity === "severe")
        return (
          <Badge className="bg-red-500 hover:bg-red-600 transition-all">
            Severe
          </Badge>
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
    accessorKey: "createdAt",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="hover:bg-transparent hover:text-white"
        >
          Registration
          <ArrowUpDown className="ml-2 h-4 w-4 text-white" />
        </Button>
      );
    },
  },
  {
    accessorKey: "addedBy",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="hover:bg-transparent hover:text-white"
        >
          Added By
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
      const patientId = row.getValue("patientId");

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant={"ghost"} className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {(userRole === "admin" || userRole === "receptionist") && (
              <>
                <Link
                  href={`/dashboard/manage/patients/create/${patientId}/update`}
                >
                  <DropdownMenuItem>
                    <Pencil className="h-4 w-4 mr-2" />
                    Edit
                  </DropdownMenuItem>
                </Link>
                <DeletePatient patientId={patientId as string} />
              </>
            )}
            <Link href={`/dashboard/profile/${patientId}`}>
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
