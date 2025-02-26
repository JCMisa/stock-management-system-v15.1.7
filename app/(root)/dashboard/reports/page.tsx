import { getMedicineSalesReport } from "@/lib/actions/report";
import React from "react";

const ReportsPage = async () => {
  const reports = await getMedicineSalesReport();
  const reportsData = reports?.data;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Medicine Sales Reports</h1>
      <div className="grid gap-4">
        {reportsData.map((report: MedicineSalesReportType) => (
          <div key={report.medicineId} className="border p-4 rounded-lg">
            <h2 className="font-semibold text-lg">{report.medicineName}</h2>
            <p>Total Sales: ${report.totalSales}</p>
            <p>Total Quantity Sold: {report.totalQuantitySold}</p>
            <p>Number of Transactions: {report.transactionCount}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReportsPage;
