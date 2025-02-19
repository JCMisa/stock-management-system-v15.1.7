import { Trash } from "lucide-react";
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
import { toast } from "sonner";
import { deleteMedicine } from "@/lib/actions/medicine";
import { useRouter } from "next/navigation";
import LoaderDialog from "@/components/custom/LoaderDialog";

const DeleteMedicine = ({ medicineId }: { medicineId: string }) => {
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    try {
      setLoading(true);
      const result = await deleteMedicine(medicineId);
      if (result?.data !== null) {
        toast(
          <p className="font-bold text-sm text-green-500">
            Medicine deleted successfully
          </p>
        );
        router.push("/dashboard/manage/medicines");
      }
    } catch {
      toast(
        <p className="font-bold text-sm text-red-500">
          Internal error occured while deleting the medicine
        </p>
      );
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <AlertDialog>
        <AlertDialogTrigger>
          <div className="flex items-center gap-1 px-2 text-red-500 hover:text-red-600 transition-all">
            <Trash className="h-4 w-4 mr-2" />
            Delete
          </div>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this
              medicine and remove related data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
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

export default DeleteMedicine;
