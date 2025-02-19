import React, { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Trash } from "lucide-react";
import { toast } from "sonner";
import { deleteTransaction } from "@/lib/actions/transaction";
import LoaderDialog from "@/components/custom/LoaderDialog";
// import { Textarea } from "@/components/ui/textarea";
// import { useUser } from "@clerk/nextjs";
// import moment from "moment";

const DeleteTransaction = ({ transactionId }: { transactionId: string }) => {
  // const { user } = useUser();

  // const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    try {
      setLoading(true);

      const result = await deleteTransaction(transactionId);
      // const result = await deleteTransaction(
      //   transactionId,
      //   reason,
      //   user?.primaryEmailAddress?.emailAddress as string,
      //   moment().format("MM-DD-YYYY")
      // );
      if (result?.data !== null) {
        toast(
          <p className="font-bold text-sm text-green-500">
            Transaction deleted successfully
          </p>
        );
      }
    } catch {
      toast(
        <p className="font-bold text-sm text-red-500">
          Internal error occured while deleting the transaction
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
          <div className="flex items-center gap-2 p-2 text-sm hover:bg-light hover:text-dark w-full transition-all rounded-sm">
            <Trash className="h-4 w-4 mr-2" />
            Delete
          </div>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this
              transaction and remove related data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          {/* <div className="my-3 flex flex-col gap-1">
            <label className="text-xs text-gray-500 dark:text-gray-400">
              Why do you want to delete this transaction?
            </label>
            <Textarea
              rows={5}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Does stock replenishment necessary?"
            />
          </div> */}
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-500 hover:bg-red-600 transition-all"
              onClick={() => handleDelete()}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <LoaderDialog loading={loading} />
    </>
  );
};

export default DeleteTransaction;
