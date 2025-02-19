"use server";

import { db } from "@/utils/db";
import { parseStringify } from "../utils";
import { Supplier } from "@/utils/schema";

export const getAllSuppliers = async () => {
  try {
    const data = await db.select().from(Supplier);

    return parseStringify({ data: data });
  } catch (error) {
    handleError(error);
  }
};

export const createSupplier = async (
  state: unknown,
  createdAt: string,
  supplierId: string,
  form: {
    supplierName: string;
    supplierDescription: string;
    contactPerson: string;
    contactEmail: string;
    contactPhone: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    website: string;
  }
) => {
  try {
    const data = await db.insert(Supplier).values({
      supplierId: supplierId,
      supplierName: form.supplierName,
      supplierDescription: form.supplierDescription,
      contactPerson: form.contactPerson,
      contactEmail: form.contactEmail,
      contactPhone: form.contactPhone,
      address: form.address,
      city: form.city,
      state: form.state,
      zipCode: form.zipCode,
      country: form.country,
      website: form.website,
      createdAt: createdAt,
    });

    if (data) {
      return parseStringify({ data: data });
    }
    return parseStringify({ data: null });
  } catch (error) {
    handleError(error);
  }
};

const handleError = (error: unknown) => {
  console.log("Internal error: ", error);
  return parseStringify({ data: null });
};
