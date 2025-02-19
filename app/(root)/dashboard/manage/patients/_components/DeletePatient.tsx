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
import { deletePatient } from "@/lib/actions/patient";
import LoaderDialog from "@/components/custom/LoaderDialog";

const DeletePatient = ({ patientId }: { patientId: string }) => {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    try {
      setLoading(true);
      const result = await deletePatient(patientId);
      if (result?.data !== null) {
        toast(
          <p className="font-bold text-sm text-green-500">
            Patient deleted successfully
          </p>
        );
      }
    } catch {
      toast(
        <p className="font-bold text-sm text-red-500">
          Internal error occured while deleting the patient
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
          <div className="flex items-center gap-2 p-2 w-full text-sm hover:bg-white hover:text-black hover:rounded-sm">
            <Trash className="h-4 w-4 mr-2" />
            Delete
          </div>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this
              patient and remove related data from our servers.
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

export default DeletePatient;
