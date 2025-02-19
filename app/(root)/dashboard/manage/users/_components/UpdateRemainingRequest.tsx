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
import {
  getUserById,
  updateUserRoleChangeRequestCount,
} from "@/lib/actions/user";
import { toast } from "sonner";
import { ArrowRightLeftIcon, LoaderCircle, Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

const UpdateRemainingRequest = ({ userId }: { userId: string }) => {
  const [user, setUser] = useState<UserType>();
  const [requestCount, setRequestCount] = useState<number>(
    Number(user?.roleChangeRequest)
  );
  const [loading, setLoading] = useState(false);

  const getUser = async () => {
    try {
      setLoading(true);
      const result = await getUserById(userId);
      if (result?.data !== null) {
        setUser(result?.data);
        setRequestCount(result?.data?.roleChangeRequest);
      }
    } catch {
      toast(
        <p className="text-red-500 text-sm font-bold">
          Internal error occured while fetching user.
        </p>
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  const decrementRequest = async () => {
    setRequestCount((prev) => prev - 1);
  };

  const incrementRequest = async () => {
    setRequestCount((prev) => prev + 1);
  };

  const updateRequestCount = async () => {
    try {
      setLoading(true);
      const result = await updateUserRoleChangeRequestCount(
        userId,
        requestCount
      );
      if (result?.data === "success") {
        toast(
          <p className="text-green-500 text-sm font-bold">
            Role change request count updated successfully.
          </p>
        );
      }
    } catch {
      toast(
        <p className="text-red-500 text-sm font-bold">
          Internal error occured while updating request count quantity.
        </p>
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger className="w-full p-2 hover:bg-light hover:text-dark transition-all rounded-sm">
        <div className="flex items-center justify-between w-full">
          <ArrowRightLeftIcon className="w-4 h-4" />
          <p className="text-sm">Req Count</p>
        </div>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Update Request Count</AlertDialogTitle>
          <AlertDialogDescription>
            Set the updated count of this user&apos;s role change request count.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="p-3 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <Minus
              className="p-1 w-8 h-8 cursor-pointer rounded-full border border-dark-200"
              onClick={() => requestCount > 0 && decrementRequest()}
            />
            <div className="flex flex-col items-center justify-center gap-1">
              <h1 className="text-6xl font-bold">{requestCount.toString()}</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                ROLE CHANGE REQUEST COUNT
              </p>
            </div>
            <Plus
              className="p-1 w-8 h-8 cursor-pointer rounded-full border border-dark-200"
              onClick={() => requestCount < 5 && incrementRequest()}
            />
          </div>
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <Button
            className="bg-green-500 hover:bg-green-600 transition-all"
            onClick={() => updateRequestCount()}
            disabled={loading}
          >
            {loading ? (
              <LoaderCircle className="w-4 h-4 animate-spin" />
            ) : (
              "Save"
            )}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default UpdateRemainingRequest;
