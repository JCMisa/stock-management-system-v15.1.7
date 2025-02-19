"use client";

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
import { medicineCategories } from "@/constants";
import {
  getMedicineByMedicineId,
  updateMedicine,
} from "@/lib/actions/medicine";
import { LoaderCircle, Pencil, X } from "lucide-react";
import React, { useActionState, useEffect, useState } from "react";
import { toast } from "sonner";
import UploadMedicineImage from "./UploadMedicineImage";
import { useRouter } from "next/navigation";
import DeleteMedicine from "./DeleteMedicine";
import LoaderDialog from "@/components/custom/LoaderDialog";
import { getAllSuppliers } from "@/lib/actions/supplier";

const UpdateMedicineForm = ({ medicineId }: { medicineId: string }) => {
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const [medicine, setMedicine] = useState<MedicineType>();

  const [category, setCategory] = useState<string>(
    medicine?.category as string
  );
  const [form, setForm] = useState<string>(medicine?.form as string);
  const [storageCondition, setStorageCondition] = useState<string>(
    medicine?.storageCondition as string
  );
  const [prescriptionRequired, setPrescriptionRequired] = useState<string>(
    medicine?.prescriptionRequired as string
  );
  const [fdaApproved, setFdaApproved] = useState<string>(
    medicine?.fdaApproved as string
  );
  const [suppliersList, setSuppliersList] = useState<SupplierType[]>([]);
  const [selectedSupplier, setSelectedSupplier] = useState<{
    id: string;
    name: string;
  } | null>(null);

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

  // for input with multiple values
  const [ingredients, setIngredients] = useState<string>("");
  const [ingredientsArray, setIngredientsArray] = useState<string[]>(
    (medicine?.activeIngredients as string[]) || []
  ); // concat this to the medicine?.activeIngredients
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    const lastChar = value.charAt(value.length - 1);
    if (lastChar === ",") {
      const trimmedValue = value.slice(0, -1).trim();
      if (trimmedValue) {
        setIngredientsArray((prevArray) => [...prevArray, trimmedValue]);
        console.log(medicine?.activeIngredients.concat(ingredientsArray));
        console.log(ingredientsArray);
      }
      setIngredients("");
    } else {
      setIngredients(value);
    }
  };
  const removeItem = (index: number) => {
    setIngredientsArray((prevArray) => prevArray.filter((_, i) => i !== index));
  };
  // for input with multiple values

  // for getting medicine record to update based on medicineId
  const getMedicine = async () => {
    try {
      setLoading(true);
      const result = await getMedicineByMedicineId(medicineId as string);
      if (result?.data !== null) {
        setMedicine(result?.data);
      }
    } catch {
      toast(
        <p className="font-bold text-sm text-red-500">
          Error fetching medicine record. Please try again later.
        </p>
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getMedicine();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [medicineId]);
  // for getting medicine record to update based on medicineId

  const handleSubmit = async (prevState: unknown, formData: FormData) => {
    try {
      //   const finalCategory = category || medicine?.category;
      //   const finalForm = form || medicine?.form;
      //   const finalStorageCondition =
      //     storageCondition || medicine?.storageCondition;
      //   const finalPrescriptionRequired =
      //     prescriptionRequired || medicine?.prescriptionRequired;
      //   const finalFdaApproved = fdaApproved || medicine?.fdaApproved;

      const formField = {
        name: formData.get("name") as string,
        brand: formData.get("brand") as string,
        category: category as string,
        activeIngredients: medicine?.activeIngredients.concat(
          ingredientsArray
        ) as string[],
        dosage: formData.get("dosage") as string,
        form: form as string,
        unitsPerPackage: formData.get("unitsPerPackage") as string,
        storageCondition: storageCondition as string,
        expiryDate: formData.get("expiryDate") as string,
        stockQuantity: formData.get("stockQuantity") as string,
        reorderLevel: formData.get("reorderLevel") as string,
        supplierId: selectedSupplier?.id as string,
        supplierName: selectedSupplier?.name as string,
        batchNumber: formData.get("batchNumber") as string,
        costPrice: formData.get("costPrice") as string,
        sellingPrice: formData.get("sellingPrice") as string,
        prescriptionRequired: prescriptionRequired as string,
        fdaApproved: fdaApproved as string,
        usageWarnings: formData.get("usageWarnings") as string,
        sideEffects: formData.get("sideEffects") as string,
        usageInstructions: formData.get("usageInstructions") as string,
        notes: formData.get("notes") as string,
      };

      const result = await updateMedicine(prevState, medicineId, formField);

      if (result?.data !== null) {
        toast(
          <p className="font-bold text-sm text-green-500">
            Medicine updated successfully
          </p>
        );

        router.back();
      }
    } catch (error) {
      toast(
        <p className="font-bold text-sm text-red-500">
          Internal error occured while updating the medicine.
        </p>
      );
      console.log("create medicine error: ", error);
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [state, formAction, uploading] = useActionState(
    handleSubmit,
    undefined
  );

  return (
    <>
      <form
        action={formAction}
        className="bg-light-100 dark:bg-dark-100 border border-t-primary rounded-lg flex flex-col gap-4 p-5"
      >
        {/* name - brand - category */}
        <div className="flex flex-col gap-2">
          <h1 className="text-center text-2xl font-bold">Basic Information</h1>
          <Separator className="border border-light-200 dark:border-dark-200" />
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <UploadMedicineImage medicine={medicine} />
              <span className="text-xs text-gray-500 dark:text-gray-400">
                Click the image to update medicine image.
              </span>
            </div>
            <DeleteMedicine medicineId={medicineId} />
          </div>
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
                  type="text"
                  id="name"
                  name="name"
                  placeholder="Enter medicine name"
                  defaultValue={medicine?.name}
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
                  type="text"
                  id="brand"
                  name="brand"
                  placeholder="Enter medicine brand"
                  defaultValue={medicine?.brand}
                />
              </div>
            </div>
            <div className="flex flex-col gap-1 w-full">
              <label
                htmlFor=""
                className="text-xs text-gray-500 dark:text-gray-400"
              >
                Medicine Category
              </label>
              <Select
                onValueChange={(value) =>
                  setCategory(value ? value : (medicine?.category as string))
                }
                defaultValue={medicine?.category}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  {medicineCategories.map((item) => (
                    <SelectItem key={item} value={item}>
                      {item}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* activeIngredients - dosage - form */}
        <div className="flex flex-col gap-2 mt-10 border border-transparent border-t-primary py-3">
          <h1 className="text-center text-2xl font-bold">
            Composition and Dosage
          </h1>
          <Separator className="border border-light-200 dark:border-dark-200" />
          <div className="flex flex-col gap-4 mt-3">
            <div className="flex flex-col gap-1 w-full">
              <label
                htmlFor=""
                className="text-xs text-gray-500 dark:text-gray-400"
              >
                Active Ingredients
              </label>
              <div className="rounded-lg p-3 bg-light dark:bg-dark">
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Please add a comma after each tag
                </p>
                <ul className="flex items-center gap-2 overflow-auto card-scroll mt-3">
                  {ingredientsArray.map((item: string, index: number) => (
                    <li
                      key={index}
                      className="min-w-32 max-w-32 min-h-12 max-h-12 text-xs rounded-lg bg-light-100 dark:bg-dark-100 flex items-center gap-2 justify-between p-3 overflow-hidden"
                    >
                      {item}
                      <X
                        onClick={() => removeItem(index)}
                        className="w-5 h-5 cursor-pointer text-red-500 p-1 bg-light dark:bg-dark rounded-full"
                      />
                    </li>
                  ))}
                </ul>
                <Input
                  type="text"
                  value={ingredients}
                  onChange={handleInputChange}
                  className="bg-light-100 dark:bg-dark-100 mt-3"
                  placeholder="Add more ingredients"
                />
                <div className="flex items-center gap-2 mt-1 w-full overflow-auto card-scroll">
                  {medicine?.activeIngredients?.map(
                    (item: string, index: number) => (
                      <p
                        className="text-xs text-gray-500 dark:text-gray-400"
                        key={index}
                      >
                        {item},
                      </p>
                    )
                  )}
                </div>
                <div className="flex items-end justify-end mt-2">
                  <Button
                    size={"sm"}
                    className="bg-red-500 hover:bg-red-600 transition-all"
                    onClick={() => setIngredientsArray([])}
                  >
                    Remove All
                  </Button>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-center gap-4 w-full">
              <div className="flex flex-col gap-1 w-full">
                <label
                  htmlFor=""
                  className="text-xs text-gray-500 dark:text-gray-400"
                >
                  Dosage (in mL)
                </label>
                <Input
                  type="text"
                  id="dosage"
                  name="dosage"
                  placeholder="Enter medicine dosage"
                  defaultValue={medicine?.dosage}
                />
              </div>
              <div className="flex flex-col gap-1 w-full">
                <label
                  htmlFor=""
                  className="text-xs text-gray-500 dark:text-gray-400"
                >
                  Medicine Form
                </label>
                <Select
                  onValueChange={(value) =>
                    setForm(value ? value : (medicine?.form as string))
                  }
                  defaultValue={medicine?.form}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Form" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="tablet">Tablet</SelectItem>
                    <SelectItem value="capsule">Capsule</SelectItem>
                    <SelectItem value="syrup">Syrup</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>

        {/* unitsPerPackage - storageCondition - expiryDate */}
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
                  type="text"
                  id="unitsPerPackage"
                  name="unitsPerPackage"
                  defaultValue={medicine?.unitsPerPackage}
                />
              </div>
              <div className="flex flex-col gap-1 w-full">
                <label
                  htmlFor=""
                  className="text-xs text-gray-500 dark:text-gray-400"
                >
                  Where should the storage be?
                </label>
                <Select
                  onValueChange={(value) =>
                    setStorageCondition(
                      value ? value : (medicine?.storageCondition as string)
                    )
                  }
                  defaultValue={medicine?.storageCondition}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Temperature" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="room temperature">
                      Room Temperature
                    </SelectItem>
                    <SelectItem value="refrigeration">Refrigeration</SelectItem>
                  </SelectContent>
                </Select>
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
                type="date"
                id="expiryDate"
                name="expiryDate"
                defaultValue={medicine?.expiryDate}
              />
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {medicine?.expiryDate}
              </span>
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
                  type="text"
                  id="stockQuantity"
                  name="stockQuantity"
                  defaultValue={medicine?.stockQuantity}
                />
              </div>
              <div className="flex flex-col gap-1 w-full">
                <label
                  htmlFor=""
                  className="text-xs text-gray-500 dark:text-gray-400"
                >
                  Stock quantity level before re-stocking
                </label>
                <Input
                  type="text"
                  id="reorderLevel"
                  name="reorderLevel"
                  defaultValue={medicine?.reorderLevel}
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
                  defaultValue={medicine?.supplierId}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select medicines" />
                  </SelectTrigger>
                  <SelectContent>
                    {suppliersList?.length > 0 &&
                      suppliersList?.map((supplier) => (
                        <SelectItem
                          key={supplier?.supplierId}
                          value={supplier?.supplierId}
                        >
                          <p className="text-sm">{supplier?.supplierName}</p>
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
                  Batch No.
                </label>
                <Input
                  type="text"
                  id="batchNumber"
                  name="batchNumber"
                  defaultValue={medicine?.batchNumber}
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
                  type="number"
                  step="0.01"
                  id="costPrice"
                  name="costPrice"
                  defaultValue={medicine?.costPrice}
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
                  type="number"
                  step="0.01"
                  id="sellingPrice"
                  name="sellingPrice"
                  defaultValue={medicine?.sellingPrice}
                />
              </div>
            </div>
          </div>
        </div>

        {/* prescriptionRequired - fdaApproved - usageWarnings */}
        <div className="flex flex-col gap-2 mt-10 border border-transparent border-t-primary py-3">
          <h1 className="text-center text-2xl font-bold">
            Regulatory Information
          </h1>
          <Separator className="border border-light-200 dark:border-dark-200" />
          <div className="flex flex-col gap-4 mt-3">
            <div className="flex items-center justify-center gap-4 w-full mt-5">
              <div className="flex flex-col gap-1 w-full">
                <label
                  htmlFor=""
                  className="text-xs text-gray-500 dark:text-gray-400"
                >
                  Does this medicine needs prescription to be sold?
                </label>
                <Select
                  onValueChange={(value) =>
                    setPrescriptionRequired(
                      value ? value : (medicine?.prescriptionRequired as string)
                    )
                  }
                  defaultValue={medicine?.prescriptionRequired}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={"true"}>Needs prescription</SelectItem>
                    <SelectItem value={"false"}>
                      Do not need prescription
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-1 w-full">
                <label
                  htmlFor=""
                  className="text-xs text-gray-500 dark:text-gray-400"
                >
                  Is this medicine FDA approved?
                </label>
                <Select
                  onValueChange={(value) =>
                    setFdaApproved(
                      value ? value : (medicine?.fdaApproved as string)
                    )
                  }
                  defaultValue={medicine?.fdaApproved}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={"true"}>FDA Approved</SelectItem>
                    <SelectItem value={"false"}>Not FDA Approved</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-1 w-full">
            <label
              htmlFor=""
              className="text-xs text-gray-500 dark:text-gray-400"
            >
              Usage Warnings
            </label>
            <Textarea
              rows={5}
              id="usageWarnings"
              name="usageWarnings"
              placeholder="Enter usage warnings..."
              defaultValue={medicine?.usageWarnings}
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
                rows={5}
                id="sideEffects"
                name="sideEffects"
                placeholder="Enter side effects if any..."
                defaultValue={medicine?.sideEffects}
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
                rows={5}
                id="usageInstructions"
                name="usageInstructions"
                placeholder="Enter instructions here..."
                defaultValue={medicine?.usageInstructions}
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
                rows={5}
                id="notes"
                name="notes"
                placeholder="Enter additional notes..."
                defaultValue={medicine?.notes}
              />
            </div>
          </div>
        </div>

        <div className="flex items-end justify-end">
          <Button
            type="submit"
            className="flex items-center gap-2 justify-center min-w-52 max-w-52"
            disabled={uploading}
          >
            {uploading ? (
              <LoaderCircle className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <Pencil className="w-5 h-5" /> Save
              </>
            )}
          </Button>
        </div>
      </form>
      <LoaderDialog loading={loading || uploading} />
    </>
  );
};

export default UpdateMedicineForm;
