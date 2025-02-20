import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import {
  addMedicineBatch,
  getMedicineByMedicineId,
} from "@/lib/actions/medicine";
import { getAllSuppliers } from "@/lib/actions/supplier";
import { getCurrentUser } from "@/lib/actions/user";
import { LoaderCircleIcon } from "lucide-react";
import moment from "moment";
import { useActionState, useEffect, useState } from "react";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";

interface AddNewBatchProps {
  medicineId: string;
}

const AddNewBatch = ({ medicineId }: AddNewBatchProps) => {
  const [currentUser, setCurrentUser] = useState<UserType>();

  const [medicineInfo, setMedicineInfo] = useState<MedicineType | null>(null);
  const newBatchNumber = Number(medicineInfo?.batchNumber) + 1;

  const [suppliersList, setSuppliersList] = useState<SupplierType[]>([]);
  const [selectedSupplier, setSelectedSupplier] = useState<{
    id: string;
    name: string;
  } | null>({
    id: medicineInfo?.supplierId as string,
    name: medicineInfo?.supplierName as string,
  });

  useEffect(() => {
    const getUser = async () => {
      try {
        const result = await getCurrentUser();
        if (result?.data !== null) {
          setCurrentUser(result?.data);
        }
      } catch {
        toast(
          <p className="font-bold text-sm text-red-500">
            Internal error occured whil fetching user
          </p>
        );
      }
    };

    getUser();
  }, []);

  useEffect(() => {
    const getMedicineInfo = async () => {
      const result = await getMedicineByMedicineId(medicineId);
      if (result?.data !== null) {
        setMedicineInfo(result.data);
      }
    };

    getMedicineInfo();
  }, [medicineId]);

  useEffect(() => {
    const getAllSuppliersList = async () => {
      try {
        const result = await getAllSuppliers();
        if (result?.data !== null) {
          setSuppliersList(result?.data);
        }
      } catch (error) {
        console.log("error fetching all suppliers: ", error);
      }
    };

    getAllSuppliersList();
  }, []);

  const handleSupplierChange = (value: string) => {
    const supplier = suppliersList?.find((s) => s.supplierId === value);
    if (supplier) {
      setSelectedSupplier({
        id: supplier.supplierId,
        name: supplier.supplierName,
      });
    } else {
      setSelectedSupplier(null); // Clear selection if no supplier is found
    }
  };

  const handleSubmit = async (prevState: unknown, formData: FormData) => {
    try {
      const medicineId = uuidv4();

      const formField = {
        name:
          (formData.get("name") as string) || (medicineInfo?.name as string),
        brand:
          (formData.get("brand") as string) || (medicineInfo?.brand as string),
        category: medicineInfo?.category as string,
        activeIngredients: medicineInfo?.activeIngredients as string[],
        dosage: medicineInfo?.dosage as string,
        form: medicineInfo?.form as string,
        unitsPerPackage:
          (formData.get("unitsPerPackage") as string) ||
          (medicineInfo?.unitsPerPackage as string),
        storageCondition: medicineInfo?.storageCondition as string,
        expiryDate:
          (formData.get("expiryDate") as string) ||
          (medicineInfo?.expiryDate as string),
        stockQuantity:
          (formData.get("stockQuantity") as string) ||
          (medicineInfo?.stockQuantity as string),
        reorderLevel:
          (formData.get("reorderLevel") as string) ||
          (medicineInfo?.reorderLevel as string),
        supplierId:
          (selectedSupplier?.id as string) ||
          (medicineInfo?.supplierId as string),
        supplierName:
          (selectedSupplier?.name as string) ||
          (medicineInfo?.supplierName as string),
        batchNumber:
          (formData.get("batchNumber") as string) || String(newBatchNumber),
        costPrice:
          (formData.get("costPrice") as string) ||
          String(medicineInfo?.costPrice),
        sellingPrice:
          (formData.get("sellingPrice") as string) ||
          String(medicineInfo?.sellingPrice),
        prescriptionRequired: medicineInfo?.prescriptionRequired as string,
        fdaApproved: medicineInfo?.fdaApproved as string,
        usageWarnings:
          (formData.get("usageWarnings") as string) ||
          (medicineInfo?.usageWarnings as string),
        sideEffects:
          (formData.get("sideEffects") as string) ||
          (medicineInfo?.sideEffects as string),
        usageInstructions:
          (formData.get("usageInstructions") as string) ||
          (medicineInfo?.usageInstructions as string),
        imageUrl: medicineInfo?.imageUrl as string,
        notes:
          (formData.get("notes") as string) || (medicineInfo?.notes as string),
      };

      const result = await addMedicineBatch(
        prevState,
        currentUser?.email as string,
        moment().format("MM-DD-YYYY"),
        medicineId,
        formField
      );

      if (result?.data !== null) {
        toast(
          <p className="font-bold text-sm text-green-500">
            Medicine batch added successfully
          </p>
        );
      }
    } catch (error) {
      toast(
        <p className="font-bold text-sm text-red-500">
          Internal error occured while adding the medicine batch.
        </p>
      );
      console.log("create medicine batch error: ", error);
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [state, formAction, uploading] = useActionState(
    handleSubmit,
    undefined
  );

  return (
    <>
      <AlertDialog>
        <AlertDialogTrigger className="w-full">
          <div className="flex items-center gap-2 p-2 text-sm hover:bg-light hover:text-dark w-full transition-all rounded-sm">
            Add Stocks
          </div>
        </AlertDialogTrigger>
        <AlertDialogContent className="h-[80%] overflow-auto card-scroll">
          <AlertDialogHeader>
            <AlertDialogTitle>Add New Batch</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-500 dark:text-gray-400">
              A new batch is added for better medicine stock management.
            </AlertDialogDescription>
          </AlertDialogHeader>

          {medicineInfo ? (
            <form
              action={formAction}
              className="bg-light-100 dark:bg-dark-100 border border-t-primary rounded-lg flex flex-col gap-4 p-5"
            >
              {/* name - brand */}
              <div className="flex flex-col gap-2">
                <h1 className="text-center text-2xl font-bold">
                  Basic Information
                </h1>
                <Separator className="border border-light-200 dark:border-dark-200" />
                <div className="flex flex-col gap-4 mt-3">
                  <div className="flex items-center justify-center gap-4 w-full mt-5">
                    <div className="flex flex-col gap-1 w-full">
                      <label
                        htmlFor=""
                        className="text-xs text-gray-500 dark:text-gray-400"
                      >
                        Medicine Name
                      </label>
                      <Input
                        defaultValue={medicineInfo?.name as string}
                        type="text"
                        id="name"
                        name="name"
                        placeholder="Enter medicine name"
                      />
                    </div>
                    <div className="flex flex-col gap-1 w-full">
                      <label
                        htmlFor=""
                        className="text-xs text-gray-500 dark:text-gray-400"
                      >
                        Medicine Brand
                      </label>
                      <Input
                        defaultValue={medicineInfo?.brand as string}
                        type="text"
                        id="brand"
                        name="brand"
                        placeholder="Enter medicine brand"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* unitsPerPackage - expiryDate */}
              <div className="flex flex-col gap-2 mt-10 border border-transparent border-t-primary py-3">
                <h1 className="text-center text-2xl font-bold">
                  Packaging and Storage
                </h1>
                <Separator className="border border-light-200 dark:border-dark-200" />
                <div className="flex flex-col gap-4 mt-3">
                  <div className="flex items-center justify-center gap-4 w-full mt-5">
                    <div className="flex flex-col gap-1 w-full">
                      <label
                        htmlFor=""
                        className="text-xs text-gray-500 dark:text-gray-400"
                      >
                        How many units per package?
                      </label>
                      <Input
                        defaultValue={medicineInfo?.unitsPerPackage as string}
                        type="text"
                        id="unitsPerPackage"
                        name="unitsPerPackage"
                      />
                    </div>
                  </div>
                  <div className="flex flex-col gap-1 w-full">
                    <label
                      htmlFor=""
                      className="text-xs text-gray-500 dark:text-gray-400"
                    >
                      Expiration Date
                    </label>
                    <Input
                      defaultValue={
                        (moment(medicineInfo?.expiryDate).format(
                          "YYYY-MM-DD"
                        ) as string) || ""
                      }
                      type="date"
                      id="expiryDate"
                      name="expiryDate"
                    />
                  </div>
                </div>
              </div>

              {/* stockQuantity - reorderLevel - supplier - batchNumber */}
              <div className="flex flex-col gap-2 mt-10 border border-transparent border-t-primary py-3">
                <h1 className="text-center text-2xl font-bold">
                  Inventory Management
                </h1>
                <Separator className="border border-light-200 dark:border-dark-200" />
                <div className="flex flex-col gap-4 mt-3">
                  <div className="flex items-center justify-center gap-4 w-full mt-5">
                    <div className="flex flex-col gap-1 w-full">
                      <label
                        htmlFor=""
                        className="text-xs text-gray-500 dark:text-gray-400"
                      >
                        Total stocks quantity
                      </label>
                      <Input
                        defaultValue={medicineInfo?.stockQuantity as string}
                        type="text"
                        id="stockQuantity"
                        name="stockQuantity"
                      />
                    </div>
                    <div className="flex flex-col gap-1 w-full">
                      <label
                        htmlFor=""
                        className="text-xs text-gray-500 dark:text-gray-400"
                      >
                        Restock Level
                      </label>
                      <Input
                        defaultValue={medicineInfo?.reorderLevel as string}
                        type="text"
                        id="reorderLevel"
                        name="reorderLevel"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-4 mt-3">
                  <div className="flex items-center justify-center gap-4 w-full mt-5">
                    <div className="flex flex-col gap-1 w-full">
                      <label
                        htmlFor=""
                        className="text-xs text-gray-500 dark:text-gray-400"
                      >
                        Supplier
                      </label>
                      <Select
                        onValueChange={(val) => handleSupplierChange(val)}
                        defaultValue={medicineInfo.supplierId as string}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select Supplier" />
                        </SelectTrigger>
                        <SelectContent>
                          {suppliersList?.length > 0 &&
                            suppliersList?.map((supplier) => (
                              <SelectItem
                                key={supplier?.supplierId}
                                value={supplier?.supplierId}
                              >
                                <p className="text-sm">
                                  {supplier?.supplierName}
                                </p>
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex flex-col gap-1 w-full">
                      <label
                        htmlFor=""
                        className="text-xs text-gray-500 dark:text-gray-400"
                      >
                        New Batch No.
                      </label>
                      <Input
                        defaultValue={String(newBatchNumber)}
                        type="number"
                        min={1}
                        id="batchNumber"
                        name="batchNumber"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* costPrice - sellingPrice */}
              <div className="flex flex-col gap-2 mt-10 border border-transparent border-t-primary py-3">
                <h1 className="text-center text-2xl font-bold">
                  Financial Information
                </h1>
                <Separator className="border border-light-200 dark:border-dark-200" />
                <div className="flex flex-col gap-4 mt-3">
                  <div className="flex items-center justify-center gap-4 w-full mt-5">
                    <div className="flex flex-col gap-1 w-full">
                      <label
                        htmlFor=""
                        className="text-xs text-gray-500 dark:text-gray-400"
                      >
                        Cost Price
                      </label>
                      <Input
                        defaultValue={String(medicineInfo?.costPrice)}
                        type="number"
                        step="0.01"
                        id="costPrice"
                        name="costPrice"
                      />
                    </div>
                    <div className="flex flex-col gap-1 w-full">
                      <label
                        htmlFor=""
                        className="text-xs text-gray-500 dark:text-gray-400"
                      >
                        Selling Price
                      </label>
                      <Input
                        defaultValue={String(medicineInfo?.sellingPrice)}
                        type="number"
                        step="0.01"
                        id="sellingPrice"
                        name="sellingPrice"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* usageWarnings */}
              <div className="flex flex-col gap-2 mt-10 border border-transparent border-t-primary py-3">
                <h1 className="text-center text-2xl font-bold">
                  Regulatory Information
                </h1>
                <Separator className="border border-light-200 dark:border-dark-200" />

                <div className="flex flex-col gap-1 w-full">
                  <label
                    htmlFor=""
                    className="text-xs text-gray-500 dark:text-gray-400"
                  >
                    Usage Warnings
                  </label>
                  <Textarea
                    defaultValue={medicineInfo?.usageWarnings as string}
                    rows={5}
                    id="usageWarnings"
                    name="usageWarnings"
                    placeholder="Enter usage warnings..."
                  />
                </div>
              </div>

              {/* sideEffects - usageInstructions - notes */}
              <div className="flex flex-col gap-2 mt-10 border border-transparent border-t-primary py-3">
                <h1 className="text-center text-2xl font-bold">
                  Additional Information
                </h1>
                <Separator className="border border-light-200 dark:border-dark-200" />
                <div className="flex flex-col gap-4 mt-3">
                  <div className="flex flex-col gap-1 w-full mt-5">
                    <label
                      htmlFor=""
                      className="text-xs text-gray-500 dark:text-gray-400"
                    >
                      Side Effects (if any)
                    </label>
                    <Textarea
                      defaultValue={medicineInfo?.sideEffects as string}
                      rows={5}
                      id="sideEffects"
                      name="sideEffects"
                      placeholder="Enter side effects if any..."
                    />
                  </div>
                  <div className="flex flex-col gap-1 w-full">
                    <label
                      htmlFor=""
                      className="text-xs text-gray-500 dark:text-gray-400"
                    >
                      Usage Instructions
                    </label>
                    <Textarea
                      defaultValue={medicineInfo?.usageInstructions as string}
                      rows={5}
                      id="usageInstructions"
                      name="usageInstructions"
                      placeholder="Enter instructions here..."
                    />
                  </div>
                  <div className="flex flex-col gap-1 w-full">
                    <label
                      htmlFor=""
                      className="text-xs text-gray-500 dark:text-gray-400"
                    >
                      Notes
                    </label>
                    <Textarea
                      defaultValue={medicineInfo?.notes as string}
                      rows={5}
                      id="notes"
                      name="notes"
                      placeholder="Enter additional notes..."
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-4">
                <AlertDialogCancel type="button" className="min-w-32 max-w-32">
                  Cancel
                </AlertDialogCancel>
                <Button
                  type="submit"
                  className="flex items-center gap-2 justify-center min-w-32 max-w-32"
                  disabled={uploading}
                >
                  {uploading ? (
                    <LoaderCircleIcon className="w-5 h-5 animate-spin" />
                  ) : (
                    "Add Batch"
                  )}
                </Button>
              </div>
            </form>
          ) : (
            <div className="grid place-items-center">
              <LoaderCircleIcon className="w-5 h-5 animate-spin" />
            </div>
          )}
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default AddNewBatch;
