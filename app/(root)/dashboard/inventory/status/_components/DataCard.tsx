/* eslint-disable @typescript-eslint/no-explicit-any */
import { formatCurrency } from "@/lib/utils";
import React from "react";

const DataCard = ({
  type = "sales",
  label,
  value,
  icon,
  dailySales = 0,
  monthlySales = 0,
}: {
  type: string;
  label: string;
  value: string;
  icon: any;
  dailySales?: number;
  monthlySales?: number;
}) => {
  return (
    <div className="p-5 rounded-lg border bg-light-100 dark:bg-dark-100 shadow-lg flex flex-col items-start">
      <div className="flex items-center justify-between w-full">
        <p className="text-sm">{label}</p>

        {icon}
      </div>
      <div className="mt-3">
        <h2 className="text-lg sm:text-xl md:text-2xl font-bold">{value}</h2>
      </div>

      {type === "sales" && (
        <div className="mt-3 flex items-center justify-between space-x-6 w-full overflow-auto card-scroll">
          <div className="flex items-center gap-4">
            <p className="text-xs text-gray-500 dark:text-gray-400">Today:</p>
            <p className="font-bold">{formatCurrency(dailySales)}</p>
          </div>
          <div className="flex items-center gap-4">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              This Month:
            </p>
            <p className="font-bold">{formatCurrency(monthlySales)}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataCard;
