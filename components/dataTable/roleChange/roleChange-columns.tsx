/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, ListCollapse, MoreHorizontal } from "lucide-react";
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
import Image from "next/image";
import EditUserRole from "@/app/(root)/dashboard/manage/roleChange/_components/EditUserRole";
import { Badge } from "@/components/ui/badge";

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

const handleImageClick = (
  event: React.MouseEvent<HTMLImageElement, MouseEvent>
) => {
  const image = event.currentTarget;
  if (image.requestFullscreen) {
    image.requestFullscreen();
  } else if (image.requestFullscreen) {
    image.requestFullscreen();
  } else if (image.requestFullscreen) {
    image.requestFullscreen();
  } else if (image.requestFullscreen) {
    image.requestFullscreen();
  }
};

const handlePdfClick = () => {};

export const columns: ColumnDef<any>[] = [
  {
    accessorKey: "roleChangeRequestId",
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
    accessorKey: "requestOwner",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="hover:bg-transparent hover:text-white"
        >
          Requestor
          <ArrowUpDown className="ml-2 h-4 w-4 text-white" />
        </Button>
      );
    },
  },
  {
    accessorKey: "currentRole",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="hover:bg-transparent hover:text-white"
        >
          Current Role
          <ArrowUpDown className="ml-2 h-4 w-4 text-white" />
        </Button>
      );
    },
  },
  {
    accessorKey: "requestedRole",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="hover:bg-transparent hover:text-white"
        >
          Requested Role
          <ArrowUpDown className="ml-2 h-4 w-4 text-white" />
        </Button>
      );
    },
  },
  {
    accessorKey: "reason",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="hover:bg-transparent hover:text-white"
        >
          Reason
          <ArrowUpDown className="ml-2 h-4 w-4 text-white" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const reason = row.getValue("reason") as string;

      return (
        <div className="w-full h-32 overflow-auto card-scroll">{reason}</div>
      );
    },
  },
  {
    accessorKey: "imageProof",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="hover:bg-transparent hover:text-white"
        >
          Proof
          <ArrowUpDown className="ml-2 h-4 w-4 text-white" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const imageProofUrl = row.getValue("imageProof") as string;
      const proofExtension = row.getValue("fileExtension") as string;

      // Function to determine if the file is a PDF
      const isPDF = proofExtension?.endsWith(".pdf");

      return imageProofUrl ? (
        isPDF ? (
          <Link
            href={imageProofUrl}
            target="_blank"
            passHref
            rel="noopener noreferrer"
          >
            <div className="w-20 h-20 relative rounded-lg overflow-hidden cursor-pointer">
              <embed
                src={imageProofUrl}
                type="application/pdf"
                width="100%"
                height="100%"
                className="w-full h-full pointer-events-none"
                onClick={handlePdfClick}
              />
            </div>
          </Link>
        ) : (
          <Image
            src={imageProofUrl}
            loading="lazy"
            placeholder="blur"
            blurDataURL="/blur.jpg"
            alt="proof"
            width={1000}
            height={1000}
            className="w-20 h-20 rounded-lg cursor-pointer"
            onClick={handleImageClick}
          />
        )
      ) : (
        <Image
          src="/empty-img.png"
          loading="lazy"
          placeholder="blur"
          blurDataURL="/blur.jpg"
          alt="proof"
          width={1000}
          height={1000}
          className="w-20 h-20 rounded-lg cursor-pointer"
        />
      );
    },
  },
  {
    accessorKey: "fileExtension",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="hover:bg-transparent hover:text-white"
        >
          File Extension
          <ArrowUpDown className="ml-2 h-4 w-4 text-white" />
        </Button>
      );
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="hover:bg-transparent hover:text-white"
        >
          Status
          <ArrowUpDown className="ml-2 h-4 w-4 text-white" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const status = row.getValue("status") as string;

      if (status === "pending") {
        return (
          <Badge className="bg-yellow-400 hover:bg-yellow-500">Pending</Badge>
        );
      }

      if (status === "approved") {
        return (
          <Badge className="bg-green-400 hover:bg-green-500">Approved</Badge>
        );
      }

      if (status === "rejected") {
        return <Badge className="bg-red-400 hover:bg-red-500">Rejected</Badge>;
      }
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
          Requested At
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
      const requestId = row.getValue("roleChangeRequestId") as string;

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
              <>
                <EditUserRole requestId={requestId} />
              </>
            )}
            <Link href={`/dashboard/profile/${requestId}`}>
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
