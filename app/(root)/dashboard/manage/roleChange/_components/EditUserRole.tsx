import React, { useEffect, useState } from "react";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { LoaderCircle, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import LoaderDialog from "@/components/custom/LoaderDialog";
import {
  getRequestById,
  rejectChangeRoleReq,
} from "@/lib/actions/roleChangeRequest";
import { updateUserRole } from "@/lib/actions/user";

const EditUserRole = ({ requestId }: { requestId: string }) => {
  const [changeRequest, setChangeRequest] = useState<RoleChangeRequestType>();
  const [updatedRole, setUpdatedRole] = useState("");
  const [loading, setLoading] = useState(false);

  const getRoleChangeRequest = async () => {
    try {
      setLoading(true);

      const result = await getRequestById(requestId);

      if (result?.data !== null) {
        setChangeRequest(result?.data);
      }
    } catch {
      toast(
        <p className="font-bold text-sm text-red-500">
          Internal error occured while fetching the request
        </p>
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getRoleChangeRequest();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [requestId]);

  const handleChangeRole = async () => {
    try {
      setLoading(true);

      const result = await updateUserRole(
        requestId,
        changeRequest?.requestOwner as string,
        updatedRole
      );

      if (result?.data === "success") {
        toast(
          <p className="font-bold text-sm text-green-500">
            User role updated successfully!
          </p>
        );
      }
    } catch {
      toast(
        <p className="font-bold text-sm text-red-500">
          Internal error occured while updating user role
        </p>
      );
    } finally {
      setLoading(false);
    }
  };

  const rejectChangeRole = async () => {
    try {
      setLoading(true);

      const result = await rejectChangeRoleReq(requestId);

      if (result?.data === "success") {
        toast(
          <p className="font-bold text-sm text-green-500">
            User request rejected successfully!
          </p>
        );
      }
    } catch {
      toast(
        <p className="font-bold text-sm text-red-500">
          Internal error occured while rejecting user request
        </p>
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <AlertDialog>
        <AlertDialogTrigger className="w-full">
          <div className="flex items-center gap-2 p-2 hover:bg-light hover:text-dark transition-all w-full rounded-sm">
            <Pencil className="h-4 w-4 mr-2" />
            <p className="text-sm">Change Role</p>
          </div>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <div className="flex items-center justify-between">
              <AlertDialogTitle>Manage User Role</AlertDialogTitle>
              <Button
                variant={"destructive"}
                onClick={rejectChangeRole}
                disabled={loading}
              >
                {loading ? (
                  <LoaderCircle className="h-5 w-5 animate-spin" />
                ) : (
                  "Reject"
                )}
              </Button>
            </div>
            <AlertDialogDescription>
              Grant user&apos;s request to change their role.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div>
            <div className="my-5">
              <div className="flex flex-col gap-1 w-full">
                <label className="text-xs text-gray-500 dark:text-gray-400">
                  Appointment Status
                </label>
                <Select
                  onValueChange={(value) =>
                    setUpdatedRole(
                      value ? value : (changeRequest?.currentRole as string)
                    )
                  }
                  defaultValue={changeRequest?.currentRole}
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
            </div>
            <AlertDialogFooter className="mt-5">
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <Button onClick={handleChangeRole} disabled={loading}>
                {loading ? (
                  <LoaderCircle className="h-5 w-5 animate-spin" />
                ) : (
                  "Grant"
                )}
              </Button>
            </AlertDialogFooter>
          </div>
        </AlertDialogContent>
      </AlertDialog>

      <LoaderDialog loading={loading} />
    </>
  );
};

export default EditUserRole;
