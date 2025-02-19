"use client";

import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import UploadRoleRequestProof from "./UploadRoleRequestProof";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";
import { askRoleChange } from "@/lib/actions/roleChangeRequest";
import { useUser } from "@clerk/nextjs";
import { getUserByEmail } from "@/lib/actions/user";
import moment from "moment";
import LoaderDialog from "./LoaderDialog";
import { LoaderCircle } from "lucide-react";

const AskRoleChangeDialog = ({ defaultRole }: { defaultRole: string }) => {
  const { user } = useUser();

  const [open, setOpen] = useState(false);
  const [requestedRole, setRequestedRole] = useState("");
  const [requestedRoleReason, setRequestedRoleReason] = useState("");
  const [imageUrlProof, setImageUrlProof] = useState("");
  const [fileExtension, setFileExtension] = useState("");
  const [loading, setLoading] = useState(false);

  const [loggedInUser, setLoggedInUser] = useState<UserType>();

  const getLoggedInUserByEmail = async () => {
    try {
      setLoading(true);

      const result = await getUserByEmail(
        user?.primaryEmailAddress?.emailAddress as string
      );
      if (result?.data !== null) {
        setLoggedInUser(result?.data);
      }
    } catch {
      toast(
        <p className="font-bold text-sm text-red-500">
          Internal error occured while fetching the user
        </p>
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    user && getLoggedInUserByEmail();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const handleSubmit = async () => {
    try {
      setLoading(true);

      const roleChangeRequestId = uuidv4();
      const result = await askRoleChange(
        roleChangeRequestId,
        loggedInUser?.email as string,
        loggedInUser?.role as string,
        requestedRole,
        requestedRoleReason,
        imageUrlProof,
        fileExtension,
        moment().format("MM-DD-YYYY")
      );

      if (result?.data === "success") {
        toast(
          <p className="text-sm font-bold text-green-500">
            Role change request submitted successfully
          </p>
        );
        setOpen(false);
        setRequestedRole("");
        setRequestedRoleReason("");
        setImageUrlProof("");
      }
    } catch {
      toast(
        <p className="text-sm font-bold text-red-500">
          Internal error occured while submitting the request
        </p>
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Dialog open={open}>
        <DialogTrigger>
          <div
            className="p-3 px-5 rounded-lg min-w-52 max-w-52 border-2 border-light-400 dark:border-dark-400 hover:bg-light-500 dark:hover:bg-dark-100 transition-all text-xs"
            onClick={() => setOpen(true)}
          >
            Ask Role Change
          </div>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <div className="flex items-center gap-3">
              <DialogTitle>Ask for a Role Change</DialogTitle>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                ({loggedInUser?.roleChangeRequest} request left)
              </span>
            </div>
            <DialogDescription>
              Inform admin of your role and provide credentials to help admin
              verify your claim.
            </DialogDescription>
          </DialogHeader>

          <div className="my-5">
            <div className="flex flex-col gap-5">
              <div className="flex flex-col gap-1">
                <label className="text-xs text-gray-500 dark:text-gray-400">
                  Select your desired role
                </label>
                <Select
                  onValueChange={(value) =>
                    setRequestedRole(value ? value : defaultRole)
                  }
                  defaultValue={defaultRole}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={"admin"}>Admin</SelectItem>
                    <SelectItem value={"doctor"}>Doctor</SelectItem>
                    <SelectItem value={"receptionist"}>Receptionist</SelectItem>
                    <SelectItem value={"pharmacist"}>Pharmacist</SelectItem>
                    <SelectItem value={"guest"}>Guest</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs text-gray-500 dark:text-gray-400">
                  Role change reason
                </label>
                <Textarea
                  rows={5}
                  placeholder="Provide reason why you want to change your role..."
                  onChange={(e) => setRequestedRoleReason(e.target.value)}
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs text-gray-500 dark:text-gray-400">
                  Any proof to verifiy your claim (e.g. professional reference,
                  Medical license, Proof of employment, Pharmacy license,
                  Official invitation, etc.)
                </label>
                <UploadRoleRequestProof
                  setImageUrlProof={(downloadUrl) =>
                    setImageUrlProof(downloadUrl)
                  }
                  setFileExtension={(extension) => setFileExtension(extension)}
                />
                <label className="text-xs text-gray-500 dark:text-gray-400">
                  Click the image banner to upload proof.
                </label>
              </div>
            </div>

            <div className="mt-5 flex items-center gap-3 justify-end">
              <Button variant={"outline"} onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={loading || requestedRoleReason === ""}
              >
                {loading ? (
                  <LoaderCircle className="w-5 h-5 animate-spin" />
                ) : (
                  "Submit"
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <LoaderDialog loading={loading} />
    </>
  );
};

export default AskRoleChangeDialog;
