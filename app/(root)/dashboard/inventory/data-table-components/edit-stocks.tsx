/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
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
import { Minus, Plus } from "lucide-react";
import { toast } from "sonner";
import {
  getMedicineByMedicineId,
  updateStockQuantity,
} from "@/lib/actions/medicine";
import { Input } from "@/components/ui/input";

const EditStocks = ({ medicineId }: { medicineId: string }) => {
  const [medicine, setMedicine] = useState<MedicineType>();
  const [stockCount, setStockCount] = useState<number | null>(
    Number(medicine?.stockQuantity) || null
  );

  const getMedicine = async () => {
    try {
      const result = await getMedicineByMedicineId(medicineId);
      if (result?.data !== null) {
        setMedicine(result?.data);
        setStockCount(result?.data?.stockQuantity);
      }
    } catch {
      toast(
        <p className="text-red-500 text-sm font-bold">
          Internal error occured while fetching medicine.
        </p>
      );
    }
  };

  useEffect(() => {
    getMedicine();
  }, [medicineId]);

  const decrementStock = async () => {
    setStockCount((prev) => (prev || 0) - 1);
  };

  const incrementStock = async () => {
    setStockCount((prev) => (prev || 0) + 1);
  };

  const updateStocks = async () => {
    try {
      console.log("current stock count: ", stockCount);
      const result = await updateStockQuantity(medicineId, stockCount);
      if (result?.data !== null) {
        toast(
          <p className="text-green-500 text-sm font-bold">
            Stock quantity updated successfully.
          </p>
        );
      }
    } catch {
      toast(
        <p className="text-red-500 text-sm font-bold">
          Internal error occured while updating stock quantity.
        </p>
      );
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger className="w-full p-2 hover:bg-light hover:text-dark transition-all rounded-sm">
        <div className="flex items-center justify-between w-full">
          <p className="text-sm">Stocks</p>
          <p className="text-sm">+ -</p>
        </div>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Update Stock Count</AlertDialogTitle>
          <AlertDialogDescription>
            Set the updated count of this medicine that will reflect to the
            inventory.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="p-3 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <Minus
              className="p-1 w-8 h-8 cursor-pointer rounded-full border border-dark-200"
              onClick={decrementStock}
            />
            <div className="flex flex-col items-center justify-center gap-1">
              {/* <h1 className="text-6xl font-bold">{stockCount.toString()}</h1> */}
              <Input
                type="number"
                value={stockCount || "0"}
                onChange={(e) => setStockCount(Number(e.target.value))}
                className="font-bold text-center"
              />
              <p className="text-sm text-gray-500 dark:text-gray-400">
                STOCK QUANTITY
              </p>
            </div>
            <Plus
              className="p-1 w-8 h-8 cursor-pointer rounded-full border border-dark-200"
              onClick={incrementStock}
            />
          </div>
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            className="bg-green-500 hover:bg-green-600 transition-all"
            onClick={() => updateStocks()}
          >
            Save
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default EditStocks;
