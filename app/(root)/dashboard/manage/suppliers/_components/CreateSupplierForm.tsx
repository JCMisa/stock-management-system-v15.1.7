"use client";

import LoaderDialog from "@/components/custom/LoaderDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { createSupplier } from "@/lib/actions/supplier";
import { LoaderCircle, Send } from "lucide-react";
import moment from "moment";
import { useRouter } from "next/navigation";
import React, { useActionState } from "react";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";

const CreateSupplierForm = () => {
  const router = useRouter();

  const handleSubmit = async (prevState: unknown, formData: FormData) => {
    try {
      const supplierId = uuidv4();

      const formField = {
        supplierName: formData.get("supplierName") as string,
        supplierDescription:
          (formData.get("supplierDescription") as string) || "",
        contactPerson: (formData.get("contactPerson") as string) || "",
        contactEmail: (formData.get("contactEmail") as string) || "",
        contactPhone: (formData.get("contactPhone") as string) || "",
        address: (formData.get("address") as string) || "",
        city: (formData.get("city") as string) || "",
        state: (formData.get("state") as string) || "",
        zipCode: (formData.get("zipCode") as string) || "",
        country: (formData.get("country") as string) || "",
        website: (formData.get("website") as string) || "",
      };

      const result = await createSupplier(
        prevState,
        moment().format("MM-DD-YYYY"),
        supplierId,
        formField
      );

      if (result?.data !== null) {
        toast(
          <p className="font-bold text-sm text-green-500">
            Medicine created successfully
          </p>
        );

        router.push("/dashboard/manage/suppliers");
      }
    } catch (error) {
      toast(
        <p className="font-bold text-sm text-red-500">
          Internal error occured while creating the medicine.
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
        {/* supplierName - supplierDescription */}
        <div className="flex flex-col gap-2">
          <h1 className="text-center text-2xl font-bold">Basic Information</h1>
          <Separator className="border border-light-200 dark:border-dark-200" />
          <div className="flex flex-col gap-4 mt-3">
            <div className="flex flex-col gap-1 w-full">
              <label
                htmlFor=""
                className="text-xs text-gray-500 dark:text-gray-400"
              >
                Supplier Name
              </label>
              <Input
                type="text"
                id="supplierName"
                name="supplierName"
                placeholder="Enter supplier name"
                required
              />
            </div>

            <div className="flex flex-col gap-1 w-full">
              <label
                htmlFor=""
                className="text-xs text-gray-500 dark:text-gray-400"
              >
                Supplier Description
              </label>
              <Textarea
                rows={5}
                id="supplierDescription"
                name="supplierDescription"
                placeholder="Tell us more about the supplier..."
              />
            </div>
          </div>
        </div>

        {/* contactPerson - contactEmail - contactPhone - website */}
        <div className="flex flex-col gap-2 mt-10 border border-transparent border-t-primary py-3">
          <h1 className="text-center text-2xl font-bold">
            Contact Information
          </h1>
          <Separator className="border border-light-200 dark:border-dark-200" />
          <div className="flex flex-col gap-4 mt-3">
            <div className="flex items-center justify-center gap-4 w-full">
              <div className="flex flex-col gap-1 w-full">
                <label
                  htmlFor=""
                  className="text-xs text-gray-500 dark:text-gray-400"
                >
                  Contact Person
                </label>
                <Input
                  type="text"
                  id="contactPerson"
                  name="contactPerson"
                  placeholder="Enter supplier contact person"
                />
              </div>
              <div className="flex flex-col gap-1 w-full">
                <label
                  htmlFor=""
                  className="text-xs text-gray-500 dark:text-gray-400"
                >
                  Website <span className="text-[10px]">(optional)</span>
                </label>
                <Input
                  type="text"
                  id="website"
                  name="website"
                  placeholder="Enter supplier website if any"
                />
              </div>
            </div>
            <div className="flex items-center justify-center gap-4 w-full">
              <div className="flex flex-col gap-1 w-full">
                <label
                  htmlFor=""
                  className="text-xs text-gray-500 dark:text-gray-400"
                >
                  Contact Email
                </label>
                <Input
                  type="email"
                  id="contactEmail"
                  name="contactEmail"
                  placeholder="Enter supplier contact email"
                />
              </div>
              <div className="flex flex-col gap-1 w-full">
                <label
                  htmlFor=""
                  className="text-xs text-gray-500 dark:text-gray-400"
                >
                  Contact Phone
                </label>
                <Input
                  type="phone"
                  id="contactPhone"
                  name="contactPhone"
                  placeholder="Enter supplier contact phone"
                />
              </div>
            </div>
          </div>
        </div>

        {/* address - city - state - zipCode - country */}
        <div className="flex flex-col gap-2 mt-10 border border-transparent border-t-primary py-3">
          <h1 className="text-center text-2xl font-bold">
            Address Infromation
          </h1>
          <Separator className="border border-light-200 dark:border-dark-200" />
          <div className="flex flex-col gap-4 mt-3">
            <div className="flex items-center justify-center gap-4 w-full mt-5">
              <div className="flex flex-col gap-1 w-full">
                <label
                  htmlFor=""
                  className="text-xs text-gray-500 dark:text-gray-400"
                >
                  Address
                </label>
                <Input type="text" id="address" name="address" />
              </div>
              <div className="flex flex-col gap-1 w-full">
                <label
                  htmlFor=""
                  className="text-xs text-gray-500 dark:text-gray-400"
                >
                  City
                </label>
                <Input type="text" id="city" name="city" />
              </div>
            </div>
            <div className="flex items-center justify-center gap-4 w-full mt-5">
              <div className="flex flex-col gap-1 w-full">
                <label
                  htmlFor=""
                  className="text-xs text-gray-500 dark:text-gray-400"
                >
                  State
                </label>
                <Input type="text" id="state" name="state" />
              </div>
              <div className="flex flex-col gap-1 w-full">
                <label
                  htmlFor=""
                  className="text-xs text-gray-500 dark:text-gray-400"
                >
                  Country
                </label>
                <Input type="text" id="country" name="country" />
              </div>
            </div>
            <div className="flex flex-col gap-1 w-full">
              <label
                htmlFor=""
                className="text-xs text-gray-500 dark:text-gray-400"
              >
                ZIP Code
              </label>
              <Input type="text" id="zipCode" name="zipCode" />
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
                <Send className="w-5 h-5" /> Submit
              </>
            )}
          </Button>
        </div>
      </form>
      <LoaderDialog loading={uploading} />
    </>
  );
};

export default CreateSupplierForm;
