"use server";

import { db } from "@/utils/db";
import { parseStringify } from "../utils";
// import { Transaction, TransactionDeleteLogs } from "@/utils/schema";
import { Transaction } from "@/utils/schema";
import { eq, sql, sum } from "drizzle-orm";
import { getMedicineByMedicineId, updateStockQuantity } from "./medicine";
import { revalidatePath } from "next/cache";
import moment from "moment";

export const getAllTransactions = async () => {
  try {
    const data = await db.select().from(Transaction);

    return parseStringify({ data: data });
  } catch (error) {
    handleError(error);
  }
};

export const getTransaction = async (transactionId: string) => {
  try {
    const data = await db
      .select()
      .from(Transaction)
      .where(eq(Transaction.transactionId, transactionId));

    if (data?.length > 0) {
      return parseStringify({ data: data[0] });
    }
    return parseStringify({ data: null });
  } catch (error) {
    handleError(error);
  }
};

export const getTotalSales = async () => {
  try {
    const data = await db
      .select({
        totalSales: sum(Transaction.totalSales),
      })
      .from(Transaction);

    if (data?.length > 0) {
      return parseStringify({ data: data[0]?.totalSales });
    }
    return parseStringify({ data: null });
  } catch (error) {
    handleError(error);
  }
};

export const getTotalSalesForThisMonth = async () => {
  try {
    const currentMonth = moment().format("MM");
    // const nextMonth = moment().add(1, "months").format("MM");
    const currentYear = moment().format("YYYY");

    const currentMonthRecords = await db
      .select({
        totalSales: Transaction.totalSales,
      })
      .from(Transaction)
      .where(
        sql`SUBSTRING(${Transaction.transactionDate}, 1, 2) = ${currentMonth} 
            AND SUBSTRING(${Transaction.transactionDate}, 7, 4) = ${currentYear}`
      );

    const totalSales = currentMonthRecords.reduce(
      (sum, record) => sum + (Number(record.totalSales) || 0),
      0
    );

    return parseStringify({
      data: totalSales > 0 ? totalSales : null,
    });
  } catch (error) {
    handleError(error);
  }
};

export const createTransaction = async (
  state: unknown,
  form: {
    transactionId: string;
    patientId: string;
    patientName: string;
    sellerEmail: string;
    medicines: string[];
    totalSales: string;
    transactionDate: string;
  }
) => {
  try {
    const totalSales =
      form.totalSales.trim() === ""
        ? "0"
        : parseFloat(form.totalSales).toFixed(2).toString();

    const data = await db.insert(Transaction).values({
      transactionId: form.transactionId as string,
      patientId: form.patientId,
      patientName: form.patientName,
      sellerEmail: form.sellerEmail,
      medicines: form.medicines,
      totalSales: totalSales,
      transactionDate: form.transactionDate,
    });

    if (data) {
      for (const medicineId of form.medicines) {
        console.log("medicine ids in server: ", medicineId);
        const medicineRecord = await getMedicineByMedicineId(medicineId);
        if (medicineRecord?.data !== null) {
          const stockQuantity = medicineRecord?.data?.stockQuantity;
          const decrementedStockQuantity = Number(stockQuantity) - 1;
          const updateStock = await updateStockQuantity(
            medicineId,
            decrementedStockQuantity
          );
          if (updateStock?.data !== null) {
            console.log(
              medicineId,
              "'s stock decremented value: ",
              stockQuantity
            );
          }
        }
      }
      return parseStringify({ data: data });
    }
    return parseStringify({ data: null });
  } catch (error) {
    handleError(error);
  }
};

export const addTransaction = async (
  state: unknown,
  form: {
    transactionId: string;
    patientId: string;
    patientName: string;
    sellerEmail: string;
    medicines: { medicineId: string; quantity: string; medicineName: string }[];
    totalSales: string;
    transactionDate: string;
  }
) => {
  const medicineIds = form.medicines.map((item) => item.medicineId);
  const quantities = form.medicines.map((item) => item.quantity);
  const medicineNames = form.medicines.map((item) => item.medicineName);
  try {
    const totalSales =
      form.totalSales.trim() === ""
        ? "0"
        : parseFloat(form.totalSales).toFixed(2).toString();

    const data = await db.insert(Transaction).values({
      transactionId: form.transactionId as string,
      patientId: form.patientId,
      patientName: form.patientName,
      sellerEmail: form.sellerEmail,
      medicineData: form.medicines,
      medicines: medicineIds,
      quantities: quantities,
      medicineNames: medicineNames,
      totalSales: totalSales,
      transactionDate: form.transactionDate,
    });

    if (data) {
      for (const medicine of form.medicines) {
        console.log("medicine ids in server: ", medicine.medicineId);
        const medicineRecord = await getMedicineByMedicineId(
          medicine?.medicineId
        );
        if (medicineRecord?.data !== null) {
          const stockQuantity = medicineRecord?.data?.stockQuantity;
          const decrementedStockQuantity =
            Number(stockQuantity) - Number(medicine.quantity);
          const updateStock = await updateStockQuantity(
            medicine.medicineId,
            decrementedStockQuantity
          );
          if (updateStock?.data !== null) {
            console.log(
              medicine.medicineId,
              "'s stock decremented value: ",
              stockQuantity
            );
          }
        }
      }
      return parseStringify({ data: data });
    }
    return parseStringify({ data: null });
  } catch (error) {
    handleError(error);
  }
};

export const updateTransaction = async (
  state: unknown,
  form: {
    transactionId: string;
    patientId: string;
    patientName: string;
    sellerEmail: string;
    medicines: { medicineId: string; quantity: string; medicineName: string }[];
    totalSales: string;
    transactionDate: string;
  }
) => {
  try {
    // First get the existing transaction to compare quantities
    const existingTransactionArray = await db
      .select()
      .from(Transaction)
      .where(eq(Transaction.transactionId, form.transactionId))
      .limit(1);
    const existingTransaction = existingTransactionArray[0];

    if (!existingTransaction) {
      throw new Error("Transaction not found");
    }

    const existingMedicineData = existingTransaction.medicineData as {
      medicineId: string;
      quantity: string;
    }[];

    // Create a map of existing quantities for easy lookup
    // gumawa ng new array na yung quantity property ay naka number format
    const existingQuantities = new Map(
      existingMedicineData.map((med) => [med.medicineId, Number(med.quantity)])
    );

    const medicineIds = form.medicines.map((item) => item.medicineId); // array na ang laman ay mga medicineId lang
    const quantities = form.medicines.map((item) => item.quantity); // array na ang laman ay mga quantity lang
    const medicineNames = form.medicines.map((item) => item.medicineName);

    // Update the transaction record
    const totalSales =
      form.totalSales.trim() === ""
        ? "0"
        : parseFloat(form.totalSales).toFixed(2).toString();

    const data = await db
      .update(Transaction)
      .set({
        patientId: form.patientId,
        patientName: form.patientName,
        sellerEmail: form.sellerEmail,
        medicineData: form.medicines,
        medicines: medicineIds,
        quantities: quantities,
        medicineNames: medicineNames,
        totalSales: totalSales,
        transactionDate: form.transactionDate,
      })
      .where(eq(Transaction.transactionId, form.transactionId));

    if (data) {
      // Handle stock updates for each medicine
      for (const medicine of form.medicines) {
        const medicineRecord = await getMedicineByMedicineId(
          medicine.medicineId
        );
        if (!medicineRecord?.data) continue;

        const currentStock = medicineRecord.data.stockQuantity;
        const newQuantity = Number(medicine.quantity);
        const oldQuantity = existingQuantities.get(medicine.medicineId) || 0;

        // Calculate the stock adjustment
        let stockAdjustment = 0;

        if (newQuantity > oldQuantity) {
          // More medicines were added, decrease stock
          stockAdjustment = -(newQuantity - oldQuantity);
        } else if (newQuantity < oldQuantity) {
          // Medicines were returned, increase stock
          stockAdjustment = oldQuantity - newQuantity;
        }

        if (stockAdjustment !== 0) {
          const newStock = Number(currentStock) + stockAdjustment;
          await updateStockQuantity(medicine.medicineId, newStock);
          console.log(
            `Updated stock for medicine ${medicine.medicineId}: ${currentStock} -> ${newStock} (adjustment: ${stockAdjustment})`
          );
        }
      }

      // Handle medicines that were completely removed
      for (const oldMedicine of existingMedicineData) {
        if (
          !form.medicines.find((m) => m.medicineId === oldMedicine.medicineId)
        ) {
          // This medicine was removed, return its quantity to stock
          const medicineRecord = await getMedicineByMedicineId(
            oldMedicine.medicineId
          );
          if (medicineRecord?.data) {
            const currentStock = medicineRecord.data.stockQuantity;
            const returnedQuantity = Number(oldMedicine.quantity);
            const newStock = Number(currentStock) + returnedQuantity;
            await updateStockQuantity(oldMedicine.medicineId, newStock);
            console.log(
              `Returned stock for removed medicine ${oldMedicine.medicineId}: ${currentStock} -> ${newStock} (returned: ${returnedQuantity})`
            );
          }
        }
      }

      return parseStringify({ data: data });
    }
    return parseStringify({ data: null });
  } catch (error) {
    handleError(error);
  }
};

// delete transaction WITH automatic medicine replenishment
export const deleteTransaction = async (transactionId: string) => {
  try {
    // First get the existing transaction to process stock returns
    const existingTransactionArray = await db
      .select()
      .from(Transaction)
      .where(eq(Transaction.transactionId, transactionId))
      .limit(1);
    const existingTransaction = existingTransactionArray[0];

    if (!existingTransaction) {
      throw new Error("Transaction not found");
    }

    const medicineData = existingTransaction.medicineData as {
      medicineId: string;
      quantity: string;
    }[];

    // Process stock returns for all medicines in the transaction
    for (const medicine of medicineData) {
      const medicineRecord = await getMedicineByMedicineId(medicine.medicineId);
      if (!medicineRecord?.data) continue;

      const currentStock = medicineRecord.data.stockQuantity;
      const returnedQuantity = Number(medicine.quantity);

      // Add the returned quantity back to stock
      const newStock = Number(currentStock) + returnedQuantity;
      await updateStockQuantity(medicine.medicineId, newStock);

      console.log(
        `Returned stock for medicine ${medicine.medicineId}: ${currentStock} -> ${newStock} (returned: ${returnedQuantity})`
      );
    }

    // Delete the transaction record
    const data = await db
      .delete(Transaction)
      .where(eq(Transaction.transactionId, transactionId));

    if (data) {
      revalidatePath("/dashboard/inventory/transactions");
      return parseStringify({ data: data });
    }

    return parseStringify({ data: null });
  } catch (error) {
    handleError(error);
  }
};

// delete transaction WITHOUT automatic medicine replenishment
// export const deleteTransaction = async (
//   transactionId: string,
//   reason: string,
//   deletedBy: string,
//   createdAt: string
// ) => {
//   try {
//     const addToDeleteLogs = await db.insert(TransactionDeleteLogs).values({
//       transactionId: transactionId,
//       deleteReason: reason,
//       deletedBy: deletedBy,
//       createdAt: createdAt,
//     });

//     if (addToDeleteLogs) {
//       const data = await db
//         .delete(Transaction)
//         .where(eq(Transaction.transactionId, transactionId));

//       if (data) {
//         revalidatePath("/dashboard/inventory/transactions");
//         return parseStringify({ data: data });
//       } else {
//         return parseStringify({ data: null });
//       }
//     }
//     return parseStringify({ data: null });
//   } catch (error) {
//     handleError(error);
//   }
// };

const handleError = (error: unknown) => {
  console.log("Internal error: ", error);
  return parseStringify({ data: null });
};
