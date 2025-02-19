import React from "react";
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

const DeleteMedicine = ({ medicineId }: { medicineId: string }) => {
  const handleDelete = async () => {
    try {
      const result = await deleteMedicine(medicineId);
      if (result?.data !== null) {
        toast(
          <p className="text-sm font-bold text-green-500">
            Medicine deleted successfully.
          </p>
        );
      }
    } catch {
      toast(
        <p className="text-sm font-bold text-red-500">
          Internal error occured while deleting the medicine.
        </p>
      );
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger className="w-full p-2 hover:bg-light hover:text-dark transition-all rounded-sm">
        <div className="flex items-center justify-between w-full">
          <p className="text-sm">Delete</p>
          <p className="text-sm">⌘⌫</p>
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
  );
};

export default DeleteMedicine;
