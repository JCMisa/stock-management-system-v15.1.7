"use server";

import { db } from "@/utils/db";
import { Transaction } from "@/utils/schema";
import { parseStringify } from "../utils";

export const getMedicineSalesReport = async () => {
  try {
    // Get all transactions
    const allTransactions = await db.select().from(Transaction);

    // Create a map to store medicine statistics
    const medicineStats = new Map<
      string,
      {
        medicineName: string;
        totalSales: number;
        totalQuantity: number;
        transactionCount: number;
      }
    >();

    // Process each transaction
    allTransactions.forEach((transaction) => {
      const medicines = transaction.medicineData as Array<{
        medicineId: string;
        medicineName: string;
        quantity: string;
      }>;

      medicines.forEach((medicine) => {
        const quantity = parseInt(medicine.quantity);
        // Calculate price per unit (total sale divided by total quantity for this transaction)
        const totalQuantityInTransaction = transaction.quantities?.reduce(
          (sum, qty) => sum + parseInt(qty),
          0
        );
        const pricePerUnit =
          Number(transaction?.totalSales) / totalQuantityInTransaction!;
        const medicineTotal = pricePerUnit * quantity;

        const existing = medicineStats.get(medicine.medicineId) || {
          medicineName: medicine.medicineName,
          totalSales: 0,
          totalQuantity: 0,
          transactionCount: 0,
        };

        medicineStats.set(medicine.medicineId, {
          medicineName: medicine.medicineName,
          totalSales: existing.totalSales + medicineTotal,
          totalQuantity: existing.totalQuantity + quantity,
          transactionCount: existing.transactionCount + 1,
        });
      });
    });

    // Convert map to array for response
    const report = Array.from(medicineStats.entries()).map(
      ([medicineId, stats]) => ({
        medicineId,
        medicineName: stats.medicineName,
        totalSales: Number(stats.totalSales.toFixed(2)),
        totalQuantitySold: stats.totalQuantity,
        transactionCount: stats.transactionCount,
      })
    );

    return parseStringify({ data: report });
  } catch (error) {
    handleError(error);
  }
};

const handleError = (error: unknown) => {
  console.log("Internal error: ", error);
  return parseStringify({ data: null });
};
