import { columns } from "@/components/dataTable/medicines/medicine-columns";
import { DataTable } from "@/components/dataTable/medicines/medicine-data-table";
import { getAllMedicines } from "@/lib/actions/medicine";
import { getCurrentUser } from "@/lib/actions/user";
import { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Medicines",
  description:
    "Manage medicines page to manage medicines by performing CRUD operations to manipulate medicines.",
  robots: {
    index: false,
    follow: true,
  },
};

const MedicinesPage = async () => {
  try {
    const [user, medicinesList] = await Promise.all([
      getCurrentUser(),
      getAllMedicines(),
    ]);
    if (user?.data === null) redirect("/sign-in");

    return (
      <div>
        <DataTable
          columns={columns}
          data={medicinesList?.data}
          query1="name"
          showCreate={
            user?.data?.role === "admin" || user?.data?.role === "pharmacist"
          }
        />
      </div>
    );
  } catch (error) {
    console.error("Failed to load medicines data:", error);
    return <div>Error loading data.</div>;
  }
};

export default MedicinesPage;
